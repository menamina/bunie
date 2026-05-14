import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentOpt, toggleCommentLikeOpt } from "../ts-queries/queries";

import MakeAComment from "./makeAComment";
import TempIcon from "../imgs/cafe.jpeg";

import FilledHeart from "../imgs/filledHeart.png";
import EmptyHeart from "../imgs/emptyHeart.png";

import "../css/comment.css";

function CommentCard({ comment }) {
  const { user } = useOutletContext();
  const isThisMyComment = comment?.commenter?.username === user.username;

  const [dotsClicked, setDotsClicked] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const [editComment, setEditComment] = useState(null);
  const [deleteCommentClicked, setDeleteCommentClicked] = useState(null);

  const likeStatus = comment?.likes?.some(
    (liker) => liker.userWhoLiked === user.id,
  )
    ? FilledHeart
    : EmptyHeart;

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${comment?.commenter?.username}`);
  }

  const { mutate: confirmDelete } = useMutation({
    ...deleteCommentOpt(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", comment.idOfPost],
      });
    },
  });

  const { mutate: toggleCommentLike } = useMutation({
    ...toggleCommentLikeOpt(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment", returnedComment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", comment.idOfPost],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikes", user.username],
      });
    },
  });

  function openCommentSettings(e) {
    e.stopPropagation();
    if (dotsClicked) {
      setDotsClicked(null);
    } else {
      setModalPosition({ x: e.clientX - 140, y: e.clientY - 30 });
      setDotsClicked(comment?.id);
    }
  }

  function closeEditModal() {
    setDotsClicked(null);
    setEditComment(false);
  }

  return (
    <div className="commentCard">
      <div>
        <img src={TempIcon} />
      </div>
      <div>
        <div>
          <div>
            <div>{comment?.commenter?.name}</div>
            <div>@{comment?.commenter?.username}</div>
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
                          confirmDelete();
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
                  className="deleteModalFixed"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDotsClicked(null);
                    setEditComment(null);
                  }}
                >
                  <div
                    className="deleteModal"
                    style={{
                      left: `${modalPosition.x}px`,
                      top: `${modalPosition.y}px`,
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDotsClicked(null);
                        setEditComment(comment.id);
                      }}
                    >
                      edit
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDotsClicked(null);
                        setDeleteCommentClicked(comment.id);
                      }}
                    >
                      delete
                    </div>
                  </div>
                </div>
              )}
              <div onClick={openCommentSettings} className="postDots">
                ...
              </div>
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
            <img src={likeStatus}></img>
            <div>{comment?.likes?.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
