import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostMut } from "./ts-queries/queries";

function EditPost({ postToEdit, closeModal, closeDots }) {
  const [postData, setPostData] = useState({
    title: postToEdit?.posts?.title,
    body: postToEdit?.posts?.body ? postToEdit?.posts?.body : "",
    images: postToEdit?.posts?.img ? [postToEdit?.posts?.img] : "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: updatePost,
    error: updateErr,
    isPending: updatePending,
    reset: resetUpdate,
  } = useMutation({
    ...updatePostMut(postData, postToEdit.posts.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryFN: ["post", postToEdit.posts.id] });
      queryClient.invalidateQueries({
        queryFN: ["profile", postToEdit.username],
      });
      closeDots();
    },
  });

  return (
    <div
      className="editPostModal"
      onClick={(e) => {
        e.stopPropagation();
        closeDots();
      }}
    >
      <form onSubmit={updatePost}>
        <div>
          <input
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
        {postData.title && (postData.body || postData.images.length > 0) ? (
          <div>
            {updatePending && <div className="cannotPost">post</div>}
            {!updatePending && <button className="canPost">post</button>}
          </div>
        ) : (
          <div className="cannotPost">post</div>
        )}
        <div
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
        >
          cancel
        </div>
      </form>
      {updateErr && (
        <div>
          <div>{updateErr}</div>
          <div onClick={resetUpdate}>try again</div>
        </div>
      )}
    </div>
  );
}
export default EditPost;
