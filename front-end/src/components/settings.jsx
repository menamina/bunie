import { useState } from "react";

function Settings() {
  const [settingView, setSettingView] = useState("overview");

  const [imgChange, setIMGChange] = useState({
    pfp: "",
    header: "",
  });

  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewpassword: "",
  });

  const [deleteAccountClicked, setDeleteAccountClicked] = useState(false);
  const [confirmedToDeleteAcc, setConfirmedToDeleteAcc] = useState(false);

  return (
    <div className="settingsDIV">
      <div>Settings</div>
      <div>
        <div>
          <div onClick={() => setSettingView("overview")}>Account</div>
          <div onClick={() => setSettingView("delete")}>Delete account</div>
        </div>
        <div>
          {settingView === "overview" && (
            <div>
              <div className="" onClick={() => setSettingView("change info")}>
                Account information
              </div>
              <div
                className=""
                onClick={() => setSettingView("change password")}
              >
                Change your password
              </div>
            </div>
          )}
          {settingView === "change info" ||
            (settingView === "change password" && (
              <div>
                <div className="" onClick={() => setSettingView("overview")}>
                  go back button
                </div>
                <div className="">
                  {settingView === "change info" && <div></div>}
                  {settingView === "change password" && <div></div>}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
