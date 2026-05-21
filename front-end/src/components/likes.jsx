import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikeOpts } from "../ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

function Likes({ whoseProfile }) {
  const {
    data: userLikes,
    error: likesErr,
    isPending: likesPending,
  } = useInfiniteQuery({
    ...getLikeOpts(whoseProfile),
  });

  return (
    <div className="likesDIV">
      {likesPending && <div>Loading..</div>}
      {likesErr && (
        <div className="centerError">
          {likesErr?.noUserFound && <div>{likesErr.noUserFound}</div>}
        </div>
      )}
      {!userLikes && <div className="centerError">Nothing to see here</div>}
      {userLikes?.likesOrdered && (
        <div className="likesFlex">
          {userLikes.likesOrdered.map((like) => {
            if (like.type === "post") {
              return <PostCard key={like.id} post={like.post} />;
            } else if (like.type === "comment") {
              return <CommentCard key={like.id} comment={like.comment} />;
            }
            return null;
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
