const express = require('express');
const cspReportRouter = express.Router();
const { cspReportLimiter } = require('../middleware/rateLimiters');

cspReportRouter.post('/csp-report', cspReportLimiter, (req, res) => {
    const reportData = req.body?.['csp-report'] || req.body;
    req.log.warn({ cspReport: reportData }, 'CSP violation report');
    res.status(204).end();
});

module.exports = cspReportRouter;