import { createReadStream } from "fs";
import { createInterface } from "readline";

interface CavesAdjList {
  [key: string]: string[];
}

interface Path {
  lastPoint: string;
  path: string[];
  lowerTwice: boolean;
}

const START = "start";
const END = "end";

const isLowerCase = (str: string) => str === str.toLowerCase();
const isUpperCase = (str: string) => str === str.toUpperCase();

const hasPathNoLowerCaseTwice = (path: string[]) => {
  const lowers = path.filter((p) => isLowerCase(p));
  return (
    lowers.length === lowers.filter((v, i, s) => s.indexOf(v) === i).length
  );
};

async function main() {
  const fileStream = createReadStream("day12/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const caves = {} as CavesAdjList;

  let finalPathsCount = 0;

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

  const paths = [] as Path[];
  paths.push({ lastPoint: START, path: [START], lowerTwice: false });

  while (paths.length > 0) {
    const path = paths.shift() as Path;

    if (path.lastPoint === END) {
      finalPathsCount++;
      continue;
    }

    caves[path.lastPoint].forEach((c) => {
      const seenCave = path.path.includes(c);
      if (!seenCave) {
        const pathSoFar = [...path.path];
        if (isLowerCase(c)) {
          pathSoFar.push(c);
        }
        paths.push({
          lastPoint: c,
          path: pathSoFar,
          lowerTwice: path.lowerTwice,
        });
      } else if (seenCave && !path.lowerTwice && c !== START && c !== END) {
        paths.push({ lastPoint: c, path: [...path.path], lowerTwice: true });
      }
    });
  }

  console.log(finalPathsCount);
}

main();
