import { FC } from "react";
import "./notifications.css";

type InfoProps = { message?: string };
export const Info: FC<InfoProps> = ({ message, children }) => {
  return (
    <div className="Info">
      {message}
      {children}
    </div>
  );
};
