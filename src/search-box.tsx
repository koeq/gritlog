import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";

export function SearchBox(): JSX.Element {
  // To ensure the ability to debounce the setting of the external
  // search state, we maintain both internal and global search states.
  const [search, setSearch] = useState("");
  const [{ searchActive }, dispatch] = useTopLevelState();

  const handleClose = () => {
    setSearch("");
    dispatch({ type: "clear-search-term" });
    dispatch({ type: "toggle-search" });
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
    <div className={`search ${searchActive ? "active" : ""}`}>
      <div className="search-box">
        <input
          type="text"
          value={search}
          placeholder="Search exercise"
          className={`input-search active`}
          onChange={(event) => {
            setSearch(event.target.value);
            searchTermResult.debounced(event.target.value);
          }}
        />
        <button onClick={handleClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
