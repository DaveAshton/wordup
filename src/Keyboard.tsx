import {FC} from 'react';
import "./Keyboard.css";
import Keyboard, { KeyboardButtonTheme, KeyboardLayoutObject } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type KeyboardProps = {
  onKeyPress: (key: string) => void;
  buttonTheme?: KeyboardButtonTheme[];
}
const config = {
  layoutName: "default",
  input: ""
};

const layout: KeyboardLayoutObject = {
  default: [
    'Q W E R T Y U I O P {bksp}',
    'A S D F G H J K L {enter}',
    'Z X C V B N M',
  ],

};

export const Board: FC<KeyboardProps> = ({onKeyPress, buttonTheme}) => {
  return (
    <Keyboard
      layoutName={config.layoutName}
      onKeyPress={onKeyPress}
      layout={layout}
      theme={"hg-theme-default Keyboard"}
      disableButtonHold={true}
      buttonTheme={buttonTheme}
      
  />
  )
}