import { LetterStatus } from "./letterStatus";

export type CellData = {
  rowId: number;
  cellId: number;
  letter?: string;
  status: LetterStatus;
};
