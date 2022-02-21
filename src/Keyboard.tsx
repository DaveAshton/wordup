import {FC} from 'react';
import "./Keyboard.css";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type KeyboardProps = {
  onKeyPress: (key: string) => void;
}
const config = {
  layoutName: "default",
  input: ""
};

const layout = {
  default: [
    'Q W E R T Y U I O P {bksp}',
    'A S D F G H J K L {enter}',
    'Z X C V B N M',
  ]
};
export const Board: FC<KeyboardProps> = ({onKeyPress}) => {

  return (
    <Keyboard
      layoutName={config.layoutName}
      onKeyPress={onKeyPress}
      layout={layout}
      theme={"hg-theme-default Keyboard"}
      disableButtonHold={true}
  />
  )
}