const mongoose = require("mongoose");

const influencerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, // Lien vers le compte User
  
  socialMedia: {
    instagram: String,
    youtube: String,
    tiktok: String,
  },
  
  bio: { type: String, maxlength: 500 },
  specialties: [String],
  visitedDestinations: [{
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    review: String,
    photos: [String], 
    rating: { type: Number, min: 1, max: 5 }
  }],
  
  followersCount: { type: Number, default: 0 }
}, 
{ timestamps: true });

module.exports = mongoose.model("Influencer", influencerSchema);