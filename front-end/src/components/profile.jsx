import { useState } from "react";

function Profile() {
  const [view, setView] = useState("overview");

  return (
    <div className="profileDIV">
      {/* div below will stetch vh vw */}
      <div>
        {/* div below willstretch view heighgt view width for header */}
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
        <div>
        <div>
        <div>
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
        </div>
        </div>
        <div className="renderViewHere">
                {view === "overview" &&}
                {view === "inventory" &&}
                {view === "inprogress" &&}
                {view === "limbo" &&}
                {view === "decluttered" &&}
                {view === "finished" &&}
                {view === "likes" &&}
                {view === "followers" &&}
                {view === "following" &&}
                
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
