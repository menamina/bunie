import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostOpt, togglePostLikeOpt, User } from "../ts-queries/queries";

import MakeAComment from "./makeAComment";
import MakeAPost from "./makeAPost";
import DefaultIcon from "../imgs/default.svg";
import EmptyHeart from "../imgs/emptyHeart.png";
import FilledHeart from "../imgs/filledHeart.png";
import CommentBubble from "../imgs/comment.png";

import "../css/postComment.css";

interface PostCardArgs {
  post: any;
  postOpen: boolean;
}

function PostCard({ post, postOpen = false }: PostCardArgs) {
  const { user } = useOutletContext<{ user: User }>();
  const isThisMyPost = post?.madeby?.username === user.username;

  const [makeAComment, setMakeAComment] = useState(null);
  const [postDotsClicked, setPostDotsClicked] = useState(null);
  const [deletePostClicked, setDeletePostClicked] = useState(null);

  const [editPostClicked, setEditPostClicked] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const likeStatus = post?.likes?.some(
    (liker: any) => liker.userWhoLiked === (user as any).id,
  )
    ? FilledHeart
    : EmptyHeart;

  const [expandIMG, setExpandIMG] = useState(null);

  const nav = useNavigate();
  const { id: postId } = useParams();
  const queryClient = useQueryClient();

  function navToProfile(e: any) {
    e.stopPropagation();
    nav(`/${post?.madeby?.username}`);
  }

  function openPostSettings(e: any) {
    e.stopPropagation();
    if (postDotsClicked) {
      setPostDotsClicked(null);
    } else {
      setModalPosition({ x: e.clientX - 140, y: e.clientY - 30 });
      setPostDotsClicked(post?.id);
    }
  }

  const { mutate: confirmDelete } = useMutation({
    ...deletePostOpt(post?.id),
    onSuccess: () => {
      if (postId) {
        nav("/");
      }

      queryClient.invalidateQueries({
        queryKey: ["profilePosts", user.username],
      });
      queryClient.invalidateQueries({ queryKey: ["mainFeed"] });
    },
  });

  const { mutate: togglePostLike } = useMutation({
    ...togglePostLikeOpt(post?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post?.id] });
      queryClient.invalidateQueries({
        queryKey: ["profilePosts", post?.madeby?.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikes", (user as any).id],
      });
      queryClient.invalidateQueries({ queryKey: ["mainFeed"] });
      queryClient.invalidateQueries({ queryKey: ["following-feed"] });
    },
  });

  function cancelUpdate() {
    setEditPostClicked(false);
    setPostDotsClicked(null);
  }

  return (
    <div className="renderingPosts">
      <div
        className="postDIV"
        id={post?.id}
        key={`${post?.id} postcard`}
        onClick={(e) => {
          e.stopPropagation();
          nav(`/post/${post?.id}`);
        }}
      >
        <div onClick={navToProfile}>
          <img
            className="posterspfp"
            src={
              post?.madeby?.profile?.pfp &&
              post?.madeby?.profile?.pfp !== "default.svg"
                ? `http://localhost:5555/IMGS-API/${post.madeby.profile.pfp}`
                : DefaultIcon
            }
            alt={` ${post?.madeby?.username}'s profile picture`}
          />
        </div>
        <div className="postContent">
          <div>
            <div className="postUserINFO">
              <div>
                <div>{post?.madeby?.name}</div>
                <div className="usernameOfPoster">
                  @{post?.madeby?.username}
                </div>
              </div>

              {isThisMyPost && (
                <>
                  {deletePostClicked === post?.id && (
                    <div
                      className="confirmDeletePostModal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletePostClicked(null);
                      }}
                    >
                      <div
                        className="deleteMiniModal"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>Delete post?</div>
                        <div className="dltCantBeUndone">
                          This can't be undone and it will be removed from your
                          profile, the timeline of any accounts that follow you,
                          and from search results.
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostDotsClicked(null);
                              setDeletePostClicked(null);
                            }}
                          >
                            cancel
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostDotsClicked(null);
                              setDeletePostClicked(null);

                              confirmDelete();
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {postDotsClicked === post.id && (
                    <div
                      className="deleteModalFixed"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPostDotsClicked(null);
                        setEditPostClicked(false);
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
                            setPostDotsClicked(null);
                            setEditPostClicked(post.id);
                          }}
                        >
                          edit
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostDotsClicked(null);
                            setDeletePostClicked(post.id);
                          }}
                        >
                          delete
                        </div>
                      </div>
                    </div>
                  )}
                  <div onClick={openPostSettings} className="postDots">
                    ...
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="postTitle">{post?.title}</div>
          </div>
          {post?.body && (
            <>
              {postOpen === false ? (
                <div>{post?.body.slice(0, 174)}...</div>
              ) : (
                <div>{post?.body}</div>
              )}
            </>
          )}
          {post?.img && (
            <div
              className={
                (post?.img?.length === 1 && "noGrid") ||
                (post?.img?.length === 2 && "twoGrids") ||
                (post?.img?.length === 3 && "threeGrids") ||
                (post?.img?.length === 4 && "fourGrids") ||
                undefined
              }
            >
              {post.img.map((img: any, index: number) => (
                <div
                  className="imgHOLDER"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandIMG(img);
                  }}
                >
                  <img
                    key={index}
                    className="postIMG"
                    src={`http://localhost:5555/IMGS-API/${img}`}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
          <div className="postEngagement">
            <div
              onClick={(e) => {
                e.stopPropagation();
                togglePostLike();
              }}
            >
              <img src={likeStatus} className="engagementIMGS"></img>
              <div>{post?.likes?.length}</div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setMakeAComment(post.id as any);
              }}
            >
              <img src={CommentBubble} className="engagementIMGS"></img>
              <div>{post?.comments?.length}</div>
            </div>
          </div>
        </div>
      </div>

      {expandIMG && (
        <div
          className="expandIMGFixedDiv"
          onClick={(e) => {
            e.stopPropagation();
            setExpandIMG(null);
          }}
        >
          <div className="xPandedIMGHolder">
            <button
              className="closeExpandedImage"
              onClick={(e) => {
                e.stopPropagation();
                setExpandIMG(null);
              }}
            >
              ×
            </button>
            <img
              key={expandIMG}
              className="expandedIMG"
              src={`http://localhost:5555/IMGS-API/${expandIMG}`}
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {makeAComment && (
        <MakeAComment postObj={post} closeModal={setMakeAComment} />
      )}
      {editPostClicked && (
        <MakeAPost post={post} closeModal={cancelUpdate} user={user} />
      )}
    </div>
  );
}

export default PostCard;
