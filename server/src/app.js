const express = require('express');
const usersRouter = require('./routes/usersRouter');
const districtsRouter = require('./routes/districtsRouter');
const listingsRouter = require('./routes/listingsRouter');
const favoritesRouter = require('./routes/favoritesRouter');
const viewingsRouter = require('./routes/viewingsRouter');
const logsRouter = require('./routes/logsRouter');
const listingPhotosRouter = require('./routes/listingPhotosRouter');
const viewingsStatusRouter = require('./routes/viewingsStatusRouter');
const pdfRouter = require('./routes/pdfRouter');
const setupMiddleware = require('./bootstrap/middleware');
const errorHandler = require('./middleware/errorHandler');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const app = express();

app.use(loggerMiddleware);

setupMiddleware(app);

app.use('/users', usersRouter);
app.use('/districts', districtsRouter);
app.use('/listings', listingsRouter);
app.use('/users/:id/favorites', favoritesRouter);
app.use('/listings/:id/viewings', viewingsRouter);
app.use('/viewings', viewingsStatusRouter);
app.use('/listings/:id/photos', listingPhotosRouter);
app.use(logsRouter);
app.use(pdfRouter);
app.use(errorHandler);

module.exports = app;