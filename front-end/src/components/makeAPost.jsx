import { useState } from "react";

function MakeAPost() {
  const [postData, setPostData] = useState({
    brand: "",
    product: "",
    category: "",
    price: "",
    img: "",
    status: "",
    backup: "",
    purchaseDate: "",
    rating: "",
    notes: "",
    wouldBuyAgain: "",
  });

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
