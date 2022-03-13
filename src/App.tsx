import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { GameView, Header } from "./components";
import { GameData } from "./model";
import { createGame, updateGame } from "./validate";

const WORD_LENGTH = 5;
function App() {
  const [gameData, setGameData] = useState<GameData | undefined>();
  useEffect(() => {
    console.warn("mounting app and therefore getting new word");
    setGameData(createGame(WORD_LENGTH));
  }, []);

  const handleUserInput = (key: string, keyCode: number) => {
    if (gameData) {
      setGameData(updateGame(gameData, keyCode, key));
    }
  };

  const handleNewGame = useCallback( () => setGameData(createGame(WORD_LENGTH)), []);
  return (
    <div className="App">
      <header className="App-header">
        <Header onNewGame={handleNewGame} />
        {gameData && (
          <GameView gameData={gameData} onUserInput={handleUserInput} />
        )}
      </header>
    </div>
  );
}

export default App;
