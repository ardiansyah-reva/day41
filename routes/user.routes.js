// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Middleware: User hanya bisa edit/hapus dirinya sendiri
const checkOwnership = (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({
      code: 403,
      status: "error",
      message: "Anda tidak bisa mengakses data user lain"
    });
  }
  next();
};

// CRUD routes
router.get("/", userController.getAllUser); // GET all (admin only)
router.get("/:id", userController.getUserById); // GET one
router.put("/:id", checkOwnership, userController.updateUser); // UPDATE (hanya diri sendiri)
router.delete("/:id", checkOwnership, userController.deleteUser); // DELETE (hanya diri sendiri)

module.exports = router;