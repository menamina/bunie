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

import DefaultIcon from "../imgs/default.svg";

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

  function follow(idToFollow) {
    toggleFollow(idToFollow);
  }

  function unfollow(idToUnfollow) {
    toggleFollow(idToUnfollow);
  }

  return (
    <div className="profileDIV">
      {isPending && (
        <div className="pendingLoadingDiv">
          <div>loading</div>
        </div>
      )}

      {error?.notAuth && (
        <div className="pendingLoadingDiv">
          <div>Sorry, you must be logged in to view {username}'s profile</div>
          <Link to="/">login or sign up here</Link>
        </div>
      )}
      {error?.noUserFound && (
        <div className="pendingLoadingDiv">
          Error loading profile: {error.noUserFound} &#9785;
        </div>
      )}
      {error?.serverError && (
        <div className="pendingLoadingDiv">
          Error loading profile: {error.serverError} &#9785;
        </div>
      )}

      {!isPending && !error && (
        <>
          <div className="headerDIV">
            {userProfile?.profile?.header &&
            userProfile.profile.header !== "white" ? (
              <img
                className="headerIMG"
                src={`http://localhost:5555/IMGS-API/${userProfile.profile.header}`}
                alt={`header for ${userProfile?.username}`}
              />
            ) : (
              <div
                className="headerIMG"
                style={{ backgroundColor: "white" }}
              ></div>
            )}
          </div>

          <div className="z-index user content">
            <div className="userINFO">
              <div>
                <img
                  src={
                    userProfile?.profile?.pfp &&
                    userProfile.profile.pfp !== "default.svg"
                      ? `http://localhost:5555/IMGS-API/${userProfile.profile.pfp}`
                      : DefaultIcon
                  }
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
                    <div
                      className="following"
                      onClick={() => setView("following")}
                    >
                      {userProfile?.followings?.length} following
                    </div>
                    <div
                      className="followers"
                      onClick={() => setView("followers")}
                    >
                      {userProfile?.followers?.length} followers
                    </div>
                  </div>
                </div>

                <div className="editAcc togglefollow">
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
                    (userProfile?.followers?.some(
                      (f) => f.follower === user.id,
                    ) ? (
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

            <div className="opts-rendering desktop">
              <div
                className={
                  view === "overview" ? "selectedViewUnderLine" : "notselected"
                }
                onClick={() => setView("overview")}
              >
                Overview
              </div>
              <div
                className={
                  view === "inventory" ? "selectedViewUnderLine" : "notselected"
                }
                onClick={() => setView("inventory")}
              >
                Inventory
              </div>
              <div
                className={
                  view === "inprogress"
                    ? "selectedViewUnderLine"
                    : "notselected"
                }
                onClick={() => setView("inprogress")}
              >
                In Progress
              </div>
              <div
                className={
                  view === "limbo" ? "selectedViewUnderLine" : "notselected"
                }
                onClick={() => setView("limbo")}
              >
                Limbo
              </div>
              <div
                className={
                  view === "decluttered"
                    ? "selectedViewUnderLine"
                    : "notselected"
                }
                onClick={() => setView("decluttered")}
              >
                Decluttered
              </div>
              <div
                className={
                  view === "finished" ? "selectedViewUnderLine" : "notselected"
                }
                onClick={() => setView("finished")}
              >
                Finished
              </div>
              <div
                className={
                  view === "likes" ? "selectedViewUnderLine" : "notselected"
                }
                onClick={() => setView("likes")}
              >
                Likes
              </div>
            </div>
          </div>
          <div
            className={
              view === "overview" || view === "likes"
                ? "renderViewHere-flex"
                : "renderViewHere-grid"
            }
          >
            {view === "overview" && <Overview whoseProfile={username} />}
            {view === "inventory" && (
              <SelectedView view={"inventory"} whoseProfile={username} />
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
            {view === "likes" && <Likes whoseProfile={userProfile?.id} />}
            {view === "followers" && (
              <Follow whoseProfile={username} view="followers" />
            )}
            {view === "following" && (
              <Follow whoseProfile={username} view="following" />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
