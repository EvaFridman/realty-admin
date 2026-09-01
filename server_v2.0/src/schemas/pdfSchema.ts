import { z } from "zod";

export const pdfQuerySchema = z.object({
  mode: z.enum(['view', 'download']).optional().default('view'),
});

export const pdfBundleQuerySchema = z.object({
  ids: z.string().transform((s) => s.split(',').map(Number)).pipe(z.array(z.number().int().positive())),
  mode: z.enum(['view', 'download']).optional().default('view'),
});

export type PdfQuery = z.infer<typeof pdfQuerySchema>;
export type PdfBundleQuery = z.infer<typeof pdfBundleQuerySchema>;