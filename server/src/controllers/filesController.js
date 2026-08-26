const path = require('path');
const { NotFoundError } = require('../errors/AppError');

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

function sendFile(subfolder) {
    return (req, res, next) => {
        const filePath = path.join(__dirname, '..', 'uploads', subfolder, req.fileName);
        res.sendFile(filePath, { maxAge: MAX_AGE, immutable: true }, (err) => {
            if (err) next(new NotFoundError('File not found'));
        });
    };
}

module.exports = { sendFile };