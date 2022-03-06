import { KeyboardButtonTheme } from "react-simple-keyboard";
import { GameData, LetterStatus } from "../../model";

export const toButtonTheme = ({ usedLetters }: GameData): KeyboardButtonTheme[] => {

  const correct = Array.from(usedLetters[LetterStatus.Correct]).join(" ");
  const vop = Array.from(usedLetters[LetterStatus.ValidOutOfPosition]).join(
    " "
  );

  const incorrect = Array.from(usedLetters[LetterStatus.Incorrect]).join(" ");
  const buttonTheme = [
  ];
  if (correct.length > 0) {
    buttonTheme.push({class: LetterStatus.Correct, buttons: correct})
  }
  if (vop.length > 0) {
    buttonTheme.push({class: LetterStatus.ValidOutOfPosition, buttons: vop})
  }
  if (incorrect.length > 0) {
    buttonTheme.push({class: LetterStatus.Incorrect, buttons: incorrect})
  }
  return buttonTheme;
};