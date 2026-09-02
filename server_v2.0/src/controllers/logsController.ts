import type { RequestHandler } from "express";
import * as logsService from "../services/logsService";
import { sendResponse } from "../utils/response";
import type { LogsQuery } from "../schemas/logsSchema";

export const list: RequestHandler = async (req, res) => {
    const { level, limit, reqId } = req.validatedQuery as LogsQuery;
    const logs = await logsService.getLogs({ level, limit, reqId });
    sendResponse(res, 200, logs, null, { count: logs.length, limit });
}