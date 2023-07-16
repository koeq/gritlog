import { useRef, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { useAuth, useTopLevelState } from "./context";
import "./styles/search-box.css";

export function SearchBox(): JSX.Element {
  const { authed } = useAuth();
  const [active, setActive] = useState(false);
  const [{ searchTerm, trainings }, dispatch] = useTopLevelState();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () =>
    setActive((isCurrentlyActive) => {
      if (isCurrentlyActive) {
        dispatch({ type: "clear-search-term" });
      } else {
        inputRef.current?.focus();
      }

      return !isCurrentlyActive;
    });

  return (
    <div className="search-box">
      <button className="btn-search" onClick={handleClick}>
        {authed &&
          trainings &&
          trainings.length > 0 &&
          (active ? (
            <IoCloseOutline size={22} />
          ) : (
            <IoSearchOutline size={20} />
          ))}
      </button>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        placeholder="Search exercise"
        className={`input-search${active ? " active" : ""}`}
        onChange={(event) =>
          dispatch({
            type: "set-search-term",
            searchTerm: event.target.value,
          })
        }
      />
    </div>
  );
}
