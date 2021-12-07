import { createReadStream } from "fs";
import { createInterface } from "readline";

async function main() {
  const fileStream = createReadStream("day07/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const positions = [] as number[];

  for await (const line of rl) {
    const tmpPositions = line.split(",");
    for (const position of tmpPositions) {
      positions.push(parseInt(position));
    }
  }

  const costs = {} as { [position: string]: number };

  for (let i = Math.min(...positions); i <= Math.max(...positions); i++) {
    let costSum = 0;
    for (const position of positions) {
      costSum += Math.abs(i - position);
    }
    costs[i.toString()] = costSum;
  }

  console.log(Math.min(...Object.values(costs)));
}

main();
