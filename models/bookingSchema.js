const mongoose = require('mongoose'); // Ajoutez cette ligne en haut
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Destination', 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });