import { useState, useOutletContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfileQueryOptions,
  followMutationOptions,
} from "../ts-queries/queries";

import Overview from "./overview";
import Likes from "./likes";
import Follow from "./follow";
import SelectedView from "./selectedView";

function Profile() {
  const { username } = useParams();
  const { user } = useOutletContext();
  const [view, setView] = useState("overview");
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isPending,
    error,
  } = useQuery(getProfileQueryOptions(username, user));

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });

  if (!user) {
    return (
      <div>
        <div>Sorry, you must be logged in to view {username}'s profile</div>
        <Link to="/">login or sign up here</Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <div>Loading {username}'s profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>Error loading profile: {error.message}</div>
      </div>
    );
  }

  function follow(idToFollow) {
    toggleFollow(idToFollow);
  }

  function unfollow(idToUnfollow) {
    toggleFollow(idToUnfollow);
  }

  return (
    <div className="profileDIV">
      {/* div below will stretch view heighgt view width for header */}
      <div className="headerDIV">
        <div classname="headerDIV">
          <img
            className="header"
            src={userProfile?.profile?.header || ""}
            alt={`header for ${userProfile?.username}`}
          ></img>
        </div>
        <div className="whiteSpace"></div>
      </div>
      {/* div below will be a position absolute and cover header a bit and also be not fulll vh vw */}
      <div className="userINFO">
        <div>
          <img
            src={userProfile?.profile?.pfp || ""}
            alt={`pfp for ${userProfile?.username}`}
          ></img>
        </div>
        <div>
          <div>
            <div className="">
              <div>{userProfile?.name}</div>
              <div>@{userProfile?.username}</div>
            </div>
            <div>
              <div>{userProfile?.profile?.bio}</div>
            </div>
            <div>
              <div className="following" onClick={() => setView("following")}>
                {userProfile?.following?.length || 0} following
              </div>
              <div className="followers" onClick={() => setView("followers")}>
                {userProfile?.followers?.length || 0} followers
              </div>
            </div>
          </div>

          <div>
            {/* follow / unfollow */}
            {user?.username === username && (
              <Link to="/settings">Edit Profile</Link>
            )}
            {user.username !== username && (
              <div>
                {userProfile.followers.has(user.id) ? (
                  <div onClick={() => unfollow(userProfile.id)}>Unfollow</div>
                ) : (
                  <div onClick={() => follow(userProfile.id)}>Follow</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="opts-rendering">
        <div onClick={() => setView("overview")}>Overview</div>
        <div onClick={() => setView("inventory")}>Inventory</div>
        <div onClick={() => setView("inprogress")}>In Progress</div>
        <div onClick={() => setView("limbo")}>Limbo</div>
        <div onClick={() => setView("decluttered")}>Decluttered</div>
        <div onClick={() => setView("finished")}>Finished</div>
        <div onClick={() => setView("likes")}>Likes</div>
      </div>

      {/* render comps below w fetch to diff api */}
      <div className="renderViewHere">
        {view === "overview" && <Overview whoseProfile={username} />}
        {view === "inventory" && (
          <SelectedView view="inventory" whoseProfile={username} />
        )}
        {view === "inprogress" && (
          <SelectedView view="inprogress" whoseProfile={username} />
        )}
        {view === "limbo" && (
          <SelectedView view="limbo" whoseProfile={username} />
        )}
        {view === "decluttered" && (
          <SelectedView view="decluttered" whoseProfile={username} />
        )}
        {view === "finished" && (
          <SelectedView view="finished" whoseProfile={username} />
        )}
        {view === "likes" && <Likes whoseProfile={username} />}
        {view === "followers" && (
          <Follow whoseProfile={username} view="followers" />
        )}
        {view === "following" && (
          <Follow whoseProfile={username} view="following" />
        )}
      </div>
    </div>
  );
}

export default Profile;
