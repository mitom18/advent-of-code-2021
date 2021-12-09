import { createReadStream } from "fs";
import { createInterface } from "readline";

async function main() {
  const fileStream = createReadStream("day09/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const map = [] as number[][];
  const mapVisited = [] as boolean[][];

  for await (const line of rl) {
    const row = [] as number[];
    const rowVisited = [] as boolean[];
    for (const point of line.split("")) {
      row.push(parseInt(point));
      rowVisited.push(false);
    }
    map.push(row);
    mapVisited.push(rowVisited);
  }

  const basinSizes = [] as number[];

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
        let basinSize = 0;
        const stack = [[j, i]] as number[][];
        while (stack.length > 0) {
          const [x, y] = stack.pop() as unknown as number[];

          if (mapVisited[y][x] === true) {
            continue;
          }

          mapVisited[y][x] = true;
          basinSize++;

          if (
            x - 1 >= 0 &&
            mapVisited[y][x - 1] === false &&
            map[y][x - 1] !== 9
          ) {
            stack.push([x - 1, y]);
          }

          if (
            y - 1 >= 0 &&
            mapVisited[y - 1][x] === false &&
            map[y - 1][x] !== 9
          ) {
            stack.push([x, y - 1]);
          }

          if (
            x + 1 < map[y].length &&
            mapVisited[y][x + 1] === false &&
            map[y][x + 1] !== 9
          ) {
            stack.push([x + 1, y]);
          }

          if (
            y + 1 < map.length &&
            mapVisited[y + 1][x] === false &&
            map[y + 1][x] !== 9
          ) {
            stack.push([x, y + 1]);
          }
        }
        basinSizes.push(basinSize);
      }
    }
  }

  console.log(
    basinSizes
      .sort((a, b) => b - a)
      .filter((_v, i) => i < 3)
      .reduce((a, b) => a * b, 1)
  );
}

main();
