import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { followMutationOptions } from "../ts-queries/queries";

import "../css/miniProfile.css";

function MiniProfile({ userProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const authUser = queryClient.getQueryData([
    "follow",
    user.username,
    "following",
  ]);
  const isFollowing = authUser?.following?.some(
    (user) => user.id === userProfile.id,
  );

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
    },
  });

  return (
    <div className="miniProfileDIV">
      <Link to={`/${userProfile?.username}`} key={userProfile?.id}>
        {" "}
        <img src={userProfile?.profile?.pfp} />
      </Link>
      <div>
        <div>
          <div>{userProfile?.name}</div>
          <div>@{userProfile?.username}</div>
          <div>{userProfile?.profile?.bio}</div>
        </div>
      </div>
      <div>
        {isFollowing ? (
          <button
            className="followButton"
            onClick={() => toggleFollow(userProfile?.id)}
          >
            Following
          </button>
        ) : (
          <button
            className="followButton"
            onClick={() => toggleFollow(userProfile?.id)}
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
}

export default MiniProfile;
