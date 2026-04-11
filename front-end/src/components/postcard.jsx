import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostOpt } from "./ts-queries/queries";

import MakeAComment from "./makeAComment";

function PostCard({ post }) {
  const { user } = useOutletContext();
  const isThisMyPost = post.username === user.username;

  const [makeAComment, setMakeAComment] = useState(false);
  const [postDotsClicked, setPostDotsClicked] = useState(false);
  const [deletePostClicked, setDeletePostClicked] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  function navToProfile(e) {
    e.stopPropagation();
    nav(`/${post.username}`);
  }

  function openPostSettings(e) {
    e.stopPropagation();
    setPostDotsClicked((prev) => !prev);
  }

  const { mutate: confirmDelete } = useQuery({
    ...deletePostOpt(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
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
              <div>{post.name}</div>
              <div>{post.username}</div>
            </div>

            {isThisMyPost && (
              <>
                {deletePostClicked && (
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
                            setPostDotsClicked(false);
                            setDeletePostClicked(false);
                            confirmDelete();
                          }}
                        >
                          delete
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostDotsClicked(false);
                            setDeletePostClicked(false);
                          }}
                        >
                          cancel
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {postDotsClicked && (
                  <div
                    className="deleteModal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPostDotsClicked(false);
                      setDeletePostClicked(false);
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletePostClicked(true);
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

      {makeAComment && <MakeAComment postToCommentOn={post} />}
    </div>
  );
}

export default PostCard;
