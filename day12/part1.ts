import { createReadStream } from "fs";
import { createInterface } from "readline";

interface CavesAdjList {
  [key: string]: string[];
}

const START = "start";
const END = "end";

const isLowerCase = (str: string) => str === str.toLowerCase();
const isUpperCase = (str: string) => str === str.toUpperCase();

async function main() {
  const fileStream = createReadStream("day12/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const caves = {} as CavesAdjList;

  const finalPaths = [] as string[][];

  for await (const line of rl) {
    const points = line.split("-");
    if (!caves[points[0]]) {
      caves[points[0]] = [];
    }
    if (!caves[points[1]]) {
      caves[points[1]] = [];
    }
    caves[points[0]].push(points[1]);
    caves[points[1]].push(points[0]);
  }

  const paths = [] as string[][];
  let path = [] as string[];
  path.push(START);
  paths.push([...path]);

  while (paths.length) {
    path = paths.shift() as string[];
    const lastPoint = path[path.length - 1];

    if (lastPoint === END) {
      finalPaths.push([...path]);
    }

    caves[lastPoint].forEach((c) => {
      if (isUpperCase(c) || (isLowerCase(c) && !path.includes(c))) {
        const tmpPath = [...path];
        tmpPath.push(c);
        paths.push(tmpPath);
      }
    });
  }

  console.log(finalPaths.length);
}

main();
