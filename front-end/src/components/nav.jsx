import { useQuery } from "@tanstack/react-query";
import { useState, useOutletContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import MakeAPost from "./makeAPost";
import AddToInventory from "./addToInventory";

function Nav() {
  const { user } = useOutletContext();
  const [makePost, setMakePost] = useState(false);
  const [addToInventory, setAddToInventory] = useState(false);
  const [utilsOpen, setUtilsOpen] = useState(false);

  function logout() {}
  function refreshFeed() {}

  return (
    <div clasnName="navDIV">
      <div className="home" onClick={refreshFeed}>
        <img />
      </div>
      <div className="make-post" onClick={() => setMakePost(true)}></div>
      <div className="make-post" onClick={() => setAddToInventory(true)}></div>
      <Link to={`/${user.username}`} className="profile">
        <img />
      </Link>
      <div clasName="utils-div">
        {utilsOpen && (
          <div className="utilsModelBackground" onClick={setUtilsOpen(false)}>
            <Link
              to="/settings"
              className="go-to-settings"
              onClick={() => setUtilsOpen(false)}
            >
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
      {makePost && <MakeAPost closePostModal={setMakePost} />}
      {addToInventory && (
        <AddToInventory closeInventoryModal={setAddToInventory} />
      )}
    </div>
  );
}

export default Nav;
