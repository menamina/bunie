import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [sessCheckAPIErr, setSessCheckAPIErr] = useState(false);

  useState(() => {
    async function sessCheck() {
      try {
        const res = await fetch("http://localHost:5555//session-check-API", {
          method: "GET",
          credentials: "include",
        });
      } catch (error) {
        console.log(error);
        setSessCheckAPIErr(error);
        setUser(null);
      }
    }
    sessCheck();
  }, []);

  return <div className="mainDIV"></div>;
}

export default App;
