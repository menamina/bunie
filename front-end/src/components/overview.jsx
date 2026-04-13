import { useOutletContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userPosts,
    isPending,
    error,
  } = useQuery(getProfilePosts(whoseProfile.username, user));

  if (isPending) {
    return (
      <div>
        <div>Loading</div>
      </div>
    );
  }

  if (error) {
    <div>
      <div>{error}</div>
    </div>;
  }

  return (
    <div className="userPostsDIV">
      {userPosts.thisUsersPosts.length === 0 && <div>Nothing to see here</div>}
      {userPosts.thisUsersPosts.length > 0 &&
        userPosts.thisUsersPosts.map((post) => {
          <PostCard post={post} />;
        })}
    </div>
  );
}

export default Overview;
