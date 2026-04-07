import { useState } from "react";

function MakeAPost({ closePostModal }) {
  const [postData, setPostData] = useState({});

  function makeAPost(e) {
    e.preventDefault;
  }

  return (
    <div
      className="makeAPostModal"
      onClick={(e) => {
        e.stopPropagation();
        closePostModal(false);
      }}
    >
      <form onSubmit={makeAPost}></form>
    </div>
  );
}

export default MakeAPost;
