import type { Response } from "express";
import type { HTTPErrorType } from "../../types/index";

export function sendResponse<T>(
    res: Response,
    status: number,
    data: T | null = null,
    error: HTTPErrorType | null = null,
    meta: Record<string, unknown> | null = null
): void {
    res.status(status).json({ data, error, meta });
}