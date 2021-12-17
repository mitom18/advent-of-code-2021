import { createReadStream } from "fs";
import { createInterface } from "readline";

interface Template {
  [key: string]: string;
}

interface Polymer {
  [key: string]: number;
}

interface CharCounts {
  [key: string]: number;
}

async function main() {
  const fileStream = createReadStream("day14/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let polymer = {} as Polymer;
  const charCounts = {} as CharCounts;
  const templates = {} as Template;
  let templatesInstructions = false;

  for await (const line of rl) {
    if (line === "") {
      templatesInstructions = true;
      continue;
    }
    if (!templatesInstructions) {
      for (let j = 0; j < line.length - 1; j++) {
        polymer[line[j] + line[j + 1]] = 1;
      }
      for (const c of line) {
        charCounts[c] = charCounts[c] + 1 || 1;
      }
    } else {
      const [pair, replace] = line.split(" -> ");
      templates[pair] = replace;
    }
  }

  for (let i = 0; i < 40; i++) {
    const newPolymer = {} as Polymer;
    for (const pair in polymer) {
      if (Object.prototype.hasOwnProperty.call(polymer, pair)) {
        const letter = templates[pair];
        charCounts[letter] =
          charCounts[letter] + polymer[pair] || polymer[pair];
        newPolymer[pair[0] + letter] =
          newPolymer[pair[0] + letter] + polymer[pair] || polymer[pair];
        newPolymer[letter + pair[1]] =
          newPolymer[letter + pair[1]] + polymer[pair] || polymer[pair];
      }
    }
    polymer = newPolymer;
  }

  const counts = Object.values(charCounts).sort((a, b) => a - b);

  console.log(counts[counts.length - 1] - counts[0]);
}

main();
