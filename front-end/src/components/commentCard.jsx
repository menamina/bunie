import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentOpt, toggleCommentLikeOpt } from "./ts-queries/queries";

function CommentCard({ comment }) {
  const { user } = useOutletContext();
  const isThisMyComment = comment.commentedBy.username === user.username;

  const [commentDotsClicked, setCommentDotsClicked] = useState(false);
  const [deleteCommentClicked, setDeleteCommentClicked] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${comment.commentedBy.username}`);
  }

  function openCommentSettings(e) {
    e.stopPropagation();
    setCommentDotsClicked((prev) => !prev);
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
              {deleteCommentClicked && (
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
                          setCommentDotsClicked(false);
                          setDeleteCommentClicked(false);
                          confirmDelete();
                        }}
                      >
                        delete
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentDotsClicked(false);
                          setDeleteCommentClicked(false);
                        }}
                      >
                        cancel
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {commentDotsClicked && (
                <div
                  className="deleteModal"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentDotsClicked(false);
                    setDeleteCommentClicked(false);
                  }}
                >
                  <div>edit</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCommentClicked(true);
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
