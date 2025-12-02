const { Order, OrderItem, Product, User, Payment, Shipment } = require("../models");
const sequelize = require("../db");

class OrderService {
  /**
   * Get all orders dengan pagination
   */
  async getAllOrders(userId = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const where = userId ? { user_id: userId } : {};

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["id", "full_name", "email", "nickname"] },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
        { model: Payment, as: "payment" },
        { model: Shipment, as: "shipment" },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      orders: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "user" },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
        { model: Payment, as: "payment" },
        { model: Shipment, as: "shipment" },
      ],
    });

    if (!order) throw new Error("Order not found");
    return order;
  }

  /**
   * Create order + auto cut stock + create shipment + create payment
   */
  async createOrder(userId, items = [], paymentData, shipmentData) {
    const t = await sequelize.transaction();

    try {
      // 1. Hitung total price
      let totalAmount = 0;

      // 2. Validasi stok
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);

        if (!product) throw new Error("Product not found");
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        totalAmount += Number(product.price) * item.quantity;
      }

      // 3. Buat order
      const order = await Order.create(
        {
          user_id: userId,
          total_amount: totalAmount,
          status: "pending",
        },
        { transaction: t }
      );

      // 4. Create order items + cut stock
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);

        await OrderItem.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,
          },
          { transaction: t }
        );

        // Kurangi stok
        await product.update(
          { stock: product.stock - item.quantity },
          { transaction: t }
        );
      }

      // 5. Create shipment
      const shipment = await Shipment.create(
        {
          order_id: order.id,
          address: shipmentData.address,
          courier: shipmentData.courier,
          tracking_number: null,
          status: "waiting_pickup",
        },
        { transaction: t }
      );

      // 6. Create payment
      const payment = await Payment.create(
        {
          order_id: order.id,
          method: paymentData.method,
          amount: totalAmount,
          status: "pending",
        },
        { transaction: t }
      );

      await t.commit();

      return { order, payment, shipment };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status) {
    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    await order.update({ status });
    return order;
  }

  /**
   * Cancel order + restore stock
   */
  async cancelOrder(orderId) {
    const t = await sequelize.transaction();

    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: "items" }],
      });

      if (!order) throw new Error("Order not found");
      if (order.status === "cancelled") throw new Error("Order already cancelled");

      // Restore stok
      for (const item of order.items) {
        const product = await Product.findByPk(item.product_id);

        await product.update(
          { stock: product.stock + item.quantity },
          { transaction: t }
        );
      }

      // Update status
      await order.update({ status: "cancelled" }, { transaction: t });

      await t.commit();
      return order;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = new OrderService();
