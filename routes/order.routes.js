

// routes/order.routes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// CRUD routes

router.get("/", orderController.getAllOrder); // GET all
router.get("/:id", orderController.getOrderById); // GET one
router.post("/", orderController.createOrder); // CREATE
router.put("/:id", orderController.updateOrder); // UPDATE
router.delete("/:id", orderController.deleteOrder); // DELETE

module.exports = router;