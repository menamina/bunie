import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signUpMutationOptions,
  loginMutationOptions,
} from "../ts-queries/queries";
import { useNavigate } from "react-router-dom";

import "../css/welcome.css";

import Bunnies from "../imgs/pngbunny.png";
import Show from "../imgs/view.png";
import DontShow from "../imgs/eye.png";

function Welcome() {
  const [mainWelcome, setMainWelcome] = useState(true);
  const [view, setView] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const [passwordInvalid, setPasswordInvalid] = useState({
    notLongEnough: "",
    notTheSame: "",
  });

  const [invalidUsername, setInvalidUsername] = useState({
    invalidChars: "",
    cannotBegin: "",
    cannotEnd: "",
    lengthTooShortOrLong: "",
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
      queryClient.invalidateQueries({ queryKey: ["checkSession"] });
      nav("/");
      setLoginINFO({
        email: "",
        password: "",
      });
      setViewPassword(false);
      setViewConfirmPassword(false);
    },
  });

  function loginSubmit(e: any) {
    e.preventDefault();
    logIn(loginINFO);
  }

  function signupSugmit(e: any) {
    e.preventDefault();
    signUp(signupINFO);
  }

  function validatePassword(password: string) {
    if (password.length < 8) {
      setPasswordInvalid((prev) => ({
        ...prev,
        notLongEnough: "Password must be 8 characters or more",
      }));
    } else {
      setPasswordInvalid((prev) => ({ ...prev, notLongEnough: "" }));
    }
  }

  function validatateBothPass(confirmPassword: string, password: string) {
    if (confirmPassword !== password) {
      setPasswordInvalid((prev) => ({
        ...prev,
        notTheSame: "Passwords must match",
      }));
    } else {
      setPasswordInvalid((prev) => ({
        ...prev,
        notTheSame: "",
      }));
    }
  }

  function validateUsername(username: string) {
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        invalidChars: "Username can only contain letters, numbers, _ or -",
      }));
    } else {
      setInvalidUsername((prev) => ({
        ...prev,
        invalidChars: "",
      }));
    }

    if (/^[_-]/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotBegin: "Username cannot begin with _ or -",
      }));
    } else {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotBegin: "",
      }));
    }

    if (/[_-]$/.test(username)) {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotEnd: "Username cannot end with _ or -",
      }));
    } else {
      setInvalidUsername((prev) => ({
        ...prev,
        cannotEnd: "",
      }));
    }

    if (username.length < 3 || username.length > 30) {
      setInvalidUsername((prev) => ({
        ...prev,
        lengthTooShortOrLong: "Username has to be between 3 and 30 characters",
      }));
    } else {
      setInvalidUsername((prev) => ({
        ...prev,
        lengthTooShortOrLong: "",
      }));
    }
  }

  return (
    <div className="welcomeDIV">
      {mainWelcome && (
        <div className="pre-login-signup">
          <div className="welcome">Welcome to Bunie</div>
          <div className="info">
            <div className="blur">
              a digital cosmetics inventory + project pan tracker
            </div>
            <div className="login signup">
              <div
                className="curs0rclick blur"
                onClick={() => {
                  setMainWelcome(false);
                  setView("login");
                }}
              >
                login
              </div>
              <div
                className="curs0rclick blur"
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
          <div className="welcomeBack">
            <div className="welcome-text">Welcome back!</div>
            <div className="imgDivHolder">
              <img
                className="logoIMG"
                src={Bunnies}
                alt="two bunnies - app logo"
              />
            </div>
          </div>
          {logInError && <div>{(logInError as any).data}</div>}
          <form onSubmit={loginSubmit}>
            <div>
              <label htmlFor="email" hidden></label>
              <input
                placeholder="Email"
                name="email"
                value={loginINFO.email}
                onChange={(e) =>
                  setLoginINFO((prev) => ({ ...prev, email: e.target.value }))
                }
              ></input>
            </div>
            <div>
              <label htmlFor="password" hidden></label>
              <input
                placeholder="Password"
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
            {loginINFO.email && loginINFO.password && (
              <div className="clickableLoginBTN curs0rclick ">
                <button type="submit" className="loginBTN">
                  LOGIN
                </button>
              </div>
            )}
            {!loginINFO.email && !loginINFO.password && (
              <div className="cannot-click-btn">
                <button type="button" className="cannotClick-loginBTN">
                  LOGIN
                </button>
              </div>
            )}
          </form>
          <div className="needToSignUpOrLogIn">
            <div>Need an account?</div>
            <div
              className="curs0rclick signup"
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
              SIGNUP
            </div>
          </div>
        </div>
      )}

      {view === "signup" && (
        <div className="signupDIV">
          {signUpError && <h2>{(signUpError as any).error}</h2>}
          <form onSubmit={signupSugmit}>
            <div>
              <label htmlFor="name"></label>
              <input
                placeholder="Name"
                name="name"
                value={signupINFO.name}
                onChange={(e) =>
                  setSignupINFO((prev) => ({ ...prev, name: e.target.value }))
                }
              ></input>
            </div>
            <div>
              {signupINFO.username &&
                (invalidUsername.invalidChars ||
                  invalidUsername.cannotBegin ||
                  invalidUsername.cannotEnd ||
                  invalidUsername.lengthTooShortOrLong) && (
                  <div className="invalidusername">
                    {invalidUsername.invalidChars && (
                      <div>• {invalidUsername.invalidChars}</div>
                    )}
                    {invalidUsername.cannotBegin && (
                      <div>• {invalidUsername.cannotBegin}</div>
                    )}
                    {invalidUsername.cannotEnd && (
                      <div>• {invalidUsername.cannotEnd}</div>
                    )}
                    {invalidUsername.lengthTooShortOrLong && (
                      <div>• {invalidUsername.lengthTooShortOrLong}</div>
                    )}
                  </div>
                )}
              <label htmlFor="username"></label>
              <input
                name="username"
                placeholder="Username"
                value={signupINFO.username}
                onChange={(e) => {
                  setSignupINFO((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                  validateUsername(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <label htmlFor="email"></label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={signupINFO.email}
                onChange={(e) =>
                  setSignupINFO((prev) => ({ ...prev, email: e.target.value }))
                }
              ></input>
            </div>

            {!viewPassword && (
              <div className="passwordFlex">
                {passwordInvalid.notLongEnough && (
                  <div>{passwordInvalid.notLongEnough}</div>
                )}
                <div>
                  <label htmlFor="password"></label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={signupINFO.password}
                    onChange={(e) => {
                      setSignupINFO((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      validatePassword(e.target.value);
                    }}
                  ></input>
                </div>
                <div onClick={() => setViewPassword(true)}>
                  <img
                    className="eyeIcons"
                    src={Show}
                    alt="click to view password"
                  ></img>
                </div>
              </div>
            )}

            {viewPassword && (
              <div className="passwordFlex">
                {passwordInvalid.notLongEnough && (
                  <div>{passwordInvalid.notLongEnough}</div>
                )}
                <div>
                  <label htmlFor="password"></label>
                  <input
                    name="password"
                    value={signupINFO.password}
                    placeholder="Password"
                    onChange={(e) => {
                      setSignupINFO((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      validatePassword(e.target.value);
                    }}
                  ></input>
                </div>
                <div onClick={() => setViewPassword(false)}>
                  <img
                    className="eyeIcons"
                    src={DontShow}
                    alt="click to view password"
                  ></img>
                </div>
              </div>
            )}

            {!viewConfirmPassword && (
              <div className="passwordFlex">
                {passwordInvalid.notTheSame && (
                  <div>{passwordInvalid.notTheSame}</div>
                )}
                <div>
                  <label htmlFor="confirmPassword"></label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={signupINFO.confirmPassword}
                    onChange={(e) => {
                      setSignupINFO((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));
                      validatateBothPass(e.target.value, signupINFO.password);
                    }}
                  ></input>
                </div>
                <div onClick={() => setViewConfirmPassword(true)}>
                  <img
                    className="eyeIcons"
                    src={Show}
                    alt="click to view confirm password"
                  ></img>
                </div>
              </div>
            )}

            {viewConfirmPassword && (
              <div className="passwordFlex">
                {passwordInvalid.notTheSame && (
                  <div>{passwordInvalid.notTheSame}</div>
                )}
                <div>
                  <label htmlFor="confirmPassword"></label>
                  <input
                    name="confirmPassword"
                    value={signupINFO.confirmPassword}
                    placeholder="Confirm password"
                    onChange={(e) => {
                      setSignupINFO((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));
                      validatateBothPass(e.target.value, signupINFO.password);
                    }}
                  ></input>
                </div>
                <div onClick={() => setViewConfirmPassword(false)}>
                  <img
                    className="eyeIcons"
                    src={DontShow}
                    alt="click to view password"
                  ></img>
                </div>
              </div>
            )}

            {signupINFO.name &&
              signupINFO.username &&
              signupINFO.email &&
              signupINFO.password &&
              signupINFO.confirmPassword &&
              !invalidUsername.invalidChars &&
              !invalidUsername.cannotBegin &&
              !invalidUsername.cannotEnd &&
              !invalidUsername.lengthTooShortOrLong &&
              !passwordInvalid.notLongEnough &&
              !passwordInvalid.notTheSame && (
                <div className="signupDivBtn">
                  <button
                    type="submit"
                    className="curs0rclick clickableSignupBTN"
                  >
                    SIGNUP
                  </button>
                </div>
              )}

            {(!signupINFO.name ||
              !signupINFO.username ||
              !signupINFO.email ||
              !signupINFO.password ||
              !signupINFO.confirmPassword ||
              passwordInvalid.notLongEnough ||
              passwordInvalid.notTheSame) && (
              <div className="signupDivBtn">
                <div className="cannot-click-btn curs0rclick">SIGNUP</div>
              </div>
            )}
          </form>
          <div className="needToSignUpOrLogIn">
            <div>Already have an account?</div>
            <div
              className="curs0rclick login"
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
              LOGIN
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
