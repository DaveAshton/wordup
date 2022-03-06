import { CellData } from "./cell";
import { LetterStatus } from "./letterStatus";

export type GameData = {
  focussed: CellData;
  cells: CellData[][];
  gameComplete?: boolean;
  rowError?: string;
  success?: boolean;
  usedLetters: {
    [LetterStatus.Correct]: Set<string>;
    [LetterStatus.ValidOutOfPosition]: Set<string>;
    [LetterStatus.Incorrect]: Set<string>;
  }
};