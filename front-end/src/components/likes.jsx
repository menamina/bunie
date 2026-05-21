import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getLikeOpts } from "../ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

function Likes({ whoseProfile }) {
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

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }

      observer.observe(hasMore.current);

      return () => observer.disconnect();
    });
  }, [fetchNextPage, hasNextPage]);

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
      {userLikes?.likesOrdered && (
        <div className="likesFlex">
          {userLikes?.pages
            ?.flatMap((object) => object.likesOrdered)
            .map((orderedLikesObj) => {
              if (orderedLikesObj.type === "post") {
                return (
                  <PostCard
                    key={orderedLikesObj.id}
                    post={orderedLikesObj.post}
                  />
                );
              } else {
                return (
                  <CommentCard
                    key={orderedLikesObj.id}
                    comment={orderedLikesObj.comment}
                  />
                );
              }
            })}
        </div>
      )}
      {userLikes?.noLikes && (
        <div className="centerError">Nothing to see here</div>
      )}
    </div>
  );
}

export default Likes;
