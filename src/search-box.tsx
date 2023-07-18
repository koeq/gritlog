import { useEffect, useRef, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { useAuth, useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";

export function SearchBox(): JSX.Element {
  const { authed } = useAuth();
  const [active, setActive] = useState(false);
  const [{ trainings }, dispatch] = useTopLevelState();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () =>
    setActive((isCurrentlyActive) => {
      if (isCurrentlyActive) {
        dispatch({ type: "clear-search-term" });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } else {
        inputRef.current?.focus();
      }

      return !isCurrentlyActive;
    });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "set-search-term",
      searchTerm: event.target.value,
    });
  };

  const debouncedResults = useRef(debounce(handleSearch, 150));

  useEffect(() => debouncedResults.current.cancel, []);

  return (
    <div className="search-box">
      <button className="btn-search" onClick={handleClick}>
        {authed &&
          trainings &&
          trainings.length > 0 &&
          (active ? (
            <IoCloseOutline size={22} />
          ) : (
            <IoSearchOutline size={19} />
          ))}
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search exercises"
        className={`input-search${active ? " active" : ""}`}
        onChange={debouncedResults.current.debounced}
      />
    </div>
  );
}
