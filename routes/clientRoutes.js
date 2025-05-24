const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middlewares/authMiddleware');

// Public
router.get('/products', clientController.getProducts);

// Privé (authentification requise)
router.post('/bookings', protect, clientController.createBooking);

module.exports = router;