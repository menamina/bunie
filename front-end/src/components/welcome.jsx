import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpMutationOptions, loginMutationOptions } from "./mutations";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [mainWelcome, setMainWelcome] = useState(true);
  const [view, setView] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const [invalidUsername, setInvalidUsername] = useState({
    invalidChars: false,
    cannotBegin: false,
    cannotEnd: false,
    lengthTooShortOrLong: false,
  });

  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [loginINFO, setLoginINFO] = useState({
    email: "",
    password: "",
  });

  const [signupINFO, setSignupINFO] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    mutate: signUp,
    error: signUpError,
    reset: resetSignUp,
  } = useMutation({
    ...signUpMutationOptions(),
    onSuccess: () => {
      setView("login");
      setSignupINFO({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      resetSignUp();
      setViewPassword(false);
      setViewConfirmPassword(false);
    },
  });

  const {
    mutate: logIn,
    error: logInError,
    reset: resetLogIn,
  } = useMutation({
    ...loginMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setLoginINFO({
        email: "",
        password: "",
      });
      resetLogIn();
      setViewPassword(false);
      setViewConfirmPassword(false);
      nav("/");
    },
  });

  function loginSubmit(e) {
    e.preventDefault();
    logIn(loginINFO);
  }

  function signupSugmit(e) {
    e.preventDefault();
    signUp(signupINFO);
  }

  function validateName(name) {}

  function validateUSername(username) {
    if (/^[a-zA-Z0-9._-]+$/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        invalidChars: "Username can only contain letters, numbers, . _ or -",
      }));
    } else {
       setInvalidUsername((prev) => ({
        ...prev,
        invalidChars: false,
      }));
    }

    if (/^[._-]/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotBegin: "Username cannot begin with . _ or -",
      }));
    } else {
       setInvalidUsername((prev) => ({
        ...prev,
        cannotBegin: false,
      }));
    }

     if (/[._-]$/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotEnd: "Username cannot end with . _ or -",
      }));
    } else {
       setInvalidUsername((prev) => ({
        ...prev,
        cannotEnd: false,
      }));
    }

    if (username.length < 3 || username.value > 30){

       setInvalidUsername((prev) => ({
        ...prev,
        lengthTooShortOrLong: "Username has to be between 3 and 30 characters",
      }));
    } else {
       setInvalidUsername((prev) => ({
        ...prev,
        lengthTooShortOrLong: false,
      }));


  }

  function validateEmail(email) {}

  function validatePassword(password) {}

  function checkIfPasswordsAreTheSame(password, confirmPassword) {}

  return (
    <div>
      {mainWelcome && (
        <div className="pre-login-signup">
          <div></div>
          <div>
            <div>
              <div
                onClick={() => {
                  setMainWelcome(false);
                  setView("login");
                }}
              >
                login
              </div>
              <div
                onClick={() => {
                  setMainWelcome(false);
                  setView("signup");
                }}
              >
                signup
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "login" && (
        <div className="loginDIV">
          {logInError && <div>{logInError}</div>}
          <form onSubmit={loginSubmit}>
            <div>
              <label for="email"></label>
              <input
                name="email"
                type="email"
                value={loginINFO.email}
                onChange={(e) =>
                  setLoginINFO((prev) => ({ ...prev, email: e.target.value }))
                }
              ></input>
            </div>
            <div>
              <label for="password"></label>
              <input
                name="password"
                type="password"
                value={loginINFO.password}
                onChange={(e) =>
                  setLoginINFO((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              ></input>
            </div>
            {loginINFO && (
              <div className="clickableLoginBTN">
                <button>LOGIN</button>
              </div>
            )}
            {!loginINFO && (
              <div classname="cannot-click-btn">
                <button>LOGIN</button>
              </div>
            )}
          </form>
          <div>
            <div>Need an account?</div>
            <div
              onClick={() => {
                setView("signup");
                setLoginINFO({
                  email: "",
                  password: "",
                });
                resetLogIn();
                setViewPassword(false);
              }}
            >
              signup
            </div>
          </div>
        </div>
      )}

      {view === "signup" && (
        <div className="loginDIV">
          {signUpError && <div>{signUpError}</div>}
          <form onSubmit={signupSugmit}>
            <div>
              <label for="name"></label>
              <input
                name="name"
                value={signupINFO.name}
                onChange={(e) =>
                  setSignupINFO((prev) => ({ ...prev, name: e.target.value }))
                }
              ></input>
            </div>
            <div>
              <label for="username"></label>
              <input
                name="username"
                value={signupINFO.username}
                onChange={(e) =>
                  setSignupINFO((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div>
              <label for="email"></label>
              <input
                name="email"
                type="email"
                value={signupINFO.email}
                onChange={(e) =>
                  setSignupINFO((prev) => ({ ...prev, email: e.target.value }))
                }
              ></input>
            </div>

            {!viewPassword && (
              <div>
                <div>
                  <label for="password"></label>
                  <input
                    name="password"
                    type="password"
                    value={signupINFO.password}
                    onChange={(e) =>
                      setSignupINFO((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  ></input>
                </div>
                <div onClick={() => setViewPassword(true)}>
                  <img alt="click to view password"></img>
                </div>
              </div>
            )}

            {viewPassword && (
              <div>
                <div>
                  <label for="password"></label>
                  <input
                    name="password"
                    value={signupINFO.password}
                    onChange={(e) =>
                      setSignupINFO((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  ></input>
                </div>
                <div onClick={() => setViewPassword(false)}>
                  <img alt="click to view password"></img>
                </div>
              </div>
            )}

            {!viewConfirmPassword && (
              <div>
                <div>
                  <label for="confirmPassword"></label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={signupINFO.confirmPassword}
                    onChange={(e) =>
                      setSignupINFO((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  ></input>
                </div>
                <div onClick={() => setViewConfirmPassword(true)}>
                  <img alt="click to view confirm password"></img>
                </div>
              </div>
            )}

            {viewConfirmPassword && (
              <div>
                <div>
                  <label for="confirmPassword"></label>
                  <input
                    name="confirmPassword"
                    value={signupINFO.confirmPassword}
                    onChange={(e) =>
                      setSignupINFO((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  ></input>
                </div>
                <div onClick={() => setViewConfirmPassword(false)}>
                  <img alt="click to view password"></img>
                </div>
              </div>
            )}

            {signupINFO && (
              <div className="clickableSignupBTN">
                <button>SIGNUP</button>
              </div>
            )}
            {!signupINFO && (
              <div classname="cannot-click-btn">
                <div>SIGNUP</div>
              </div>
            )}
          </form>
          <div>
            <div>Already have an account?</div>
            <div
              onClick={() => {
                setView("login");
                setSignupINFO({
                  name: "",
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
                resetSignUp();
                setViewPassword(false);
              }}
            >
              login
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
