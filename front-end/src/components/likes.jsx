import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLikeOpts } from "./ts-queries/queries";
import LikedCard from "./likedCard";

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
          {userLikes.likesOrdered.map((like) => (
            <LikedCard key={like.id} like={like} />
          ))}
        </div>
      )}
      {userLikes?.noLikes && <div>Nothing to see here</div>}
    </div>
  );
}

export default Likes;
