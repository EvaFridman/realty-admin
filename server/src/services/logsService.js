const { readLastLines } = require('../repositories/logsRepository');
const { LEVEL_VALUES } = require('../constants/logLevels');
const { LOG_FILE } = require('../constants/paths');

async function getLogs({ level, limit, reqId }) {
    const minLevelValue = level ? LEVEL_VALUES[level] : 0;

    let windowSize = limit * 20;
    let matches = [];
    let exhausted = false;

    while (matches.length < limit && !exhausted) {
        const rawLines = await readLastLines(LOG_FILE, windowSize);
        exhausted = rawLines.length < windowSize;

        matches = rawLines
            .map(parseLine)
            .filter(Boolean)
            .filter((entry) => entry.level >= minLevelValue)
            .filter((entry) => !reqId || entry.reqId === reqId);

        windowSize *= 4;
    }

    return matches.slice(-limit).reverse();
}

function parseLine(line) {
    try {
        return JSON.parse(line);
    } catch {
        return null;
    }
}

module.exports = { getLogs };