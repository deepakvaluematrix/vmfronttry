import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";
import { getProfileImage, getXIInfo } from "../../service/api";
import { BiErrorCircle } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { Oval } from "react-loader-spinner";
// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Tabs from "../../Components/Dashbaord/Tabs.jsx";
const UserProfile = () => {
  let navigate = useNavigate();

  // let url = window.location.href;
  // let type = url.split("/")[3];
  // console.log(type);

  // Access Token And User State
  const [user, setUser] = React.useState();
  const [level, setLevel] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [loader, setLoader] = React.useState(true);

  // Sets User and AccessToken from SessionStorage

  React.useEffect(() => {
    ////console.log("Checked");
    const func = async () => {
      let user = JSON.parse(await getStorage("user"));

      let access_token = getStorage("access_token");

      let xi_info = await getXIInfo(user._id);
      ////console.log(xi_info);
      if (xi_info.data.user) {
        setLevel(xi_info.data.user.level);
        setLoader(false);
      }
      if (user && user.profileImg) {
        setLoader(false);
        let image = await getProfileImage({ id: user._id }, user.access_token);
        ////console.log(image)
        if (image?.status === 200) {
          await ls.set("profileImg", JSON.stringify(image));

          // let base64string = btoa(
          //  String.fromCharCode(...new Uint8Array(image.data.Image.data))
          // );

          let base64string = btoa(
            new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
              return data + String.fromCharCode(byte);
            }, "")
          );
          let src = `data:image/png;base64,${base64string}`;
          await setProfileImg(src);
        }
      }
      if (access_token === null) window.location.href = "/login";

      setLoader(false);
      await setUser(user);
    };
    func();
  }, []);

  return (
    <div className="flex sm:p-1 overflow-hidden">
    {/* <Sidebar /> */}

    <div className="container mx-auto bg-slate-50 mt-8 ">
      <div className="  bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5 p-4 ">
      {loader ? (
        <div className="mt-40" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Oval /><Oval /><Oval /><Oval /><Oval />
        </div>
      ) : (
      <div className="h-100 w-full -z-[10]">
        {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
        {user !== null && user !== undefined && (
          <div className="w-auto">
            <div className="relative  rounded-md w-full py-3 md:flex pb-5  ">
              <div className="absolute">
                <img
                  src={
                    user && user.profileImg && profileImg ? profileImg : Avatar
                  }
                  //src={Avatar}
                  className=" h-36 w-36 md:h-32 md:w-32 lg:h-56 lg:w-56 rounded-full relative"
                  alt="userAvatar"
                />
              </div>

              <div className="mt-20 md:ml-60 md:px-5 sm:mx-5 md:text-left">
                <p className="font-semibold md:text-3xl mx-6  text-2xl ">
                  {user.firstName} {user.lastname}
                </p>
                <p className="text-gray-400 mx-6 text-lg">{user.username}</p>
                {level !== null && (
                  <p className="text-gray-400 mx-6 text-lg">Level : {level}</p>
                )}
                <div className="mx-6 my-2">
                    <div className="flex space-x-3">
                      <div className="flex items-center space-x-3 py-1">
                        {user && user?.profileImg ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Uploaded Profile Image</p>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        {user && user?.linkedinurl ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Connected LinkedIn Profile</p>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        {user && user?.tools.length > 0 ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Updated Skills</p>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        {user && user?.resume ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Uploaded Resume</p>
                      </div>
                    </div>
            </div>
              </div>
              <div className=" mt-3 md:text-right  md:ml-auto sm:text-left flex-col">
                <div className="my-3 w-10 h-10 d-flex ml-auto" style={{background: "#FFFFFF", border: "1px solid #E3E3E3", borderRadius: "20px"}}>
                  <ModeEditOutlineOutlinedIcon
                    className="hover:text-blue-600 cursor-pointer m-auto"
                    style={{color: "#228276"}}
                    onClick={() => {
                      let url = window.location.href;
                      let type = url.split("/")[3];
                      // window.location.href = "/" + type + "/editProfile";
                      let link = "/" + type + "/editProfile"
                      navigate(link)
                    }}
                  />
                </div>
                {/* <button
                  className="font-bold py-3 px-8 mt-9 text-xs rounded"
                  style={{ backgroundColor: "#FFFFFF", color: "#228276", border: "1px solid #228276" }}
                  onClick={() => {
                    let url = window.location.href;
                    let type = url.split("/")[3];
                    window.location.href = "/" + type + "/editProfile";
                  }}
                >
                  Upload Resume
                </button> */}
              </div>
            </div>
            <div
              className="my-12 rounded-lg pt-3 mr-2 w-full outline outline-offset-2 outline-2 outline-slate-200  bg-white"
              style={{ borderRadius: "12px" }}
            >
              <div className="App " style={{ borderRadius: "12px" }}>
                <Tabs />
              </div>
            </div>
          </div>
        )}{" "}
      </div>
    )}
    </div></div></div>
  );
};

export default UserProfile;
