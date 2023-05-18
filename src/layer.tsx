import { ReactNode } from "react";
import "./styles/layer.css";

interface LayerProps {
  children: () => ReactNode;
  clickHandler?: () => void;
}

export const Layer = ({ children, clickHandler }: LayerProps): JSX.Element => {
  return (
    <div className="layer" onClick={clickHandler}>
      {children()}
    </div>
  );
};
