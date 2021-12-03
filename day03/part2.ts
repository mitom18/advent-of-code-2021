import { createReadStream } from "fs";
import { createInterface } from "readline";

function getRating(bits: number[][], isMostCommon: boolean) {
  const keepNumber = [] as boolean[];

  for (let i = 0; i < bits[0].length; i++) {
    keepNumber.push(true);
  }

  for (const position of bits) {
    const bitCounts = [0, 0];

    for (let i = 0; i < position.length; i++) {
      if (!keepNumber[i]) {
        continue;
      }
      bitCounts[position[i]]++;
    }

    for (let i = 0; i < position.length; i++) {
      if (
        (isMostCommon && bitCounts[1] > bitCounts[0] && position[i] === 0) ||
        (isMostCommon && bitCounts[0] > bitCounts[1] && position[i] === 1) ||
        (isMostCommon && bitCounts[0] === bitCounts[1] && position[i] === 0) ||
        (!isMostCommon && bitCounts[0] === bitCounts[1] && position[i] === 1) ||
        (!isMostCommon && bitCounts[1] > bitCounts[0] && position[i] === 1) ||
        (!isMostCommon && bitCounts[0] > bitCounts[1] && position[i] === 0)
      ) {
        keepNumber[i] = false;
      }
    }

    const kept = [] as number[];

    for (let i = 0; i < keepNumber.length; i++) {
      if (keepNumber[i]) {
        kept.push(i);
      }
    }

    if (kept.length === 1) {
      return bits.reduce((a, b) => `${a}${b[kept[0]]}`, "");
    }
  }

  throw new Error("Rating not found.");
}

async function countRates() {
  const fileStream = createReadStream("day03/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const bits = [] as number[][];

  for await (const line of rl) {
    for (let i = 0; i < line.length; i++) {
      const bit = parseInt(line[i]);

      while (i > bits.length - 1) {
        bits.push([]);
      }

      bits[i].push(bit);
    }
  }

  const oxygenRating = getRating(bits, true);
  const co2Rating = getRating(bits, false);

  console.log(parseInt(oxygenRating, 2) * parseInt(co2Rating, 2));
}

countRates();
