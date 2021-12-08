import { createReadStream } from "fs";
import { createInterface } from "readline";

function sortString(input: string) {
  return input.split("").sort().join("");
}

function stringDifference(a: string, b: string) {
  const largerString = a.length > b.length ? a : b;
  const shorterString = a.length <= b.length ? a : b;
  return largerString
    .split("")
    .map((c) => shorterString.includes(c))
    .reduce((a, b) => a + (b ? 1 : 0), 0);
}

async function main() {
  const fileStream = createReadStream("day08/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const decodedOutputValues = [] as string[];

  for await (const line of rl) {
    const input = line.split(" | ");
    const inputValues = input[0].split(" ");
    const outputValues = input[1].split(" ");

    let codes = ["", "", "", "", "", "", "", "", "", ""];

    // find codes for unique numbers
    inputValues.forEach((i) => {
      if (i.length === 2) {
        codes[1] = sortString(i);
        return;
      }

      if (i.length === 4) {
        codes[4] = sortString(i);
        return;
      }

      if (i.length === 3) {
        codes[7] = sortString(i);
        return;
      }

      if (i.length === 7) {
        codes[8] = sortString(i);
        return;
      }
    });

    // find codes for numbers with 5 chars in their codes
    inputValues
      .filter((i) => i.length === 5)
      .forEach((i) => {
        const iSorted = sortString(i);

        // find code for 3 => has length of 5 and contains code of 1
        if (codes[1].split("").every((c) => iSorted.includes(c))) {
          codes[3] = iSorted;
          return;
        }

        const diff = stringDifference(iSorted, codes[4]);
        // find code for 5 => has 3 common segments with 4
        if (diff === 3) {
          codes[5] = iSorted;
          return;
        }

        // find code for 2 => has 2 common segments with 4
        if (diff === 2) {
          codes[2] = iSorted;
          return;
        }
      });

    // find code for 0 => has length of 6 and does not contain code of 5
    inputValues
      .filter((i) => i.length === 6)
      .forEach((i) => {
        const iSorted = sortString(i);
        if (!codes[5].split("").every((c) => iSorted.includes(c))) {
          codes[0] = iSorted;
        }
      });

    // find codes for 6 and 9 => have length of 6 and are not 0
    inputValues
      .filter((i) => i.length === 6 && sortString(i) !== codes[0])
      .forEach((i) => {
        const iSorted = sortString(i);

        // find code for 9 => contains codes for 4 and 5
        if (
          codes[4].split("").every((c) => iSorted.includes(c)) &&
          codes[5].split("").every((c) => iSorted.includes(c))
        ) {
          codes[9] = iSorted;
        } else {
          codes[6] = iSorted;
        }
      });

    let decodedValue = "";

    outputValues.forEach((o) => {
      decodedValue += codes.indexOf(o.split("").sort().join("")).toString();
    });

    decodedOutputValues.push(decodedValue);
  }

  console.log(decodedOutputValues.reduce((a, b) => a + parseInt(b), 0));
}

main();
