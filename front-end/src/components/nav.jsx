import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useOutletContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import MakeAPost from "./makeAPost";
import AddToInventory from "./addToInventory";

import { logoutMut } from "../ts-queries/queries";

function Nav() {
  const { user } = useOutletContext();
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
      <div className="home" onClick={refreshFeed}>
        <img />
      </div>
      <div className="make-post" onClick={() => setMakePost(true)}></div>
      <div
        className="add to inven"
        onClick={() => setAddToInventory(true)}
      ></div>
      <div>
        <Link to="/search">
          <img />
        </Link>
      </div>
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
      {makePost && <MakeAPost closeModal={setMakePost} />}
      {addToInventory && <AddToInventory closeModal={setAddToInventory} />}
    </div>
  );
}

export default Nav;
