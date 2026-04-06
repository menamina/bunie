import { useState } from "react";
import { useMutation } from '@tanstack/react-query'
import { signUpMutationOptions } from './mutations'

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
    confirmPassword: "",
  })

  const {mutate, isPending, error} = useMutate(signUpMutationOptions())

function signupSugmit(e){
  e.preventDefault()
  mutate(signupINFO)
}

  return (
    <div>
      {view === "login" && (
        <div className="loginDIV">
          <form onSubmit={}>
            <div>
              <label for="email"></label>
              <input name="email" type="email" value={loginINFO.email} onChange={(e) => setLoginINFO(prev => ({...prev, email: e.target.value }))}></input>
            </div>
            <div>
              <label for="password"></label>
              <input name="password" type="password" value={loginINFO.password} onChange={(e) => setLoginINFO(prev => ({...prev, password: e.target.value }))}></input>
            </div>
            <div>
              <button>LOGIN</button>
            </div>
          </form>
          <div>
            <div>Need an account?</div>
            <div onClick={() => {
              setView("signup");
              setLoginINFO({
                email: "",
                password: "",
              });
            }}>signup</div>
          </div>
        </div>
      )}

      {view === "signup" && (
        <div className="loginDIV">
          <form onSubmit={signupSugmit}>
            <div>
              <label for="name"></label>
              <input name="name" value={signupINFO.name} onChange={(e) => setSignupINFO(prev => ({...prev, name: e.target.value }))}></input>
            </div>
            <div>
              <label for="username"></label>
              <input name="username" value={signupINFO.username} onChange={(e) => setSignupINFO(prev => ({...prev, username: e.target.value }))}></input>
            </div>
            <div>
              <label for="email"></label>
              <input name="email" type="email"value={signupINFO.email} onChange={(e) => setSignupINFO(prev => ({...prev, email: e.target.value }))}></input>
            </div>

            {!viewPassword && (
              <>
                <div>
                  <label for="password"></label>
                  <input name="password" type="password" value={signupINFO.password} onChange={(e) => setSignupINFO(prev => ({...prev, password: e.target.value }))}></input>
                </div>
                <div>
                  <label for="confirmPassword"></label>
                  <input name="confirmPassword" type="password" value={signupINFO.confirmPassword} onChange={(e) => setSignupINFO(prev => ({...prev, confirmPassword: e.target.value }))}></input>
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
            <div onClick={() => {
              setView("login");
              setSignupINFO({
                name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}>login</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
