
// product.controller.js
const { Op } = require("sequelize");
const Product = require("../models/Product");

// get all produk + SEARCH
exports.getAllProducts = async (req, res) => {
  try {
    const search = req.query.search || ""; // ambil ?search=
    
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    res.json({
      code: 200,
      status: "success",
      data: products,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};


// get produk byid
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      code: 200,
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// create produk
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};


// update produk id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    await product.update(req.body);

    res.json({
      status: "success",
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};


// delete produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    await product.destroy();

    res.json({
      code: 200,
      status: "success",
      message: "Product deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
