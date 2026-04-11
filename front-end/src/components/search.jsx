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

      <div className="queryRes">
        <div className="top">
          {queryResults.usersWithQuery.length === 0 &&
            queryResults.postsWithQuery.length === 0 && (
              <div className="topResDIV"></div>
            )}
        </div>

        <div className="posts">
          {queryResults.postsWithQuery.length > 0 && (
            <div className="postsresDIV"></div>
          )}
        </div>

        <div className="users">
          {queryResults.postsWithQuery.length > 0 && (
            <div className="userResDIV"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
