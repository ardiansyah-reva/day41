// const express = require("express");
// const router = express.Router();

// // GET cart
// router.get("/", (req, res) => {
//   res.json({
//     message: "GET user cart (route working)",
//   });
// });

// module.exports = router;

// routes/product.routes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// CRUD routes

router.get("/", cartController.getAllCart); // GET all
router.get("/:id", cartController.getCartById); // GET one
router.post("/", cartController.createCart); // CREATE
router.put("/:id", cartController.updateCart); // UPDATE
router.delete("/:id", cartController.deleteCart); // DELETE

module.exports = router;