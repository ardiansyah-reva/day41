// routes/Shipment.routes.js

const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipment.controller");

// CRUD routes

router.get("/", shipmentController.getAllShipment); // GET all
router.get("/:id", shipmentController.getShipmentById); // GET one
router.post("/", shipmentController.createShipment); // CREATE
router.put("/:id", shipmentController.updateShipment); // UPDATE
router.delete("/:id", shipmentController.deleteShipment); // DELETE

module.exports = router;