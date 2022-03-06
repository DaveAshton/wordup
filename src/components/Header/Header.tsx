import {  FC } from "react";
import { Button } from "../Button";
import { Cell, Cells } from "../GameView";
import "./Header.css";
import { LetterStatus } from "../../model";

type HeaderProps = {
  onNewGame: () => void;
};
const title = [
  {letter: "T", status: LetterStatus.Correct, isFocussed: false, className: "TitleCell"},
  {letter: "U", status: LetterStatus.NotSet, isFocussed: false, className: "TitleCell"},
  {letter: "R", status: LetterStatus.Incorrect, isFocussed: false, className: "TitleCell"},
  {letter: "D", status: LetterStatus.NotSet, isFocussed: false, className: "TitleCell"},
  {letter: "L", status: LetterStatus.Incorrect, isFocussed: false, className: "TitleCell"},
  {letter: "E", status: LetterStatus.Correct, isFocussed: false, className: "TitleCell"}

];
export const Header: FC<HeaderProps> = ({ onNewGame }) => {

  return (
    <div className="HeaderRoot" >
      <div className="Spacer" />
      <h2 className="Title">
        <Cells cells={title} />
      </h2>

      <Button className="NextGameButton" onClick={onNewGame}>
        New Game
      </Button>
    </div>
  );
};
