import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import swal from "sweetalert";

// Assets
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { adminLogin, authenticateLogin, url } from "../../service/api";
import logo from "../../assets/images/logo.png"
import CircularProgress from '@mui/material/CircularProgress';
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { useNavigate } from "react-router-dom";

const LoginForm = (props) => {
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [error, setError] = React.useState(0);
  const [captcha, setCaptcha] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const captchaRef = React.useRef();
  const navigate = useNavigate();

  const Login = async (values) => {
    if (captcha === false && error >= 3) {
      setCaptchaError("Confirm Captcha");
      return;
    } else {
      setCaptchaError(null);
    }
    let res = null;
    setLoading(true);
    if (props.admin) res = await adminLogin(values);
    else res = await authenticateLogin(values);
    //let access = res?.headers?.access;
    //let version= res?.headers?.vmversion;
    let access = res?.data?.access_token;
    let user = res?.data?.user;
    if (res) {
      setCaptcha(true);
      setCaptchaError(null);
      setLoading(false);
      ls.set("access_token", access);
      ls.set("vm_version",'0.1');
      if (res?.data?.user?.invite) {
        navigate("/setProfile/" + res?.data?.user?.resetPassId);
      } else if (res.data.user.user_type === "User")
        navigate("/user?a=" + access);
      else if (
        res?.data?.user?.user_type === "Company" ||
        res?.data?.user?.user_type === "Company_User"
      )
        navigate("/company?a=" + access);
      else if (res?.data?.user?.user_type === "XI" || res?.data?.user?.user_type === "SuperXI")
        navigate("/XI?a=" + access);
      else if (
        res?.data?.user?.isAdmin ||
        res?.data?.user?.user_type === "Admin_User"
      ) {
        navigate("/admin?a=" + access);
      }
      
    } else {
      setCaptcha(false);
      if (captchaRef.current !== undefined) {
        captchaRef.current.reset();
      }
      let e = error + 1;
      setError(e);
      if (error >= 3) {
        setCaptcha(false);
      }
      
      swal({
        title: "Login",
        text: "Username and Password doesn't match !",
        icon: "error",
        button: false,
      });
      setLoading(false);
    }
  };

  return (
    <div className="pt-5 lg:p-7 h-100 mx-[100px] lg:mx-[30px] p-5">
      <span
        style={{ fontWeight: 700 }}
        className="text-4xl font-bold flex pl-9"
      >
      </span>
      <div className="my-2">
        <span className="text-4xl font-semibold pl-9">
          Welcome!
        </span>
      </div>
      <div className="my-2">
        <span className="text-xl mt-2 font-semibold text-slate-400 pl-9">
          Please enter your details.
        </span>
      </div>
      <div className=" px-6 mx-6 lg:p-4 pt-4">
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={(values) => {
            Login(values);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-2 pt-3">
              <div className="mt-3">
                <label className="text-sm font-semibold">Username, Phone or Email Address</label>
                <br></br>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username, Phone or Email Address"
                  className="w-full text-600 my-1"
                  style={{ borderRadius: "8px" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-xs text-red-600 mb-4"
                />
              </div>
              <div className="pt-2">
                <label className="text-sm font-semibold">Password</label>
                <br/>
                <div
                  className="w-full flex items-center"
                  style={{ borderRadius: "12px" }}
                >
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full text-600 my-1"
                    style={{ borderRadius: "8px" }}
                  />
                  <div className="relative flex items-center">
                  {showPassword ? (
                    <p
                      className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3" 
                      onClick={() => {
                        setShowPassword(false);
                      }}
                    >
                      <AiFillEyeInvisible className="text-xl" />
                    </p>
                  ) : (
                    <p
                      className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold absolute right-3" 
                      onClick={() => {
                        setShowPassword(true);
                      }}
                    >
                      <AiFillEye className="text-xl"/>
                    </p>
                  )}
                  </div>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <div className="w-100 mt-10">
                <p className="text-sm text-blue-600 text-right font-semibold">
                  <Link to="/resetPassword">Forgot Password ?</Link>
                </p>
              </div>
              {error >= 3 && (
                <div>
                  <ReCAPTCHA
                    sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"
                    onChange={(value) => {
                      setCaptcha(true);
                    }}
                    ref={captchaRef}
                  />
                </div>
              )}
              {captchaError && (
                <p className="text-sm my-0 text-red-600">{captchaError}</p>
              )}
              {!loading && (
                <button
                  className="bg-emerald-700 px-4 py-2 text-white rounded-md font-bold text-lg block mt-6 mx-auto hover:bg-emerald-700 text-center w-full cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "#228276" }}
                >
                  Log In
                </button>
              )}
              {loading && (
                <button className="bg-emerald-700 px-4 py-2 text-white rounded-md font-bold text-lg block mt-6 mx-auto hover:bg-emerald-700 text-center w-full cursor-pointer"
                style={{ backgroundColor: "#228276" }}>
                 <CircularProgress size={20} />
                </button>
              )}
            </Form>
          )}
        </Formik>

        <div className="flex space-x-3 justify-center w-full items-center text-gray-400 py-4">
          <p className="text-gray-400 text-md font-semibold"> or login using  </p>
        </div>
        <div className="flex flex-row justify-center space-x-2 h-7 mt-3">
          <form className="w-1/3" action={`${url}/auth/google`}>
            <button type="submit" className="my-0.5 w-full ">
              <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">
                <img
                  src={Google}
                  alt="google-login"
                  className="cursor-pointer h-5 my-2"
                />
                <p className="text-s font-semibold px-2 self-center">Google</p>
              </div>
            </button>
          </form>
          {/* <form className="w-1/3" action={`${url}/auth/microsoft`}>
            <button type="submit" className="my-0.5 w-full">
              <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                <img
                  src={Microsoft}
                  alt="microsoft-login"
                  className="cursor-pointer h-5 my-2"
                />

                <p className="text-s font-semibold px-2 self-center">Microsoft</p>
              </div>
            </button>
          </form> */}
          <form className="w-1/3" action={`${url}/auth/linkedin`}>
            <button type="submit" className="my-0.5 w-full">
              <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                <img
                  src={Linkedin}
                  alt="linkedin-login"
                  className="cursor-pointer h-5 my-2"
                />
                <p className="text-s font-semibold px-2 self-center">Linkedin</p>
              </div>
            </button>
          </form>
        </div>
        <div className="h-5 block"></div>
      </div>
    </div>
  );
};


export default LoginForm;
