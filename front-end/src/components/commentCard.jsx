import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentOpt, toggleCommentLikeOpt } from "../ts-queries/queries";
import MakeAComment from "./makeAComment";

function CommentCard({ comment }) {
  const { user } = useOutletContext();
  const isThisMyComment = comment.commentedBy.username === user.username;

  const [dotsClicked, setDotsClicked] = useState(null);

  const [editComment, setEditComment] = useState(null);
  const [deleteCommentClicked, setDeleteCommentClicked] = useState(null);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${comment.commentedBy.username}`);
  }

  const { mutate: confirmDelete } = useMutation({
    ...deleteCommentOpt(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", comment.idOfPost] });
    },
  });

  const { mutate: toggleCommentLike } = useMutation({
    ...toggleCommentLikeOpt(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  function closeEditModal() {
    setDotsClicked(null);
    setEditComment(false);
  }

  return (
    <div className="commentCard">
      <div onClick={navToProfile}>
        <img />
      </div>
      <div>
        <div>
          <div>
            <div>{comment.commentedBy.name}</div>
            <div>@{comment.commentedBy.username}</div>
          </div>

          {isThisMyComment && (
            <>
              {editComment && (
                <MakeAComment
                  postToCommentOn={comment.idOfPost}
                  closeModal={closeEditModal}
                  edit={true}
                  comment={comment}
                />
              )}
              {deleteCommentClicked === comment.id && (
                <div className="confirmDeleteCommentModal">
                  <div>
                    <div>Delete comment?</div>
                    <div>
                      This can't be undone and it will be removed from the post.
                    </div>
                    <div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteCommentClicked(null);
                          confirmDelete(comment.id);
                        }}
                      >
                        delete
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDotsClicked(null);
                        }}
                      >
                        cancel
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {dotsClicked === comment.id && (
                <div
                  className="optionsModal"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDotsClicked(null);
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditComment(comment.id);
                    }}
                  >
                    edit
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCommentClicked(comment.id);
                    }}
                  >
                    delete
                  </div>
                </div>
              )}
              <div onClick={() => setDotsClicked(comment.id)}>...</div>
            </>
          )}
        </div>

        <div>{comment.body}</div>

        <div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleCommentLike(comment.id);
            }}
          >
            <img></img>
            <div>{comment.likes?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
