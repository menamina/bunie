import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeCommentMut } from "./ts-queries/queries";
import PostCard from "./postcard";
import { useOutletContext } from "react-router-dom";
import { updateComment } from "../../../server/remote/control";

function MakeAComment({
  closeModal,
  postObj = null,
  edit = false,
  comment = null,
}) {
  const [commentData, setCommentData] = useState(
    edit
      ? {
          pID: postID,
          body: comment.body,
        }
      : {
          pID: postObj.id,
          body: "",
        },
  );

  const postID = postObj ? postObj.id : comment.idOfPost;

  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const {
    mutate: makeAComment,
    reset: resetComment,
    isPending: addPending,
    error: addErr,
  } = useMutation({
    ...makeCommentMut(commentData),
    onSuccess: () => {
      closeModal(false);
      resetComment();
      setCommentData({
        pID: "",
        body: "",
      });
      queryClient.invalidateQueries({ queryKey: ["post", postObj.id] });
    },
  });

  const {
    mutate: updateComment,
    error: updateErr,
    isPending: updatePend,
    reset: resetComment,
  } = useMutation({
    ...updateCommentMut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postID] });
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
          {!edit && <PostCard post={postObj} />}
          {edit && <PostCard post={updatedFetch} />}
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
