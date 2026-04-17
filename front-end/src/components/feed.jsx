import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedOpt, getFollowingFeedOpt } from "../ts-queries/queries";
import PostCard from "./postcard";

function Feed() {
  const [view, setView] = useState("main");

  const {
    data: mainFeedData,
    fetchNextPage: fetchNextMainPage,
    hasNextPage: hasNextMainPage,
    isFetchingNextPage: isFetchingNextMain,
    isPending: isMainPending,
  } = useInfiniteQuery(getFeedOpt());

  const {
    data: followingFeedData,
    fetchNextPage: fetchNextFollowingPage,
    hasNextPage: hasNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowing,
    isPending: isFollowingPending,
  } = useInfiniteQuery(getFollowingFeedOpt());

  return (
    <div className="feedDIV">
      <div>
        <div
          className={view === "main" ? "selectedView" : "main"}
          onClick={() => setView("main")}
        >
          Main
        </div>
        <div
          className={view === "following" ? "selectedView" : "following"}
          onClick={() => setView("following")}
        >
          Following
        </div>
      </div>

      {view === "main" && (
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
      )}
    </div>
  );
}

export default Feed;
