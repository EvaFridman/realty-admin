const express = require('express');
const pdfController = require('../controllers/pdfController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { pdfQuerySchema, pdfBundleQuerySchema } = require('../schemas/pdfSchema');

const pdfRouter = express.Router();

pdfRouter.use(verifyAccessToken);
pdfRouter.use(requireRole('moderator'));

pdfRouter.get('/listings/:id/pdf', validate(pathIdSchema, 'params'), validate(pdfQuerySchema, 'query'), pdfController.listingCard);
pdfRouter.get('/listings/pdf', validate(pdfBundleQuerySchema, 'query'), pdfController.listingsBundle);

module.exports = pdfRouter;