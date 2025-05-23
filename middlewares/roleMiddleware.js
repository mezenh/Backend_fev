const User = require('../models/userSchema');

// Middleware pour vérifier les rôles
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // 1. Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      // 2. Vérifier si le rôle est autorisé
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false,
          message: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}` 
        });
      }

      // 3. Ajouter les infos utilisateur à la requête
      req.user.role = user.role;
      next();
      
    } catch (error) {
      console.error('Erreur du middleware de rôle:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur de vérification des rôles' 
      });
    }
  };
};

// Middlewares spécifiques par rôle
const isAdmin = checkRole(['admin']);
const isInfluencer = checkRole(['influencer', 'admin']); // Les admins ont tous les accès
const isClient = checkRole(['client', 'influencer', 'admin']);

// Vérification de propriétaire (pour les modifications utilisateur)
const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.role === 'admin' || req.params.id === req.user.id) {
      return next();
    }

    res.status(403).json({ 
      success: false,
      message: 'Accès refusé. Vous devez être admin ou propriétaire' 
    });
    
  } catch (error) {
    console.error('Erreur isOwnerOrAdmin:', error);
    res.status(500).json({ message: 'Erreur de vérification des permissions' });
  }
};

module.exports = {
  checkRole,
  isAdmin,
  isInfluencer,
  isClient,
  isOwnerOrAdmin
};