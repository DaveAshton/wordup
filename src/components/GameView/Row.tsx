import { FC, useEffect, useState, memo } from "react";
import { CellData } from "../../model";
import { Cell } from "./Cell";
import { Error } from "../notifications";
import "./GameView.css";

export type RowProps = {
  rowId: number;
  cells: CellData[];
  focussedCell: CellData;
  errorMessage?: string;
};

export const Row: FC<RowProps> = memo(({
  cells,
  rowId,
  focussedCell,
  errorMessage,
}) => {
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      setErr(errorMessage);
      setTimeout(() => setErr(null), 2000);
    }
  }, [errorMessage]);

  if (err) {
    return <Error message={err} />;
  }
  const cellsComps = cells.map(({ status, letter }, cellIdx) => {
    const isFocussed =
      focussedCell.cellId === cellIdx && focussedCell.rowId === rowId;
    return (
      <Cell
        key={`${rowId}-${cellIdx}`}
        status={status}
        letter={letter}
        isFocussed={isFocussed}
      />
    );
  });
  return <div className="Row">{cellsComps}</div>;
});
