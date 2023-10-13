import React from "react";
import { ReactSession } from "react-client-session";
import DialerApp from "../dialer.jsx";
// Components
import SignupForm from "../Components/Login/SignUpForm.jsx";
import LoginForm from "../Components/Login/LoginForm.jsx";
import testiPictureSid from "../assets/images/sid-review.jpg";
import testiPicturePrabhir from "../assets/images/prabhir-review.jpg";
import logowhite from "../assets/images/logo-white.png";

// Assets
import styles from "../assets/stylesheet/login.module.css";
import { useNavigate } from "react-router-dom";
import ls from 'localstorage-slim';
import { getStorage } from "../service/storageService.js";
import { Carousel } from 'react-responsive-carousel';

const Register = () => {
  const [login, showLogin] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    const initial = async () => {
      let access = await getStorage("access_token");
      await ls.remove("modalOnce");
      let user = JSON.parse(await getStorage("user"));
      let url = window.location.href.split("/");
      if (url[url.length - 1] === "register") showLogin(false);
      if (
        (access !== "null" ||
          access !== undefined ||
          access !== null ||
          access !== "undefined") &&
        user.access_valid === true
      ) {
        if (user.isAdmin) {
          window.location.href = "/admin?a=" + access;
        }
        if (user.user_type === "Company") {
          window.location.href = "/company?a=" + access;
        }
        if (user.user_type === "XI") {
          window.location.href = "/XI?a=" + access;
        }
        if (user.user_type === "User") {
          window.location.href = "/user?a=" + access;
        }
      }
    };
    initial();
  });

  return (
    <div className="row h-screen">

<div
        className=" md:w-1/2 flex bg-white "
      >
        <div className="m-3 mx-5 bg-grey w-full rounded-md flex justify-between flex-col px-5"
                style={{ borderRadius: "2rem" , background: "linear-gradient(180deg, rgba(43, 178, 138, 0.8) 0%, #228276 65.1%)" }}
                >
          {/* top text */}

          <div>
            <img className="pt-4" src={logowhite}></img>
          </div>
          <div>
            <p className="text-sm bg-white rounded-full py-1 px-3 w-fit">360 Degree Talent Hiring Platform</p>
            <p className="text-7xl text-white mt-3">ValueMatrix<br/> Biased for Action</p>
            <p className="text-2xl text-white mt-3">Sign-up now and start experiencing the convenience<br/> and ease of our platform</p>
          </div>
          <div>
            .
          </div>
          <Carousel autoPlay='true'>
            <div className="bg-white h-fit mb-5 rounded-xl p-4">
              <div className="mb-4 mx-2 row">
                <div>
                <img src={testiPictureSid}></img>
                </div>
                <div className="ml-3 mt-2">
                <p className="text-xl" align="left">Siddharth Malik</p>
                <p className="text-gray-500">Global CEO CleverTap, Ex CRO Freshworks</p>
                </div>
                
              </div>
              <div>“ Hiring is a big problem with a huge TAM & the way ValueMatrix team is solving is something I believe will surely make them a market leader. I know Aditya, the founder from my Freshworks days and I have full faith in his execution skills. "</div>
            </div>
            <div className="bg-white h-fit mb-5 rounded-xl p-4">
              <div className="mb-4 mx-2 row">
                <div>
                <img src={testiPicturePrabhir}></img>
                </div>
                <div className="ml-3 mt-2">
                <p className="text-xl" align="left">Prabir Jha</p>
                <p className="text-gray-500">Former CHRO Cipla, Tata Motors</p>
                </div>
              </div>
              <div>“ In the war for talent, you need to have the best instruments to help you be certain of the talent you hire. ValueMatrix is your tool to locate right, interview better and select best. All that in the best timelines while reducing the fatigue in the client systems fighting an unending talent war.  "</div>
            </div>
          </Carousel>
        </div>
      </div>

      <div className="container md:w-1/2 flex bg-white rounded-lg" style={{ borderRadius: "0.7rem" }}>
        <div className="w-full flex flex-col self-center">
          <SignupForm />
          <p className="pb-5 text-center text-md block">
            Already have an account ?{" "}
            <span
              className="text-blue-700 font-semibold cursor-pointer"
              onClick={() => {
                navigate('/login');
              }}
            >
              {" "}
              Log In{" "}
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;

