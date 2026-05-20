import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "../ts-queries/queries";

import MiniProfile from "./miniProfile";
import PostCard from "./postcard";

import "../css/search.css";

function Search() {
  const [querySearch, setQuerySearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [tabView, setTabView] = useState("top");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!querySearch) {
      return;
    }

    const timer = setTimeout(() => setSearching(true), 1000);

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
    enabled: searching && !!querySearch,
    onSuccess: () => {
      setSearching(false);
    },
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="searchDIV">
      <div className="searchTop">
        <div>Search</div>
        <div>
          <input
            value={querySearch}
            onChange={(e) => setQuerySearch(e.target.value)}
          />
        </div>
      </div>
      {isFetching && !queryResults && <div>Loading</div>}
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

          {queryResults?.pages[0]?.usersWithQuery.length === 0 &&
            queryResults?.pages[0]?.postsWithQuery.length === 0 && (
              <div className="noQueryResults">No results found</div>
            )}

          {tabView === "top" && (
            <div>
              <div className="topRES">
                <div className="top10USERS">
                  {queryResults?.pages[0]?.usersWithQuery.length > 0 &&
                    queryResults?.pages[0].usersWithQuery
                      .slice(0, 10)
                      .map((user) => (
                        <MiniProfile key={user.id} userProfile={user} />
                      ))}
                  {queryResults?.pages[0]?.usersWithQuery.length >= 10 && (
                    <div
                      onClick={() => {
                        setTabView("users");
                      }}
                    >
                      see more{" "}
                    </div>
                  )}
                </div>
                <div className="top10POSTS">
                  {queryResults?.pages[0]?.postsWithQuery
                    .slice(0, 10)
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  {queryResults?.pages[0]?.postsWithQuery.length >= 10 && (
                    <div
                      onClick={() => {
                        setTabView("posts");
                      }}
                    >
                      see more{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tabView !== "top" && (
            <div>
              {tabView === "users" && (
                <div>
                  {queryResults.pages.flatMap((item) =>
                    item.usersWithQuery.map((user) => (
                      <MiniProfile key={user.id} userProfile={user} />
                    )),
                  )}
                  {hasNextPage && (
                    <div ref={loadMoreRef} style={{ height: "20px" }}>
                      {isFetchingNextPage && <div>Loading more...</div>}
                    </div>
                  )}
                  {!hasNextPage && <div>That's all folks</div>}
                </div>
              )}

              {tabView === "posts" && (
                <div>
                  {queryResults.pages.flatMap((item) =>
                    item.postsWithQuery.map((post) => (
                      <PostCard key={post.id} post={post} />
                    )),
                  )}
                  {hasNextPage && (
                    <div ref={loadMoreRef} style={{ height: "20px" }}>
                      {isFetchingNextPage ? <div>Loading more...</div> : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
