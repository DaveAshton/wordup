import { CellData, GameData, LetterStatus } from "../model";

const dictionary = require("./dictionary");

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

const validateRow = (
  gameData: GameData,
  gameWord: string,
  isValidWord?: boolean
): GameData => {
  const { focussed, cells } = gameData;
  const { rowId } = focussed;
  const upperWord = gameWord.toLocaleUpperCase();

  const wordMap = upperWord.split("").reduce((map, letter) => {
    let count = map.get(letter);
    return map.set(letter, count ? count+1 : 1);
  }, new Map<string, number>());
  // console.log('word map', wordMap);

  const deleteLetter = (letter: string) => {
    let count = wordMap.get(letter);
    if (count) {
      wordMap.set(letter, count - 1);
    }
  };

  const isCorrectCell = (cell: CellData) => {
    const isCorrectLetter = cell.letter === upperWord[cell.cellId];
    if (isCorrectLetter && cell.letter) {
      deleteLetter(cell.letter);
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
    if (cell.letter && !!wordMap.get(cell.letter)) {
      deleteLetter(cell.letter);
      return {
        ...cell,
        status: LetterStatus.ValidOutOfPosition,
      };
    } else if (cell.letter && !wordMap.get(cell.letter)) {
      return {
        ...cell,
        status: LetterStatus.Incorrect,
      };
    }
    if (cell.letter) {
      deleteLetter(cell.letter);
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
    success
  };
  console.log("validated", ret.usedLetters, ret.focussed);
  return ret;
};
const getNextRow = (gameData: GameData): GameData => {
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
const updateCell = (gameData: GameData, value?: string): GameData => {
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
    ...gameData, // new
    cells: updatedCells,
    focussed: updatedFocussed,
    rowError: undefined,
  };
};

 const validateGame = (
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

export const updateGame = (
  gameData: GameData,
  code: number,
  gameWord: string,
  value?: string
): GameData => {
  const dt = validateGame(gameData, code, gameWord, value);
  const {cells, focussed, usedLetters} = dt;

  if (focussed.rowId > 0) {
    cells[focussed.rowId-1].forEach((cell, idx) => {
      if (cell.letter && cell.status === LetterStatus.Correct) {
        usedLetters[LetterStatus.Correct].add(cell.letter);
        if (usedLetters[LetterStatus.ValidOutOfPosition].has(cell.letter)) {
          usedLetters[LetterStatus.ValidOutOfPosition].delete(cell.letter);
        }
  
      } else if (cell.letter && cell.status === LetterStatus.ValidOutOfPosition) {
        if (!usedLetters[LetterStatus.Correct].has(cell.letter)) {
            usedLetters[LetterStatus.ValidOutOfPosition].add(cell.letter);
        }
        
      } else if (cell.letter && cell.status === LetterStatus.Incorrect) {
        if (!usedLetters[LetterStatus.Correct].has(cell.letter) && !usedLetters[LetterStatus.ValidOutOfPosition].has(cell.letter)) {
            usedLetters[LetterStatus.Incorrect].add(cell.letter);
        }
        
      }
    });
  }

  return {
    ...dt,
    usedLetters: {
      ...usedLetters
    }
  };

}


export const createGame = (wordLength: number): GameData => {
 // console.log("creating game", wordLength, lookup.size);
  const cells = createCells(wordLength);
  return {
    focussed: cells[0][0],
    cells,
    usedLetters: {
      [LetterStatus.Correct]: new Set<string>(),
      [LetterStatus.ValidOutOfPosition]: new Set<string>(),
      [LetterStatus.Incorrect]: new Set<string>()
    }
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
