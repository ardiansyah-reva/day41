// routes/product.routes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// CRUD routes

router.get("/", productController.getAllProducts); // GET all
router.get("/:id", productController.getProductById); // GET one
router.post("/", productController.createProduct); // CREATE
router.put("/:id", productController.updateProduct); // UPDATE
router.delete("/:id", productController.deleteProduct); // DELETE

module.exports = router;