import { createReadStream } from "fs";
import { createInterface } from "readline";

enum Command {
  Forward = "forward",
  Up = "up",
  Down = "down",
}

async function countPosition() {
  const fileStream = createReadStream("day02/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let aim = 0;
  let depth = 0;
  let horizontalPosition = 0;

  for await (const line of rl) {
    const [command, strUnits] = line.split(" ");
    const units = parseInt(strUnits);
    if (command === Command.Forward) {
      horizontalPosition += units;
      depth += aim * units;
    } else if (command === Command.Down) {
      aim += units;
    } else if (command === Command.Up) {
      aim -= units;
    }
  }

  console.log(depth * horizontalPosition);
}

countPosition();
