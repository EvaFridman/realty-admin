const express = require('express');
const logsController = require('../controllers/logsController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { logsQuerySchema } = require('../schemas/logsSchema');

const logsRouter = express.Router();

logsRouter.get('/', verifyAccessToken, requireRole('moderator'), validate(logsQuerySchema, 'query'), logsController.list);

module.exports = logsRouter;