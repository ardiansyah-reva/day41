// backend/routes/index.js

const express = require("express");
const router = express.Router();


// Import semua routes lain (nanti setelah dibuat)
const userRoutes = require("./user.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const cartRoutes = require("./cart.routes");
const authRoutes = require("./auth.routes");


// contoh route
router.get("/", (req, res) => {
  res.json({ message: "API Route Connected" });
});

// Gunakan sub-route
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);


module.exports = router;