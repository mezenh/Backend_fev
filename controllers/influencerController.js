const Influencer = require("../models/influencerSchema");
const Destination = require("../models/destinationSchema");

// Méthodes à exporter
exports.getAllInfluencers = async (req, res) => {
  try {
    const influencers = await Influencer.find().populate('user');
    res.status(200).json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id)
      .populate('user visitedDestinations.destination');
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.status(200).json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInfluencer = async (req, res) => {
  try {
    const { userId, socialMedia, bio, specialties } = req.body;
    const influencer = await Influencer.create({ 
      user: userId, 
      socialMedia, 
      bio, 
      specialties 
    });
    res.status(201).json(influencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateInfluencer = async (req, res) => {
  try {
    const updatedInfluencer = await Influencer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedInfluencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInfluencer = async (req, res) => {
  try {
    await Influencer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Influencer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInfluencersByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const destinations = await Destination.find({ region });
    const influencers = await Influencer.find({
      "visitedDestinations.destination": { 
        $in: destinations.map(d => d._id) 
      }
    }).populate("user visitedDestinations.destination");
    res.status(200).json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addVisitedDestination = async (req, res) => {
  try {
    const { influencerId, destinationId, review, photos, rating } = req.body;
    const influencer = await Influencer.findByIdAndUpdate(
      influencerId,
      { $push: { 
        visitedDestinations: { 
          destination: destinationId, 
          review, 
          photos, 
          rating 
        } 
      }},
      { new: true }
    );
    res.status(200).json(influencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};