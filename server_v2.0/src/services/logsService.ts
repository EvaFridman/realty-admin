import { readLastLines } from "../tools/readLastLines";
import { LEVEL_VALUES } from "../constants/logLevels";
import { LOG_FILE } from "../constants/paths";

type LogEntry = { level: number; req?: { reqId?: string } };

function parseLine(line: string): LogEntry | null {
    try {
        return JSON.parse(line) as LogEntry;
    } catch {
        return null;
    }
}

export async function getLogs({ level, limit, reqId }: { level?: keyof typeof LEVEL_VALUES; limit: number; reqId?: string}): Promise<LogEntry[]> {
    const minLevelValue = level ? LEVEL_VALUES[level] : 0;

    let windowSize = limit * 20;
    let matches: LogEntry[] = [];
    let exhausted = false;

    while (matches.length < limit && !exhausted) {
        const rawLines = await readLastLines(LOG_FILE, windowSize);
        exhausted = rawLines.length < windowSize;

        matches = rawLines
            .map(parseLine)
            .filter((entry): entry is LogEntry => entry !== null)
            .filter((entry) => entry.level >= minLevelValue)
            .filter((entry) => !reqId || entry.req?.reqId === reqId);
        windowSize *= 4;
    }

    return matches.slice(-limit).reverse();
}