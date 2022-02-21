const dictionary = require("./dictionary");
export enum LetterStatus {
  NotSet = "NotSet",
  ValidOutOfPosition = "ValidOutOfPosition",
  Correct = "Correct",
  Incorrect = "Incorrect",
}

export type CellData = {
  rowId: number;
  cellId: number;
  letter?: string;
  status: LetterStatus;
};

const lookup = new Set(dictionary);

export const isValidWord = (word: string): boolean => {
  const isValid = lookup.has(word.toLocaleLowerCase());
  console.log("isvalid", word, isValid);
  return isValid;
};

const getNextCell = ({ focussed, cells }: GameData): CellData => {
  const { rowId, cellId } = focussed;
  // console.log('getNextCell', cellId, rowId);
  if (cellId < cells[rowId].length - 1) {
    return {
      rowId,
      cellId: cellId + 1,
      status: LetterStatus.NotSet,
    };
  }

  return focussed;
};

const getPrevCell = ({ focussed, cells }: GameData): CellData => {
  const { rowId, cellId } = focussed;
  // console.log('getPrevCell', cellId, rowId);
  if (cellId > 0) {
    return {
      rowId,
      cellId: cellId - 1,
      status: LetterStatus.NotSet,
    };
  }
  return focussed;
};

export const validateRow = (
  gameData: GameData,
  gameWord: string,
  isValidWord?: boolean
): GameData => {
  const { focussed, cells } = gameData;
  const { rowId } = focussed;
  // const toTest = gameWord.split('');
  const upperWord = gameWord.toLocaleUpperCase();
  const wordSet = new Set(upperWord.split(""));

  const isCorrectCell = (cell: CellData) => {
    const isCorrectLetter = cell.letter === upperWord[cell.cellId];
    if (isCorrectLetter && cell.letter) {
      wordSet.delete(cell.letter);
    }
    return {
      ...cell,
      status: isCorrectLetter ? LetterStatus.Correct : LetterStatus.Incorrect,
    };
  };
  let updatedRow = cells[rowId].map(isCorrectCell);

  updatedRow = updatedRow.map((cell) => {

    if (cell.status === LetterStatus.Correct) {
      return cell;
    }
    if (cell.letter && wordSet.has(cell.letter)) {
      return {
        ...cell,
        status: LetterStatus.ValidOutOfPosition,
      };
    } else if (cell.letter && !wordSet.has(cell.letter)) {
      return {
        ...cell,
        status: LetterStatus.Incorrect,
      };
    }
    if (cell.letter) {
      wordSet.delete(cell.letter);
    }

    return cell;
  });

  const success = updatedRow.every((cell, cellIdx) => cell.letter === upperWord[cellIdx]);
  const isLastRow = (isValidWord && rowId === cells.length - 1);
  const gameComplete = success || isLastRow;
 
  const ret = {
    ...gameData,
    cells: cells.map((row, rowIdx) => {
      if (rowIdx === rowId) {
        return updatedRow;
      }
      return row;
    }),
    gameComplete,
   // rowError: success ? undefined : `Hard luck, word was: ${gameWord}`,
    success
  };
  console.log("validated", ret);
  return ret;
};
export const getNextRow = (gameData: GameData): GameData => {
  const { focussed, cells } = gameData;
  const { rowId } = focussed;
  // if cellid is end of row and there are more rows available
  if (rowId < cells.length - 1) {
    return {
      ...gameData,
      focussed: {
        rowId: rowId + 1,
        cellId: 0,
        status: LetterStatus.NotSet,
      },
    };
  }
  return gameData;
};
export const updateCell = (gameData: GameData, value?: string): GameData => {
  if (gameData.gameComplete) {
    return {
      ...gameData,
      focussed: {
        cellId: -1,
        rowId: -1,
        status: LetterStatus.NotSet,
      },
      rowError: undefined,
    };
  }

  const { focussed, cells } = gameData;
  let updatedFocussed = value ? getNextCell(gameData) : getPrevCell(gameData);
  // console.log('foc', updatedFocussed.cellId, updatedFocussed.rowId);
  const updatedCells = cells.map((row, rowIdx) => {
    if (rowIdx === focussed.rowId) {
      return row.map((cell, cellIdx) => {
        if (cellIdx === focussed.cellId) {
          return {
            ...cell,
            letter: value,
          };
        }
        return cell;
      });
    }
    return row;
  });
  return {
    cells: updatedCells,
    focussed: updatedFocussed,
    rowError: undefined,
  };
};

export const updateGame = (
  gameData: GameData,
  code: number,
  gameWord: string,
  value?: string
): GameData => {
  // console.log(
  //   ">>",
  //   gameData.focussed.cellId === gameData.cells[0].length - 1,
  //   gameData.focussed.cellId,
  //   gameData.cells[0].length - 1,
  //   gameData.cells[gameData.focussed.rowId][gameData.focussed.cellId].letter
  // );
  if (code > 64 && code < 91) {
    return updateCell(gameData, value?.toLocaleUpperCase());
  } else if (value === "Backspace" || value === "{bksp}") {
    return updateCell(gameData, undefined);
  } else if (value === "Enter" || value === "{enter}") {
    if (
      gameData.focussed.cellId === gameData.cells[0].length - 1 &&
      gameData.cells[gameData.focussed.rowId][gameData.focussed.cellId].letter
    ) {
      if (
        isValidWord(
          gameData.cells[gameData.focussed.rowId].map((x) => x.letter).join("")
        )
      ) {
        const upd = validateRow(gameData, gameWord, true);
        if (upd.gameComplete) {
          return updateCell(upd);
        }
        return getNextRow(upd);
      } else {
        return {
          ...gameData,
          rowError: "Invalid word.",
        };
      }
    }
  }

  return gameData;
};
export type GameData = {
  focussed: CellData;
  cells: CellData[][];
  gameComplete?: boolean;
  rowError?: string;
  success?: boolean;
};

export const createGame = (wordLength: number): GameData => {
  console.log("creating game", wordLength);
  const cells = createCells(wordLength);
  return {
    focussed: cells[0][0],
    cells,
  };
};
const createCells = (wordLength: number): CellData[][] => {
  const res = [];

  for (let rowId = 0; rowId < wordLength + 1; rowId++) {
    res.push(
      Array(wordLength)
        .fill(undefined)
        .map((cl, cellId) => ({ status: LetterStatus.NotSet, cellId, rowId }))
    );
  }
  return res;
};
