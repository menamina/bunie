import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  makeCommentMut,
  updateCommentMut,
  getPostOpt,
} from "../ts-queries/queries";
import PostCard from "./postcard";
import { useOutletContext } from "react-router-dom";

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
    data: fetchedPost,
    isLoading,
    error: fetchErr,
    refetch: refetchPost,
  } = useQuery({
    ...getPostOpt(comment?.idOfPost),
    enabled: edit && comment && !postObj,
  });

  const {
    mutate: makeAComment,
    isPending: addPending,
    error: addErr,
  } = useMutation({
    ...makeCommentMut(),
    onSuccess: () => {
      closeModal(false);
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
  } = useMutation({
    ...updateCommentMut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postID] });
    },
  });

  function submit() {
    if (edit && comment && !postObj) {
      return updateComment(commentData);
    }
    return makeAComment(commentData);
  }

  function closeStop(e) {
    e.stopPropagation();
    closeModal(false);
  }

  return (
    <div
      className="makeACommentModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      {fetchErr.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>Oops something went wrong fetching the post</div>
            <div onClick={refetchPost}>try again</div>
          </div>
        </div>
      )}
      {fetchErr.postNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{fetchErr.postNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {updateErr.commentNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{updateErr.commentNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {addErr.postNotExisting && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{addErr.postNotExisting}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {addErr.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{addErr.serverError}</div>
            <div>
              <div onClick={() => closeModal(false)}>cancel</div>
              <div onClick={() => makeAComment.mutate(commentData)}>
                try again
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={submit}>
        <div>
          {!edit && <PostCard post={postObj} />}
          {edit && <PostCard post={fetchedPost} />}
          {edit && isLoading(<div>Loading..</div>)}
        </div>
        <div className="yourReply">
          <div>
            <img
              src={`http://localhost:5555/IMGS-API/${user.pfp}`}
              alt="your profile image"
            />
          </div>
          <div>
            <textarea
              placeholder="post your reply"
              value={commentData.body}
              onChange={(e) =>
                setCommentData((prev) => ({ ...prev, body: e.target.value }))
              }
            />
          </div>
        </div>
        {edit && !postObj && (
          <div>
            {updatePend && (
              <div>
                <div className="cannot click">update</div>
                <div className="cannot click">cancel</div>
              </div>
            )}

            {!updatePend && (
              <div>
                <button type="submit" className="can click">
                  update
                </button>
                <div className="can click" onClick={() => closeModal(false)}>
                  cancel
                </div>
              </div>
            )}
          </div>
        )}
        {!edit && postObj && (
          <div>
            {addPending && (
              <div>
                <div className="cannot click">post</div>
                <div className="cannot click">cancel</div>
              </div>
            )}

            {!addPending && (
              <div>
                <div className="can click" onClick={() => closeModal(false)}>
                  cancel
                </div>
                <button type="submit" className="can click">
                  post
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default MakeAComment;
