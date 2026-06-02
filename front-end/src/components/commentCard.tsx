import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommentOpt,
  toggleCommentLikeOpt,
  User,
} from "../ts-queries/queries";

import MakeAComment from "./makeAComment";
import TempIcon from "../imgs/cafe.jpeg";

import FilledHeart from "../imgs/filledHeart.png";
import EmptyHeart from "../imgs/emptyHeart.png";

import "../css/comment.css";

function CommentCard({ comment }: any) {
  const { user } = useOutletContext<{ user: User }>();
  const isThisMyComment = comment?.commenter?.username === user.username;

  const [dotsClicked, setDotsClicked] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const [editComment, setEditComment] = useState(false);
  const [deleteCommentClicked, setDeleteCommentClicked] = useState(false);

  const likeStatus = comment?.likes?.some(
    (liker) => liker.userWhoLiked === user.id,
  )
    ? FilledHeart
    : EmptyHeart;

  const queryClient = useQueryClient();

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
        queryKey: ["comment", comment.id],
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
      setDotsClicked(false);
    } else {
      setModalPosition({ x: e.clientX - 140, y: e.clientY - 30 });
      setDotsClicked(comment?.id);
    }
  }

  function closeEditModal() {
    setDotsClicked(false);
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
                <div
                  className="confirmDeleteCommentModal"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteCommentClicked(false);
                  }}
                >
                  <div
                    className="deleteMiniModal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>Delete comment?</div>
                    <div className="dltCantBeUndone">
                      This can't be undone and it will be removed from the post.
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDotsClicked(false);
                          setDeleteCommentClicked(false);
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDotsClicked(false);
                          setDeleteCommentClicked(false);
                          confirmDelete(comment.id);
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {dotsClicked === comment.id && (
                <div
                  className="deleteModalFixed"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDotsClicked(false);
                    setEditComment(false);
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
                        setDotsClicked(false);
                        setEditComment(comment.id);
                      }}
                    >
                      edit
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDotsClicked(false);
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
