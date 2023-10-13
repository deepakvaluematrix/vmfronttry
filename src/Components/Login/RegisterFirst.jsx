import React from "react";
import { useNavigate } from "react-router-dom";
import testiPictureSid from "../../assets/images/sid-review.jpg";
import testiPicturePrabhir from "../../assets/images/prabhir-review.jpg";
// Components
import LoginForm from "../../Components/Login/LoginForm.jsx";
import logowhite from "../../assets/images/logo-white.png";
import { Carousel } from 'react-responsive-carousel';

const RegisterFirst = () => {
  const [login, showLogin] = React.useState(true);
  const navigate = useNavigate();

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

      <div className="container md:w-1/2 flex bg-white">
        <div className="w-full flex flex-col self-center">
        <h2 className="text-xl font-bold mb-4">Hello there, </h2>
        <h3 className="text-xl font mb-4">We encountered an problem while trying to sign you in. Please check, </h3>

        <h4 className="text-xl font mb-4">1. Ensure you are a registered user. If not, kindly use the "Sign Up" link below to create a new account.</h4>
        <h4 className="text-xl font mb-4">2. Verify your SSO credentials to ensure they are correct.</h4>        
        
         <h3 className="text-xl font mb-4">If you encounter any further difficulties, don't hesitate to reach out to our support team for assistance at <b>support@valuematrix.ai</b>. We'll be glad to help you with the login process.</h3>

          <p className="pb-5 text-center mt-4 text-md block">
            <b>Don't have an account ?</b>{" "}
            <span
              className="text-blue-700 font-semibold cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              {" "}
              Sign Up{" "}
            </span>

          </p>
        </div>
      </div>

    </div>
  );
};

export default RegisterFirst;
