import { createReadStream } from "fs";
import { createInterface } from "readline";

async function countIncreases() {
  const fileStream = createReadStream("day01/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let increases = 0;
  let prevDepth: number | null = null;

  for await (const line of rl) {
    const depth = parseInt(line);
    if (prevDepth === null) {
      prevDepth = depth;
      continue;
    }
    if (depth > prevDepth) {
      increases++;
    }
    prevDepth = depth;
  }

  console.log(increases);
}

countIncreases();
