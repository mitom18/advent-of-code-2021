import { createReadStream } from "fs";
import { createInterface } from "readline";

async function countIncreases() {
    const fileStream = createReadStream("data.in");

    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const depths = [];

    for await (const line of rl) {
        depths.push(parseInt(line));
    }

    const sums = [];

    for (let i = 0; i < depths.length; i++) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
            if (i + j >= depths.length) {
                break;
            }
            const depth = depths[i + j];
            sum += depth;
        }
        sums.push(sum);
    }

    let increases = 0;
    let prevSum = null;

    for (const sum of sums) {
        if (prevSum === null) {
            prevSum = sum;
            continue;
        }
        if (sum > prevSum) {
            increases++;
        }
        prevSum = sum;
    }

    console.log(increases);
}

countIncreases();
