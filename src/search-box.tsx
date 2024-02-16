import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import "./styles/search-box.css";
import { debounce } from "./utils/debounce";

export function SearchBox(): JSX.Element {
  // To ensure the ability to debounce the setting of the external
  // search state, we maintain both internal and global search states.
  const [search, setSearch] = useState("");
  const [{ searchActive }, dispatch] = useTopLevelState();

  // const handleClose = () => {
  //   setSearch("");
  //   dispatch({ type: "clear-search-term" });
  // };

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
    <div className={`search-box ${searchActive ? "active" : ""}`}>
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
    </div>
  );
}
