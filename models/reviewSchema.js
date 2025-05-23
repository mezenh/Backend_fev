const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  destination: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Destination', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    maxlength: 500 
  },
  photos: [String], // URLs des images (Cloudinary/Firebase)
  isVerified: { 
    type: Boolean, 
    default: false 
  } // Pour modération
}, { 
  timestamps: true 
});

// Mise à jour automatique de la note moyenne de la destination
reviewSchema.post('save', async function() {
  const Destination = mongoose.model('Destination');
  const stats = await this.model('Review').aggregate([
    { $match: { destination: this.destination } },
    { $group: { _id: '$destination', avgRating: { $avg: '$rating' } } }
  ]);
  
  await Destination.findByIdAndUpdate(this.destination, {
    averageRating: stats[0]?.avgRating || 0
  });
});

module.exports = mongoose.model('Review', reviewSchema);