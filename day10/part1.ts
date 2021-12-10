import { createReadStream } from "fs";
import { createInterface } from "readline";

type OpeningCharacter = "(" | "[" | "{" | "<";
type ClosingCharacter = ")" | "]" | "}" | ">";

type CharacterPairs = {
  [key in OpeningCharacter]: ClosingCharacter;
};

type ClosingCharacterPoints = {
  [key in ClosingCharacter]: number;
};

const openingCharacters = ["(", "[", "{", "<"];
const closingCharacters = [")", "]", "}", ">"];
const characterPairs: CharacterPairs = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
const closingCharacterPoints: ClosingCharacterPoints = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

async function main() {
  const fileStream = createReadStream("day10/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const charStack = [] as OpeningCharacter[];
  const illegalCharacters = [] as ClosingCharacter[];

  for await (const line of rl) {
    for (const c of line) {
      if (openingCharacters.includes(c)) {
        charStack.push(c as OpeningCharacter);
        continue;
      }
      if (closingCharacters.includes(c)) {
        const lastOpeningCharacter = charStack.pop() as OpeningCharacter;
        if (characterPairs[lastOpeningCharacter] !== c) {
          illegalCharacters.push(c as ClosingCharacter);
          break;
        }
      }
    }
  }

  console.log(
    illegalCharacters
      .map((c) => closingCharacterPoints[c])
      .reduce((a, b) => a + b, 0)
  );
}

main();
