const districtsRouter = require('express').Router();
const districtsController = require('../controllers/districtsController');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createDistrictSchema, updateDistrictSchema } = require('../schemas/districtsSchema');

districtsRouter.get('/', districtsController.list);
districtsRouter.get('/:id', validate(pathIdSchema, 'params'), districtsController.getById);
districtsRouter.post('/', validate(createDistrictSchema, 'body'), districtsController.create);
districtsRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateDistrictSchema, 'body'), districtsController.update);

module.exports = districtsRouter;