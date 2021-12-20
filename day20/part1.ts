import { createReadStream } from "fs";
import { createInterface } from "readline";

let { getOutOfBoundsPixel, flip } = (() => {
  let pixel = ".";
  return {
    getOutOfBoundsPixel: () => pixel,
    flip: () => (pixel = pixel === "." ? "#" : "."),
  };
})();

const pixels = {
  ".": 0,
  "#": 1,
} as { [key: string]: number };

const getPositionsForPixelEnhancement = (x: number, y: number) => {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];
};

const enhanceImage = (
  input: string[][],
  enhancementAlgorithm: string,
  outOfBoundsPixel: string
): string[][] => {
  const output = [] as string[][];

  for (let y = -1; y <= input.length; y++) {
    const outputRow = [] as string[];

    for (let x = -1; x <= input[0].length; x++) {
      let pixelsInBinary = "";

      for (const [xx, yy] of getPositionsForPixelEnhancement(x, y)) {
        pixelsInBinary +=
          xx < 0 || xx >= input[0].length || yy < 0 || yy >= input.length
            ? pixels[outOfBoundsPixel].toString()
            : pixels[input[yy][xx]].toString();
      }

      outputRow.push(enhancementAlgorithm[parseInt(pixelsInBinary, 2)]);
    }

    output.push([...outputRow]);
  }
  return output;
};

async function main() {
  const fileStream = createReadStream("day20/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let enhancementAlgorithm = "";
  let enhancement = true;
  let image = [] as string[][];

  for await (const line of rl) {
    if (enhancement) {
      enhancementAlgorithm = line;
      enhancement = false;
      continue;
    }
    if (line === "") {
      continue;
    }
    image.push(line.split(""));
  }

  for (let i = 0; i < 2; i++) {
    image = enhanceImage(image, enhancementAlgorithm, getOutOfBoundsPixel());
    if (enhancementAlgorithm[0] === "#" && getOutOfBoundsPixel() !== "#") {
      flip();
    } else if (
      enhancementAlgorithm[enhancementAlgorithm.length - 1] === "." &&
      getOutOfBoundsPixel() !== "."
    ) {
      flip();
    }
  }

  console.log(
    image.reduce((a, b) => a + b.reduce((c, d) => c + pixels[d], 0), 0)
  );
}

main();
