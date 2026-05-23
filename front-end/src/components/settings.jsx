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

import DefaultIcon from "../imgs/default.svg";
import Close from "../imgs/eye.png";
import View from "../imgs/view.png";

function Settings() {
  const { user } = useOutletContext();
  const [settingsView, setSettingsView] = useState(null);
  const [editUserData, setEditUserData] = useState(false);
  const [openIconHeader, setOpenIconHeader] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const [viewCurrentPass, setViewCurrentPass] = useState(false);
  const [viewNewPass, setViewNewPass] = useState(false);
  const [viewConfirmPass, setViewConfirmPass] = useState(false);

  const nav = useNavigate();

  const [iconHeaderData, setIconHeaderData] = useState({
    pfp: "",
    header: "",
  });

  const [updateData, setUpdateData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.profile.bio || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: updatePass,
    error: updatePassErr,
    reset: resetPasswordUpdate,
  } = useMutation({
    ...updatePassword(),
    onSuccess: () => {
      setSettingsView(null);
    },
  });

  const { mutate: updateIMGS, error: imgUpdateErr } = useMutation({
    ...updateIMGs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
      queryClient.invalidateQueries({ queryKey: ["checkSession"] });
      setOpenIconHeader(false);
      setSettingsView(null);
    },
  });

  const { mutate: updateUserData, error: dataUpdateErr } = useMutation({
    ...updateUData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user.username] });
      queryClient.invalidateQueries({ queryKey: ["checkSession"] });
      setEditUserData(false);
    },
  });

  const { mutate: deleteMyAccount, error: deleteAccErr } = useMutation({
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
                  {user?.profile?.header && user.profile.header !== "white" ? (
                    <img
                      className="currentHeader"
                      src={`http://localhost:5555/IMGS-API/${user.profile.header}`}
                      alt="your header"
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="currentHeader"
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    ></div>
                  )}
                </div>
                <div className="iconHolder">
                  <img
                    className="currentIcon"
                    src={
                      user?.profile?.pfp && user.profile.pfp !== "default.svg"
                        ? `http://localhost:5555/IMGS-API/${user.profile.pfp}`
                        : DefaultIcon
                    }
                    alt="your profile img"
                    style={{ cursor: "pointer" }}
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
                      <div>{imgUpdateErr.error}</div>
                    </div>
                  </div>
                )}

                <div>
                  {iconHeaderData.header ? (
                    <img
                      className="wantedHeader noHeaderOverlay"
                      src={URL.createObjectURL(iconHeaderData.header)}
                      alt="your updated header"
                      onClick={(e) => e.target.nextElementSibling.click()}
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  ) : user?.profile?.header &&
                    user.profile.header !== "white" ? (
                    <img
                      className="wantedHeader overlay"
                      src={`http://localhost:5555/IMGS-API/${user.profile.header}`}
                      alt="your updated header"
                      onClick={(e) => e.target.nextElementSibling.click()}
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="wantedHeader overlay"
                      style={{ backgroundColor: "white", width: "100%" }}
                      onClick={(e) => e.target.nextElementSibling.click()}
                    ></div>
                  )}
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
                        ? user?.profile?.pfp &&
                          user.profile.pfp !== "default.svg"
                          ? `http://localhost:5555/IMGS-API/${user.profile.pfp}`
                          : DefaultIcon
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
                        updateIMGS(iconHeaderData);
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
                  <div>
                    <div>cake day</div>
                    <div>{user.joined.split("T")[0]}</div>
                  </div>
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
                    onClick={() => {
                      updateUserData(updateData);
                    }}
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
                  <div>@{user.username}</div>
                  <div>{user.email}</div>
                  <div>{user.profile.bio}</div>
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
          {updatePassErr && (
            <div className="passwordErrModal">
              {updatePassErr.noUserFound && (
                <>
                  <div>Sorry, this account cannot be found</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nav("/");
                    }}
                  >
                    login/signup
                  </button>
                </>
              )}
              {updatePassErr.serverError && (
                <>
                  <div>Sorry, server error</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetPasswordUpdate();
                    }}
                  >
                    try again
                  </button>
                </>
              )}
            </div>
          )}
          <div>Change password</div>
          {updatePassErr && (
            <div>
              {updatePassErr.PasswordsDontMatch && (
                <div className="validationErr">
                  Current password is incorrect
                </div>
              )}
              {updatePassErr.validationErrors &&
                updatePassErr.validationErrors.map((error, index) => (
                  <div className="validationErr" key={index}>
                    {error.msg || error.message || error}
                  </div>
                ))}
            </div>
          )}
          <div className="changePasswordForm">
            <div>
              <label htmlFor="">Current password:</label>
              <input
                type={viewCurrentPass ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
              {viewCurrentPass ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewCurrentPass(false);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={Close}
                    alt="dont show password"
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewCurrentPass(true);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={View}
                    alt=" show password"
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="">New password:</label>
              <input
                type={viewNewPass ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              {viewNewPass ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewNewPass(false);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={Close}
                    alt="dont show password"
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewNewPass(true);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={View}
                    alt=" show password"
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="">Confirm new password:</label>
              <input
                type={viewConfirmPass ? "text" : "password"}
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value,
                  }))
                }
              />
              {viewConfirmPass ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewConfirmPass(false);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={Close}
                    alt="dont show password"
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewConfirmPass(true);
                  }}
                >
                  <img
                    className="passwordViewImgs"
                    src={View}
                    alt=" show password"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="changePassBtns">
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
              update
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
          <div class="dltAccBtns">
            <button
              type="button"
              className="settingsButtons"
              onClick={() => setSettingsView(null)}
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
              <div
                className="areYouSureDLT"
                onClick={(e) => e.stopPropagation()}
              >
                <div>Are you sure you want to delete your account?</div>
                <div>
                  <button
                    type="button"
                    className="settingsButtons"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteClicked(false);
                    }}
                  >
                    cancel
                  </button>
                  <button
                    type="button"
                    className="settingsButtons"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMyAccount();
                    }}
                  >
                    delete account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Settings;
