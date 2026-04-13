import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLikeOpts } from "./ts-queries/queries";

function Likes({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userLikes,
    error: likesErr,
    isPending: likesPending,
  } = useQuery({
    ...getLikeOpts(whoseProfile.name, user.username),
  });

  return (
    <div className="likesDIV">
      {likesPending && <div>Loading..</div>}
      {likesErr && <div>{likesErr}</div>}
      {userLikes.length > 0 && <div></div>}
      {userLikes.length === 0 && <div>Nothing to see here</div>}
    </div>
  );
}

export default Likes;
