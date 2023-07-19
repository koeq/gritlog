import { useEffect, useMemo, useRef, useState } from "react";
import { IoCloseOutline, IoSearch } from "react-icons/io5";
import { useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";
import { noTrainings } from "./utils/no-trainings";

export function SearchBox(): JSX.Element {
  // To ensure the ability to debounce the setting of the external
  // search state, we maintain both internal and global search states.
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ trainings }, dispatch] = useTopLevelState();
  const disableButton = noTrainings(trainings) && !active;

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

  useEffect(() => {
    if (noTrainings(trainings) && active) {
      setActive(false);
    }
  }, [trainings, active]);

  return (
    <div className="search-box">
      <button
        className={`btn-search${disableButton ? " disable" : ""}`}
        onClick={active ? handleClose : handleOpen}
        disabled={disableButton}
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
