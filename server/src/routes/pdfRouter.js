const express = require('express');
const pdfController = require('../controllers/pdfController');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');
const { pdfQuerySchema, pdfBundleQuerySchema } = require('../schemas/pdfSchema');

const pdfRouter = express.Router();

pdfRouter.get('/listings/:id/pdf', validate(pathIdSchema, 'params'), validate(pdfQuerySchema, 'query'), pdfController.listingCard);
pdfRouter.get('/listings/pdf', validate(pdfBundleQuerySchema, 'query'), pdfController.listingsBundle);

module.exports = pdfRouter;