import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import {
  followMutationOptions,
  getMiniProfileOpts,
} from "../ts-queries/queries";

import "../css/miniProfile.css";

function MiniProfile({ userProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  console.log("Profile data:", userProfile);
  console.log("Profile PFP:", userProfile.profile?.pfp);

  const { data: authUserFollowing } = useQuery(
    getMiniProfileOpts(user.username, "following"),
  );

  const isFollowing = authUserFollowing?.fullFollowingList?.followings?.some(
    (f) => f.followingAcc.id === userProfile.id,
  );

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["miniProfile", user.username, "following"],
      });
    },
  });

  return (
    <div className="miniProfileDIV">
      <div>
        <Link to={`/${userProfile?.username}`} key={userProfile?.id}>
          {" "}
          <img
            className="miniProfilePfp"
            src={`http://localhost:5555/IMGS-API/${userProfile?.profile?.pfp}`}
            alt={`${userProfile?.username}'s profile`}
          />
        </Link>
        <div>
          <div>
            <div>{userProfile?.name}</div>
            <div>@{userProfile?.username}</div>
            <div>{userProfile?.profile?.bio}</div>
          </div>
        </div>
      </div>
      <div>
        {isFollowing ? (
          <button
            className="followButton unfollowMini"
            onClick={() => toggleFollow(userProfile?.id)}
          >
            Following
          </button>
        ) : (
          <button
            className="followButton followMini"
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
