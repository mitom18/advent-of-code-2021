import { createReadStream } from "fs";
import { createInterface } from "readline";

class DeterministicDie {
  number = 0;
  rolled = 0;

  roll() {
    this.rolled++;
    this.number++;
    return this.number > 100 ? (this.number = 1) : this.number;
  }
}

async function main() {
  const fileStream = createReadStream("day21/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const players = [] as number[];
  const playerScores = [] as number[];
  const die = new DeterministicDie();

  for await (const line of rl) {
    players.push(
      parseInt(
        line
          .replace("Player 1 starting position: ", "")
          .replace("Player 2 starting position: ", "")
      )
    );
    playerScores.push(0);
  }

  gameLoop: while (true) {
    for (let i = 0; i < players.length; i++) {
      let rolledSum = 0;
      for (let j = 0; j < 3; j++) {
        rolledSum += die.roll();
      }
      players[i] += rolledSum;
      players[i] %= 10;
      if (players[i] === 0) {
        players[i] = 10;
      }
      playerScores[i] += players[i];
      if (playerScores[i] >= 1000) {
        break gameLoop;
      }
    }
  }

  console.log(Math.min(...playerScores) * die.rolled);
}

main();
