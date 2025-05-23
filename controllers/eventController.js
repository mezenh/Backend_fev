const Event = require('../models/eventSchema');
const Destination = require('../models/destinationSchema');
const User = require('../models/userSchema');

// @desc    Créer un nouvel événement
// @route   POST /api/events
// @access  Privé/Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, destinationId } = req.body;

    // Vérifier que la destination existe
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination non trouvée' });
    }

    const event = await Event.create({
      title,
      description,
      location,
      date,
      destination: destinationId,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Récupérer tous les événements
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    // Filtrage par date si fourni (ex: /api/events?from=2023-01-01&to=2023-12-31)
    const { from, to } = req.query;
    let query = {};
    
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const events = await Event.find(query)
      .populate('destination', 'name region')
      .populate('subscribers', 'username email')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    S'abonner à un événement
// @route   POST /api/events/:id/subscribe
// @access  Privé
exports.subscribeToEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { subscribers: req.user.id } }, // Évite les doublons
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }

    // Ajouter l'événement à la liste de l'utilisateur
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedEvents: req.params.id }
    });

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Rechercher des événements par région
// @route   GET /api/events/region/:region
// @access  Public
exports.getEventsByRegion = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: 'destination',
        match: { region: req.params.region },
        select: 'name region'
      })
      .where('destination').ne(null) // Exclut les événements sans destination correspondante
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/events/:id
// @access  Privé/Admin
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/events/:id
// @access  Privé/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }

    // Retirer l'événement des abonnements utilisateurs
    await User.updateMany(
      { subscribedEvents: req.params.id },
      { $pull: { subscribedEvents: req.params.id } }
    );

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};