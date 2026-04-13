import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deletePostOpt,
  deleteCommentOpt,
  togglePostLikeOpt,
  toggleCommentLikeOpt,
} from "./ts-queries/queries";
import MakeAComment from "./makeAComment";

function LikedCard({ like }) {
  const { user } = useOutletContext();
  const isPost = like.type === "post";

  const content = isPost ? like.post : like.comment;
  const author = isPost ? content.madeBy : content.commentedBy;
  const isMyContent = author.username === user.username;

  const [makeAComment, setMakeAComment] = useState(false);
  const [dotsClicked, setDotsClicked] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${author.username}`);
  }

  function openSettings(e) {
    e.stopPropagation();
    setDotsClicked(true);
  }

  const { mutate: confirmDelete } = useMutation({
    ...(isPost ? deletePostOpt(content.id) : deleteCommentOpt(content.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
    },
  });

  const { mutate: toggleLike } = useMutation({
    ...(isPost
      ? togglePostLikeOpt(content.id)
      : toggleCommentLikeOpt(content.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  if (isPost) {
    return (
      <div className="renderingPosts">
        <div
          className="postDIV"
          id={content.id}
          key={content.id}
          onClick={(e) => {
            e.stopPropagation();
            nav(`/post/${content.id}`);
          }}
        >
          <div onClick={navToProfile}>
            <img />
          </div>
          <div>
            <div>
              <div>
                <div>{author.name}</div>
                <div>@{author.username}</div>
              </div>

              {isMyContent && (
                <>
                  {deleteClicked && (
                    <div className="confirmDeletePostModal">
                      <div>
                        <div>Delete post?</div>
                        <div>
                          This can't be undone and it will be removed from your
                          profile, the timeline of any accounts that follow you,
                          and from search results.
                        </div>
                        <div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setDotsClicked(false);
                              setDeleteClicked(false);
                              confirmDelete();
                            }}
                          >
                            delete
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setDotsClicked(false);
                              setDeleteClicked(false);
                            }}
                          >
                            cancel
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dotsClicked && (
                    <div className="deleteModal">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDotsClicked(false);
                        }}
                      >
                        edit
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteClicked(true);
                        }}
                      >
                        delete
                      </div>
                    </div>
                  )}
                  <div onClick={openSettings}>...</div>
                </>
              )}
            </div>

            <div>
              <h3>{content.title}</h3>
            </div>
            {content.body && <div>{content.body}</div>}
            {content.img && (
              <div>
                {content.img.map((img, index) => (
                  <img
                    key={index}
                    className="postIMG"
                    src={`http://localhost:5555/IMGS-API/${img}`}
                    alt=""
                  />
                ))}
              </div>
            )}
            <div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike();
                }}
              >
                <img></img>
                <div>{content.likes?.length || 0}</div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setMakeAComment(true);
                }}
              >
                <img></img>
                <div>{content.comments?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {makeAComment && <MakeAComment postToCommentOn={content} />}
      </div>
    );
  } else {
    return (
      <div
        className="commentCard"
        onClick={(e) => {
          e.stopPropagation();
          nav(`/post/${content.post.id}`);
        }}
      >
        <div onClick={navToProfile}>
          <img />
        </div>
        <div>
          <div>
            <div>
              <div>{author.name}</div>
              <div>@{author.username}</div>
            </div>

            {isMyContent && (
              <>
                {deleteClicked && (
                  <div className="confirmDeleteCommentModal">
                    <div>
                      <div>Delete comment?</div>
                      <div>
                        This can't be undone and it will be removed from the
                        post.
                      </div>
                      <div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setDotsClicked(false);
                            setDeleteClicked(false);
                            confirmDelete();
                          }}
                        >
                          delete
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setDotsClicked(false);
                            setDeleteClicked(false);
                          }}
                        >
                          cancel
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {dotsClicked && (
                  <div className="deleteModal">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDotsClicked(false);
                      }}
                    >
                      edit
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteClicked(true);
                      }}
                    >
                      delete
                    </div>
                  </div>
                )}
                <div onClick={openSettings}>...</div>
              </>
            )}
          </div>

          <div>{content.body}</div>

          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
            >
              <img></img>
              <div>{content.likes?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LikedCard;
