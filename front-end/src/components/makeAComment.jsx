import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeCommentMut } from "./ts-queries/queries";
import PostCard from "./postcard";
import { useOutletContext } from "react-router-dom";

function MakeAComment({ postToCommentOn, closeModal }) {
  const [commentData, setCommentData] = useState({
    pID: "",
    body: "",
  });

  const { user } = useOutletContext();

  const {
    mutate: makeAComment,
    reset: resetComment,
    isPending,
    error,
  } = useMutation({
    ...makeCommentMut(commentData),
    onSuccess: () => {
      closeModal(false);
      resetComment();
      setCommentData({
        pID: "",
        body: "",
      });
    },
  });

  return (
    <div
      className="makeACommentModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      <form onSubmit={makeAComment}>
        <div>
          <PostCard post={postToCommentOn} />
        </div>
        <div className="yourReply">
          <div>
            <img
              src={`http://localhost:5555/IMGS-API/${user.pfp}`}
              alt="your profile image"
            />
          </div>
          <div>
            <textarea placeholder="post your reply" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default MakeAComment;
