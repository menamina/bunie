import { useState } from "react";

function MakeAComment() {
  const [postData, setPostData] = useState({});

  function makeAComment(e) {
    e.preventDefault;
  }

  return (
    <div className="makeACommentModal">
      <form onSubmit={makeAComment}></form>
    </div>
  );
}

export default MakeAComment;
