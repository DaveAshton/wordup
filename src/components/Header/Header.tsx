import {  FC } from "react";
import { Button } from "../Button";
import { Cell } from "../GameView";
import "./Header.css";
import { LetterStatus } from "../../validate";

type HeaderProps = {
  onNewGame: () => void;
};
export const Header: FC<HeaderProps> = ({ onNewGame }) => {

  return (
    <div className="HeaderRoot" >
      <div className="Spacer" />
      <h2 className="Title">
        <Cell className="TitleCell" isFocussed={false} status={LetterStatus.Correct} letter="T" />
        <Cell className="TitleCell" isFocussed={false} status={LetterStatus.NotSet} letter="U" />
        <Cell className="TitleCell" isFocussed={false} status={LetterStatus.Incorrect} letter="R" />
        <Cell className="TitleCell" isFocussed={false} status={LetterStatus.NotSet} letter="D" />
        <Cell className="TitleCell" isFocussed={false} status={LetterStatus.Incorrect} letter="L" />
        <Cell  className="TitleCell" isFocussed={false} status={LetterStatus.Correct} letter="E" />
      </h2>

      <Button className="NextGameButton" onClick={onNewGame}>
        New Game
      </Button>
    </div>
  );
};
