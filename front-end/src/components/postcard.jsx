import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostOpt, togglePostLikeOpt } from "../ts-queries/queries";

import MakeAComment from "./makeAComment";
import MakeAPost from "./makeAPost";
import TempIcon from "../imgs/cafe.jpeg";

import "../css/postComment.css";

function PostCard({ post }) {
  const { user } = useOutletContext();
  const isThisMyPost = post.madeBy.username === user.username;

  const [makeAComment, setMakeAComment] = useState(null);
  const [postDotsClicked, setPostDotsClicked] = useState(null);
  const [deletePostClicked, setDeletePostClicked] = useState(null);

  const [editPostClicked, setEditPostClicked] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${post.madeBy.username}`);
  }

  function openPostSettings(e) {
    e.stopPropagation();
    setPostDotsClicked(post.id);
  }

  const { mutate: confirmDelete } = useMutation({
    ...deletePostOpt(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profilePosts", user.username],
      });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const { mutate: togglePostLike } = useMutation({
    ...togglePostLikeOpt(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  function cancelUpdate() {
    (editPostClicked(null), setPostDotsClicked(false));
  }

  return (
    <div className="renderingPosts">
      <div
        className="postDIV"
        id={post.id}
        key={post.id}
        // onClick={(e) => {
        //   e.stopPropagation();
        //   nav(`/post/${post.id}`);
        // }}
      >
        <div onClick={navToProfile}>
          {/* <img src={`http://localhost:5555/IMGS-API/${post.madeBy.pfp}`} /> */}
          <img src={TempIcon} />
        </div>
        <div>
          <div>
            <div>
              <div>{post.madeBy.name}</div>
              <div>{post.madeBy.username}</div>
            </div>

            {isThisMyPost && (
              <>
                {deletePostClicked === post.id && (
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
                            setPostDotsClicked(null);
                            setDeletePostClicked(null);
                            console.log(
                              "postID:",
                              post.id,
                              "post title:",
                              post.title,
                            );
                            confirmDelete();
                          }}
                        >
                          delete
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostDotsClicked(null);
                            setDeletePostClicked(null);
                          }}
                        >
                          cancel
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {postDotsClicked === post.id && (
                  <div className="deleteModal">
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
                        setDeletePostClicked(post.id);
                      }}
                    >
                      delete
                    </div>
                  </div>
                )}
                <div onClick={openPostSettings}>...</div>
              </>
            )}
          </div>

          <div>
            <div>{post.title}</div>
          </div>
          {post.body && <div>{post.body}</div>}
          {post.img && (
            <div>
              {post.img.map((img, index) => (
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
                togglePostLike();
              }}
            >
              <img></img>
              <div>{post.likes.length}</div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setMakeAComment(true);
              }}
            >
              <img></img>
              <div>{post.comments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {makeAComment && (
        <MakeAComment postToCommentOn={post} closeModal={setMakeAComment} />
      )}
      {editPostClicked && (
        <MakeAPost postToEdit={post} closeModal={cancelUpdate} />
      )}
    </div>
  );
}

export default PostCard;
