import { Router } from "express";
import { cspReportLimiter } from "../middleware/rateLimiters";

const cspReportRouter = Router();

cspReportRouter.post("/csp-report", cspReportLimiter, (req, res) => {
    const reportData = req.body?.['csp-report'] || req.body;
    req.log.warn({ cspReport: reportData }, 'CSP violation report');
    res.status(204).end();
});

export default cspReportRouter;