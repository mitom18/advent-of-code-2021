import { createReadStream } from "fs";
import { createInterface } from "readline";

interface VentLine {
  x: number;
  y: number;
}

async function main() {
  const fileStream = createReadStream("day05/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const ventLines = [] as VentLine[][];
  let maxNumber = 0;

  for await (const line of rl) {
    const points = line.split(" -> ");

    const coordsStart = points[0].split(",");
    const xStart = parseInt(coordsStart[0]);
    const yStart = parseInt(coordsStart[1]);

    const coordsEnd = points[1].split(",");
    const xEnd = parseInt(coordsEnd[0]);
    const yEnd = parseInt(coordsEnd[1]);

    maxNumber = Math.max(maxNumber, xStart, yStart, xEnd, yEnd);

    const ventLine = [
      { x: xStart, y: yStart },
      { x: xEnd, y: yEnd },
    ];
    ventLines.push(ventLine);
  }

  const diagram = [] as number[][];
  for (let i = 0; i <= maxNumber; i++) {
    const row = [] as number[];
    for (let j = 0; j <= maxNumber; j++) {
      row.push(0);
    }
    diagram.push(row);
  }

  for (const ventLine of ventLines) {
    if (ventLine[0].x === ventLine[1].x) {
      for (
        let y = Math.min(ventLine[0].y, ventLine[1].y);
        y <= Math.max(ventLine[0].y, ventLine[1].y);
        y++
      ) {
        diagram[y][ventLine[0].x]++;
      }
    } else if (ventLine[0].y === ventLine[1].y) {
      for (
        let x = Math.min(ventLine[0].x, ventLine[1].x);
        x <= Math.max(ventLine[0].x, ventLine[1].x);
        x++
      ) {
        diagram[ventLine[0].y][x]++;
      }
    }
  }

  let overlappingCount = 0;

  for (let i = 0; i < diagram.length; i++) {
    const row = diagram[i];
    for (let j = 0; j < row.length; j++) {
      const item = row[j];
      if (item > 1) {
        overlappingCount++;
      }
    }
  }

  console.log(overlappingCount);
}

main();
