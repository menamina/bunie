import { useState } from "react";

function MakeAPost({ closeModal }) {
  const [postData, setPostData] = useState({
    title: "",
    body: "",
    img: "",
  });

  function makeAPost(e) {
    e.preventDefault;
  }

  return (
    <div
      className="makeAPostModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
      }}
    >
      <form onSubmit={makeAPost}></form>
    </div>
  );
}

export default MakeAPost;
