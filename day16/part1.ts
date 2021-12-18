import { createReadStream } from "fs";
import { createInterface } from "readline";

class Parser {
  versionSum = 0;

  parse(input: string, start: number): number {
    const version = input.slice(start, start + 3);
    this.versionSum += parseInt(version, 2);

    const typeId = parseInt(input.slice(start + 3, start + 6), 2);

    if (typeId === 4) {
      // skip literal value
      start += 6;
      while (true) {
        start += 5;
        if (input[start - 5] === "0") {
          return start;
        }
      }
    } else {
      const lengthTypeId = input[start + 6];

      if (lengthTypeId === "0") {
        const totalLength = parseInt(input.slice(start + 7, start + 7 + 15), 2);

        let startIndex = start + 7 + 15;
        start = startIndex;

        while (true) {
          let nextIndex = this.parse(input, start);
          start = nextIndex;
          if (nextIndex - startIndex === totalLength) {
            break;
          }
        }
      } else {
        const numberOfPackets = parseInt(
          input.slice(start + 7, start + 7 + 11),
          2
        );

        start += 7 + 11;

        for (let i = 0; i < numberOfPackets; i++) {
          let nextIndex = this.parse(input, start);
          start = nextIndex;
        }
      }
    }

    return start;
  }
}

const hexToBinary = (hex: string) => {
  let result = "";
  for (const char of hex) {
    result += parseInt(char, 16).toString(2).padStart(4, "0");
  }
  return result;
};

async function main() {
  const fileStream = createReadStream("day16/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let input = "";

  for await (const line of rl) {
    input = line;
  }

  const parser = new Parser();

  parser.parse(hexToBinary(input), 0);

  console.log(parser.versionSum);
}

main();
