import { createReadStream } from "fs";
import { createInterface } from "readline";

type Rotation = (arg: number[]) => number[];

interface Transformations {
  [scannerId: number]: ScannerTransformation[];
}

interface ScannerTransformation {
  rotation: Rotation;
  distanceVector: number[];
}

interface BeaconDistances {
  [distance: string]: number;
}

const rotations = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-y, -x, -z],
] as Rotation[];

const transformScanner = (
  scanner: number[][],
  rotation: Rotation,
  dist: number[]
) => {
  return scanner.map((beacon) => {
    return rotation(beacon).map((coord, i) => {
      return coord + dist[i];
    });
  });
};

async function main() {
  const fileStream = createReadStream("day19/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const scanners = [] as number[][][];
  let newScanner = true;
  let scanner = [] as number[][];

  for await (const line of rl) {
    if (newScanner) {
      scanner = [];
      newScanner = false;
      continue;
    }
    if (line === "") {
      newScanner = true;
      scanners.push([...scanner]);
      continue;
    }
    const beacon = line.split(",").map((c) => parseInt(c));
    scanner.push(beacon);
  }
  scanners.push([...scanner]);

  const transformations = scanners.map(() => ({})) as Transformations[];
  transformations[0] = {
    0: [
      {
        rotation: rotations[0],
        distanceVector: [0, 0, 0],
      },
    ],
  };

  for (let i = 1; i < scanners.length; i++) {
    const scanner1 = scanners[i];

    scanner2Loop: for (let j = 0; j < scanners.length; j++) {
      if (i === j) {
        continue;
      }

      const scanner2 = scanners[j];

      for (const rotation of rotations) {
        const beaconDistances = {} as BeaconDistances;

        for (const beacon1 of scanner1) {
          const [x1, y1, z1] = rotation(beacon1);

          for (const beacon2 of scanner2) {
            const [x2, y2, z2] = beacon2;
            const distance = [x2 - x1, y2 - y1, z2 - z1].join(",");

            beaconDistances[distance] = (beaconDistances[distance] ?? 0) + 1;

            if (beaconDistances[distance] === 12) {
              transformations[i][j] = [
                {
                  rotation,
                  distanceVector: distance.split(",").map((c) => parseInt(c)),
                },
              ];
              continue scanner2Loop;
            }
          }
        }
      }
    }
  }

  while (transformations.some((t) => !t[0])) {
    for (let i = 1; i < transformations.length; i++) {
      if (transformations[i][0]) {
        continue;
      }

      for (const j in transformations[i]) {
        if (Object.prototype.hasOwnProperty.call(transformations[i], j)) {
          if (!transformations[j][0]) {
            continue;
          }

          transformations[i][0] = transformations[i][j].concat(
            transformations[j][0]
          );
          break;
        }
      }
    }
  }

  const uniqueBeacons = new Set(scanners[0].map((b) => b.join(",")));
  for (let i = 1; i < scanners.length; i++) {
    let scanner = scanners[i];
    for (const { rotation, distanceVector } of transformations[i][0]) {
      scanner = transformScanner(scanner, rotation, distanceVector);
    }
    for (const beacon of scanner) {
      uniqueBeacons.add(beacon.join());
    }
  }
  console.log(uniqueBeacons.size);
}

main();
