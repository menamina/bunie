import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
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

import "../css/profile.css";

import TempHeader from "../imgs/image.jpg";
import TempIcon from "../imgs/cafe.jpeg";

function Profile() {
  const { username } = useParams();
  const { user } = useOutletContext();
  const [view, setView] = useState("overview");
  const queryClient = useQueryClient();

  const nav = useNavigate();

  const {
    data: userProfile,
    isPending,
    error,
  } = useQuery(getProfileQueryOptions(username, user.username));

  const { mutate: toggleFollow } = useMutation({
    ...followMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });

  if (!user) {
    return (
      <div className="errorModal">
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
        {error.notAuth && (
          <div className="errorModal">
            <div>Sorry, you must be logged in to view {username}'s profile</div>
            <Link to="/">login or sign up here</Link>
          </div>
        )}
        {error.noProfileFound && (
          <div className="errorModal">
            Error loading profile: {error.noProfileFound}
          </div>
        )}
        {error.serverError && (
          <div className="errorModal">
            Error loading profile: {error.serverError}
          </div>
        )}
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
      <div className="headerDIV">
        <img
          className="headerIMG"
          src={userProfile?.profile?.header || TempHeader}
          alt={`header for ${userProfile?.username}`}
        />
      </div>

      <div className="z-index user content">
        <div className="userINFO">
          <div>
            <img
              src={userProfile?.profile?.pfp || TempIcon}
              alt={`pfp for ${userProfile?.username}`}
            ></img>
          </div>
          <div className="userContent">
            <div className="username follow-info">
              <div className="username-name">
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

            <div className="editAcc togglefollow">
              {/* follow / unfollow */}
              {user?.username === username && (
                <button
                  type="button"
                  className="goToSettings"
                  onClick={(e) => {
                    e.stopPropagation();
                    nav("/settings");
                  }}
                >
                  Edit Profile
                </button>
              )}
              {user.username !== username &&
                (userProfile.followers.has(user.id) ? (
                  <button
                    type="button"
                    className="followBTN unfollow"
                    onClick={() => unfollow(userProfile.id)}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    type="button"
                    className="followBTN follow"
                    onClick={() => follow(userProfile.id)}
                  >
                    Follow
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="opts-rendering mobile">
          <div onClick={() => setView("overview")}>Overview</div>
          <div onClick={() => setView("inventory")}>Inventory</div>
        </div>

        {/* MEDIA QUERIES HERE FOR CONDENSED MOBILE VIEW VS DESKTOP */}
        <div className="opts-rendering desktop">
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
    </div>
  );
}

export default Profile;
