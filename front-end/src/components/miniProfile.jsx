import { useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";

function MiniProfile({ userProfile }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const authUser = queryClient.getQueryData(["profile", user.username]);
  const isFollowing = authUser.following.some(
    (user) => user.id === userProfile.id,
  );

  return (
    <div className="miniProfileDIV">
      <Link to={`/${userProfile?.username}`} key={userProfile?.id}>
        <div>
          <img src={userProfile?.profile.pfp} />
          <div>
            <div>{userProfile?.name}</div>
            <div>{userProfile?.username}</div>
          </div>
        </div>
        <div>
          {isFollowing ? (
            <div onClick={() => toggleFollow(userProfile?.id)}>Following</div>
          ) : (
            <div onClick={() => toggleFollow(userProfile?.id)}>Follow</div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default MiniProfile;
