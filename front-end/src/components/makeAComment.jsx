import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  makeCommentMut,
  updateCommentMut,
  getPostOpt,
} from "../ts-queries/queries";
import PostCard from "./postcard";
import "../css/comment.css";
import TempIcon from "../imgs/cafe.jpeg";

function MakeAComment({
  closeModal,
  postObj = null,
  edit = false,
  comment = null,
}) {
  const [commentData, setCommentData] = useState(
    edit
      ? {
          pID: comment?.idOfPost,
          body: comment?.body,
        }
      : {
          pID: postObj?.id,
          body: "",
        },
  );

  const postID = postObj ? postObj?.id : comment?.idOfPost;

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
      queryClient.invalidateQueries({ queryKey: ["post", postObj.id] });
      closeModal(false);
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
      }}
    >
      {fetchErr?.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>Oops something went wrong fetching the post</div>
            <div onClick={refetchPost}>try again</div>
          </div>
        </div>
      )}
      {fetchErr?.postNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{fetchErr?.postNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {updateErr?.commentNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{updateErr?.commentNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {addErr?.postNotExisting && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{addErr?.postNotExisting}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {addErr?.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{addErr?.serverError}</div>
            <div>
              <div onClick={() => closeModal(false)}>cancel</div>
              <div onClick={() => makeAComment.mutate(commentData)}>
                try again
              </div>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={submit}
        className="commentForm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="comment">
          {!edit && <PostCard post={postObj} />}
          {edit && <PostCard post={fetchedPost} />}
          {edit && isLoading && <div>Loading..</div>}
        </div>
        <div className="yourReply" onClick={(e) => e.stopPropagation()}>
          <div>
            <img
              // src={`http://localhost:5555/IMGS-API/${user.pfp}`}
              src={TempIcon}
              alt="your profile image"
              className="pfpIMG"
            />
          </div>

          <textarea
            placeholder="post your reply"
            value={commentData.body}
            onChange={(e) =>
              setCommentData((prev) => ({ ...prev, body: e.target.value }))
            }
            className="textAreaComment"
          />
        </div>
        {edit && !postObj && (
          <div className="commentBtns">
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
          <div className="commentBtns">
            {addPending && (
              <div>
                <button type="button" className="cannot click">
                  post
                </button>
                <button type="button" className="cannot click">
                  cancel
                </button>
              </div>
            )}

            {!addPending && commentData.body && (
              <div>
                <button
                  type="button"
                  className="can click"
                  onClick={() => closeModal(false)}
                >
                  cancel
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  type="submit"
                  className="can click"
                >
                  post
                </button>
              </div>
            )}

            {!addPending && !commentData.body && (
              <div>
                <button
                  type="button"
                  className="can click"
                  onClick={() => closeModal(false)}
                >
                  cancel
                </button>
                <button type="button" className="can click">
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
