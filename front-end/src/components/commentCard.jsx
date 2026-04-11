import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentOpt, toggleCommentLikeOpt } from "./ts-queries/queries";

function CommentCard({ comment }) {
  const { user } = useOutletContext();
  const isThisMyComment = comment.commentedBy.username === user.username;

  const [commentDotsClicked, setCommentDotsClicked] = useState(null);
  const [deleteCommentClicked, setDeleteCommentClicked] = useState(null);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${comment.commentedBy.username}`);
  }

  function openCommentSettings(e) {
    e.stopPropagation();
    setCommentDotsClicked(comment.id);
  }

  const { mutate: confirmDelete } = useMutation({
    ...deleteCommentOpt(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
  });

  const { mutate: toggleCommentLike } = useMutation({
    ...toggleCommentLikeOpt(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
  });

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
                          setCommentDotsClicked(null);
                          setDeleteCommentClicked(null);
                          confirmDelete();
                        }}
                      >
                        delete
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentDotsClicked(null);
                          setDeleteCommentClicked(null);
                        }}
                      >
                        cancel
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {commentDotsClicked === comment.id && (
                <div className="deleteModal">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentDotsClicked(null);
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
              <div onClick={openCommentSettings}>...</div>
            </>
          )}
        </div>

        <div>{comment.body}</div>

        <div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleCommentLike();
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
