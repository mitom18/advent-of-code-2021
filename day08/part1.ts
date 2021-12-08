import { createReadStream } from "fs";
import { createInterface } from "readline";

async function main() {
  const fileStream = createReadStream("day08/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let result = 0;

  for await (const line of rl) {
    const outputValues = line.split(" | ")[1].split(" ");
    for (const value of outputValues) {
      if (
        value.length === 2 ||
        value.length === 4 ||
        value.length === 3 ||
        value.length === 7
      ) {
        result++;
      }
    }
  }

  console.log(result);
}

main();
