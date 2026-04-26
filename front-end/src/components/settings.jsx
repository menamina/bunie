import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUData,
  updateIMGs,
  updatePassword,
  deleteAccount,
} from "../ts-queries/queries";

import "../css/settings.css";

import Icon from "../imgs/cafe.jpeg";
import Header from "../imgs/image.jpg";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState(null);
  const [editUserData, setEditUserData] = useState(false);
  const [openIconHeader, setOpenIconHeader] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const nav = useNavigate();

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

  const queryClient = useQueryClient();

  const { mutation: updatePass, error: updatePassErr } = useMutation({
    ...updatePassword(),
    onSuccess: () => {
      setSettingsView(null);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    },
  });

  const {
    mutation: updateIMGS,
    error: imgUpdateErr,
    reset: resetIMG,
  } = useMutation({
    ...updateIMGs(),
    onSuccess: () => {
      setIconHeaderData({
        pfp: "",
        header: "",
      });
      resetIMG();
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
    },
  });

  const {
    mutation: updateUserData,
    error: dataUpdateErr,
    reset: resetData,
  } = useMutation({
    ...updateUData(),
    onSuccess: () => {
      setUpdateData({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      });
      resetData();
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
    },
  });

  const { mutation: deleteMyAccount, error: deleteAccErr } = useMutation({
    ...deleteAccount(),
    onSuccess: () => {
      nav("/");
    },
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
      <div className="leftOfSettings">
        <div>Settings</div>
        <div className="options-set">
          <div
            className={settingsView === null ? "selectedSView" : "viewOpt"}
            onClick={() => setSettingsView(null)}
          >
            Overview
          </div>
          <div
            className={
              settingsView === "change password" ? "selectedSView" : "viewOpt"
            }
            onClick={() => setSettingsView("change password")}
          >
            Change Password
          </div>
          <div
            className={settingsView === "delete" ? "selectedSView" : "viewOpt"}
            onClick={() => setSettingsView("delete")}
          >
            Nuke Account
          </div>
        </div>
      </div>
      {settingsView === null && (
        <div className="rightOfSettings updateIMGS">
          <div>
            {!openIconHeader && (
              <div className="currentIconHeader">
                <div>
                  <img
                    className="currentHeader"
                    src={Header}
                    // src={`http:localhost:5555/IMGS-API/${user.header}`}
                    alt="your header"
                  />
                </div>
                <div className="iconHolder">
                  <img
                    className="currentIcon"
                    src={Icon}
                    // src={`http:localhost:5555/IMGS-API/${user.pfp}`}
                    alt="your profile img"
                  />
                </div>
                {!editUserData && (
                  <div
                    onClick={() => {
                      setOpenIconHeader(true);
                      {
                        editUserData && setEditUserData(false);
                      }
                    }}
                    className="clickEdit"
                  >
                    edit icon + header
                  </div>
                )}
              </div>
            )}
            {openIconHeader && (
              <div className="editImgsOpen">
                {imgUpdateErr && (
                  <div className="imgErrModal">
                    <div>
                      <div>{imgUpdateErr}</div>
                    </div>
                  </div>
                )}

                <div>
                  <img
                    className={
                      iconHeaderData.header
                        ? "wantedHeader noHeaderOverlay"
                        : "wantedHeader overlay"
                    }
                    src={
                      !iconHeaderData.header
                        ? Header
                        : URL.createObjectURL(iconHeaderData.header)
                    }
                    alt="your updated header"
                    onClick={(e) => e.target.nextElementSibling.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setIconHeaderData((prev) => ({
                        ...prev,
                        header: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div className="iconHolder">
                  <img
                    className={
                      iconHeaderData.header
                        ? "wantedIcon noIconOverlay"
                        : "wantedIcon overlay"
                    }
                    src={
                      !iconHeaderData.pfp
                        ? Icon
                        : URL.createObjectURL(iconHeaderData.pfp)
                    }
                    alt="your updated pfp"
                    onClick={(e) => e.target.nextElementSibling.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setIconHeaderData((prev) => ({
                        ...prev,
                        pfp: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div className="updateCancelIMGS">
                  <button
                    type="button"
                    className="settingsButtons"
                    onClick={() => {
                      setIconHeaderData({
                        pfp: "",
                        header: "",
                      });
                      setOpenIconHeader(false);
                    }}
                  >
                    cancel
                  </button>
                  {iconHeaderData.pfp || iconHeaderData.header ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateIMGS;
                      }}
                      className="canUpdate settingsButtons"
                    >
                      update
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cannotUpdate settingsButtons"
                    >
                      update
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="editStatic">
            {editUserData && (
              <div className="openedEditForStaticData">
                {dataUpdateErr && (
                  <div className="imgErrModal">
                    <div>
                      <div>{dataUpdateErr}</div>
                    </div>
                  </div>
                )}
                <div className="editForReal">
                  <div>
                    <label>Name</label>
                    <input
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
                    <textarea
                      className="editBio"
                      value={updateData.bio}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>cake day: {user.joined.split("T")[0]}</div>
                </div>
                <div className="editOrCancelStaticUpdate">
                  <button
                    type="button"
                    className="settingsButtons"
                    onClick={() => {
                      setEditUserData(false);
                      {
                        openIconHeader && setIconHeaderData(false);
                      }
                      setUpdateData({
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        bio: user.bio,
                      });
                    }}
                  >
                    cancel
                  </button>
                  <button
                    type="button"
                    className="settingsButtons"
                    onClick={updateUserData}
                  >
                    update
                  </button>
                </div>
              </div>
            )}

            {!editUserData && !openIconHeader && (
              <div className="userInfoSettings">
                <div>
                  <div>{user.name}</div>
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                  <div>{user.bio}</div>
                  <div>cake day: {user.joined.split("T")[0]}</div>
                </div>
                <div
                  className="clickEdit"
                  onClick={() => setEditUserData(true)}
                >
                  edit user data
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {settingsView === "change password" && (
        // ability to view passwords too
        <div className="rightOfSettings changePass">
          {updatePassErr && <div>{updatePassErr}</div>}
          <div>Change password</div>
          <div className="changePasswordForm">
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
            <button
              type="button"
              className="settingsButtons"
              onClick={cancelPassword}
            >
              cancel
            </button>
            <button
              type="button"
              className="settingsButtons"
              onClick={() => updatePass(passwordData)}
            >
              change password
            </button>
          </div>
        </div>
      )}
      {settingsView === "delete" && (
        <div className="rightOfSettings dltAcc">
          <div>Delete account?</div>
          <div>
            Your account will be permanently deleted and everything associated
            with it will no longer be available to other users or yourself; once
            you delete your account there is no recovering it.
          </div>
          <div>
            <button
              type="button"
              className="settingsButtons"
              onClick={() => settingsView(null)}
            >
              cancel
            </button>
            <button
              type="button"
              className="settingsButtons"
              onClick={() => setDeleteClicked(true)}
            >
              delete
            </button>
          </div>
          {deleteClicked && (
            <div
              className="delete account modal"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteClicked(false);
              }}
            >
              {deleteAccErr && (
                <div className="delete err modal">
                  <div>
                    <div>{deleteAccErr}</div>
                  </div>
                </div>
              )}
              <div onClick={deleteMyAccount}>Permanently delete account</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Settings;
