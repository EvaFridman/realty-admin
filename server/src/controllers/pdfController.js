const listingsService = require('../services/listingsService');
const pdfService = require('../services/pdfService');
const { NotFoundError } = require('../errors/AppError');

async function listingCard(req, res, next) {
    try {
        const { id } = req.params;
        const { mode } = req.validatedQuery;

        const listing = await listingsService.getListingById(id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `${mode === 'download' ? 'attachment' : 'inline'}; filename="listing-${id}.pdf"`
        );
        pdfService.streamListingCard(res, listing);
    } catch (err) {
        next(err);
    }
}

async function listingsBundle(req, res, next) {
    try {
        const { ids, mode } = req.validatedQuery;

        const listings = await listingsService.getListingsByIds(ids);
        if (!listings.length) throw new NotFoundError('No listings found for given ids');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `${mode === 'download' ? 'attachment' : 'inline'}; filename="listings-bundle.pdf"`
        );
        pdfService.streamListingsBundle(res, listings);
    } catch (err) {
        next(err);
    }
}

module.exports = { listingCard, listingsBundle };