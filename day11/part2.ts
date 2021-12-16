import { createReadStream } from "fs";
import { createInterface } from "readline";

function getNeighbors(x: number, y: number) {
  return [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
}

function flash(octopuses: number[][], x: number, y: number) {
  if (octopuses[y][x] !== 10) {
    return 0;
  }

  let count = 1;

  for (const neighbor of getNeighbors(x, y)) {
    if (
      neighbor[1] < 0 ||
      neighbor[1] >= octopuses.length ||
      neighbor[0] < 0 ||
      neighbor[0] >= octopuses[y].length
    ) {
      continue;
    }
    if (octopuses[neighbor[1]][neighbor[0]] <= 9) {
      octopuses[neighbor[1]][neighbor[0]]++;
      count += flash(octopuses, neighbor[0], neighbor[1]);
    }
  }

  octopuses[y][x] = 11;

  return count;
}

async function main() {
  const fileStream = createReadStream("day11/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const octopuses = [] as number[][];

  for await (const line of rl) {
    const row = [] as number[];
    for (const c of line) {
      row.push(parseInt(c));
    }
    octopuses.push(row);
  }

  for (let i = 1; ; i++) {
    let flashes = 0;

    for (let y = 0; y < octopuses.length; y++) {
      for (let x = 0; x < octopuses[y].length; x++) {
        octopuses[y][x]++;
      }
    }

    for (let y = 0; y < octopuses.length; y++) {
      for (let x = 0; x < octopuses[y].length; x++) {
        flashes += flash(octopuses, x, y);
      }
    }

    for (let y = 0; y < octopuses.length; y++) {
      for (let x = 0; x < octopuses[y].length; x++) {
        if (octopuses[y][x] > 9) {
          octopuses[y][x] = 0;
        }
      }
    }

    if (flashes === octopuses.length * octopuses[0].length) {
      console.log(i);
      break;
    }
  }
}

main();
