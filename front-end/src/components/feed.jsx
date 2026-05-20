import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedOpt, getFollowingFeedOpt } from "../ts-queries/queries";
import PostCard from "./postcard";

function Feed() {
  const [view, setView] = useState("main");
  const mainFeed = useRef(null);
  const followingFeed = useRef(null);

  const {
    data: mainFeedData,
    isPending: isMainPending,
    fetchNextPage: fetchNextMainPage,
    isFetchingNextPage: isFetchingNextMain,
    hasNextPage: hasNextMainPage,
  } = useInfiniteQuery({
    ...getFeedOpt(),
    enabled: view === "main",
  });

  const {
    data: followingFeedData,
    isPending: isFollowingPending,
    fetchNextPage: fetchNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowing,
    hasNextPage: hasNextFollowingPage,
  } = useInfiniteQuery({
    ...getFollowingFeedOpt(),
    enabled: view === "following",
  });

  console.log(mainFeedData, followingFeedData);

  useEffect(() => {
    if (!mainFeed.current || isFetchingNextMain || !hasNextMainPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextMainPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(mainFeed.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextMainPage, isFetchingNextMain, hasNextMainPage]);

  useEffect(() => {
    if (
      !followingFeed.current ||
      isFetchingNextFollowing ||
      !hasNextFollowingPage
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextFollowingPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(followingFeed.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextFollowingPage, isFetchingNextFollowing, hasNextFollowingPage]);

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

      {view === "main" && (
        <div>
          {isMainPending && <div>Loading...</div>}
          {mainFeedData?.pages
            ?.flatMap((page) => page.feed)
            .map((post) => (
              <PostCard key={post?.id} post={post} />
            ))}

          {hasNextMainPage && (
            <div className="mainFeed ref" ref={mainFeed}>
              {isFetchingNextMain ? <div>loading.. </div> : null}
            </div>
          )}
        </div>
      )}

      {view === "following" && (
        <div>
          {isFollowingPending && <div>Loading...</div>}
          {followingFeedData?.pages
            ?.flatMap((page) => page.feed)
            .map((post) => (
              <PostCard key={post?.id} post={post} />
            ))}
          {hasNextFollowingPage && (
            <div className="followingFeed ref" ref={followingFeed}>
              {isFetchingNextFollowing ? <div>loading... </div> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Feed;
