import { useState } from "react";

function Welcome() {
  const [view, setView] = useState("login");
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <div>
      {view === "login" && (
        <div className="loginDIV">
          <form>
            <div>
              <label for="email"></label>
              <input name="email" type="email"></input>
            </div>
            <div>
              <label for="password"></label>
              <input name="password" type="password"></input>
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
              <label for="name"></label>
              <input name="name"></input>
            </div>
            <div>
              <label for="username"></label>
              <input name="username"></input>
            </div>
            <div>
              <label for="email"></label>
              <input name="email" type="email"></input>
            </div>

            {!viewPassword && (
              <>
                <div>
                  <label for="password"></label>
                  <input name="password" type="password"></input>
                </div>
                <div>
                  <label for="confirmPassword"></label>
                  <input name="confirmPassword" type="password"></input>
                </div>
              </>
            )}

            {viewPassword && (
              <>
                <div>
                  <label for="password"></label>
                  <input name="password" type="password"></input>
                </div>
                <div>
                  <label for="confirmPassword"></label>
                  <input name="confirmPassword" type="password"></input>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Welcome;
