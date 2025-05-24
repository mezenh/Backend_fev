const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le pseudo est obligatoire'],
    unique: true,
    trim: true,
    minlength: [3, 'Le pseudo doit faire au moins 3 caractères'],
    maxlength: [30, 'Le pseudo ne doit pas dépasser 30 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit faire au moins 8 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'influenceur'],  // Modifié ici
    default: 'client'
  },
  age: {
    type: Number,
    min: [13, 'L\'âge minimum est 13 ans'],
    max: [120, 'Âge invalide']
  },
  user_image: {
    type: String,
    default: 'default.jpg'
  },
  ban: {
    type: Boolean,
    default: false
  },
  // Champs spécifiques aux influenceurs
  social_media: {  // Nouveau champ
    instagram: String,
    tiktok: String,
    youtube: String
  },
  followers_count: {  // Nouveau champ
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware de hachage du mot de passe (identique)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Méthodes d'instance (identique)
userSchema.methods = {
  comparePassword: async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },
  changedPasswordAfter: function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  },
  createPasswordResetToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;