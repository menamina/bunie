import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Nav() {
  const { utilsOpen, setUtilsOpen } = useState(false);

  function logout() {}

  return (
    <div clasnName="navDIV">
      <div className="home"></div>
      <div className="feed"></div>
      <div className="make-post"></div>
      <div className="profile"></div>
      <div clasName="utils-div">
        {utilsOpen && (
          <div className="utilsModelBackground" onClick={setUtilsOpen(false)}>
            <Link to="/settings" className="go-to-settings">
              Settings
            </Link>
            <div className="logout" onClick={logout}>
              Logout
            </div>
          </div>
        )}
        <div
          className="open-utils"
          onClick={() => setUtilsOpen((prev) => !prev)}
        ></div>
      </div>
    </div>
  );
}

export default Nav;
