import { useState } from "react";

function MakeAPost() {
  const [postData, setPostData] = useState({});

  function makeAPost(e) {
    e.preventDefault;
  }

  return (
    <div className="makeAPostModal">
      <form onSubmit={makeAPost}></form>
    </div>
  );
}

export default MakeAPost;
