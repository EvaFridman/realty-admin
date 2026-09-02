import { Router } from "express";
import * as pdfController from "../controllers/pdfController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, requireRole } from "../middleware/auth";
import { pathIdSchema } from "../schemas/pathSchema";
import { pdfQuerySchema, pdfBundleQuerySchema } from "../schemas/pdfSchema";

const pdfRouter = Router();

pdfRouter.use(verifyAccessToken);
pdfRouter.use(requireRole('moderator'));

pdfRouter.get('/listings/:id/pdf', validate(pathIdSchema, 'params'), validate(pdfQuerySchema, 'query'), pdfController.listingCard);
pdfRouter.get('/listings/pdf', validate(pdfBundleQuerySchema, 'query'), pdfController.listingsBundle);

export default pdfRouter;