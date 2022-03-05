import {FC, useRef} from 'react';
import "./Button.css";
type ButtonProps = {
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export const Button: FC<ButtonProps> = (props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const handleClick = (thing: any) => {
    props.onClick?.(thing);
    buttonRef?.current?.blur();
  };
  const cls = props.className ? `Button ${props.className}` : 'Button';
  return <button {...props} className={cls} ref={buttonRef} onClick={handleClick} />;
}