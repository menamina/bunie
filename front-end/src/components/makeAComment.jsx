import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeCommentMut } from "./ts-queries/queries";
import PostCard from "./postcard";
import { useOutletContext } from "react-router-dom";

function MakeAComment({ postToCommentOn, closeModal }) {
  const [commentData, setCommentData] = useState({
    pID: postToCommentOn.id,
    body: "",
  });

  const { user } = useOutletContext();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["post", postToCommentOn.id] });
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
        {isPending && <div className="cannotClick">post</div>}
        {!isPending && commentData.body && (
          <button className="canClick">post</button>
        )}
      </form>
      {error && (
        <div className="errorDiv">
          <div>{error}</div>
          <div onClick={resetComment}>try again</div>
        </div>
      )}
    </div>
  );
}

export default MakeAComment;
