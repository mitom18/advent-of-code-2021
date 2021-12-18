import { createReadStream } from "fs";
import { createInterface } from "readline";

class Probe {
  dx: number;
  dy: number;
  x = 0;
  y = 0;
  maxY = 0;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  step() {
    this.x += this.dx;
    this.y += this.dy--;
    if (this.dx > 0) {
      this.dx -= 1;
    } else {
      this.dx = 0;
    }
    this.maxY = Math.max(this.maxY, this.y);
  }
}

const simulate = (
  x: number,
  y: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): Probe | null => {
  const probe = new Probe(x, y);
  while (probe.y >= yMin && probe.x <= xMax) {
    probe.step();
    if (
      probe.x >= xMin &&
      probe.x <= xMax &&
      probe.y >= yMin &&
      probe.y <= yMax
    ) {
      return probe;
    }
  }
  return null;
};

async function main() {
  const fileStream = createReadStream("day17/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let xMin = 0;
  let xMax = 0;
  let yMin = 0;
  let yMax = 0;

  for await (const line of rl) {
    [xMin, xMax, yMin, yMax] = line
      .replace("target area: ", "")
      .split(", ")
      .flatMap((c) => {
        return c
          .split("=")[1]
          .split("..")
          .map((v) => parseInt(v));
      });
  }

  let count = 0;

  for (let x = 1; x <= xMax; x++) {
    for (let y = yMin; y < Math.abs(yMin); y++) {
      const result = simulate(x, y, xMin, xMax, yMin, yMax);
      if (result !== null) {
        count++;
      }
    }
  }

  console.log(count);
}

main();
