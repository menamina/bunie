import { useState } from "react";

function Welcome() {
  const [view, setView] = useState("login");

  return (
    <div>
      {view === "login" && (
        <div className="loginDIV">
          <form>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <button>LOGIN</button>
            </div>
          </form>
        </div>
      )}

      {view === "signup" && (
        <div className="loginDIV">
          <form>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <label></label>
              <input></input>
            </div>
            <div>
              <label></label>
              <input></input>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Welcome;
