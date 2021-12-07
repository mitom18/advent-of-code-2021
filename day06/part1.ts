import { createReadStream } from "fs";
import { createInterface } from "readline";

const SIMULATION_DAYS = 80;

async function main() {
  const fileStream = createReadStream("day06/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const fish = [] as number[];

  for await (const line of rl) {
    const fishAges = line.split(",");
    for (const age of fishAges) {
      fish.push(parseInt(age));
    }
  }

  for (let i = 0; i < SIMULATION_DAYS; i++) {
    let fishCountToAdd = 0;
    for (let j = 0; j < fish.length; j++) {
      fish[j]--;
      if (fish[j] < 0) {
        fish[j] = 6;
        fishCountToAdd++;
      }
    }
    for (let j = 0; j < fishCountToAdd; j++) {
      fish.push(8);
    }
  }

  console.log(fish.length);
}

main();
