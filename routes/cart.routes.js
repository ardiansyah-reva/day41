const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../middlewares/auth");

// Semua route butuh auth
router.use(auth);

// Cart routes
router.get('/', cartController.getAllCart);
router.get('/:id', cartController.getCartById);
router.post('/items', cartController.createCart);        
router.put('/items/:id', cartController.updateCart);  
router.delete('/items/:id', cartController.deleteCart);
// router.delete('/clear', cartController.clearCart);

module.exports = router;
