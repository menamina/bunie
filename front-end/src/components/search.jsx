import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { search } from "./ts-queries/queries";

import MiniProfile from "./miniProfile";
import PostCard from "./postcard";

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
      {error && <div>{error.errMsg}</div>}
      {queryResults && (
        <div className="resultsReturnedDIV">
          <div className="tabView">
            <div
              className={tabView === "top" ? "clickedView" : "topView"}
              onClick={() => setTabView("top")}
            >
              Top
            </div>
            <div
              className={tabView === "posts" ? "clickedView" : "postView"}
              onClick={() => setTabView("posts")}
            >
              Posts
            </div>
            <div
              className={tabView === "users" ? "clickedView" : "userView"}
              onClick={() => setTabView("users")}
            >
              Users
            </div>
          </div>

          {queryResults.usersWithQuery.length === 0 &&
            queryResults.postsWithQuery.length === 0 && (
              <div className="noQueryResults">No results found</div>
            )}

          {tabView === "top" && (
            <div>
              {queryResults.usersWithQuery.length > 0 &&
                queryResults.postsWithQuery.length > 0 && (
                  <div className="topRES">
                    <div className="top10USERS">
                      {queryResults.usersWithQuery.slice(0, 9).map((user) => {
                        <MiniProfile userProfile={user} />;
                      })}
                      {queryResults.usersWithQuery.length > 10 && (
                        <div onClick={setTabView("users")}>see more </div>
                      )}
                    </div>
                    <div className="top10POSTS"></div>
                  </div>
                )}
            </div>
          )}
          {tabView === "posts" && (
            <div>
              {queryResults.postsWithQuery.map((post) => {
                <PostCard post={post} />;
              })}
            </div>
          )}

          {tabView === "users" && (
            <div>
              {queryResults.usersWithQuery.map((user) => {
                <MiniProfile userProfile={user} />;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
