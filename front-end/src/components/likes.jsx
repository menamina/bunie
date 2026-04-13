import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLikeOpts } from "./ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

function Likes({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userLikes,
    error: likesErr,
    isPending: likesPending,
  } = useQuery({
    ...getLikeOpts(whoseProfile, user.username),
  });

  return (
    <div className="likesDIV">
      {likesPending && <div>Loading..</div>}
      {likesErr && <div>{likesErr}</div>}
      {userLikes?.likesOrdered && (
        <div className="likesFlex">
          {userLikes.likesOrdered.map((like) => {
            if (like.type === "post") {
              return <PostCard key={like.id} post={like.post} />;
            } else {
              return <CommentCard key={like.id} comment={like.comment} />;
            }
          })}
        </div>
      )}
      {userLikes?.noLikes && <div>Nothing to see here</div>}
    </div>
  );
}

export default Likes;
