
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

// CRUD routes

router.get("/", paymentController.getAllPayment); // GET all
router.get("/:id", paymentController.getPaymentById); // GET one
router.post("/", paymentController.createPayment); // CREATE
router.put("/:id", paymentController.updatePayment); // UPDATE
router.delete("/:id", paymentController.deletePayment); // DELETE

module.exports = router;