import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState("overview");
  const [editUserData, setEditUserData] = useState(false);
  const [openIconHeader, setOpenIconHeader] = useState(false);

  const [iconHeaderData, setIconHeaderData] = useState({
    pfp: "",
    header: "",
  });

  const [updateData, setUpdateData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
  });

  const [updatePassword, setUpdatePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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
            {editUserData && (
              <div>
                <div>
                  <div>
                    <label>Name</label>
                    <input
                    placeholder=
                      value={updateData.name}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label>Username</label>
                    <input
                      value={updateData.username}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                                        <label>Email</label>
                    <input
                      value={updateData.email}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label>Bio</label>
                    <input
                      value={updateData.bio}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>cake day: {user.joined}</div>
                </div>
                <div>
                  <div
                    onClick={() => {
                      setEditUserData(false);
                      setUpdateData({
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        bio: user.bio,
                      });
                    }}
                  >
                    cancel
                  </div>
                  <div onClick={updateUserData}>update</div>
                </div>
              </div>
            )}

            {!editUserData && (
              <div>
                <div>
                  <div>{user.name}</div>
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                  <div>{user.bio}</div>
                  <div>cake day: {user.joined}</div>
                </div>
                <div onClick={() => setEditUserData(true)}>edit user data</div>
              </div>
            )}
          </div>
        </div>
      )}
      {settingsView === "change password" && 
      <div>
        <div>

        </div>
        </div>}
      {settingsView === "delete" && <div></div>}
    </div>
  );
}

export default Settings;
