const express = require('express');
const logsController = require('../controllers/logsController');
const { validate } = require('../middleware/validate');
const { logsQuerySchema } = require('../schemas/logsSchema');

const logsRouter = express.Router();

logsRouter.get('/', validate(logsQuerySchema, 'query'), logsController.list);

module.exports = logsRouter;