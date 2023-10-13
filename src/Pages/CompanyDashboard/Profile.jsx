import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../Components/CompanyDashboard/Card.jsx";
import ProgressBar from "@ramonak/react-progress-bar";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Tabs from "../../Components/CompanyDashboard/Tabs.jsx";
import { getProfileImage } from "../../service/api";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const CompanyProfile = () => {
  let navigate = useNavigate();

  // Access Token And User State
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);

  // Sets User and AccessToken from SessionStorage

  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await getStorage("user"));
      //console.log(user);
      let access_token = getStorage("access_token");
      if (user && user.profileImg) {
        let image = await getProfileImage({id: user._id}, user.access_token);
          await ls.set("profileImg", JSON.stringify(image));
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image?.data?.Image?.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfileImg(src);
      }
      if (access_token === null) window.location.href = "/login";

      await setUser(user);
    };
    func();
  }, []);

  return (
    <div className="bg-slate-100 ml-10 mr-9 lg:mr-4">
      {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
      {user !== null && user !== undefined && (
        <div className="my-3 mx-5">
          <div
            className="md:h-48 h-24 w-full relative"
            style={{ background: "#99DEFF" }}
          ></div>
          <div className="relative rounded-md w-full py-3 md:flex">
          <div className="absolute sm:left-6 sm:px-2 -top-20 md:-top-28 md:left-20 ">
              <img
                src={
                  user && user.profileImg && profileImg ? profileImg : Avatar
                }
                //src={Avatar}
                className=" h-36 w-36 md:h-32 md:w-32 lg:h-56 lg:w-56 rounded-full relative"
                alt="userAvatar"
              />
            </div>

            <div className="mt-16 md:ml-80 md:px-5 md:mt-3  sm:ml-7 md:text-left">
              <p className="font-semibold md:text-3xl text-2xl ">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className=" mt-3 md:text-right  md:ml-auto sm:text-left flex-col">
            <div className="my-3 w-10 h-10 d-flex ml-auto" style={{background: "#FFFFFF", border: "1px solid #E3E3E3", borderRadius: "20px"}}>
              <ModeEditOutlineOutlinedIcon
                className="hover:text-blue-600 cursor-pointer m-auto"
                // style={{backgroundColor:"#034488"}}
                style={{color: "#228276"}}
                onClick={() => {
                  let url = window.location.href;
                  let type = url.split("/")[3];
                  window.location.href = "/" + type + "/editProfile";
                }}
              />
            </div>
            </div>
          </div>
          {/* <div className=" mt-3 md:text-right  md:ml-auto sm:text-left flex-col">
              <div className="my-3 w-10 h-10 d-flex ml-auto" style={{background: "#FFFFFF", border: "1px solid #E3E3E3", borderRadius: "20px"}}>
                <ModeEditOutlineOutlinedIcon
                  className="hover:text-blue-600 cursor-pointer m-auto"
                  style={{color: "#228276"}}
                  onClick={() => {
                    let url = window.location.href;
                    let type = url.split("/")[3];
                    window.location.href = "/" + type + "/editProfile";
                  }}
                />
              </div> */}

          <div
            className="my-7 rounded-lg pt-3 w-full"
            style={{ borderRadius: "12px" }}
          >
            <div className="App " style={{ borderRadius: "12px" }}>
              <Tabs />
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default CompanyProfile;
