import { useState, useEffect } from "react";
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

  const [maxImgTotal, setMaxImgTotal] = useState(false);

  const errModals = document.querySelectorAll(".errorModal");
  errModals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  return (
    <div
      className="make edit post"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      {maxImgTotal && (
        <div className="errorModal">
          <div>
            <div>Max 4 images per post</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMaxImgTotal(false);
              }}
            >
              go back
            </button>
          </div>
        </div>
      )}
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
              {updateErr.message}
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
              {postErr.message}
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
              (postData.body ||
                (postData.image.length > 0 && postData.image.length <= 4)) ? (
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
            className={postData.image.length > 0 ? "bodyText" : "bodyText HALF"}
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
                    <button
                      type="button"
                      onClick={() =>
                        setPostData((prev) => ({
                          ...prev,
                          image: prev.image.filter((img) => img !== thisImg),
                        }))
                      }
                    >
                      X
                    </button>
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
              e.stopPropagation();
              e.target.nextElementSibling.click();
            }}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const imgFiles = Array.from(e.target.files);
              const total = postData.image.length + imgFiles.length;

              if (total > 4) {
                setMaxImgTotal(true);
                return;
              }

              setPostData((prev) => ({
                ...prev,
                image: [...prev.image, ...imgFiles],
              }));
            }}
            className="hidden"
            hidden
          />
        </div>
      </form>
    </div>
  );
}

export default MakeAPost;
