import { GameData } from "..";
import { updateGame, createGame, LetterStatus, CellData } from "../validate";

jest.mock("../dictionary", () => {
  return [
    "swine",
    "strip",
    "witch",
    "bears",
    "winter",
    "sausage",
    "beast",
    "there",
    "trees",
  ];
});

const update =
  (gameWord: string) => (data: GameData, letter: string, code?: number) => {
    const keyCode = code == undefined ? letter.charCodeAt(0) : code;
    // console.log('keycode', keyCode);
    return updateGame(data, keyCode, gameWord, letter);
  };

const updateMultiple = (
  keyedWord: string,
  gameWord: string,
  data: GameData
): GameData => {
  const func = update(gameWord);
  return keyedWord.split("").reduce((dt, letter) => func(dt, letter), data);
};

const expectCell = (
  data: GameData,
  rowIdx: number,
  cellIdx: number,
  letter: string,
  status: LetterStatus
) => {
  expect(data.cells[rowIdx][cellIdx]).toEqual({
    rowId: rowIdx,
    cellId: cellIdx,
    letter,
    status,
  });
};

type Status =
  | LetterStatus.Correct
  | LetterStatus.Incorrect
  | LetterStatus.ValidOutOfPosition;

const expectUsedLetters = (
  data: GameData,
  status: Status,
  expectation: string[]
) => {
  expect(Array.from(data.usedLetters[status].values())).toEqual(expectation);
};

describe("createGame tests", () => {
  let gameData: GameData;
  const wordLength = 5;
  beforeEach(() => {
    gameData = createGame(wordLength);
  });

  it("should generate cells of expected length", () => {
    // rows equals word length + 1
    expect(gameData.cells.length).toEqual(wordLength + 1);
    expect(gameData.cells[0].length).toEqual(wordLength);
  });

  it("should set focussed cell to 0,0", () => {
    expect(gameData.focussed.cellId).toEqual(0);
    expect(gameData.focussed.rowId).toEqual(0);
  });
});

describe("updateGame tests", () => {
  let gameData: GameData;
  const wordLength = 5;
  const gameWord = "bears";
  const upd = update(gameWord);

  beforeEach(() => {
    gameData = createGame(wordLength);
  });

  describe("given user adds invalid letter", () => {
    const keyedLetter = "T";
    beforeEach(() => {
      gameData = upd(gameData, keyedLetter);
    });

    it("should add letter to cells", () => {
      expect(gameData.cells[0][0]).toEqual({
        rowId: 0,
        cellId: 0,
        letter: "T",
        status: LetterStatus.NotSet,
      });
    });

    it("should move focussed cell to 0,1", () => {
      expect(gameData.focussed).toEqual({
        rowId: 0,
        cellId: 1,
        letter: undefined,
        status: LetterStatus.NotSet,
      });
    });
  });

  describe("given user adds valid word but not game word", () => {
    const keyedWord = "BEAST";
    beforeEach(() => {
      gameData = updateMultiple(keyedWord, gameWord, gameData);
    });

    it("should add letter to cells", () => {
      // console.log('gd', keyedLetter.charCodeAt(0), gameData.cells[0][0]);
      expectCell(gameData, 0, 0, "B", LetterStatus.NotSet);
      expectCell(gameData, 0, 1, "E", LetterStatus.NotSet);
      expectCell(gameData, 0, 2, "A", LetterStatus.NotSet);
      expectCell(gameData, 0, 3, "S", LetterStatus.NotSet);
      expectCell(gameData, 0, 4, "T", LetterStatus.NotSet);
    });

    it("should move focussed cell to 0,4", () => {
      expect(gameData.focussed).toEqual({
        rowId: 0,
        cellId: 4,
        letter: undefined,
        status: LetterStatus.NotSet,
      });
    });

    describe("then hits enter", () => {
      beforeEach(() => {
        gameData = upd(gameData, "Enter", 13);
      });

      it("should validate cells in row", () => {
        expectCell(gameData, 0, 0, "B", LetterStatus.Correct);
        expectCell(gameData, 0, 1, "E", LetterStatus.Correct);
        expectCell(gameData, 0, 2, "A", LetterStatus.Correct);
        expectCell(gameData, 0, 3, "S", LetterStatus.ValidOutOfPosition);
        expectCell(gameData, 0, 4, "T", LetterStatus.Incorrect);
      });

      it("should move focussed cell to next row 1,0", () => {
        expect(gameData.focussed).toEqual({
          rowId: 1,
          cellId: 0,
          letter: undefined,
          status: LetterStatus.NotSet,
        });
      });

      it("should have B E A in Correct usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.Correct, ["B", "E", "A"]);
      });

      it("should have S in ValidOutOfPosition usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.ValidOutOfPosition, ["S"]);
      });

      it("should have T in Incorrect usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.Incorrect, ["T"]);
      });

      it("should not be complete", () => {
        expect(gameData.gameComplete).toEqual(false);
      });

      it("should not have row error", () => {
        expect(gameData.rowError).toBeFalsy();
      });
    });
  });

  describe("given user adds invalid word", () => {
    const keyedWord = "PARPS";
    beforeEach(() => {
      gameData = updateMultiple(keyedWord, gameWord, gameData);
    });

    it("should add letter to cells", () => {
      expectCell(gameData, 0, 0, "P", LetterStatus.NotSet);
      expectCell(gameData, 0, 1, "A", LetterStatus.NotSet);
      expectCell(gameData, 0, 2, "R", LetterStatus.NotSet);
      expectCell(gameData, 0, 3, "P", LetterStatus.NotSet);
      expectCell(gameData, 0, 4, "S", LetterStatus.NotSet);
    });

    it("should move focussed cell to 0,4", () => {
      expect(gameData.focussed).toEqual({
        rowId: 0,
        cellId: 4,
        letter: undefined,
        status: LetterStatus.NotSet,
      });
    });

    describe("then hits enter", () => {
      beforeEach(() => {
        gameData = upd(gameData, "Enter", 13);
      });

      it("should NOT move focussed cell to next row (stays at end of row)", () => {
        expect(gameData.focussed).toEqual({
          rowId: 0,
          cellId: 4,
          letter: undefined,
          status: LetterStatus.NotSet,
        });
      });

      it("should have row error", () => {
        expect(gameData.rowError).toBeTruthy();
      });
    });
  });
});

describe("given game word with double letters", () => {
  let gameData: GameData;
  const wordLength = 5;
  const gameWord = "TREES";
  const upd = update(gameWord);

  beforeEach(() => {
    gameData = createGame(wordLength);
  });

  describe("given user adds valid word but not game word", () => {
    const keyedWord = "THERE";
    beforeEach(() => {
      gameData = updateMultiple(keyedWord, gameWord, gameData);
    });

    it("should add letter to cells", () => {
      expectCell(gameData, 0, 0, "T", LetterStatus.NotSet);
      expectCell(gameData, 0, 1, "H", LetterStatus.NotSet);
      expectCell(gameData, 0, 2, "E", LetterStatus.NotSet);
      expectCell(gameData, 0, 3, "R", LetterStatus.NotSet);
      expectCell(gameData, 0, 4, "E", LetterStatus.NotSet);
    });

    it("should move focussed cell to 0,4", () => {
      expect(gameData.focussed).toEqual({
        rowId: 0,
        cellId: 4,
        letter: undefined,
        status: LetterStatus.NotSet,
      });
    });

    describe("then hits enter", () => {
      beforeEach(() => {
        gameData = upd(gameData, "Enter", 13);
      });

      it("should validate cells in row", () => {
        expectCell(gameData, 0, 0, "T", LetterStatus.Correct);
        expectCell(gameData, 0, 1, "H", LetterStatus.Incorrect);
        expectCell(gameData, 0, 2, "E", LetterStatus.Correct);
        expectCell(gameData, 0, 3, "R", LetterStatus.ValidOutOfPosition);
        expectCell(gameData, 0, 4, "E", LetterStatus.ValidOutOfPosition);
      });

      it("should move focussed cell to next row 1,0", () => {
        expect(gameData.focussed).toEqual({
          rowId: 1,
          cellId: 0,
          letter: undefined,
          status: LetterStatus.NotSet,
        });
      });

      it("should have T E in Correct usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.Correct, ["T", "E"] );
      });

      it("should have R E in ValidOutOfPosition usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.ValidOutOfPosition, [ "R"] );
      });

      it("should have H in Incorrect usedLetters Set", () => {
        expectUsedLetters(gameData, LetterStatus.Incorrect, [ "H"] );
      });

      it("should not be complete", () => {
        expect(gameData.gameComplete).toEqual(false);
      });

      it("should not have row error", () => {
        expect(gameData.rowError).toBeFalsy();
      });
    });
  });
});

describe("given game played to completion", () => {
  let gameData: GameData;
  const wordLength = 5;
  const gameWord = "TREES";
  const upd = update(gameWord);

  beforeEach(() => {
    gameData = createGame(wordLength);
  });

  describe("given user adds 2 valid words, then invalid word", () => {
    beforeEach(() => {
      gameData = updateMultiple("SWINE", gameWord, gameData);
      gameData = upd(gameData, "Enter", 13);
      gameData = updateMultiple("STRIP", gameWord, gameData);
      gameData = upd(gameData, "Enter", 13);
      gameData = updateMultiple("PARPS", gameWord, gameData); //INVALID
      gameData = upd(gameData, "Enter", 13);
 
    });

    it("should add letter to cells", () => {
      expectCell(gameData, 2, 0, "P", LetterStatus.NotSet);
      expectCell(gameData, 2, 1, "A", LetterStatus.NotSet);
      expectCell(gameData, 2, 2, "R", LetterStatus.NotSet);
      expectCell(gameData, 2, 3, "P", LetterStatus.NotSet);
      expectCell(gameData, 2, 4, "S", LetterStatus.NotSet);
    });

    it("should have row error", () => {
      expect(gameData.rowError).toBeTruthy();
    });

    describe("then backspaces and enters correct word", () => {
      beforeEach(() => {
        gameData = upd(gameData, "Backspace", 13);
        gameData = upd(gameData, "Backspace", 13);
        gameData = upd(gameData, "Backspace", 13);
        gameData = upd(gameData, "Backspace", 13);
        gameData = upd(gameData, "Backspace", 13);
        gameData = updateMultiple(gameWord, gameWord, gameData);
        gameData = upd(gameData, "Enter", 13);
      });

      it("should have validate row", () => {
        expectCell(gameData, 2, 0, "T", LetterStatus.Correct);
        expectCell(gameData, 2, 1, "R", LetterStatus.Correct);
        expectCell(gameData, 2, 2, "E", LetterStatus.Correct);
        expectCell(gameData, 2, 3, "E", LetterStatus.Correct);
        expectCell(gameData, 2, 4, "S", LetterStatus.Correct);
      });

      it("should be complete", () => {
        expect(gameData.gameComplete).toEqual(true);
      });

      it("should not have row error", () => {
        expect(gameData.rowError).toBeFalsy();
      });
    });
  });
});