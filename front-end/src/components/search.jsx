import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "../ts-queries/queries";

import MiniProfile from "./miniProfile";
import PostCard from "./postcard";

function Search() {
  const [querySearch, setQuerySearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [tabView, setTabView] = useState("top");

  useEffect(() => {
    if (!querySearch) {
      setSearching(false);
      return;
    }

    const timer = setTimeout(() => setSearching(true), 5000);

    return () => clearTimeout(timer);
  }, [querySearch]);

  const {
    data: queryResults,
    error,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...search(querySearch),
    enabled: searching,
  });

  return (
    <div className="searchDIV">
      <div>Search</div>
      <div>
        <input
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
        />
      </div>
      {isFetching && <div>Loading</div>}
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

          {queryResults.pages[0].usersWithQuery.length === 0 &&
            queryResults.pages[0].postsWithQuery.length === 0 && (
              <div className="noQueryResults">No results found</div>
            )}

          {tabView === "top" && (
            <div>
              <div className="topRES">
                <div className="top10USERS">
                  {queryResults.pages[0].usersWithQuery.length > 0 &&
                    queryResults.pages[0].usersWithQuery
                      .slice(0, 9)
                      .map((user) => <MiniProfile userProfile={user} />)}
                  {queryResults.pages[0].usersWithQuery.length > 10 && (
                    <div
                      onClick={() => {
                        setTabView("users");
                        fetchNextPage();
                      }}
                    >
                      see more{" "}
                    </div>
                  )}
                </div>
                <div className="top10POSTS">
                  {queryResults.pages[0].postsWithQuery
                    .slice(0, 9)
                    .map((post) => (
                      <PostCard post={post} />
                    ))}
                  {queryResults.pages[0].postsWithQuery.length > 10 && (
                    <div
                      onClick={() => {
                        setTabView("posts");
                        fetchNextPage();
                      }}
                    >
                      see more{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {tabView !== "top" && 
          <div>
            <div>
              <div
                className={
                  tabView === "users" ? "selectedViewInSearch" : "userView"
                }
              >
                Users
                </div>
                 <div
                className={
                  tabView === "posts" ? "selectedViewInSearch" : "postView"
                }
              >
                Posts
              </div>

            </div>


             </div>
              {tabView === "users" && (
                <div>
                  {queryResults.usersWithQuery.map((user) => (
                    <MiniProfile userProfile={user} />
                  ))}
                </div>
              )}

               {tabView === "posts" && (
                <div>
                  {queryResults.postsWithQuery.map((post) => (
                    <PostCard post={post} />
                  ))}
                </div>
              )}
          </div>
        </div>
        }
      )}
    </div>
  );
}

export default Search;
