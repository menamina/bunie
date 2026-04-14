import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makePostMut } from "./ts-queries/queries";

function MakeAPost({ closeModal }) {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    images: [],
  });

  const queryClient = useQueryClient();

  const {
    mutate: makeAPost,
    error: postErr,
    isPending: postPending,
    reset: resetPostErr,
  } = useMutation({
    ...makePostMut(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      resetPostErr;
    },
  });

  return (
    <div
      className="makeAPostModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
      }}
    >
      <form onSubmit={makeAPost}>
        <div>
          <input placeholder="Title" />
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
            type="files"
            accept="image/*"
            onChange={(e) => {
              const imgFiles = Array.from(e.target.files);
              setPostData((prev) => ({
                ...prev,
                images: [...prev.images, imgFiles],
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
          {postData.images && (
            <div className="imgs if any sticky or whatever">
              {postData.images.map((thisImg, index) => {
                <div>
                  <div
                    onClick={() =>
                      setPostData((prev) => ({
                        ...prev,
                        images: prev.images.filter((img) => img !== thisImg),
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
                </div>;
              })}
            </div>
          )}
        </div>
        {postData.title && (postData.body || postData.images.length > 0) && (
          <div>
            {postPending && <div className="cannotPost">post</div>}
            {<button className="canPost">post</button>}
          </div>
        )}
        {!postData.title &&
          (!postData.body || postData.images.length === 0) && (
            <div className="cannotPost">post</div>
          )}
        <div
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
            setPostData({
              title: "",
              body: "",
              images: [],
            });
          }}
        >
          cancel
        </div>
      </form>
      {postErr && (
        <div>
          <div>{postErr}</div>
          <div onClick={resetPostErr}>try again</div>
        </div>
      )}
    </div>
  );
}

export default MakeAPost;
