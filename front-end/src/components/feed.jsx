import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedOpt, getFollowingFeedOpt } from "../ts-queries/queries";
import PostCard from "./postcard";

function Feed() {
  const [view, setView] = useState("main");

  const {
    data: mainFeedData,
    error: mainFeedError,
    isFetching: isFetchingFirstPage,
    fetchNextPage: fetchNextMainPage,
    isFetchingNextPage: isFetchingNextMain,
    hasNextPage: hasNextMainPage,
  } = useInfiniteQuery({
    ...getFeedOpt(),
    enabled: view === "main",
  });

  const {
    data: followingFeedData,
    error: followingFeedError,
    fetchNextPage: fetchNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowing,
    hasNextPage: hasNextFollowingPage,
  } = useInfiniteQuery({
    ...getFollowingFeedOpt(),
    enabled: view === "following",
  });

  return (
    <div className="feedDIV">
      <div className="feedOpts">
        <div
          className={
            view === "main" ? "selectedView curs0rclick" : "main curs0rclick"
          }
          onClick={() => setView("main")}
        >
          Feed
        </div>
        <div
          className={
            view === "following"
              ? "selectedView curs0rclick"
              : "following curs0rclick"
          }
          onClick={() => setView("following")}
        >
          Following
        </div>
      </div>

      {/* {view === "main" && (
        <div>
          {isMainPending && <div>Loading...</div>}
          {mainFeedData?.pages.map((page) =>
            page.map((post) => <PostCard key={post.id} post={post} />),
          )}
          {hasNextMainPage && (
            <button
              onClick={() => fetchNextMainPage()}
              disabled={isFetchingNextMain}
            >
              {isFetchingNextMain ? "Loading more..." : "Load More"}
            </button>
          )}
        </div>
      )}

      {view === "following" && (
        <div>
          {isFollowingPending && <div>Loading...</div>}
          {followingFeedData?.pages.map((page) =>
            page.map((post) => <PostCard key={post.id} post={post} />),
          )}
          {hasNextFollowingPage && (
            <button
              onClick={() => fetchNextFollowingPage()}
              disabled={isFetchingNextFollowing}
            >
              {isFetchingNextFollowing ? "Loading more..." : "Load More"}
            </button>
          )}
        </div>
      )} */}
    </div>
  );
}

export default Feed;
