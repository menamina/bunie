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
    error.notAuth ? <div> {error.notAuth}</div> : null;
  }

  return (
    <div className="userPostsDIV">
      {error && (
        <div>{error?.serverError && <div>{error.serverError}</div>}</div>
      )}
      {error?.zeroposts && <div>{error.zeroposts}</div>}
      {userPosts?.length > 0 &&
        userPosts?.map((post) => <PostCard post={post} />)}
    </div>
  );
}

export default Overview;
