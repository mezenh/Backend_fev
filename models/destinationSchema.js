const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  region: { type: String, enum: ["Nord", "Sud", "Centre", "Côte"], required: true },
  type: { type: String, enum: ["culturel", "aventure", "balnéaire", "écologique"] },
  coordinates: { lat: Number, lng: Number }, // Pour la carte interactive
  images: [String], // URLs des images (stockées sur Cloudinary)
  averageRating: { type: Number, default: 0 },
  nearbyPlaces: { // Recommandations proches
    hotels: [String],
    restaurants: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);