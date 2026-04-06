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
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Settings;
