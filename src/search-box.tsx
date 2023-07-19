import { useEffect, useMemo, useRef, useState } from "react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";

export function SearchBox(): JSX.Element {
  // Hold internal and global search state in order to being
  // able to debounce the setting of the external search state.
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ trainings }, dispatch] = useTopLevelState();
  const noTrainings = !trainings || trainings.length === 0;

  const handleOpen = () => {
    setActive(true);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setSearch("");
    setActive(false);
    dispatch({ type: "clear-search-term" });
  };

  const searchTermResult = useMemo(
    () =>
      debounce(
        (searchTerm: string) =>
          dispatch({
            type: "set-search-term",
            searchTerm,
          }),
        50
      ),
    [dispatch]
  );

  useEffect(() => {
    return () => searchTermResult.cancel();
  }, [searchTermResult]);

  return (
    <div className="search-box">
      <button
        className={`btn-search${noTrainings ? " no-trainings" : ""}`}
        onClick={active ? handleClose : handleOpen}
        disabled={noTrainings}
      >
        {active ? <IoCloseOutline size={22} /> : <IoSearch size={19} />}
      </button>
      <input
        ref={inputRef}
        type="text"
        value={search}
        placeholder="Search exercises"
        className={`input-search${active ? " active" : ""}`}
        onChange={(event) => {
          setSearch(event.target.value);
          searchTermResult.debounced(event.target.value);
        }}
      />
    </div>
  );
}
