import { createReadStream } from "fs";
import { createInterface } from "readline";

function getChosenBoard(boards: number[][][], numbers: number[]) {
  const boardsMarkers = [] as boolean[][][];

  for (let i = 0; i < boards.length; i++) {
    const board = [] as boolean[][];
    for (let j = 0; j < 5; j++) {
      const row = [] as boolean[];
      for (let k = 0; k < 5; k++) {
        row.push(false);
      }
      board.push(row);
    }
    boardsMarkers.push(board);
  }

  const chosenBoard = [] as boolean[];
  for (let i = 0; i < boards.length; i++) {
    chosenBoard.push(false);
  }

  for (const number of numbers) {
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];

      for (let j = 0; j < board.length; j++) {
        const row = board[j];

        for (let k = 0; k < row.length; k++) {
          const item = row[k];

          if (item === number) {
            boardsMarkers[i][j][k] = true;

            // check row
            if (boardsMarkers[i][j].every((i) => i)) {
              chosenBoard[i] = true;
            }

            // check column
            if (boardsMarkers[i].every((i) => i[k])) {
              chosenBoard[i] = true;
            }

            // check if the board is last
            if (
              chosenBoard.reduce((a, b) => a + (b ? 1 : 0), 0) ===
              chosenBoard.length
            ) {
              return { index: i, markers: boardsMarkers[i], lastDrawn: number };
            }
          }
        }
      }
    }
  }

  throw new Error("No good board found.");
}

async function main() {
  const fileStream = createReadStream("day04/data.in");

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const numbers = [] as number[];
  let firstRow = true;
  const boards = [] as number[][][];
  let board = [] as number[][];

  for await (const line of rl) {
    if (line.length === 0) {
      continue;
    }

    if (firstRow) {
      for (const number of line.split(",")) {
        numbers.push(parseInt(number));
      }
      firstRow = false;
      continue;
    }

    const boardRow = [] as number[];
    for (const number of line.split(/\s+/)) {
      if (isNaN(parseInt(number))) continue;
      boardRow.push(parseInt(number));
    }
    board.push(boardRow);

    if (board.length === 5) {
      boards.push(board);
      board = [];
    }
  }

  const { index, markers, lastDrawn } = getChosenBoard(boards, numbers);
  let score = 0;

  for (let i = 0; i < markers.length; i++) {
    const row = markers[i];
    for (let j = 0; j < row.length; j++) {
      const item = row[j];
      if (!item) {
        score += boards[index][i][j];
      }
    }
  }

  console.log(score * lastDrawn);
}

main();
