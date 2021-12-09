import { createReadStream } from "fs";
import { createInterface } from "readline";

async function main() {
  const fileStream = createReadStream("day09/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const map = [] as number[][];

  for await (const line of rl) {
    const row = [] as number[];
    for (const point of line.split("")) {
      row.push(parseInt(point));
    }
    map.push(row);
  }

  const riskPoints = [] as number[];

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const point = row[j];
      if (
        (j - 1 < 0 || point < row[j - 1]) &&
        (j + 1 >= row.length || point < row[j + 1]) &&
        (i - 1 < 0 || point < map[i - 1][j]) &&
        (i + 1 >= map.length || point < map[i + 1][j])
      ) {
        riskPoints.push(point);
      }
    }
  }

  console.log(riskPoints.reduce((a, b) => a + b + 1, 0));
}

main();
