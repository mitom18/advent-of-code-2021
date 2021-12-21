import { createReadStream } from "fs";
import { createInterface } from "readline";

const wins = [0, 0];

const movePlayer = (from: number, distance: number) => {
  from += distance;
  from %= 10;
  if (from === 0) {
    from = 10;
  }
  return from;
};

const getQuantumDieOutcomes = () => {
  const possibleRollSums: Map<number, number> = new Map();

  for (let r1 = 1; r1 <= 3; r1++) {
    for (let r2 = 1; r2 <= 3; r2++) {
      for (let r3 = 1; r3 <= 3; r3++) {
        const sum = r1 + r2 + r3;
        possibleRollSums.set(sum, (possibleRollSums.get(sum) || 0) + 1);
      }
    }
  }

  return possibleRollSums;
};

const quantumTurn = (
  player: 0 | 1,
  rollSum: number,
  state: [number, number, number, number],
  count: number,
  quantumDieOutcomes: Map<number, number>
) => {
  const space = (state[player] = movePlayer(state[player], rollSum));
  const score = (state[2 + player] += space);
  if (score >= 21) {
    wins[player] += count;
    return;
  }
  for (const [sum, nextCount] of quantumDieOutcomes) {
    quantumTurn(
      player === 1 ? 0 : 1,
      sum,
      [state[0], state[1], state[2], state[3]],
      count * nextCount,
      quantumDieOutcomes
    );
  }
};

async function main() {
  const fileStream = createReadStream("day21/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const players = [] as number[];

  for await (const line of rl) {
    players.push(
      parseInt(
        line
          .replace("Player 1 starting position: ", "")
          .replace("Player 2 starting position: ", "")
      )
    );
  }

  const quantumDieOutcomes = getQuantumDieOutcomes();

  for (const [sum, count] of quantumDieOutcomes) {
    quantumTurn(
      0,
      sum,
      [players[0], players[1], 0, 0],
      count,
      quantumDieOutcomes
    );
  }

  console.log(Math.max(...wins));
}

main();
