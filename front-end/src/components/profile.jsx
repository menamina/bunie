import { useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const { username } = useParams();

  const [view, setView] = useState("overview");
  const [isLoggedInUser, setIsLoggedInUserProf] = useState(null);

  return (
    <div className="profileDIV">
      {/* div below will stretch view heighgt view width for header */}
      <div className="headerDIV">
        <div classname="headerDIV">
          <img className="header" src="" alt="header for.."></img>
        </div>
        <div className="whiteSpace"></div>
      </div>
      {/* div below will be a position absolute and cover header a bit and also be not fulll vh vw */}
      <div className="userINFO">
        <div>
          <img src="" alt="pfp for.."></img>
        </div>
        <div>
          <div>
            <div className="">
              <div>name</div>
              <div>username</div>
            </div>
            <div>
              <div>bio</div>
            </div>
          </div>
          <div>
            {/* follow / unfollow */}
            {/* edit prof if u */}
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

      <div className="renderViewHere">
        {view === "overview" && <div>Overview</div>}
        {view === "inventory" && <div>Inventory</div>}
        {view === "inprogress" && <div>In Progress</div>}
        {view === "limbo" && <div>Limbo</div>}
        {view === "decluttered" && <div>Decluttered</div>}
        {view === "finished" && <div>Finished</div>}
        {view === "likes" && <div>Likes</div>}
        {view === "followers" && <div>Followers</div>}
        {view === "following" && <div>Following</div>}
      </div>
    </div>
  );
}

export default Profile;
