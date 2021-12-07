import { createReadStream } from "fs";
import { createInterface } from "readline";

const SIMULATION_DAYS = 256;

async function main() {
  const fileStream = createReadStream("day06/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let fishAgesCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for await (const line of rl) {
    const fishAges = line.split(",");
    for (const age of fishAges) {
      fishAgesCounts[parseInt(age)]++;
    }
  }

  for (let i = 0; i < SIMULATION_DAYS; i++) {
    let fishCountToAdd = fishAgesCounts[0];
    fishAgesCounts = [
      fishAgesCounts[1],
      fishAgesCounts[2],
      fishAgesCounts[3],
      fishAgesCounts[4],
      fishAgesCounts[5],
      fishAgesCounts[6],
      fishAgesCounts[7] + fishCountToAdd,
      fishAgesCounts[8],
      fishCountToAdd,
    ];
  }

  console.log(fishAgesCounts.reduce((a, b) => a + b, 0));
}

main();
