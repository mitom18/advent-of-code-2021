import { createReadStream } from "fs";
import { createInterface } from "readline";

interface Template {
  [key: string]: string;
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

  let polymer = "";
  let templatesInstructions = false;
  const templates = {} as Template;

  for await (const line of rl) {
    if (line === "") {
      templatesInstructions = true;
      continue;
    }
    if (!templatesInstructions) {
      polymer = line;
    } else {
      const [pair, replace] = line.split(" -> ");
      templates[pair] = replace;
    }
  }

  for (let i = 0; i < 10; i++) {
    const inserts = [] as string[][];
    for (let j = 0; j < polymer.length - 1; j++) {
      inserts.push([]);
    }

    for (let j = 0; j < polymer.length - 1; j++) {
      const first = polymer[j];
      const second = polymer[j + 1];
      Object.keys(templates).forEach((key) => {
        if (key === first + second) {
          inserts[j].push(templates[key]);
        }
      });
    }

    let newPolymer = "";

    for (let j = 0; j < polymer.length; j++) {
      newPolymer += polymer[j];
      if (inserts[j]) {
        inserts[j].forEach((c) => {
          newPolymer += c;
        });
      }
    }

    polymer = newPolymer;
  }

  const charCounts = {} as CharCounts;

  for (const c of polymer) {
    charCounts[c] = charCounts[c] + 1 || 1;
  }

  const counts = Object.values(charCounts).sort((a, b) => a - b);

  console.log(counts[counts.length - 1] - counts[0]);
}

main();
