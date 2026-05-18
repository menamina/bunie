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

  console.log("Auth user following data:", authUserFollowing);
  console.log("Checking if following user:", userProfile.id);

  const isFollowing = authUserFollowing?.followings?.some(
    (f) => f.followingAcc.id === userProfile.id,
  );

  const isOwnProfile = user.id === userProfile.id;

  console.log("Is following:", isFollowing);
  console.log("Is own profile:", isOwnProfile);

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onMutate: (userID) => {
      console.log("About to toggle follow for user ID:", userID);
      console.log("Current user (me):", user.id, user.username);
      console.log("Target user:", userProfile.id, userProfile.username);
    },
    onSuccess: (data) => {
      console.log("Follow toggle success! Response:", data);
      queryClient.invalidateQueries({
        queryKey: ["miniProfile", user.username, "following"],
      });
      console.log("Invalidated queries for:", user.username);
    },
    onError: (error) => {
      console.error("Follow toggle failed:", error);
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
        {!isOwnProfile && (
          <>
            {isFollowing ? (
              <button
                className="followButton unfollowMini"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFollow(userProfile?.id);
                }}
              >
                Following
              </button>
            ) : (
              <button
                className="followButton followMini"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFollow(userProfile?.id);
                }}
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MiniProfile;
