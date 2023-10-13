
import React, { useRef, useEffect, Fragment,useState } from "react";
import 'react-phone-input-2/lib/style.css'
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import wildcards from "disposable-email-domains/wildcard.json";
import swal from "sweetalert";
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog, Transition } from "@headlessui/react";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Assets
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Github from "../../assets/images/Social/github.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Loader from "../../assets/images/loader.gif";
import logo from "../../assets/images/logo.png"
import {
  authenticateSignUp,
  OTPMail,
  OTPSms,
  validateSignupDetails,
  url,
  countryCodeList,
  findCompanyById,
} from "../../service/api";
import data from "./termsAndConditions.json";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";
import { sendSMSOTP, verifySMSOTP } from "../../service/otpService";

const validateUserEmail = (value) => {
  let domain = value.split("@")[1];
  let host = domain.split(".")[0];
  if (wildcards.includes(host) | wildcards.includes(domain)) {
    return false;
  }
  return true;
};

const validateCompanyEmail = (value) => {
  let domain = value.split("@")[1];
  let host = domain.split(".")[0];
  let domains = ["gmail", "yahoo", "bing"];
  if (domains.includes(host)) {
    return false;
  }
  return true;
};

const SignupForm = () => {
  let [seconds, setSeconds] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  const [signupError, setSignupError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [OTP, setOTP] = React.useState(null);
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [SmsOTP, setSMSOTP] = React.useState(null);
  const [SmsOTPError, setSmsOTPError] = React.useState(false);
  const [EmailOTPError, setEmailOTPError] = React.useState(false);
  const [EmailError, setEmailError] = React.useState(null);
  const [SmsError, setSmsError] = React.useState(null);
  const [countryCode, setcountryCode] = React.useState([]);

  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [captcha, setCaptcha] = React.useState(false);

  const [emailLoading, setEmailLoading] = React.useState(false);
  const [contactLoading, setContactLoading] = React.useState(false);
  const [verifyEmail, setverifyEmail] = React.useState(false);

  const [smsLoad, setSmsLoading] = React.useState(false);
  const [verifySms, setverifySms] = React.useState(false);
  const [verifycode, setverifyCode] = React.useState(false);

  const [modal, setModal] = React.useState(false);
  const [expandButton, setExpandButton] = React.useState(false);
  const [expandButtonIndex, setExpandButtonIndex] = React.useState(null);

  const [companyId, setCompanyId] = useState("");
  const [showCompanyField, setShowCompanyField] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [varifiedCompanyId, setVarifiedCompanyId] = useState(false);
  const [validContact, setValidContact] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const captchaRef = React.useRef();

  const OTPField = useRef(null);

  const varifyCompany = async (companyId) => {
    let res = await findCompanyById({ companyId });

    if (res.data.status == 404) {
      swal({
        title: "Verification failed",
        text: "Invalid Company ID",
        icon: "error",
        button: false,
      });
    } else {
      swal({
        title: "Comapny ID Verified",
        text: "Company ID Verified successfully",
        icon: "success",
        button: "Continue",
      }).then(() => {
        setVarifiedCompanyId(true);
      });
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, seconds]);

  // Format the remaining seconds as "MM:SS".
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  useEffect(() => {
    const initial = async () => {
      let countryCode = await countryCodeList();
      setcountryCode(countryCode.data)
    }
    initial();

  }, [])

  const handleVerifyEmailOTP = values => {
    verifyEmailOTP(values);
  };

  const handleSendEmailOTP = values => {
    sendEmailOTP(values);
  };


  const sendEmailOTP = async (values) => {
    setEmailLoading(true);
    if (values.user_type === "Company") {
      if (validateCompanyEmail(values.email) === false) {
        swal({
          title: "Sign Up",
          text: "Enter Company Email !",
          icon: "error",
          button: false,
        });
        return;
      }
    }
    if (validateUserEmail(values.email) === false) {
      swal({
        title: "Sign Up",
        text: "Invalid Email Address",
        icon: "error",
        button: false,
      });
      return;
    }
    setSignupError(null);
    let check = await validateSignupDetails(values);
    // //console.log(check.data);
    if (check.data.username && check.data.email === true) {
      setSignupError("Username and Email Already Registered");
      swal({
        title: "Sign Up",
        text: "Username and Email Already Registered",
        icon: "error",
        button: false,
      });
    }

    if (check.data.email) {
      swal({
        title: "Sign Up",
        text: "Email Already Registered",
        icon: "error",
        button: false,
      });
    }

    if (check.data.username) {
      swal({
        title: "Sign Up",
        text: "Username Already Registered",
        icon: "error",
        button: false,
      });
    }
    if (check.data.username || check.data.email) {
      setEmailLoading(false);
      return;
    }

    let res2 = await OTPMail({ mail: values.email });

    if (res2) {
      setEmailOTP(res2);
      setEmailLoading(false);
    } else if (!res2) {
    }
  };

  const verifyEmailOTP = async (values) => {
    if (parseInt(values.EmailOTP) === parseInt(EmailOTP)) {
      setEmailOTPError(false);
      setverifyEmail(true);
      swal({
        title: "OTP Verified!",
        text: ".",
        icon: "success",
        button: false,
      });
    } else {
      swal({
        title: "Invalid OTP!",
        text: ".",
        icon: "error",
        button: false,
      });
    }
    if (verifyEmail && verifySms) {
      setOTP(true);
    }
  };


  /**
   * Send OTP message via sms
   * @param {*} values 
   * @returns 
   */
  const sendSmsOTP = async (values) => {
    setContactLoading(true);
    setIsRunning(true);
    setSeconds(120);
    if (values.user_type === "Company") {
      if (validateCompanyEmail(values.email) === false) {
        swal({
          title: "Sign Up",
          text: "Enter Company Email !",
          icon: "error",
          button: false,
        });
        return;
      }
    }
    setSignupError(null);
    setSmsLoading(true);
    setverifySms(false);
    let check = await validateSignupDetails(values);

    if (check.data.username && check.data.contact) {
      swal({
        title: "Sign Up",
        text: "Username or contact or both already in use",
        icon: "error",
        button: false,
      });
    }

    if (check.data.contact) {
      swal({
        title: "Sign Up",
        text: " Contact already in use",
        icon: "error",
        button: false,
      }).then(()=>{
        setverifySms(false);
        setIsRunning(false);
      });
    }
    if (check.data.username) {
      swal({
        title: "Sign Up",
        text: "Username not available",
        icon: "error",
        button: false,
      });
    }
    if (check.data.username || check.data.contact) {
      setContactLoading(false);
      return;
    }
    // right now just send country code India. This will be updated once we have more countries
    let countryCode;
    if (values?.countryCode || values.countryCode.trim() === '') {
      countryCode="+91";
    }else{
      countryCode=values?.countryCode;
    }

    let respSMSOTP = await sendSMSOTP(values?.contact,countryCode);
    if(respSMSOTP){
      if(respSMSOTP?.status===201){
        swal({
          title: "Contact verification",
          text: respSMSOTP?.data?.details,
          icon: "error",
          button: false,
        });
      }else if(respSMSOTP?.status===200){
        setSMSOTP(respSMSOTP);
      }
    }else{
      swal({
        title: "Contact verification",
        text: "Something went wrong. Please check if the contact is valid.",
        icon: "error",
        button: false,
      }).then(()=>{
        setverifySms(false);
        setIsRunning(false);
      });
    }
    setContactLoading(false);
  };

  const verifySmsOTP = async (values) => {
    if(values && values?.SmsOTP && values?.contact){
      let verifyOTPResp = await verifySMSOTP(values?.contact,values?.SmsOTP);
      if(verifyOTPResp){
        setSmsOTPError(false);
        setverifySms(true);
      }else{
        swal({
          title: "Contact OTP",
          text: "Invalid contact OTP. Please enter a valid one and retry",
          icon: "error",
          button: false,
        });
      }
    }
  };

  const signup = async (values) => {
    if (!verifyEmail) {
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
      return;
    }
    if (!verifySms) {
      swal({
        title: "Sign Up",
        text: "Invalid OTP!",
        icon: "error",
        button: false,
      });
      return;
    }

    if (
      verifySms &&
      parseInt(values.EmailOTP) === parseInt(EmailOTP)
    ) {
      if (captcha === false) {
        setShowCaptcha(true);
      } else if (captcha) {
        let res = await authenticateSignUp(values);
        setSmsOTPError(false);
        setEmailOTPError(false);
        setLoading(true);


        if (res && !res.data.Error) {
          swal({
            title: "Sign Up",
            text: "Signup Successfull",
            icon: "success",
            button: "Continue",
          }).then(async () => {
            let user = res.data.user;
            let access = res.data.access_token;
            await ls.set("user", JSON.stringify(user));
            await ls.set("access_token", access);
            if (user.user_type === "User")
              window.location.href = "/user/profile";
            else if (
              user.user_type === "Company" ||
              user.user_type === "Company_User"
            )
              window.location.href = "/company/profile";
            else if (user.user_type === "XI")
              window.location.href = "/XI/?a=" + access;
            else if (user.isAdmin) window.location.href = "/admin/?a=" + access;
          });
        } else if (res) {
          setSignupError(res.data.Error);
          setOTP(null);
        } else {
          setOTP(null);
          setSignupError("Error Signing Up");
          OTPField.current = "";
          setEmailOTPError(null);
          setSmsOTPError(null);
        }
        setLoading(false);
      }
    } else if (parseInt(values.SmsOTP) !== parseInt(SmsOTP)) {
      setSmsOTPError(true);
    } else {
      setEmailOTPError(true);
    }
  };

  return (
    <div className="px-7 pt-5  lg:p-7 mx-[100px] lg:mx-[30px]">
      <span
        style={{ fontWeight: 700 }}
        className="text-3xl font-bold flex px-4"
      >
      </span>
      <br></br>
      <div className="p-4 lg:p-8 pt-2  pb-2 px-7">
        <p className="text-4xl font-semibold mb-4" >
          Create New Account{" "}
        </p>

        <Formik
          initialValues={{
            name: "",
            email: "",
            username: "",
            password: "",
            user_type: "User",
            contact: "",
            agree: false,
            countryCode: "",
          }}



          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Username Required";
            } else if (values.username.length > 50) {
              errors.username = 'Must be 20 characters or less';
            } else if (!/^[a-zA-Z]+$/.test(values.username)) {
              errors.username = 'Only alphabets and spaces are allowed';
            }

            if (!values.name) {
              errors.name = "Name Required";
            } else if (values.name.length > 50) {
              errors.name = 'Must be 20 characters or less';
            } else if (!/^[a-zA-Z ]+$/.test(values.name)) {
              errors.name = 'Only alphabets and spaces are allowed';
            }
            if (!values.email) {
              errors.email = "Email Required";
              setValidEmail(false);
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid Email Address";
              setValidEmail(false);
            }else{
              setValidEmail(true);
            }

            if (values.user_type && values.user_type!=='User' &&!values.companyId) {
              errors.companyId = "Company ID Required";
            }
            if (!values.contact) {
              errors.contact = "Contact Required";
              setValidContact(false);
            } else if (
              !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                values.contact
              )
            ) {
              errors.contact = "Invalid Contact Number";
              setValidContact(false);
            }else{
              setValidContact(true);
            }
            if (!values.password) {
              errors.password = "Required";
            }
            if (!values.countryCode || values.countryCode === "") {
              errors.countryCode = "Country Code Required";
            }
            if (!values.agree) {
              errors.agree = "You need to accept to continue";
            }
            return errors;
          }}
          onSubmit={(values) => {
            signup(values);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-3 py-1">
              <div className="my-2">
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full"
                  disabled={OTP !== null}
                  style={{ borderRadius: "12px" }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-red-600"
                />
              </div>
              <div className="my-2">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full"
                  disabled={OTP !== null}
                  style={{ borderRadius: "12px" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-xs text-red-600"
                />
              </div>
              <div className="ml-1 row self-center">
                <label className="self-center">Register As : </label>
                <div className="mb-2 w-[300px] ml-2 ">
                <Field
                  as="select"
                  name="user_type"
                  className="w-full"
                  style={{ borderRadius: "12px" }}
                >
                  <option value="User">Candidate</option>
                  <option value="Company">Company</option>
                </Field>
              </div>
              </div>
              {values?.user_type == 'Company' && (
                <>
                  <div className="my-2">
                    <Field
                      type="text"
                      name="companyId"
                      placeholder="Company ID"
                      className="w-full"
                      style={{ borderRadius: "12px" }}
                    />
                    <ErrorMessage
                      name="companyId"
                      component="div"
                      className="text-xs text-red-600"
                    />

                  <div className="d-flex w-full justify-content-between space-x-2">
                      {!varifiedCompanyId && (
                        <button
                          type="button"
                          className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 cursor-pointer"
                          style={{ backgroundColor: "#228276" }}
                          onClick={()=>{varifyCompany(values?.companyId);}}
                        >
                          {" "}
                          Verify CompanyID
                          {/* {!emailLoading ? (EmailOTP ? "Resend OTP" : "Verify CompanyID") : <CircularProgress size={20} />} */}
                        </button>
                      )}


                    </div>


                  </div>
                </>
              )}
              <div className="my-1">
                <Field
                  type="text"
                  name="email"
                  disabled={verifyEmail}
                  placeholder="Email"
                  className="w-full"
                  style={{ borderRadius: "12px" }}
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-600"
                />
                {EmailOTP && !verifyEmail && (
                  <Field
                    type="number"
                    name="EmailOTP"
                    refs={OTPField}
                    placeholder="Email OTP"
                    className="w-full my-2"
                    style={{ borderRadius: "12px" }}
                  />
                )}
                {EmailOTP && EmailOTPError && (
                  <p className="text-xs text-red-600">Invalid Email OTP !</p>
                )}
                {EmailError && (
                  <p className="text-xs text-red-600">Email Not Verified !</p>
                )}

                <div className="d-flex w-full justify-content-between space-x-2">
                  {!verifyEmail && validEmail && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 cursor-pointer"
                      style={{ backgroundColor: "#228276" }}
                      onClick={()=>{handleSendEmailOTP(values)}}
                    >
                      {" "}
                      {!emailLoading ? (EmailOTP ? "Resend OTP" : "Send OTP") : <CircularProgress size={20} />}
                    </button>
                  )}

                  {EmailOTP && !verifyEmail && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 cursor-pointer"
                      style={{ backgroundColor: "#228276" }}
                      onClick={()=>{handleVerifyEmailOTP(values)}}
                     

                    >
                      {" "}
                      Verify OTP
                    </button>
                  )}

                  {EmailOTP && verifyEmail && (
                    <p
                      className="p-2"
                      style={{ fontWeight: 600, color: "green" }}
                    >
                      Email Verified
                    </p>
                  )}
                </div>
              </div>
              <div className="my-1 w-full">

                <div className="grid grid-cols-2 gap-4 py-2">
                  <Field component="select" id="countryCode" name="countryCode" className="col-span-1 rounded-lg"
                    style={{
                      borderRadius: "12px 0 0px 12px",
                    }}
                    multiple={false}
                    disabled={false}>
                    <option value={``}>
                      Select
                    </option>
                    <option value={`+91`}>
                      India<span> </span>{'  '} (+91)
                    </option>

                    {/* {countryCode &&
                      countryCode.map((item) => {
                      })} */}
                  </Field>
                  <Field
                    type="text"
                    name="contact"
                    disabled={verifySms}
                    placeholder="Contact Number"
                    className="col-span-1 rounded-lg"
                    style={{
                      borderRadius: " 0 12px 12px 0",
                    }}
                  />
                </div>

                <ErrorMessage
                  name="contact"
                  component="div"
                  className="text-xs text-red-600"
                />
                <ErrorMessage
                  name="countryCode"
                  component="div"
                  className="text-xs text-red-600"
                />
                {SmsOTP && !verifySms && (
                  <>
                  <Field
                    type="text"
                    name="SmsOTP"
                    // refs={OTPField}
                    placeholder="Contact OTP"
                    className="w-1/2"
                    style={{ borderRadius: "12px", marginTop: "10px" }}
                  /> {" "}
                  <span style={{ border: '1px solid lightgreen', color: 'maroon',padding: '4px',}}> {formattedTime}</span>
                  </>
                )}
                {SmsOTP && SmsOTPError && (
                  <p className="text-sm text-red-600">Invalid SMS OTP !</p>
                )}
                {SmsError && (
                  <p className="text-sm text-red-600">Contact Not Verified !</p>
                )}

                <div className="d-flex w-full space-x-2">
                  
                  {!verifySms && validContact && !isRunning && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 py-1 cursor-pointer"
                      style={{ backgroundColor: "#228276" }}
                      onClick={() => sendSmsOTP(values)}
                    >
                      {" "}
                      {!contactLoading ? (SmsOTP ? "Resend OTP" : "Send OTP") : <CircularProgress size={20} />}
                    </button>
                  )}

                  {SmsOTP && !verifySms && (
                    <button
                      type="button"
                      className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 py-1 cursor-pointer"
                      style={{ backgroundColor: "#228276" }}
                      onClick={() => verifySmsOTP(values)}
                    >
                      Verify OTP
                    </button>
                  )}
                  {SmsOTP && verifySms && (
                    <p
                      className="p-2"
                      style={{ fontWeight: 600, color: "green" }}
                    >
                      Contact Verified
                    </p>
                  )}
                </div>
              </div>
              <Field
                type="password"
                name="password"
                disabled={OTP !== null}
                placeholder="Password"
                className="w-full"
                style={{ borderRadius: "12px" }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-600"
              />

              {signupError && (
                <p className="text-xs text-red-600">{signupError}</p>
              )}
              <div>
                <Field type="checkbox" name="agree" className="mr-2" />
                <label>
                  I agree to the{" "}
                  {/* <a href="#" target="_blank">
                    Terms and conditions
                  </a>{" "} */}
                  <span className="hover:text-[#007bff] hover:underline cursor-pointer"
                    onClick={() => setModal(true)}
                  >
                    terms and conditions {" "}
                  </span>
                  and{" "}
                  <a href="#" target="_blank">
                    privacy policy
                  </a>
                  .
                </label>
                <ErrorMessage
                  name="agree"
                  component="div"
                  className="text-xs text-red-600 w-100"
                />
              </div>

              <div>
                <div className="w-full justify-center flex">
                  <ReCAPTCHA
                    sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"

                    onChange={(values) => {
                      setCaptcha(true);
                    }}
                    ref={captchaRef}
                  />
                </div>
                {captchaError && (
                  <p className="text-sm my-0 text-red-600">{captchaError}</p>
                )}
              </div>

              {!loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-lg mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
                  type="submit"
                  style={{ backgroundColor: "#228276" }}
                >
                  SignUp
                </button>
              )}
              {loading && (
                <button
                  className="bg-blue-600 px-8 py-2 text-white rounded-lg mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
                  style={{ backgroundColor: "#228276" }}
                >
                  <CircularProgress size={20} />
                </button>


              )}
            </Form>
          )}
        </Formik>
        {/* <div className="flex space-x-3 justify-center w-full items-center text-gray-600 py-3">
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
          <p> or </p>
          <div className="h-[0.5px] w-12 bg-gray-600 block"></div>
        </div> */}
        {/* <div className="flex flex-row justify-center space-x-2 h-7 mt-3">
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
          <form className="w-1/3" action={`${url}/auth/microsoft`}>
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
          </form>
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
        </div> */}
        <div className="lg:h-5 h-0 block"></div>
      </div>
      {modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
            static={true}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
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
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-6xl m-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                    <div className={`${!modal ? "hidden" : "block"} h-full`}>
                      <div className="w-full h-full">
                        <div className="w-full h-full">
                          <div className="">
                            <div className="my-6 px-4 w-3/4 md:w-full text-left flex justify-between">
                              <div className="mt-auto mb-auto">
                                <p className="font-semibold text-[#333333]">Terms of services</p>
                              </div>
                              <div className="">
                                <AiOutlineClose className="cursor-pointer" 
                                  onClick={() => {
                                    setModal(false);
                                    setExpandButton(false);
                                    setExpandButtonIndex(null);
                                  }}
                                />
                              </div>              
                            </div>
                          </div>
                          <div className="h-[83vh] overflow-y-scroll">
                            {data.map((details, index) => {
                              return (
                                <div className="w-full bg-[#FFFFFF] flex flex-col justify-between"
                                  onClick={() => {
                                    setExpandButton(!expandButton);
                                    setExpandButtonIndex(index);
                                  }}
                                >
                                  <div className="flex flex-row justify-between hover:border-b cursor-pointer px-4  py-3 hover:shadow ">
                                    <div className="mt-auto mb-auto">
                                      <p >{details.title}</p>
                                    </div>
                                    <span >
                                      {expandButton===true && expandButtonIndex === index ? (
                                        <>
                                          <AiOutlineUp />
                                        </>
                                      ) : (
                                        <>
                                          <AiOutlineDown />
                                        </>
                                      )}
                                    </span>
                                  </div>
                                  {expandButton===true && expandButtonIndex === index ? (
                                    <>
                                      <div className="overflow-x-auto py-3 px-4 bg-[#FAFAFA]">
                                        <p>
                                          {data[expandButtonIndex].descrption.split("\n").map(item=><div>{item}</div>)}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <>  
                                    </>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}    
    </div>
  );
};

export default SignupForm;
