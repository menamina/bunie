import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import Welcome from "./components/welcome";

async function sessCheck() {
  const res = await fetch("http://localHost:5555//session-check-API", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

function App() {
  const { data } = useQuery({
    queryKey: ["checkSession"],
    queryFn: sessCheck,
  });
  // const [user, setUser] = useState(null);
  // const [sessCheckAPIErr, setSessCheckAPIErr] = useState(false);

  return (
    <div className="mainDIV">
      {/* {!user && <Welcome setTheUser={setUser} />}
      {user && (
        <div className="authUserDiv">
          <Outlet></Outlet>
        </div>
      )} */}
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export default App;
