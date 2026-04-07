import { useState, useOutletContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

function PostCard({ post }) {
  const { user } = useOutletContext();
  const isThisPostAnotherUsers = post.username === user.username;
  const [postDotsClicked, setPostDotsClicked] = useState(false)
  const [deletePostClicked, setDeletePostClicked] = useState(false)

  function navToProfile(){

  }

  function openPostSettings(){

  }

  return (
    <div className="renderingPosts">
      {isThisPostAnotherUsers && (
        <div className="postDIV" id={post.id} key={post.id}>
          <div onClick={navToProfile}>
            <img />
          </div>
          <div>
            <div>
              <div>{post.name}</div>
              <div>{post.username}</div>
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
          </div>

           {!isThisPostAnotherUsers && (
        <div className="postDIV" id={post.id} key={post.id}>
          <div onClick={navToProfile}>
            <img />
          </div>
          <div>
            <div>
                <div>
              <div>{post.name}</div>
              <div>{post.username}</div>
              </div>
              <div onClick={openPostSettings}>...</div>
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
          </div>
        </div>
      )}
    </div>
  );
}
