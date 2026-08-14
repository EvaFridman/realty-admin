const { z } = require('zod');

const pdfQuerySchema = z.object({
  mode: z.enum(['view', 'download']).optional().default('view'),
});

const pdfBundleQuerySchema = z.object({
  ids: z.string().transform((s) => s.split(',').map(Number)),
  mode: z.enum(['view', 'download']).optional().default('view'),
});

module.exports = { pdfQuerySchema, pdfBundleQuerySchema };