const logsService = require('../services/logsService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const { level, limit, reqId } = req.validatedQuery;
        const logs = await logsService.getLogs({ level, limit, reqId });
        sendResponse(res, 200, logs, null, { count: logs.length, limit });
    } catch (err) {
        next(err);
    }
}

module.exports = { list };