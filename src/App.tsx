import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { GameView } from './GameView';
import { getWord } from './words';
import { Header } from './Header';

function App() {

  const [word, setWord] = useState<null | string>();
  useEffect(() => {
    console.warn('mounting app and therefore getting new word')
    setWord(getWord(5));
  }, []);
  // console.log('word is', word)
  return (
    <div className="App">
      <header className="App-header">
        <Header onNewGame={() => setWord(getWord(5))} />
        {word && <GameView word={word} />}
      </header>
    </div>
  );
}

export default App;
