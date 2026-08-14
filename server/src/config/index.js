require('dotenv').config();

module.exports = {
    port: Number(process.env.PORT) || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    mail: {
        transport: process.env.MAIL_TRANSPORT || 'stream',
        from: process.env.MAIL_FROM || 'no-reply@realty-board.local',
    },
    pagination: {
        defaultSize: Number(process.env.PAGE_SIZE_DEFAULT) || 20,
        maxSize: Number(process.env.PAGE_SIZE_MAX) || 2000,
    },
};
