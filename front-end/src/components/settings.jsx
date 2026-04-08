import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState("overview");
  const [editUserData, setEditUserData] = usestate(false);
  const [openIconHeader, setOpenIconHeader] = useState(false);

  const [iconHeaderData, setIconHeaderData] = useState({
    pfp: "",
    header: "",
  });
  const [updateData, setUpdateData] = useState({});
  const [updatePassword, setUpdatePassword] = useState({});

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
            {!openIconHeader && (
              <div>
                <div>
                  <img src={`http:localhost:5555/${user.header}`} alt="" />
                </div>
                <div>
                  <img src={`http:localhost:5555/${user.pfp}`} alt="" />
                </div>
                <div onClick={() => setOpenIconHeader(true)}>
                  edit icon + header
                </div>
              </div>
            )}
            {openIconHeader && <div>{/* SHOW IMG PREVEIWEWS HERE */}</div>}
          </div>

          <div>

            {!editUserData &&  <div>
              <div>{user.username}</div>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.bio}</div>
              <div>cake day: {user.joined}</div>
            </div>
            <div onClick={editUserData}>edit user data</div>}
           
          </div>
        </div>
      )}
      {settingsView === "change password" && <div></div>}
      {settingsView === "delete" && <div></div>}
    </div>
  );
}

export default Settings;
