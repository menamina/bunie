import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMiniProfile, followMutationOptions } from "../ts-queries/queries";
import { useOutletContext, Link } from "react-router-dom";
import { useState } from "react";

function Follow({ whoseProfile, view }) {
  const [VIEW, setVIEW] = useState(view);
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const {
    data: followData,
    error: followError,
    isPending,
  } = useQuery(getMiniProfile(whoseProfile.username, VIEW));

  const { data: authUserFollowing } = useQuery(
    getMiniProfile(user.username, "following"),
  );

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", whoseProfile.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["follow"],
      });
    },
  });

  return (
    <div className="followDIV">
      <div className="followSelection">
        <div
          onClick={() => setVIEW("followers")}
          className={
            VIEW === "followers" ? "selectedView follow" : "notSelected follow"
          }
        >
          Followers
        </div>
        <div
          onClick={() => setVIEW("following")}
          className={
            VIEW === "following" ? "selectedView follow" : "notSelected follow"
          }
        >
          Following
        </div>
      </div>
      {isPending && <div>loading..</div>}
      {followError && <div>{followError}</div>}
      <div className="followDataDIV">
        {VIEW === "followers" && (
          <div>
            {followData?.fullFollowerList.followers.map((follower) => {
              const isFollowing =
                authUserFollowing?.fullFollowingList?.following.some(
                  (f) => f.followingAcc.id === follower.followerAcc.id,
                );

              return (
                <Link
                  to={`/${follower.followerAcc.username}`}
                  key={follower.followerAcc.id}
                >
                  <div>
                    <img src={follower.followerAcc.profile.pfp} />
                    <div>
                      <div>{follower.followerAcc.name}</div>
                      <div>{follower.followerAcc.username}</div>
                    </div>
                  </div>
                  <div>
                    {isFollowing ? (
                      <div
                        onClick={() => toggleFollow(follower.followerAcc.id)}
                      >
                        Following
                      </div>
                    ) : (
                      <div
                        onClick={() => toggleFollow(follower.followerAcc.id)}
                      >
                        Follow
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {VIEW === "following" && (
          <div>
            {followData?.fullFollowingList.following.map((following) => {
              const isFollowing =
                authUserFollowing?.fullFollowingList?.following.some(
                  (f) => f.followingAcc.id === following.followingAcc.id,
                );

              return (
                <Link
                  to={`/${following.followingAcc.username}`}
                  key={following.followingAcc.id}
                >
                  <div>
                    <img src={following.followingAcc.profile.pfp} />
                    <div>
                      <div>{following.followingAcc.name}</div>
                      <div>{following.followingAcc.username}</div>
                    </div>
                  </div>
                  <div>
                    {isFollowing ? (
                      <div
                        onClick={() => toggleFollow(following.followingAcc.id)}
                      >
                        Following
                      </div>
                    ) : (
                      <div
                        onClick={() => toggleFollow(following.followingAcc.id)}
                      >
                        Follow
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Follow;
