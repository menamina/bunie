import { useState } from "react";

function Welcome() {
  const [view, setView] = useState("login");
  const [viewPassword, setViewPassword] = useState(false);
  const [loginINFO, setLoginINFO] = useState({
    email: "",
    password: ""
  })
  const [signupINFO, setSignupINFO] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPasword: "",
  })

  return (
    <div>
      {view === "login" && (
        <div className="loginDIV">
          <form onSubmit={}>
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
          <div>
            <div>Need an account?</div>
            <div onClick={() => setView("signup")}>signup</div>
          </div>
        </div>
      )}

      {view === "signup" && (
        <div className="loginDIV">
          <form onSubmit={}>
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
                  <input name="password"></input>
                </div>
                <div>
                  <label for="confirmPassword"></label>
                  <input name="confirmPassword"></input>
                </div>
              </>
            )}
            <button>SIGN UP</button>
          </form>
          <div>
            <div>Already have an account?</div>
            <div onClick={() => setView("login")}>signup</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
