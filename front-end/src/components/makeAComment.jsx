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
    reset: resetFetch,
  } = useQuery({
    ...getPostOpt(comment?.idOfPost),
    enabled: edit && !postObj,
  });

  const {
    mutate: makeAComment,
    reset: resetAddComment,
    isPending: addPending,
    error: addErr,
  } = useMutation({
    ...makeCommentMut(commentData),
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
    reset: resetUpdate,
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

  return (
    <div
      className="makeACommentModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      {fetchErr && (
        <div>
          <div>Oops something went wrong</div>
          <div onClick={resetFetch}>{fetchErr}</div>
        </div>
      )}
      {updateErr && (
        <div>
          <div>Oops something went wrong</div>
          <div onClick={resetUpdate}>{fetchErr}</div>
        </div>
      )}
      {addErr && (
        <div>
          <div>Oops something went wrong</div>
          <div onClick={resetAddComment}>{addErr}</div>
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
                <div className="can click" onClick={closeModal}>
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
                <button type="submit" className="can click">
                  post
                </button>
                <div className="can click" onClick={closeModal}>
                  cancel
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default MakeAComment;
