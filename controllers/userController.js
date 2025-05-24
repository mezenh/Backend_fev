const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || "client",
      age,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        age: user.age,
        user_image: user.user_image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Vérification des champs requis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // 2. Récupération de l'utilisateur AVEC le mot de passe haché
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.password) {  // Vérification supplémentaire
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides"
      });
    }

    // 3. Comparaison sécurisée
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides"
      });
    }

    // 4. Génération du token (si JWT_SECRET est bien configuré)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Réponse sans le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};
// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const { username, age, user_image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, age, user_image },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Update any user (Admin or owner)
// @route   PUT /api/users/:id
// @access  Private/AdminOrOwner
exports.updateUser = async (req, res, next) => {
  try {
    const { username, age, user_image, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, age, user_image, role },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user ban status (Admin only)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.ban = !user.ban;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.ban ? "banned" : "unbanned"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update influencer social media
// @route   PUT /api/users/me/social
// @access  Private/Influencer
exports.updateSocialMedia = async (req, res, next) => {
  try {
    if (req.user.role !== 'influenceur') {
      return res.status(403).json({ 
        success: false, 
        message: "Accès réservé aux influenceurs" 
      });
    }

    const { instagram, tiktok, youtube } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        social_media: { instagram, tiktok, youtube },
        $inc: { followers_count: req.body.followers_increase || 0 }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top influencers
// @route   GET /api/users/top-influencers
// @access  Public
exports.getTopInfluencers = async (req, res, next) => {
  try {
    const influencers = await User.find({ 
      role: 'influenceur',
      ban: false 
    })
    .sort('-followers_count')
    .limit(10)
    .select('username user_image followers_count social_media');

    res.status(200).json({ success: true, influencers });
  } catch (error) {
    next(error);
  }
};