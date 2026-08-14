function sendResponse(res, status, data = null, error = null, meta = null) {
    res.status(status).json({
        data,
        error,
        meta,
    });
}

module.exports = sendResponse;