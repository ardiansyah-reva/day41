const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// CRUD routes

router.get("/", userController.getAllUser); // GET all
router.get("/:id", userController.getUserById); // GET one
// router.post("/", productController.createP); // CREATE
router.put("/:id", userController.updateUser); // UPDATE
router.delete("/:id", userController.deleteUser); // DELETE

module.exports = router;