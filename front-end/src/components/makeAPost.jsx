import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makePostMut, updatePostMut } from "../ts-queries/queries";
import Picture from "../imgs/uploadPic.svg";

import "../css/nav.css";

function MakeAPost({ closeModal, post = null }) {
  const [postData, setPostData] = useState(
    post
      ? {
          title: post.title,
          body: post.body || "",
          image: post.img || "",
        }
      : {
          title: "",
          body: "",
          image: [],
        },
  );

  const queryClient = useQueryClient();

  const {
    mutate: makeAPost,
    error: postErr,
    isPending: postPending,
    reset: resetPost,
  } = useMutation({
    ...makePostMut(),
    onSuccess: () => {
      closeModal(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const {
    mutate: updatePost,
    error: updateErr,
    isPending: updatePending,
    reset: resetUpdate,
  } = useMutation({
    ...updatePostMut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryFN: ["post", post.id] });
      queryClient.invalidateQueries({
        queryFN: ["profile", post.madeBy.username],
      });
      closeModal(false);
    },
  });

  function submit(e) {
    e.preventDefault();
    post ? updatePost(postData, post.id) : makeAPost(postData);
  }

  return (
    <div
      className="make edit post"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      {updateErr && (
        <div onClick={resetUpdate} className="errorModal">
          <div>
            <div>Oops something went wrong</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetUpdate;
              }}
            >
              {updateErr}
            </button>
          </div>
        </div>
      )}
      {postErr && (
        <div onClick={resetPost} className="errorModal">
          <div>
            <div>Oops something went wrong</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetPost;
              }}
            >
              {postErr}
            </button>
          </div>
        </div>
      )}
      <form
        onClick={(e) => e.stopPropagation()}
        className="makePostForm"
        onSubmit={submit}
      >
        <div>
          {!post && (
            <div className="topOfPostModal">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal(false);
                }}
                className="X"
              >
                X
              </div>
              {postData.title &&
              (postData.body || postData.image.length > 0) ? (
                <div>
                  {postPending && (
                    <button type="button" className="cannot click">
                      Post
                    </button>
                  )}
                  {!postPending && (
                    <button type="submit" className="can click">
                      Post
                    </button>
                  )}
                </div>
              ) : (
                <button type="button" className="cannot click">
                  Post
                </button>
              )}
            </div>
          )}
          {post && (
            <div>
              {postData.title &&
              (postData.body || postData.image.length > 0) ? (
                <div>
                  {updatePending && <div className="cannot click">update</div>}
                  {!updatePending && (
                    <button className="can click">post</button>
                  )}
                </div>
              ) : (
                <div className="cannotPost">post</div>
              )}
            </div>
          )}
        </div>
        <input
          className="title"
          placeholder="Title"
          value={postData.title}
          onChange={(e) => {
            setPostData((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <div className="post-body-imgs">
          <textarea
            className={postData.image.length > 0 ? "bodyText" : "bodyTextHALF"}
            placeholder="got more to say?"
            value={postData.body}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, body: e.target.value }))
            }
          />
          {postData.image.length > 0 && (
            <div className="imgs if any sticky or whatever">
              {postData.image.map((thisImg, index) => {
                return (
                  <div className="postIMGContain">
                    <div
                      onClick={() =>
                        setPostData((prev) => ({
                          ...prev,
                          image: prev.image.filter((img) => img !== thisImg),
                        }))
                      }
                    >
                      X
                    </div>
                    <img
                      className="picToPost"
                      src={URL.createObjectURL(thisImg)}
                      key={index}
                      alt={`image #${thisImg.index}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <img
            src={Picture}
            alt="images upload"
            className="stickyorwhatever"
            onClick={(e) => {
              e.target.nextElementSibling.click();
            }}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const imgFiles = Array.from(e.target.files);
              setPostData((prev) => ({
                ...prev,
                image: [...prev.image, ...imgFiles],
              }));
            }}
            hidden
          />
        </div>
      </form>
    </div>
  );
}

export default MakeAPost;
