const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  destinations: [{
    destination: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Destination' 
    },
    visitDate: Date,
    notes: String
  }],
  duration: { 
    type: Number, 
    min: 1 
  }, // En jours
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  tags: [String] // Ex: ["aventure", "famille"]
}, { 
  timestamps: true 
});

// Pour les recherches full-text
itinerarySchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Itinerary', itinerarySchema);