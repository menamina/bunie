import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getLikeOpts } from "../ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

interface Who {
  whoseProfile: number;
}

function Likes({ whoseProfile }: Who) {
  const hasMore = useRef(null);

  const {
    data: userLikes,
    error: likesErr,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...getLikeOpts(whoseProfile),
  });

  useEffect(() => {
    if (!hasMore.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(hasMore.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="likesDIV">
      {isFetching && <div>Loading..</div>}
      {likesErr && (
        <div className="centerError">
          {likesErr?.noUserFound && <div>{likesErr.noUserFound}</div>}
        </div>
      )}
      {userLikes?.pages[0]?.likesOrdered?.length === 0 && (
        <div className="centerError">Nothing to see here</div>
      )}
      {userLikes?.pages && (
        <div className="likesFlex">
          {userLikes?.pages
            ?.flatMap((object) => object.likesOrdered)
            .map((orderedLikesObj) => {
              if (orderedLikesObj.type === "post") {
                return (
                  <PostCard key={orderedLikesObj?.id} post={orderedLikesObj} />
                );
              } else {
                return (
                  <CommentCard
                    key={orderedLikesObj?.id}
                    comment={orderedLikesObj}
                  />
                );
              }
            })}
          {hasNextPage && (
            <div ref={hasMore} style={{ height: "20px" }}>
              {isFetchingNextPage && <div>Loading more...</div>}
            </div>
          )}
        </div>
      )}
      {userLikes?.noLikes && (
        <div className="centerError">Nothing to see here</div>
      )}
    </div>
  );
}

export default Likes;
