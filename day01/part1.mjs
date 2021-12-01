import { createReadStream } from "fs";
import { createInterface } from "readline";

async function countIncreases() {
    const fileStream = createReadStream("part1.in");

    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let increases = 0;
    let prevDepth = null;

    for await (const line of rl) {
        if (prevDepth === null) {
            prevDepth = parseInt(line);
            continue;
        }
        if (line > prevDepth) {
            increases++;
        }
        prevDepth = parseInt(line);
    }

    console.log(increases);
}

countIncreases();
