import type { RequestHandler } from "express";
import * as listingsService from "../services/listingsService";
import * as pdfService from "../services/pdfService";
import { NotFoundError } from "../errors/AppError";
import type { PdfQuery, PdfBundleQuery } from "../schemas/pdfSchema";

export const listingCard: RequestHandler<{ id: string }> = async (req, res) => {
    const { id } = req.params;
    const { mode } = req.validatedQuery as PdfQuery;

    const listing = await listingsService.getListingForPdf(req.user!, Number(id));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `${mode === 'download' ? 'attachment' : 'inline'}; filename="listing-${id}.pdf"`
    );
    pdfService.streamListingCard(res, listing);
}

export const listingsBundle: RequestHandler = async (req, res) => {
    const { ids, mode } = req.validatedQuery as PdfBundleQuery;

    const listings = await listingsService.getListingsByIds(ids);
    if (!listings.length) throw new NotFoundError('No listings found for given ids');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `${mode === 'download' ? 'attachment' : 'inline'}; filename="listings-bundle.pdf"`
    );
    pdfService.streamListingsBundle(res, listings);
}