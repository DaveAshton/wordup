import { FC, useState, useEffect, useRef, LegacyRef } from "react";
import "./GameView.css";
import { Board } from "./Keyboard";
import {
  CellData,
  createGame,
  GameData,
  LetterStatus,
  updateGame,
} from "./validate";

export type GameViewProps = {
  word: string;
};
export const GameView: FC<GameViewProps> = ({ word }) => {
  const [gameData, setGameData] = useState<GameData | undefined>();

  useEffect(() => {
    setGameData(createGame(word.length));
  }, [word]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key, e.code, e.keyCode, gameData);
      const code = e.keyCode;
      if (gameData) {
        setGameData(updateGame(gameData, code, word, e.key));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameData, word]);

  const handleKeyboardPress = (key: string) => {
    //  console.log("keyboard press", key, key.charCodeAt(0));
    if (gameData) {
      setGameData(updateGame(gameData, key.charCodeAt(0), word, key));
    }
  };
  const rows = gameData?.cells.map((row, idx) => {
    const errMessage =
      gameData.rowError && idx === gameData.focussed.rowId
        ? gameData.rowError
        : undefined;
    return (
      <Row
        key={idx}
        rowId={idx}
        cells={row}
        focussedCell={gameData.focussed}
        errorMessage={errMessage}
      />
    );
  });

  let gameEnd: any;
  if (gameData?.gameComplete) {
    gameEnd = gameData?.success ? (
      <Info message="Well done, you got the correct word" />
    ) : (
      <Info message={`Hard luck, word was: \n ${word.toLocaleUpperCase()}`} />
    );
  }
  return (
    <div className="GameView">
      {gameEnd}
      {rows}
      <Board onKeyPress={handleKeyboardPress} />
    </div>
  );
};

export type RowProps = {
  rowId: number;
  cells: CellData[];
  focussedCell: CellData;
  onLetterChange?: (letter: string) => void;
  errorMessage?: string;
};
const Row: FC<RowProps> = ({ cells, rowId, focussedCell, errorMessage }) => {
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
};
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
export const Cell: FC<CellProps> = ({
  letter,
  status,
  isFocussed,
  className,
}) => {
  return (
    <div className={getClass(status, isFocussed, className)}>{letter}</div>
  );
};

type ErrorProps = { message?: string };
const Error: FC<ErrorProps> = ({ message }) => {
  return <div className="Error">{message}</div>;
};

type InfoProps = { message?: string };
const Info: FC<InfoProps> = ({ message }) => {
  return <div className="Info">{message}</div>;
};
