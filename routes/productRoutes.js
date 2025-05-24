const express = require('express');
const router = express.Router();
const productController = require('../controllers/admin/productController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Routes ADMIN (protégées)
router.post('/', protect, isAdmin, productController.createProduct);
router.put('/:id', protect, isAdmin, productController.updateProduct);
router.delete('/:id', protect, isAdmin, productController.deleteProduct);

// Routes PUBLIC
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

module.exports = router;