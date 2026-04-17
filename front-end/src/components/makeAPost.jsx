import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makePostMut, updatePostMut } from "../ts-queries/queries";

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
      className="make edit APostModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
      }}
    >
      {updateErr && (
        <div onClick={resetUpdate}>
          <div>
            <div>Oops something went wrong</div>
            <div>{updateErr}</div>
          </div>
        </div>
      )}
      {postErr && (
        <div onClick={resetPost}>
          <div>
            <div>Oops something went wrong</div>
            <div>{updateErr}</div>
          </div>
        </div>
      )}
      <form onSubmit={submit}>
        <div>
          <input
            placeholder="Title"
            value={postData.title}
            onChange={(e) => {
              setPostData((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>
        <div>
          <div
            className="stickyorwhatever"
            onClick={(e) => {
              e.target.nextElementSibling.click();
            }}
          >
            add an image
          </div>
          {/* ^^upload image here actually */}
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
        <div>
          <div className="">
            <textarea
              placeholder="got more to say?"
              value={postData.body}
              onChange={(e) =>
                setPostData((prev) => ({ ...prev, body: e.target.value }))
              }
            />
          </div>
          {postData.image.length > 0 && (
            <div className="imgs if any sticky or whatever">
              {postData.image.map((thisImg, index) => {
                return (
                  <div>
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
        {!post && (
          <div>
            {postData.title && (postData.body || postData.image.length > 0) ? (
              <div>
                {postPending && <div className="cannot click">post</div>}
                {!postPending && <button className="can click">post</button>}
              </div>
            ) : (
              <div className="cannot click">post</div>
            )}
          </div>
        )}
        {post && (
          <div>
            {postData.title && (postData.body || postData.image.length > 0) ? (
              <div>
                {updatePending && <div className="cannot click">update</div>}
                {!updatePending && <button className="can click">post</button>}
              </div>
            ) : (
              <div className="cannotPost">post</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default MakeAPost;
