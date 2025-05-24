const mongoose = require('mongoose'); // Ajoutez cette ligne en haut
const Booking = require('../../models/bookingSchema');

// [ADMIN] Valider une réservation
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    ).populate('user destination');
    
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// [ADMIN] Voir toutes les réservations
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user destination');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};