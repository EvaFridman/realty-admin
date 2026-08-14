const { z } = require('zod');
const { LEVEL_VALUES } = require('../constants/logLevels');

const logsQuerySchema = z.object({
    level: z.enum(Object.keys(LEVEL_VALUES)).optional(),
    limit: z.coerce.number().int().positive().max(500).optional().default(50),
    reqId: z.string().optional(),
});

module.exports = { logsQuerySchema };