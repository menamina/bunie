import { useState, useOutletContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileQueryOptions } from "./ts-queries/queries";

function Profile() {
  const { username } = useParams();
  const { user } = useOutletContext();
  const [view, setView] = useState("overview");

  const {
    data: userProfile,
    isPending,
    error,
  } = useQuery(getProfileQueryOptions(username, user));

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

  return (
    <div className="profileDIV">
      {/* div below will stretch view heighgt view width for header */}
      <div className="headerDIV">
        <div classname="headerDIV">
          <img
            className="header"
            src={userProfile?.header || ""}
            alt={`header for ${userProfile?.username}`}
          ></img>
        </div>
        <div className="whiteSpace"></div>
      </div>
      {/* div below will be a position absolute and cover header a bit and also be not fulll vh vw */}
      <div className="userINFO">
        <div>
          <img
            src={userProfile?.pfp || ""}
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
              <div>{userProfile?.bio}</div>
            </div>
          </div>
          <div>
            {/* follow / unfollow */}
            {user?.username === username ? (
              <Link to="/settings">Edit Profile</Link>
            ) : (
              <div>Follow</div>
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
        {view === "overview" && <Overview whoseProfile={userProfile} />}
        {view === "inventory" && <Inventory whoseProfile={userProfile} />}
        {view === "inprogress" && <InProgress whoseProfile={userProfile} />}
        {view === "limbo" && <Limbo whoseProfile={userProfile} />}
        {view === "decluttered" && <Decluttered whoseProfile={userProfile} />}
        {view === "finished" && <Finished whoseProfile={userProfile} />}
        {view === "likes" && <Likes whoseProfile={userProfile} />}
        {view === "followers" && <Followers whoseProfile={userProfile} />}
        {view === "following" && <Following whoseProfile={userProfile} />}
      </div>
    </div>
  );
}

export default Profile;
