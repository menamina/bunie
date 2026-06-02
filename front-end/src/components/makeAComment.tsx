import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  makeCommentMut,
  updateCommentMut,
  getPostOpt,
  User,
} from "../ts-queries/queries";
import PostCard from "./postcard";
import "../css/comment.css";
import TempIcon from "../imgs/cafe.jpeg";

interface CommentArgs {
  closeModal: any;
  postObj?: any;
  edit?: boolean;
  comment?: any;
  postToCommentOn?: any;
}

function MakeAComment({
  closeModal,
  postObj = null,
  postToCommentOn = null,
  edit = false,
  comment = null,
}: CommentArgs) {
  const actualPost = postObj || postToCommentOn;
  const { user } = useOutletContext<{ user: User }>();

  const [commentData, setCommentData] = useState<any>(
    edit
      ? {
          id: comment?.id,
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
      queryClient.invalidateQueries({ queryKey: ["post", postID] });
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

  function closeStop(e: any) {
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
      {(fetchErr as any)?.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>Oops something went wrong fetching the post</div>
            <div onClick={() => refetchPost()}>try again</div>
          </div>
        </div>
      )}
      {(fetchErr as any)?.postNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{(fetchErr as any)?.postNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {(updateErr as any)?.commentNotFound && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{(updateErr as any)?.commentNotFound}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {(addErr as any)?.postNotExisting && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{(addErr as any)?.postNotExisting}</div>
            <div onClick={() => closeModal(false)}>ok</div>
          </div>
        </div>
      )}
      {(addErr as any)?.serverError && (
        <div className="errorModal" onClick={closeStop}>
          <div>
            <div>{(addErr as any)?.serverError}</div>
            <div>
              <div onClick={() => closeModal(false)}>cancel</div>
              <div onClick={() => makeAComment(commentData)}>try again</div>
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
          {!edit && <PostCard post={postObj} postOpen={false} />}
          {edit && <PostCard post={fetchedPost} postOpen={false} />}
          {edit && isLoading && <div>Loading..</div>}
        </div>
        <div className="yourReply" onClick={(e) => e.stopPropagation()}>
          <div>
            <img
              src={`http://localhost:5555/IMGS-API/${(user as any).pfp}`}
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
