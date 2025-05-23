// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" }, // Lieu lié
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Utilisateurs abonnés
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);