require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const productSchema = require('./models/productSchema');

// Initialisation Express
const app = express();

// Connexion MongoDB
const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  }
};

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import des routes
const routes = {
  base: require('./routes/indexRouter'),
  users: require('./routes/usersRouter'),
  os: require('./routes/osRouter'),
  influencers: require('./routes/influencerRouter'),
  reviews: require('./routes/reviewRoutes'),
  itineraries: require('./routes/itineraryRoutes'),
  events: require('./routes/eventRoutes'),
  admin: require('./routes/adminRoutes'),
  client: require('./routes/clientRoutes'),
  products: require('./routes/productRoutes') // AJOUT IMPORTANT
};

// Configuration des routes
app.use("/", routes.base);
app.use('/users', routes.users);
app.use("/os", routes.os);
app.use("/influencers", routes.influencers);
app.use('/api/reviews', routes.reviews);
app.use('/api/itineraries', routes.itineraries);
app.use('/api/events', routes.events);
app.use('/api/admin', routes.admin);
app.use('/api', routes.client);
app.use('/api/products', routes.products); // AJOUT IMPORTANT

// Gestion des erreurs
app.use((req, res, next) => {
  next(createError(404, 'Endpoint non trouvé'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  await connectToMongoDb();
  server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log('Routes disponibles:');
    console.log('- POST /api/products');
    console.log('- PUT /api/products/:id');
    console.log('- DELETE /api/products/:id');
  });
};

process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  server.close(() => process.exit(1));
});

startServer();