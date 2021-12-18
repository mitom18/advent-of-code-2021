import { createReadStream } from "fs";
import { createInterface } from "readline";

const addSnailNumbers = (a: string[], b: string[]) => {
  return ["[", ...a, ...b, "]"];
};

const explode = (snailNumber: string[]) => {
  let opened = 0;

  for (let i = 0; i < snailNumber.length; i++) {
    const currentChar = snailNumber[i];

    if (currentChar === "[") {
      opened++;
    }

    if (currentChar === "]") {
      opened--;
    }

    if (opened === 5) {
      let buf = snailNumber.splice(i, 4);
      let up = i - 1;
      let down = i;

      while (down--) {
        const parsedNumber = parseInt(snailNumber[down]);

        if (!isNaN(parsedNumber)) {
          snailNumber[down] = (parsedNumber + parseInt(buf[1])).toString();
          break;
        }
      }

      while (up++ < snailNumber.length) {
        const parsedNumber = parseInt(snailNumber[up]);

        if (!isNaN(parsedNumber)) {
          snailNumber[up] = (parsedNumber + parseInt(buf[2])).toString();
          break;
        }
      }

      snailNumber.splice(i, 0, "0");
      explode(snailNumber);
      return true;
    }
  }
  return false;
};

const split = (snailNumber: string[]) => {
  for (let i = 0; i < snailNumber.length; i++) {
    const currentChar = snailNumber[i];
    const parsedNumber = parseInt(currentChar);
    if (!isNaN(parsedNumber) && parsedNumber > 9) {
      let left = Math.floor(parsedNumber / 2).toString();
      let right = Math.ceil(parsedNumber / 2).toString();
      let newNumber = ["[", left, right, "]"];
      snailNumber.splice(i, 1, ...newNumber);
      return true;
    }
  }
  return false;
};

const magnitude = (snailNumber: string[]) => {
  for (let i = 0; i < snailNumber.length; i++) {
    const currentChar = snailNumber[i];
    if (currentChar == "]") {
      let buf = snailNumber.splice(i - 3, 4).map((c) => parseInt(c));
      let sum = buf[1] * 3 + buf[2] * 2;
      snailNumber.splice(i - 3, 0, sum.toString());
      i -= 3;
    }
  }
  return snailNumber;
};

async function main() {
  const fileStream = createReadStream("day18/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const numbers = [] as string[][];

  for await (const line of rl) {
    numbers.push(line.split(",").flatMap((c) => c.split("")));
  }

  let maxMagnitude = 0;

  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        const snailSum = addSnailNumbers(numbers[i], numbers[j]);
        while (explode(snailSum) || split(snailSum));
        maxMagnitude = Math.max(maxMagnitude, parseInt(magnitude(snailSum)[0]));
      }
    }
  }

  console.log(maxMagnitude);
}

main();
