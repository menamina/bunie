import { useState } from "react";

function MakeAPost({ closeModal }) {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    img: "",
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
          <div className="stickyorwhatever">add an image</div>
          <input
            type="files"
            accept="image/*"
            onChange={(e) => {
              const imgFiles = Array.from(e.target.files);
              setPostData((prev) => ({
                ...prev,
                img: [...prev.img, imgFiles],
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
          {postData.img && (
            <div className="imgs if any sticky or whatever">
              {postData.img.map((thisImg, index) => {
                <div>
                  <div
                    onClick={() =>
                      setPostData((prev) => ({
                        ...prev,
                        img: prev.img.filter((img) => img !== thisImg),
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
        <div>post</div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
        >
          cancel
        </div>
      </form>
    </div>
  );
}

export default MakeAPost;
