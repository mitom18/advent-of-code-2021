import { createReadStream } from "fs";
import { createInterface } from "readline";

interface ParseReturn {
  value: number;
  start: number;
}

class Parser {
  parse(input: string, start: number): ParseReturn {
    const typeId = parseInt(input.slice(start + 3, start + 6), 2);

    if (typeId === 4) {
      start += 6;
      let value = 0;
      while (true) {
        value = value * 16 + parseInt(input.slice(start + 1, start + 5), 2);
        start += 5;
        if (input[start - 5] === "0") {
          return { value, start };
        }
      }
    } else {
      const lengthTypeId = input[start + 6];
      const values = [] as number[];

      if (lengthTypeId === "0") {
        const totalLength = parseInt(input.slice(start + 7, start + 7 + 15), 2);

        let startIndex = start + 7 + 15;
        start = startIndex;

        while (true) {
          let { value, start: nextIndex } = this.parse(input, start);
          values.push(value);
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
          let { value, start: nextIndex } = this.parse(input, start);
          values.push(value);
          start = nextIndex;
        }
      }

      switch (typeId) {
        case 0:
          return { value: values.reduce((a, b) => a + b, 0), start };

        case 1:
          return { value: values.reduce((a, b) => a * b, 1), start };

        case 2:
          return { value: Math.min(...values), start };

        case 3:
          return { value: Math.max(...values), start };

        case 5:
          return { value: values[0] > values[1] ? 1 : 0, start };

        case 6:
          return { value: values[0] < values[1] ? 1 : 0, start };

        case 7:
          return { value: values[0] === values[1] ? 1 : 0, start };
      }
    }

    return { value: 0, start };
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

  let { value } = parser.parse(hexToBinary(input), 0);

  console.log(value);
}

main();
