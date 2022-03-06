import { FC, useState, useEffect } from "react";
import "./GameView.css";
import { Board, toButtonTheme } from "../Keyboard";
import { createGame,  updateGame } from "../../validate";
import { Complete } from "./Complete";
import { Row } from "./Row";
import {GameData} from '../../model'

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

  const buttonTheme = gameData && toButtonTheme(gameData);

  return (
    <div className="GameView">
      {gameData?.gameComplete && (
        <Complete gameWord={word} success={gameData?.success} />
      )}
      {rows}
      <Board onKeyPress={handleKeyboardPress} buttonTheme={buttonTheme} />
    </div>
  );
};
