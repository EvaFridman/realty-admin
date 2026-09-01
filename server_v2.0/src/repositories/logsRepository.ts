import fs from "node:fs";

const CHUNK_SIZE = 64 * 1024;

export async function readLastLines(filePath: string, maxLines: number): Promise<string[]> {
    const fd = await fs.promises.open(filePath, 'r');
    try {
        const { size } = await fd.stat();
        let position = size;
        let leftover = '';
        const lines: string[] = [];

        while (position > 0 && lines.length < maxLines) {
            const readSize = Math.min(CHUNK_SIZE, position);
            position -= readSize;

            const buffer = Buffer.alloc(readSize);
            await fd.read(buffer, 0, readSize, position);

            const chunk = buffer.toString('utf8') + leftover;
            const chunkLines = chunk.split('\n');

            leftover = chunkLines.shift() ?? "";

            lines.unshift(...chunkLines.filter(Boolean));
        }

        if (leftover) lines.unshift(leftover);

        return lines.slice(-maxLines);
    } finally {
        await fd.close();
    }
}