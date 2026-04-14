import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostOpt, togglePostLikeOpt } from "./ts-queries/queries";

import MakeAComment from "./makeAComment";

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
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
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

  return (
    <div className="renderingPosts">
      <div
        className="postDIV"
        id={post.id}
        key={post.id}
        onClick={(e) => {
          e.stopPropagation();
          nav(`/post/${post.id}`);
        }}
      >
        <div onClick={navToProfile}>
          <img />
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
                        setEditPostClicked(true);
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
            <h3>{post.posts.title}</h3>
          </div>
          {post.posts.body && <div>{post.posts.body}</div>}
          {post.posts.img && (
            <div>
              {post.posts.img.map((img, index) => (
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
              <div>{post.posts.likes.length}</div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setMakeAComment(true);
              }}
            >
              <img></img>
              <div>{post.posts.comments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {makeAComment && (
        <MakeAComment postToCommentOn={post} closeModal={setMakeAComment} />
      )}
      {editPostClicked && (
        <EditPost
          postToEdit={post}
          closeModal={setEditPostClicked}
          closeDots={setPostDotsClicked}
        />
      )}
    </div>
  );
}

export default PostCard;
