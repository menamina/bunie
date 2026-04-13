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
        </div>
        <div>
          <div className="">
            <textarea
              placeholder="got more to say?"
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
      </form>
    </div>
  );
}

export default MakeAPost;
