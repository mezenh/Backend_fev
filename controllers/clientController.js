const Product = require('../models/productSchema');
const Booking = require('../models/bookingSchema');

// [CLIENT] Voir les produits disponibles
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// [CLIENT] Réserver une destination
exports.createBooking = async (req, res) => {
  try {
    const { destination, startDate, endDate, guests } = req.body;
    
    const booking = await Booking.create({
      user: req.user.id,
      destination,
      startDate,
      endDate,
      guests
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};