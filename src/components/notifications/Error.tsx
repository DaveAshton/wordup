import { FC } from "react";
import "./notifications.css";

type ErrorProps = { message?: string };
export const Error: FC<ErrorProps> = ({ message }) => {
  return <div className="Error">{message}</div>;
};
