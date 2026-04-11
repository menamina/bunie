import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { search } from "./ts-queries/queries";

function Search() {
  const [querySearch, setQuerySearch] = useState("");

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
        <div className="topRes"></div>
        <div className="postRes"></div>
        <div className="userRes"></div>
      </div>
    </div>
  );
}

export default Search;
