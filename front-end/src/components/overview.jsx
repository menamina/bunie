import { useOutletContext, useEffect, useRef } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

import PostCard from "./postcard";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();
  const loadMore = useRef(null);

  const {
    data: userPosts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    ...getProfilePosts(whoseProfile, user.username),
    onSuccess: () => {
      console.log("gathered", whoseProfile, "posts");
    },
  });

  useEffect(() => {
    if (!loadMore.current || !isFetchingNextPage || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage;
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMore);
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <div className="userPostsDIV">
      {error && (
        <div>
          {" "}
          {error?.notAuth && <div className="centerError">{error.notAuth}</div>}
          {error?.serverError && (
            <div className="centerError">{error.serverError}</div>
          )}
        </div>
      )}
      {isPending && <div>Loading..</div>}
      {userPosts?.pages?.length === 0 && <div>Nothing to see here</div>}
      {userPosts?.pages?.length > 0 &&
        userPosts?.pages
          ?.flatMap((page) => page.feed)
          .map((post) => <PostCard post={post} key={post?.id} />)}
      <div className="intersectObsOverview" ref={loadMore}></div>
    </div>
  );
}

export default Overview;
