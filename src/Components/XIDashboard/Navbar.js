import React from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Avatar from "../../assets/images/UserAvatar.png";
import { LogoutAPI, getProfileImage, getUserFromId, updatePassword } from "../../service/api";
import { ReactSession } from "react-client-session";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import NotificationPopOver from "../Dashbaord/Notifications.jsx";
import { FiLogOut } from "react-icons/fi";
import { MdOutlinePassword } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";

const HorizontalNav = (props) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [progress, setProgress] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);

  const Logout = async () => {
    let user = await getStorage("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);

    await ls.set("user", null);
    await ls.set("access_token", null);
    window.location.href = "/login";
  };

  const Changepassword = async () => {

  };

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let step = 0;
      await setUser(user);
      if (user && user.profileImg) {
        let image = await getProfileImage({ id: user._id }, user.access_token);
        if (image?.status === 200) {
          await ls.set("profileImg", JSON.stringify(image));
          let base64string = btoa(
            String.fromCharCode(...new Uint8Array(image?.data?.Image?.data))
          );
          let src = `data:image/png;base64,${base64string}`;
          await setProfileImg(src);
        }
      }
      if (user.resume) {
        step++;
      }
      if (user.tools.length > 0) {
        step++;
      }
      if (user.education.length > 0) {
        step++;
      }
      if (user.contact !== user.id && user.address && user.email) {
        step++;
      }
      if (user.experience.length > 0) {
        // step++;
      }
      let progress = (step / 5) * 100;
      await setProgress(progress);
    };
    initial();
  }, []);

  // React.useEffect(() => {
  //   const initial = async () => {
  //     let user = JSON.parse(getStorage("user"));
  //     let userData = await getUserFromId(
  //       { id: user._id },
  //       user.access_token
  //     );
  //     await setUser(userData.data.user.user)
  //   }
  //   initial();
  // }, []);

  return (
    <div className="flex items-center border-b-2 w-full pl-4 py-3 shadow-md">
      <div className="text-slate-600 text-lg md:block hidden ">
        <img className="h-10 mx-5" src={logo} />
      </div>
      {/*
      <div className="md:w-3/5 mx-auto pl-7 w-1/2">
        <form>
          <label
            for="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              style={{
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                backgroundColor: "transparent",
              }}
              type="search"
              id="default-search"
              className="block p-3 pl-10 w-full text-sm text-gray-500 rounded-lg border-none  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type to search"
              required
            />
            {//<button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> 
            }
          </div>
        </form>
      </div>*/}

      <div className="space-x-8   ml-auto flex mr-8 items-center">
        <NotificationPopOver />
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
              ${open ? "" : "text-opacity-90"} focus:outline-0`}
              >
                <div className="flex space-x-3 items-center cursor-pointer">
                  <div className="text-xs text-start md:block hidden">
                    {user ? (
                      <p className="text-md text-semibold">
                        {user.firstName} {user.lastname}
                      </p>
                    ) : (
                      <p className="text-md text-semibold">XI</p>
                    )}
                  </div>
                  <img
                    src={
                      user && user.profileImg && profileImg
                        ? profileImg
                        : Avatar
                    }
                    //src={Avatar}
                    className="h-7 w-7 md:h-7 md:w-7 rounded-full"
                    alt="userAvatar"
                  />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-screen z-10 mt-3 w-[10vw] -translate-x-full transform px-4 sm:px-0 lg:max-w-3xl ">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      {progress < 100 && (
                        <div>
                          <Link className="text-xs" to="/user/editProfile">
                            Complete Your Profile
                          </Link>
                          <div className="w-full bg-gray-200 h-1 mb-6">
                            <div
                              className="bg-blue-400 text-xs h-1"
                              style={{ width: progress + "%" }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <span className="flex items-center mb-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer">
                          <Link
                            to="/XI/profile"
                            className="flex space-x-2 items-center"
                          >
                            <AiOutlineUser /> <p>View Profile</p>
                          </Link>
                        </div>
                      </span>
                      <span className="flex items-center row">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
                          onClick={openModal}
                        >
                          <MdOutlinePassword /> <p>Change password</p>
                        </div>
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
                          onClick={Logout}
                        >
                          <MdOutlineLogout /> <p>Logout</p>
                        </div>
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Change Password
                      <div style={{ float: "right" }}>
                        <ImCross onClick={closeModal} />
                      </div>
                    </Dialog.Title>
                    <div className="mt-2">
                      <Formik
                        initialValues={{
                          currentPassword: "",
                          newPassword: "",
                          confirmpassword: "",
                        }}
                        validate={(values) => {
                          const errors = {};
                          if (!values.currentPassword) {
                            errors.currentPassword = "Required";
                          }
                          if (!values.newPassword) {
                            errors.newPassword = "Required";
                          }
                          if (!values.confirmpassword) {
                            errors.confirmpassword = "Required";
                          }
                          if (
                            values.newPassword !== "" &&
                            values.confirmpassword !== "" &&
                            values.newPassword !== values.confirmpassword
                          ) {
                            errors.confirmpassword =
                              "Both password must be same";
                          }
                          return errors;
                        }}
                        onSubmit={(values, { resetForm }) => {
                          let dataForUpdate = {
                            ...values,
                            userId: user._id,
                          };
                          updatePassword(dataForUpdate).then((result) => {
                            if (result && result.status == 200) {
                              swal({
                                title: "Success",
                                text: "Password Updated Successfully",
                                icon: "success",
                                button: "Ok",
                              }).then(() => {
                                window.location.reload();
                              });
                            } else {
                              swal({
                                icon: "error",
                                title: "Update Password",
                                text: "Incorrect Details",
                                button: "Continue",
                              }).then(() => {
                                // window.location.reload();
                                resetForm();
                              });
                            }
                          });
                        }}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            <Field
                              type="password"
                              name="currentPassword"
                              placeholder="Current Password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage
                              name="currentPassword"
                              component="div"
                            />
                            <Field
                              type="password"
                              name="newPassword"
                              placeholder="Enter new password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage name="password" component="div" />
                            <Field
                              type="password"
                              name="confirmpassword"
                              placeholder="Confirm new password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage
                              name="confirmpassword"
                              component="div"
                              style={{ color: "red" }}
                            />
                            <button
                              type="submit"
                              // disabled={isSubmitting}
                              className=" mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                              Submit
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default HorizontalNav;

