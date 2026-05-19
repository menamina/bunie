import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import MakeAPost from "./makeAPost";
import AddToInventory from "./addToInventory";

import DefaultIcon from "../imgs/default.svg";

import { logoutMut } from "../ts-queries/queries";

import Logo from "../imgs/buni.png";
import Add from "../imgs/add.svg";
import Post from "../imgs/post.svg";
import Search from "../imgs/search.svg";
import Settings from "../imgs/settings.svg";

import "../css/nav.css";

function Nav({ user }) {
  const [makePost, setMakePost] = useState(false);
  const [addToInventory, setAddToInventory] = useState(false);
  const [utilsOpen, setUtilsOpen] = useState(false);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    ...logoutMut(),
    onSuccess: () => {
      (queryClient.invalidateQueries({ queryKey: ["checkSession"] }), nav("/"));
    },
  });

  function refreshFeed() {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
    queryClient.invalidateQueries({ queryKey: ["following-feed"] });
  }

  return (
    <div className="navDIV">
      <div className="nav options minus profile">
        <Link to="/" className="home" onClick={refreshFeed}>
          <img className="logo navIMG" src={Logo} alt="app logo" />
        </Link>
        <div className="make-post" onClick={() => setMakePost(true)}>
          <img className="navIMG" src={Post} alt="make a post" />
        </div>
        <div className="add to inven" onClick={() => setAddToInventory(true)}>
          <img className="navIMG" src={Add} alt="add to inventory" />
        </div>
        <div>
          <Link to="/search">
            <img className="navIMG" src={Search} alt="search" />
          </Link>
        </div>
        <div
          className="utils-div"
          onClick={() => setUtilsOpen((prev) => !prev)}
        >
          {utilsOpen && (
            <div>
              <div
                className="utilsModelBackground"
                onClick={(e) => {
                  e.stopPropagation();
                  setUtilsOpen(false);
                }}
              ></div>
              <Link
                to="/settings"
                className="cursorPoint"
                onClick={(e) => {
                  e.stopPropagation();
                  setUtilsOpen(false);
                }}
              >
                Settings
              </Link>
              <div
                className="cursorPoint"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              >
                Logout
              </div>
            </div>
          )}
          <div className="open-utils">
            <img className="navIMG" src={Settings} alt="settings" />
          </div>
        </div>
      </div>
      <Link className="goToProfile" to={`/${user?.user?.username}`}>
        <img
          className="miniPFP"
          src={
            user?.user?.profile?.pfp && user.user.profile.pfp !== "default.svg"
              ? `http://localhost:5555/IMGS-API/${user.user.profile.pfp}`
              : DefaultIcon
          }
          alt="your profile"
        />
      </Link>
      {makePost && <MakeAPost closeModal={setMakePost} user={user?.user} />}
      {addToInventory && (
        <AddToInventory closeInventoryModal={setAddToInventory} user={user?.user} />
      )}
    </div>
  );
}

export default Nav;
