import { FC, memo } from "react";
import { LetterStatus } from "../../model";
import "./GameView.css";

const getClass = (
  status: LetterStatus,
  isFocussed: boolean,
  className?: string
) =>
  `Cell ${status} ${isFocussed ? "Focussed" : undefined} ${className}`.trim();

export type CellProps = {
  isFocussed: boolean;
  letter?: string;
  status: LetterStatus;
  className?: string;
};
export const Cell: FC<CellProps> = memo(({
  letter,
  status,
  isFocussed,
  className,
}) => {
  return (
    <div className={getClass(status, isFocussed, className)}>{letter}</div>
  );
});

type CellsProps = {
  cells: CellProps[];
};

export const Cells: FC<CellsProps> = ({ cells }) => {
  const things = cells.map(({ letter, className, status }, idx) => (
    <Cell
      key={`${letter}-${idx}`}
      letter={letter}
      className={className}
      isFocussed={false}
      status={status}
    />
  ));
  return <>{things}</>;
};
