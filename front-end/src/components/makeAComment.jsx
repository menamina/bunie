import { useState } from "react";

function MakeAComment({ postToCommentOn, closeModal }) {
  const [commentData, setCommentData] = useState({
    pID: "",
    body: "",
  });

  function makeAComment(e) {
    e.preventDefault;
  }

  return (
    <div
      className="makeACommentModal"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(false);
      }}
    >
      <form onSubmit={makeAComment}></form>
    </div>
  );
}

export default MakeAComment;
