import { useQuery } from "@tanstack/react-query";
import { getFollow } from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function Follow({ whoseProfile, view }) {
  const [VIEW, setVIEW] = useState(view);
  const { user } = useOutletContext();

  const {
    data: followData,
    error: followError,
    isPending,
  } = useQuery(getFollow(whoseProfile.username, VIEW));

  const { data: authUserFollowing, error: authUserFollowingErr } = useQuery(
    getFollow(user.username, "following"),
  );

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
              <div key={follower.followerAcc.id}>
                <div>
                  <img src={follower.followerAcc.profile.pfp} />
                  <div>
                    <div>{follower.followerAcc.name}</div>
                    <div>{follower.followerAcc.username}</div>
                  </div>
                </div>
                <div>
                  {authUserFollowing?.fullFollowingList.following.FollowingAcc.has(
                    follower.followerAcc.id && (
                      <div
                        onClick={() => toggleFollow(follower.followerAcc.id)}
                      >
                        Following
                      </div>
                    ),
                  )}
                  {
                    !authUserFollowing?.fullFollowingList.following.FollowingAcc.has(
                      follower.followerAcc.id && (
                        <div
                          onClick={() => toggleFollow(follower.followerAcc.id)}
                        >
                          Follow
                        </div>
                      ),
                    )
                  }
                </div>
              </div>;
            })}
          </div>
        )}
        {VIEW === "following" && (
          <div>
            {followData?.fullFollowingList.following.map((following) => {
              <div key={following.followingAcc.id}>
                <img src={following.followingAcc.profile.pfp} />
                <div>{following.followingAcc.username}</div>
                <div>{following.followingAcc.name}</div>
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Follow;
