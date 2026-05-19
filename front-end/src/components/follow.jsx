import { useQuery } from "@tanstack/react-query";
import { getMiniProfileOpts } from "../ts-queries/queries";
import MiniProfile from "./miniProfile";

function Follow({ whoseProfile, view }) {
  const {
    data: followData,
    error: followError,
    isPending,
  } = useQuery(getMiniProfileOpts(whoseProfile.username, view));

  return (
    <div className="followDIV">
      {isPending && <div>loading..</div>}
      {followError && <div>{followError?.errors}</div>}
      <div className="followDataDIV">
        {view === "followers" && (
          <div>
            {followData?.followers && followData.followers.length > 0 ? (
              followData.followers.map((follower) => (
                <MiniProfile
                  key={follower.followerAcc.id}
                  userProfile={follower.followerAcc}
                />
              ))
            ) : (
              <div>No followers yet</div>
            )}
          </div>
        )}
        {view === "following" && (
          <div>
            {followData?.followings?.length > 0 ? (
              followData?.followings?.map((following) => (
                <MiniProfile
                  key={following.followingAcc?.id}
                  userProfile={following.followingAcc}
                />
              ))
            ) : (
              <div>Not following anyone yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Follow;
