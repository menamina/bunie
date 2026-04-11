import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { search } from "./ts-queries/queries";

function Search() {
  const [querySearch, setQuerySearch] = useState("");
  const [tabView, setTabView] = useState("top");

  const {
    data: queryResults,
    isPending,
    error,
  } = useQuery(search(querySearch));

  return (
    <div className="searchDIV">
      <div>Search</div>
      <div>
        <input
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
        />
      </div>
      {isPending && <div>Loading</div>}
      {queryResults && (
        <div className="resultsReturnedDIV">
          <div className="tabView">
            <div className="top" onClick={() => setTabView("top")}>
              Top
            </div>
            <div className="posts" onClick={() => setTabView("posts")}>
              Posts
            </div>
            <div className="users" onClick={() => setTabView("users")}>
              Users
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
