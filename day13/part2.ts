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

  let dots = [] as Dot[];
  let foldInstructions = false;
  const folds = [] as Fold[];

  for await (const line of rl) {
    if (line === "") {
      foldInstructions = true;
      continue;
    }
    if (!foldInstructions) {
      const coords = line.split(",");
      const x = parseInt(coords[0]);
      const y = parseInt(coords[1]);
      dots.push({
        x: x,
        y: y,
      });
    } else {
      const [coord, val] = line.replace("fold along ", "").split("=");
      folds.push({ axis: coord as "x" | "y", value: parseInt(val) });
    }
  }

  folds.forEach((f) => {
    dots = dots.map((d) =>
      d[f.axis] > f.value
        ? {
            ...d,
            [f.axis]: Math.abs(d[f.axis] - 2 * f.value),
          }
        : d
    );
  });

  let xMax = 0;
  let yMax = 0;

  dots = dots
    .map((d) => `${d.x}-${d.y}`)
    .filter((v, i, s) => s.indexOf(v) === i)
    .map((s) => {
      const coords = s.split("-");
      return { x: parseInt(coords[0]), y: parseInt(coords[1]) } as Dot;
    });

  dots.forEach((d) => {
    if (d.x > xMax) {
      xMax = d.x;
    }
    if (d.y > yMax) {
      yMax = d.y;
    }
  });

  for (let y = 0; y <= yMax; y++) {
    let row = "";
    for (let x = 0; x <= xMax; x++) {
      if (dots.some((d) => d.x === x && d.y === y)) {
        row += "█";
      } else {
        row += " ";
      }
    }
    console.log(row);
  }
}

main();
