import { z } from "zod";
import { LEVEL_VALUES } from '../constants/logLevels';
import type { LogLevelName } from '../constants/logLevels';

export const logsQuerySchema = z.object({
    level: z.enum(Object.keys(LEVEL_VALUES) as [LogLevelName, ...LogLevelName[]]).optional(),
    limit: z.coerce.number().int().positive().max(500).optional().default(50),
    reqId: z.string().optional(),
});

export type LogsQuery = z.infer<typeof logsQuerySchema>;