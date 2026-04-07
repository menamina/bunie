import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Nav() {
  return (
    <div clasnName="navDIV">
      <div className="home"></div>
      <div className="feed"></div>
      <div className="make-post"></div>
      <div className="profile"></div>
      <div className="open-utils"></div>
    </div>
  );
}

export default Nav;
