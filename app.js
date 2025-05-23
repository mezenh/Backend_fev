var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { connectToMongoDb } = require("./config/db");
require("dotenv").config();
const http = require('http');

// Import des routeurs
var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');
var osRouter = require('./routes/osRouter');
var influencerRouter = require('./routes/influencerRouter'); // Nouveau routeur
const reviewRoutes = require('./routes/reviewRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const eventRoutes = require('./routes/eventRoutes');
var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", indexRouter);
app.use('/users', usersRouter);
app.use("/os", osRouter);
app.use("/influencers", influencerRouter); // Nouvelle route pour les influenceurs
app.use('/api/reviews', reviewRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/events', eventRoutes);

// Gestion des erreurs
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({ error: err.message });
});

// Lancement du serveur
const server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
  connectToMongoDb();
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});