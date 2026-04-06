import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Welcome from "./components/welcome";

const query = useQuery({
  queryKey: ["checkSession"],
  queryFn: sessCheck,
});

async function sessCheck() {
  const res = await fetch("http://localHost:5555//session-check-API", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

function App() {
  const [user, setUser] = useState(null);
  const [sessCheckAPIErr, setSessCheckAPIErr] = useState(false);

  return (
    <div className="mainDIV">
      {!user && <Welcome setTheUser={setUser} />}
      {user && (
        <div className="authUserDiv">
          <Outlet></Outlet>
        </div>
      )}
    </div>
  );
}

export default App;
