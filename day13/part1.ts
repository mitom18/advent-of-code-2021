import { createReadStream } from "fs";
import { createInterface } from "readline";

interface Dot {
  x: number;
  y: number;
}

interface Fold {
  axis: "x" | "y";
  value: number;
}

async function main() {
  const fileStream = createReadStream("day13/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const dots = [] as Dot[];
  let foldInstructions = false;
  const folds = [] as Fold[];

  for await (const line of rl) {
    if (line === "") {
      foldInstructions = true;
      continue;
    }
    if (!foldInstructions) {
      const coords = line.split(",");
      dots.push({
        x: parseInt(coords[0]),
        y: parseInt(coords[1]),
      });
    } else {
      const [coord, val] = line.replace("fold along ", "").split("=");
      folds.push({ axis: coord as "x" | "y", value: parseInt(val) });
    }
  }

  const firstFold = folds[0];

  const dotsStrings = dots
    .map((d) =>
      d[firstFold.axis] > firstFold.value
        ? {
            ...d,
            [firstFold.axis]: Math.abs(d[firstFold.axis] - 2 * firstFold.value),
          }
        : d
    )
    .map((d) => `${d.x}-${d.y}`)
    .filter((v, i, s) => s.indexOf(v) === i);

  console.log(dotsStrings.length);
}

main();
