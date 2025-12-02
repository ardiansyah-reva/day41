const { Cart, CartItem, Product, ProductMedia } = require("../models");
const redis = require("../utils/redis"); // pastikan lu punya file redis.js
const { applyVoucher } = require("./voucherService");

class CartService {
  // --------------------------------------------------------
  // GET / CREATE CART (Cache Redis + Database)
  // --------------------------------------------------------
  async getOrCreateCart(userId) {
    const redisKey = `cart:${userId}`;

    // 1. Cek cart di Redis dulu
    const cached = await redis.get(redisKey);
    if (cached) return JSON.parse(cached);

    // 2. Kalo ngga ada → ambil dari DB
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [{ model: ProductMedia, as: "media" }],
            },
          ],
        },
      ],
    });

    // 3. Jika tidak ada, buat cart baru
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      cart.items = [];
    }

    // 4. Simpan ke Redis (expire 7 hari)
    await redis.setEx(redisKey, 60 * 60 * 24 * 7, JSON.stringify(cart));

    return cart;
  }

  // --------------------------------------------------------
  // ADD ITEM
  // --------------------------------------------------------
  async addItem(userId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const product = await Product.findByPk(productId);

    if (!product) throw new Error("Product not found");

    let item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });
    }

    await this.refreshCache(userId);

    return { message: "Item added", item };
  }

  // --------------------------------------------------------
  // UPDATE ITEM
  // --------------------------------------------------------
  async updateItem(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);

    const item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!item) throw new Error("Item not found");

    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }

    await this.refreshCache(userId);

    return { message: "Item updated", item };
  }

  // --------------------------------------------------------
  // REMOVE ITEM
  // --------------------------------------------------------
  async removeItem(userId, productId) {
    const cart = await this.getOrCreateCart(userId);

    await CartItem.destroy({
      where: { cart_id: cart.id, product_id: productId },
    });

    await this.refreshCache(userId);

    return { message: "Item removed" };
  }

  // --------------------------------------------------------
  // APPLY VOUCHER
  // --------------------------------------------------------
  async applyVoucher(userId, voucherCode) {
    const cart = await this.getOrCreateCart(userId);

    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const discount = await applyVoucher(voucherCode, total);

    return {
      originalTotal: total,
      discount,
      finalTotal: total - discount,
    };
  }

  // --------------------------------------------------------
  // AUTO REDUCE STOCK ON CHECKOUT
  // --------------------------------------------------------
  async checkout(userId) {
    const cart = await this.getOrCreateCart(userId);

    for (const item of cart.items) {
      const product = await Product.findByPk(item.product_id);

      if (product.stock < item.quantity) {
        throw new Error(`Stock not enough for product: ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save();
    }

    await CartItem.destroy({ where: { cart_id: cart.id } });
    await this.refreshCache(userId);

    return { message: "Checkout success ❗ Stok otomatis dikurangi" };
  }

  // --------------------------------------------------------
  // MERGE GUEST CART → USER CART
  // --------------------------------------------------------
  async mergeGuestCart(userId, guestItems = []) {
    const cart = await this.getOrCreateCart(userId);

    for (const g of guestItems) {
      await this.addItem(userId, g.product_id, g.quantity);
    }

    await this.refreshCache(userId);

    return { message: "Guest cart merged", cart };
  }

  // --------------------------------------------------------
  // CART EXPIRATION (hapus otomatis setelah 7 hari tidak dipakai)
  // --------------------------------------------------------
  async refreshCache(userId) {
    const cart = await this.getOrCreateCart(userId);
    await redis.setEx(`cart:${userId}`, 60 * 60 * 24 * 7, JSON.stringify(cart));
  }
}

module.exports = new CartService();
