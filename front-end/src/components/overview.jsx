import { useOutletContext } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

import PostCard from "./postcard";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userPosts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    ...getProfilePosts(whoseProfile, user.username),
    onSuccess: () => {
      console.log("gathered", whoseProfile, "posts");
    },
  });

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
        userPosts?.pages?.flatMap((post) => (
          <PostCard post={post} key={post.id} />
        ))}
    </div>
  );
}

export default Overview;
