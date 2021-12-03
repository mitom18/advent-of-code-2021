import { createReadStream } from "fs";
import { createInterface } from "readline";

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

  let gammaRate = "";
  let epsilonRate = "";

  for (const position of bits) {
    const bitCounts = [0, 0];

    for (const bit of position) {
      bitCounts[bit]++;
    }

    if (bitCounts[1] > bitCounts[0]) {
      gammaRate += "1";
      epsilonRate += "0";
    } else {
      gammaRate += "0";
      epsilonRate += "1";
    }
  }

  console.log(parseInt(gammaRate, 2) * parseInt(epsilonRate, 2));
}

countRates();
