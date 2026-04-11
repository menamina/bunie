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
}

export default Search;
