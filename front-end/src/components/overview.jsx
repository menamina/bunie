import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

import PostCard from "./postcard";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userPosts,
    isPending,
    error,
  } = useQuery(getProfilePosts(whoseProfile, user.username));

  if (isPending) {
    return (
      <div>
        <div>Loading</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userPostsDIV">
        {error?.notAuth && <div>{error.notAuth}</div>}
        {error?.serverError && <div>{error.serverError}</div>}
        {error?.zeroposts && <div>Nothing to see here</div>}
      </div>
    );
  }

  return (
    <div className="userPostsDIV">
      {userPosts?.length > 0 &&
        userPosts?.map((post) => <PostCard post={post} key={post.id} />)}
    </div>
  );
}

export default Overview;
