import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState("overview");
  const [editUserData, setEditUserData] = usestate(false);

  const [updateData, setUpdateData] = useState({});

  return (
    <div className="settingsDIV">
      <div>
        <div>Settings</div>
        <div>
          <div onChange={() => setSettingsView("overview")}>Overview</div>
          <div onChange={() => setSettingsView("change password")}>
            Change Password
          </div>
          <div onChange={() => setSettingsView("delete")}>Nuke Account</div>
        </div>
      </div>
      {settingsView === "overview" && (
        <div>
          <div>
            <div>
              <img src={`http:localhost:5555/${user.header}`} alt="" />
              <div>edit header</div>
            </div>
            <div>
              <img src={`http:localhost:5555/${user.pfp}`} alt="" />
              <div>edit icon</div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <input type="text" value={user.name} />
              </div>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.bio}</div>
              <div>cake day: {user.joined}</div>
            </div>
            <div onClick={editUserData}>edit user data</div>
          </div>
        </div>
      )}
      {settingsView === "change password" && <div></div>}
      {settingsView === "delete" && <div></div>}
    </div>
  );
}

export default Settings;
