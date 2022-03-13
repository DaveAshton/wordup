import { FC, useEffect } from "react";
import "./GameView.css";
import { Board, toButtonTheme } from "../Keyboard";
import { Complete } from "./Complete";
import { Row } from "./Row";
import { GameData } from "../../model";

export type GameViewProps = {
  gameData: GameData;
  onUserInput: (key: string, keyCode: number) => void;
};

export const GameView: FC<GameViewProps> = ({ gameData, onUserInput }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key, e.code, e.keyCode, gameData);
      const code = e.keyCode;
      onUserInput(e.key, code);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameData, onUserInput]);

  const handleKeyboardPress = (key: string) => {
    onUserInput(key, key.charCodeAt(0));
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

  const buttonTheme = gameData && toButtonTheme(gameData);

  return (
    <div className="GameView">
      {gameData?.gameComplete && (
        <Complete gameWord={gameData.gameWord} success={gameData.success} />
      )}
      {rows}
      <Board onKeyPress={handleKeyboardPress} buttonTheme={buttonTheme} />
    </div>
  );
};
