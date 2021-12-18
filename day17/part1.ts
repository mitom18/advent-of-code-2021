import { createReadStream } from "fs";
import { createInterface } from "readline";

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

  let yVelocity = -yMin - 1;

  let y = 0;
  while (yVelocity !== 0) {
    y += yVelocity;
    yVelocity--;
  }

  console.log(y);
}

main();
