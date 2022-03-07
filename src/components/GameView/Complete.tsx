import { LetterStatus } from "../../model";
import { Info } from "../notifications";
import { Cells } from "./Cell";
import "./GameView.css";

type CompleteProps = {
  success?: boolean;
  gameWord: string;
};

export const Complete = ({ success, gameWord }: CompleteProps) => {
  const status = success ? LetterStatus.Correct : LetterStatus.Incorrect;
  const wordConfig = gameWord
  .toLocaleUpperCase()
    .split("")
    .map((letter) => ({
      letter,
      isFocussed: false,
      status,
      className: "InfoCell",
    }));
  const cells = <div className="CompleteResult"> <Cells cells={wordConfig} /></div>;
  return success ? (
    <Info message="Well done, you got the correct word">{cells}</Info>
  ) : (
    <Info message={`Hard luck, word was:`}>{cells}</Info>
  );
};
