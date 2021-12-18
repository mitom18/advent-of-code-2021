import { createReadStream } from "fs";
import { createInterface } from "readline";

class QElement<T> {
  element: T;
  priority: number;

  constructor(element: T, priority: number) {
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue<T> {
  items: QElement<T>[];

  constructor() {
    this.items = [];
  }

  enqueue(element: T, priority: number) {
    var qElement = new QElement(element, priority);
    var contain = false;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.items.push(qElement);
    }
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length == 0;
  }
}

const getNeighbors = (x: number, y: number) => {
  return [
    [x - 1, y],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
  ];
};

async function main() {
  const fileStream = createReadStream("day15/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const map = [] as number[][];
  const visited = [] as boolean[][];
  let riskLevel = 0;

  let mapTmp = [] as number[][];
  const visitedTmp = [] as boolean[][];

  for await (const line of rl) {
    let rowMap = [] as number[];
    let rowVisited = [] as boolean[];
    for (let i = 0; i < 5; i++) {
      if (i === 0) {
        rowMap = rowMap.concat(line.split("").map((c) => parseInt(c)));
      } else {
        const mapped = rowMap
          .slice(line.length * (i - 1))
          .map((c) => (c + 1 <= 9 ? c + 1 : 1));
        rowMap = rowMap.concat(mapped);
      }

      rowVisited = rowVisited.concat(line.split("").map((_) => false));
    }
    mapTmp.push(rowMap);
    visitedTmp.push(rowVisited);
  }

  for (let i = 0; i < 5; i++) {
    for (const row of mapTmp) {
      map.push([...row]);
      visited.push(row.map((_) => false));
    }
    mapTmp = mapTmp.map((a) => a.map((c) => (c + 1 <= 9 ? c + 1 : 1)));
  }

  const queue = new PriorityQueue<number[]>();
  queue.enqueue([0, 0], 0);

  while (!queue.isEmpty()) {
    const top = queue.dequeue() as QElement<number[]>;

    const x = top.element[0];
    const y = top.element[1];

    if (visited[y][x]) {
      continue;
    }

    if (x === map[0].length - 1 && y === map.length - 1) {
      riskLevel = top.priority;
      break;
    }

    for (const neighbor of getNeighbors(x, y)) {
      const nX = neighbor[0];
      const nY = neighbor[1];
      if (nY < 0 || nY >= map.length || nX < 0 || nX >= map[nY].length) {
        continue;
      }
      if (visited[nY][nX]) {
        continue;
      }
      queue.enqueue([nX, nY], top.priority + map[nY][nX]);
    }

    visited[y][x] = true;
  }

  console.log(riskLevel);
}

main();
