import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";

import MakeAPost from "./makeAPost";
import AddToInventory from "./addToInventory";

import { logoutMut } from "../ts-queries/queries";

import Logo from "../imgs/buni.png";
import Add from "../imgs/add.svg";
import Post from "../imgs/post.svg";
import Search from "../imgs/search.svg";
import Settings from "../imgs/settings.svg";

function Nav() {
  const user = useOutletContext();
  const [makePost, setMakePost] = useState(false);
  const [addToInventory, setAddToInventory] = useState(false);
  const [utilsOpen, setUtilsOpen] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    ...logoutMut(),
    onSuccess: () => {
      nav("/");
    },
  });

  function refreshFeed() {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({ queryKey: ["following-feed"] });
  }

  return (
    <div clasnName="navDIV">
      <div className="nav options minus profile">
        <div className="home" onClick={refreshFeed}>
          <img src={Logo} alt="app logo" />
        </div>
        <div className="make-post" onClick={() => setMakePost(true)}>
          <img src={Post} alt="make a post" />
        </div>
        <div className="add to inven" onClick={() => setAddToInventory(true)}>
          <img src={Add} alt="add to inventory" />
        </div>
        <div>
          <Link to="/search">
            <img src={Search} alt="search" />
          </Link>
        </div>
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
          >
            <img src={Settings} alt="settingd" />
          </div>
        </div>
      </div>
      <Link to={`/${user?.username}`} className="profile">
        {/* <img src={`http://localhost:5555/IMGS-API/${user?.pfp}`} alt="search" /> */}
      </Link>
      {makePost && <MakeAPost closeModal={setMakePost} />}
      {addToInventory && <AddToInventory closeModal={setAddToInventory} />}
    </div>
  );
}

export default Nav;
