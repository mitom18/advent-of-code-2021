import { createReadStream } from "fs";
import { createInterface } from "readline";

interface Instruction {
  isOn: boolean;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

async function main() {
  const fileStream = createReadStream("day22/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const instructions = [] as Instruction[];
  const map = [] as Instruction[];

  for await (const line of rl) {
    const isOn = line.split(" ")[0] === "on";
    const instructionCoords = [] as number[][];
    line
      .split(" ")[1]
      .split(",")
      .forEach((c) =>
        instructionCoords.push(
          c
            .split("=")[1]
            .split("..")
            .map((i) => parseInt(i))
        )
      );
    instructions.push({
      isOn,
      xMin: instructionCoords[0][0],
      xMax: instructionCoords[0][1],
      yMin: instructionCoords[1][0],
      yMax: instructionCoords[1][1],
      zMin: instructionCoords[2][0],
      zMax: instructionCoords[2][1],
    });
  }

  const newMap = [] as Instruction[];

  instructions.forEach((i) => {
    map.forEach((f) => {
      const xMin = Math.max(i.xMin, f.xMin);
      const xMax = Math.min(i.xMax, f.xMax);
      if (xMin > xMax) {
        return;
      }
      const yMin = Math.max(i.yMin, f.yMin);
      const yMax = Math.min(i.yMax, f.yMax);
      if (yMin > yMax) {
        return;
      }
      const zMin = Math.max(i.zMin, f.zMin);
      const zMax = Math.min(i.zMax, f.zMax);
      if (zMin > zMax) {
        return;
      }
      newMap.push({ isOn: !f.isOn, xMin, xMax, yMin, yMax, zMin, zMax });
    });
    map.push(...newMap);
    newMap.length = 0;
    if (i.isOn) {
      map.push({ ...i });
    }
  });

  const volume = map.reduce(
    (a, b) =>
      a +
      (b.xMax - b.xMin + 1) *
        (b.yMax - b.yMin + 1) *
        (b.zMax - b.zMin + 1) *
        (b.isOn ? 1 : -1),
    0
  );

  console.log(volume);
}

main();
