import { useOutletContext } from "react-router-dom";
import { infiniteQueryOptions, useQuery } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

import PostCard from "./postcard";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userPosts,
    isPending,
    error,
  } = infiniteQueryOptions(getProfilePosts(whoseProfile, user.username));

  return (
    <div className="userPostsDIV">
      {error && (
        <div>
          {" "}
          {error?.notAuth && <div className="centerError">{error.notAuth}</div>}
          {error?.serverError && (
            <div className="centerError">{error.serverError}</div>
          )}
        </div>
      )}
      {isPending && <div>Loading..</div>}
      {userPosts?.pages?.length === 0 && <div>Nothing to see here</div>}
      {userPosts?.pages?.length > 0 &&
        userPosts?.pages?.flatmap((post) => (
          <PostCard post={post} key={post.id} />
        ))}
    </div>
  );
}

export default Overview;
