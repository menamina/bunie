import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import {
  followMutationOptions,
  getMiniProfileOpts,
  User,
} from "../ts-queries/queries";

import DefaultIcon from "../imgs/default.svg";
import "../css/miniProfile.css";

function MiniProfile({ userProfile }: { userProfile: any }) {
  const { user } = useOutletContext<{ user: User }>();
  const queryClient = useQueryClient();

  const { data: authUserFollowing } = useQuery(
    getMiniProfileOpts(user.username, "following"),
  );

  const isFollowing = authUserFollowing?.followings?.some(
    (f: any) => f.followingAcc.id === userProfile.id,
  );

  const isOwnProfile = (user as any).id === userProfile.id;

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["miniProfile", user.username, "following"],
      });
      queryClient.invalidateQueries({
        queryKey: ["miniProfile", user.username, "followers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", user.username],
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
            src={
              userProfile?.profile?.pfp &&
              userProfile.profile.pfp !== "default.svg"
                ? `http://localhost:5555/IMGS-API/${userProfile.profile.pfp}`
                : DefaultIcon
            }
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
