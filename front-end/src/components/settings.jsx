import { useState, useTransition } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "./ts-queries/queries";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState(null);
  const [editUserData, setEditUserData] = useState(false);
  const [openIconHeader, setOpenIconHeader] = useState(false);

  const { mutation: updatePass, error: updatePassErr } = useMutation({
    ...updatePassword(),
    onSuccess: () => {
      setSettingsView(null);
    },
  });

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

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function cancelPassword() {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setSettingsView(null);
  }

  return (
    <div className="settingsDIV">
      <div>
        <div>Settings</div>
        <div>
          <div onChange={() => setSettingsView(null)}>Overview</div>
          <div onChange={() => setSettingsView("change password")}>
            Change Password
          </div>
          <div onChange={() => setSettingsView("delete")}>Nuke Account</div>
        </div>
      </div>
      {settingsView === null && (
        <div>
          <div>
            {!openIconHeader && (
              <div>
                <div>
                  <img
                    src={`http:localhost:5555/${user.header}`}
                    alt="your header"
                  />
                </div>
                <div>
                  <img
                    src={`http:localhost:5555/${user.pfp}`}
                    alt="your profile img"
                  />
                </div>
                <div onClick={() => setOpenIconHeader(true)}>
                  edit icon + header
                </div>
              </div>
            )}
            {openIconHeader && (
              <div>
                <div>
                  {iconHeaderData.header instanceof File ? (
                    <>
                      <img
                        src={URL.createObjectURL(iconHeaderData.header)}
                        alt="your updated header"
                        onClick={(e) => e.target.nextElementSibling.click()}
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setIconHeaderData((prev) => ({
                            ...prev,
                            header: e.target.files[0],
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={`http://localhost:5555/${user.header}`}
                        alt="your updated header"
                        onClick={(e) => e.target.nextElementSibling.click()}
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setIconHeaderData((prev) => ({
                            ...prev,
                            header: e.target.files[0],
                          }))
                        }
                      />
                    </>
                  )}
                </div>
                <div>
                  {iconHeaderData.pfp instanceof File ? (
                    <>
                      <img
                        src={URL.createObjectURL(iconHeaderData.pfp)}
                        alt="your updated pfp"
                        onClick={(e) => e.target.nextElementSibling.click()}
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setIconHeaderData((prev) => ({
                            ...prev,
                            pfp: e.target.files[0],
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={`http://localhost:5555/${user.pfp}`}
                        alt="your updated pfp"
                        onClick={(e) => e.target.nextElementSibling.click()}
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setIconHeaderData((prev) => ({
                            ...prev,
                            pfp: e.target.files[0],
                          }))
                        }
                      />
                    </>
                  )}
                </div>
                <div>
                  <div
                    onClick={() => {
                      setIconHeaderData({
                        pfp: user.pfp,
                        header: user.header,
                      });
                      setOpenIconHeader(false);
                    }}
                  >
                    cancel
                  </div>
                  <div onClick={() => {}}>update</div>
                </div>
              </div>
            )}
          </div>

          <div>
            {editUserData && (
              <div>
                <div>
                  <div>
                    <label>Name</label>
                    <input
                      placeholder=""
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
      {settingsView === "change password" && (
        // ability to view passwords too
        <div>
          {updatePassErr && <div>{updatePassErr}</div>}
          <div>
            <div>
              <label htmlFor="">Current password:</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="">New password:</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="">Confirm new password:</label>
              <input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <div onClick={cancelPassword}>cancel</div>
            <div onClick={() => updatePass(passwordData)}>change password</div>
          </div>
        </div>
      )}
      {settingsView === "delete" && <DeleteAccount />}
    </div>
  );
}

export default Settings;
