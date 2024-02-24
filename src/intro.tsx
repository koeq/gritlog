import { PlusCircle } from "lucide-react";
import "./styles/intro.css";

export function Intro(): JSX.Element {
  return (
    <section className="intro">
      <p className="add-first">
        Add your first
        <br />
        <span className="bold">Training</span>
        <PlusCircle color="var(--text)" size={40} />
      </p>
    </section>
  );
}
