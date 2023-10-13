import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from "react-pro-sidebar";
import "../../assets/stylesheet/layout.scss";

import "react-pro-sidebar/dist/css/styles.css";
import { dashboardRoutes } from "../../routes";
import { RiAdminFill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { getUserFromId, LogoutAPI } from "../../service/api";
import "../../assets/stylesheet/sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import swal from "sweetalert";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiSettings, FiGrid } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import {
  userUpgradePostRequest,
  OTPSms,
  updateUserDetails,
} from "../../service/api";
import { Fragment } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { FaLock } from "react-icons/fa";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const [menu, setMenu] = React.useState(false);
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  const [activePage, setActivePage] = React.useState(null);
  const [close, setClose] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [u_id, setU_id] = React.useState(null);
  const hasWindow = typeof window !== "undefined";
  const [smsOTP, setsmsOTP] = React.useState("");
  const [otp, setotp] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const [arr, setArr] = React.useState([]);

  const sideRef = React.useRef(null);
  const Logout = async () => {
    let user = await getStorage("user");
    user = JSON.parse(user);
    setU_id(user._id);
    let res = await LogoutAPI(user._id);
    ls.set("user", null);
    ls.set("access_token", null);
    window.location.href = "/login";
  };

  const navigate = useNavigate();
  
  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    // //console.log(width);
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      setClose(getWindowDimensions().width);

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  const handleToggle = () => {
    if (close < 1336) {
      setToggled(!toggled);
      setCollapsed(!collapsed);
      setsmsOTP("");
    }
  };

  const handlePopup = () => {
    swal({
      title: "This will upgrade your profile to expert interviewer.",
      text: "Click OK to continue",
      icon: "success",
      buttons: true,
      dangerMode: false,
    }).then((respose) => {
      if (respose) {
        handleUpgradeXIRequest();
        setsmsOTP("");
        // swal("Your account upgradation request is raised successfully", {
        //   icon: "success",
        // });
      } else {
        swal("Request cancelled");
      }
    });
  };


  const handleUpgradeXIRequest = async () => {
    let user = await getStorage("user");
    user = JSON.parse(user);
    setUser(user);
    setotpModal(true);
    let resend = await OTPSms({ contact: user.contact });
    // //console.log(resend)
    setotp(resend);
    // swal({
    //   title: "Are you sure?",
    //   text: "Once upgraded, you will not be able to downgrade!",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // }).then((respose) => {
    //   if (respose) {
    //     handleUpgradeXIRequestPost();
    //     // swal("Your account upgradation request is raised successfully", {
    //     //   icon: "success",
    //     // });
    //   } else {
    //     swal("Request cancelled");
    //   }
    // });
  };
  const [profileCompleted,setProfileCompleted] = useState(false)
  useEffect(()=>{
    const fetchUser = async() => {
      let access_token = getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      let user1 = await getUserFromId({ id: user?._id }, access_token);
      if (!user1?.data?.user?.profileImg || !user1?.data?.user?.linkedinurl || user1?.data?.user?.tools.length == 0) {
        setProfileCompleted(false);
      } else {
        setProfileCompleted(true);
      }
    };
    fetchUser();
  },[profileCompleted])

  const handleUpgradeXIRequestPost = async () => {
    let access_token = getStorage("access_token");
    let user = JSON.parse(await getStorage("user"));
   //  console.log('USER------------', user)
    // let res = await userUpgradePostRequest(
    //   {
    //     u_id: u_id,
    //   },
    //   access_token
    // );
    let res = await updateUserDetails(
      { user_id: user._id, updates: { status: "Pending", user_type: "XI" } },
      { access_token: user.access_token }
    );

    if (res) {
      console.log("resp: ",res?.data?.user);
      if(res?.data?.user){
        ls.set("user", null);
        ls.set("user", JSON.stringify(res?.data?.user));
      }
      swal("Your account upgradation request is raised successfully", {
        icon: "success",
      }).then(()=>{
        navigate("/XI");
      });
    } else {
      swal("Request Failed! Something went wrong", {
        icon: "error",
      });
    }
  };

  return (
    <div className="sidebarComponent z-20">
      {otpModal && (
        <Transition
          appear
          show={otpModal}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => {}}
            static={true}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-auto">
                    <div className="py-5 w-full bg-blue-900 flex">
                      <p className="text-lg mx-5 text-center text-white font-semibold">
                        Enter OTP
                      </p>
                    </div>

                    <div className="my-16 w-full">
                      <h2 className="mx-auto w-fit">
                        OTP sent to {user.contact}{" "}
                      </h2>
                    </div>

                    <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-56"></div>
                    <div className="mx-56 my-5">
                      <h3>Enter OTP</h3>
                      <input
                        id="smsOTP"
                        type="number"
                        name="smsOTP"
                        onChange={handleOTP}
                        placeholder="Enter OTP"
                        className="w-full"
                        style={{ borderRadius: "12px", marginTop: "10px" }}
                      ></input>
                    </div>

                    <div className="w-full my-16 flex justify-center">
                      <button
                        className="border-2 text-black font-bold py-3 px-8 w-fit md:mx-4 text-xs rounded"
                        onClick={async () => {
                          let resend = await OTPSms({ contact: user.contact });
                          // //console.log(resend)
                          setotp(resend);
                        }}
                      >
                        Resend OTP
                      </button>
                    </div>

                    <div className="flex my-16 justify-center">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        required
                        onClick={async () => {
                          // //console.log(smsOTP);
                          // //console.log(otp);

                          if (smsOTP == otp) {
                            handleUpgradeXIRequestPost();
                            setotpModal(false);
                          }
                          else if (smsOTP == "" || smsOTP == null) {
                            swal({
                              title: "Please enter OTP !",
                              message: "Error",
                              icon: "error",
                              button: "Continue",
                            });
                          }
                           else {
                            swal({
                              title: "Invalid OTP !",
                              message: "Error",
                              icon: "error",
                              button: "Continue",
                            });
                          }
                        }}
                      >
                        Submit
                      </button>

                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setotpModal(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* sidebar starts here */}

      <div
        className="h-screen fixed top-20 left-0"
        style={{ marginTop: "-10px" }}
      >
        <div
          className="absolute text-gray-9 left-5 -top-10   text-gray-800 text-xl menu"
          style={{ zIndex: 18 }}
        >
          <AiOutlineMenu
            className="text-md menu-bar"
            onClick={() => {
              handleToggle();
            }}
            style={{ zIndex: 20 }}
          />
        </div>

        <ProSidebar
          // toggled={menu}
          // onToggle={(prev)=>setMenu(!prev)}
          // width={280}
          id="prosidebar"
          ref={sideRef}
          className="fixed left-0 h-screen z-0 text-left active text-gray-500"
          style={{ backgroundColor: "#FAFAFA" }}
          breakPoint="xl"
          collapsed={collapsed}
          toggled={toggled}
          onToggle={handleToggle}
        >
          {/* <button
            className=" hover:bg-blue-700 text-white font-bold py-2 px-4 mx-auto text-xs mt-4 flex text-center rounded-lg"
            style={{ backgroundColor: "#034488" }}
          >
            
            <p className="py-1 px-2 text-sm font-bold">
              {" "}
              <AiOutlinePlus />
            </p>
            <p className="py-1">Connect New Account</p>
          </button> */}
          <SidebarContent style={{ zIndex: -1 }} className="text-left mx-1 ">
            <Menu iconShape="square">
              {/* <MenuItem
           
          >
           Value matrix
          </MenuItem> */}
              <MenuItem
                className="text-gray-700 font-semibold flex"
                active={
                  window.location.pathname === `/user/` ||
                  window.location.pathname === `/user`
                }
                onClick={() => handleToggle()}
              >
                {" "}
                <p className="text-xl flex mx-2 my-2">
                  <FiGrid />
                  <p className="text-sm mx-4  text-gray-700 font-semibold">
                    Dashboard{" "}
                  </p>
                </p>
                <Link to={`/user/`} />
              </MenuItem>

              <p className="text-gray-400 font-bold text-xs mx-4 my-3">Menu</p>
              {dashboardRoutes.map((item, id) => {
                // console.log("loc", window.location.pathname.split("/")[2]);
                if (item.hide === false && item.name !== "Interviews" && item.name !== 'Invitations') {
                  return (
                    <MenuItem
                      // className="text-gray-500 font-semibold"
                      className={
                        arr.includes(id)
                          ? "text-gray-800 font-bold"
                          : "text-gray-400 font-semibold"
                      }
                      active={window.location.pathname === `/user/${item.path}`}
                      icon={item.icon}
                    >
                      {item.name}{" "}
                      <Link
                        to={`/user/${item.path}`}
                        onClick={() => {
                          setOpen(true);
                          handleToggle();
                        }}
                      />
                      {/* <p>lock</p> */}
                    </MenuItem>
                  );
                } else if (item?.name == "Interviews" || item?.name == "Invitations") {
                  if (!profileCompleted) {
                    return (
                      <div className="row m-1">
                        <MenuItem
                          // className="text-gray-500 font-semibold"
                          className={
                            arr.includes(id)
                              ? "text-gray-800 font-bold"
                              : "text-gray-400 font-semibold"
                          }
                          onClick={() => {
                            swal({
                              icon: "error",
                              title: "Locked",
                              text: "Complete the profile to view this section",
                              button: "Continue",
                            });
                          }}
                          icon={item.icon}
                        >
                          {item.name}
                        </MenuItem>
                        <FaLock className="mt-3 text-gray-800" />
                      </div>
                    );
                  } else {
                    return (
                      <MenuItem
                        // className="text-gray-500 font-semibold"
                        className={
                          arr.includes(id)
                            ? "text-gray-800 font-bold"
                            : "text-gray-400 font-semibold"
                        }
                        active={
                          window.location.pathname === `/user/${item.path}`
                        }
                        icon={item.icon}
                      >
                        {item.name}{" "}
                        {profileCompleted ? (
                          <>
                            <Link
                              to={`/user/${item.path}`}
                              onClick={() => {
                                setOpen(true);
                                handleToggle();
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FaLock
                              onClick={() => {
                                swal({
                                  icon: "error",
                                  title: "Locked",
                                  text: "Complete the profile to view this section",
                                  button: "Continue",
                                });
                              }}
                            />
                          </>
                        )}
                      </MenuItem>
                    );
                  }
                }
              })}
            </Menu>
          </SidebarContent>
          <div className="mx-4 my-24">
            {/* <div className="flex m-2">
              <a
                href="/user/profile"
                className="text-gray-700 mx-4 py-2 font-semibold"
              >
                <FiSettings />{" "}
              </a>
              <a
                href="/user/profile"
                className="text-gray-700  font-semibold py-1"
              >
                Settings
              </a>
            </div> */}
            {props.user && props.user.isAdmin === true && (
              <MenuItem icon={<FaUserCog className="text-xl" />}>
                <Link to="/admin">Admin Panel</Link>
              </MenuItem>
            )}
            {/* {profileCompleted?
            <button
              className=" hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs mt-4 self-center rounded-lg w-full"
              style={{ backgroundColor: "#228276" }}
              onClick={handlePopup}
            >
              {/* <p classname=" py-2"><AiOutlinePlus/></p> */}
              {/* <p className="py-1">Become XI</p>
            </button>
            :null} } */}
            <div
              className="flex m-2"
              onClick={Logout}
              style={{ cursor: "pointer" }}
            >
              <p className="text-gray-700   py-2 font-semibold">
                <MdOutlineLogout />{" "}
              </p>
              <p className="text-gray-700 ml-3 font-semibold py-1">Log Out</p>
            </div>
          </div>
        </ProSidebar>
        {/* 
      <div className="flex">
        <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
          <div className="space-y-3">
            <div className="flex items-center">
            </div>
            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                {dashboardRoutes.map((item) => {
                  if (item.hide === false)
                    return (
                      <li className="rounded-sm">


                        <Link
                          to={`/user/${item.path}`}
                          onClick={() => setOpen(true)}
                        > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-gray-600">{item.icon} </p>  <p className="font-bold"> {item.name}</p> </span></Link>

                      </li>)
                })}

                {props.user && props.user.isAdmin === true && (
                  // <MenuItem
                  // icon={<FaUserCog className="text-xl"/>}>
                  //   <Link to="/admin">Admin Panel</Link>
                  // </MenuItem>

                  <Link
                    to={`/admin`}

                  > <span className="flex my-2 p-3 text-gray-700"> <p className="mx-2 text-xl text-gray-600"> <RiAdminFill/></p>  <p className="font-bold">Admin Panel</p> </span></Link>

                )}

              </ul>
            </div>
          </div>
        </div>

      </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
