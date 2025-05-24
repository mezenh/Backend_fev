const express = require('express');
const router = express.Router();
const productController = require('../controllers/admin/productController');
const bookingController = require('../controllers/admin/bookingController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Gestion des produits
router.post('/products', protect, isAdmin, productController.createProduct);
router.put('/products/:id', protect, isAdmin, productController.updateProduct);
router.delete('/products/:id', protect, isAdmin, productController.deleteProduct);

// Gestion des réservations
router.get('/bookings', protect, isAdmin, bookingController.getAllBookings);
router.patch('/bookings/:id/approve', protect, isAdmin, bookingController.approveBooking);

module.exports = router;