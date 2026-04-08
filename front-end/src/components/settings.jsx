import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState("overview");

  return (
    <div className="settingsDIV">
      <div>
        <div onChange={() => setSettingsView("overview")}>Overview</div>
        <div onChange={() => setSettingsView("change password")}>
          Change Password
        </div>
        <div onChange={() => setSettingsView("delete")}>Nuke Account</div>
      </div>
    </div>
  );
}

export default Settings;
