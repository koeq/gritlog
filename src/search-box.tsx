import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";

export function SearchBox(): JSX.Element {
  const [active, setActive] = useState(false);
  const [{ trainings }, dispatch] = useTopLevelState();
  const inputRef = useRef<HTMLInputElement>(null);
  const noTrainings = !trainings || trainings.length === 0;

  const handleClick = () => {
    if (!active && inputRef.current) {
      inputRef.current.focus();
    }

    setActive(!active);
  };

  const debouncedResults = useRef(
    debounce(
      (event: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({
          type: "set-search-term",
          searchTerm: event.target.value,
        }),
      150
    )
  );

  useEffect(() => {
    const ref = debouncedResults.current;

    return () => ref.cancel();
  }, []);

  useLayoutEffect(() => {
    if (active) {
      dispatch({ type: "clear-search-term" });
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [active, dispatch]);

  return (
    <div className="search-box">
      <button
        className={`btn-search${noTrainings ? " no-trainings" : ""}`}
        onClick={handleClick}
        disabled={noTrainings}
      >
        {active ? <IoCloseOutline size={22} /> : <IoSearch size={19} />}
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
