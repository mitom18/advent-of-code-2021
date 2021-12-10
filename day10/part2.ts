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
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

async function main() {
  const fileStream = createReadStream("day10/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const insertedCharacters = [] as ClosingCharacter[][];

  for await (const line of rl) {
    const charStack = [] as OpeningCharacter[];
    let lineCorrupted = false;

    for (const c of line) {
      if (openingCharacters.includes(c)) {
        charStack.push(c as OpeningCharacter);
        continue;
      }
      if (closingCharacters.includes(c)) {
        const lastOpeningCharacter = charStack.pop() as OpeningCharacter;
        if (characterPairs[lastOpeningCharacter] !== c) {
          lineCorrupted = true;
          break;
        }
      }
    }

    if (!lineCorrupted && charStack.length > 0) {
      const insertedCharactersForLine = [] as ClosingCharacter[];

      while (charStack.length > 0) {
        const openingCharacter = charStack.pop() as OpeningCharacter;
        insertedCharactersForLine.push(characterPairs[openingCharacter]);
      }

      insertedCharacters.push(insertedCharactersForLine);
    }
  }

  console.log(
    insertedCharacters
      .map((a) =>
        a.map((c) => closingCharacterPoints[c]).reduce((a, b) => a * 5 + b, 0)
      )
      .sort((a, b) => b - a)[Math.floor(insertedCharacters.length / 2)]
  );
}

main();
