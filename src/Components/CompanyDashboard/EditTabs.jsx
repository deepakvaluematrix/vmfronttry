import React from "react";

import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
import { Combobox } from "@headlessui/react";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Assets
import "react-multi-carousel/lib/styles.css";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  getCountryList,
  fetchCountry,
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop.jsx";
import { AiOutlineHome, AiOutlineUser, AiOutlineFolderAdd } from "react-icons/ai";
import { RiBillLine } from "react-icons/ri";
import cities from "cities.json";
// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";

export default function Tabs(props) {
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);

  // States for the Page
  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);

  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);

  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);


  // Company contact page error
  const [cnameErroor , setcnameError] = React.useState(null)
  const [cityError , setCityError] = React.useState(null)
  const [stateError , setStateError] = React.useState(null)
  const [countryError , setCountryError] = React.useState(null)
  const [fieldErrors , setFieldErrors] = React.useState(null)

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);
  const [upImg, setUpImg] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [profileImg, setProfileImg] = React.useState(null);
  const [aboutDetail, setAboutDetail] = React.useState([]);
  const [billingDetail, setBillingDetail] = React.useState([]);
  const [error, setFormError] = React.useState(false);
  const [conerror, setConError] = React.useState(false);
  const [country, setSelectedCountry] = React.useState([]);
  const [tax, setTax] = React.useState([]);
  const [selectedAddCity, setSelectedAddCity] = React.useState(cities[103]);
  const [Addquery, setAddQuery] = React.useState("");
  const [inputField, setInputField] = React.useState({
    about: "",
    motto: "", 
    industry: "",
    found: "",
    website: "",
    company_size: "",
  });

  const [inputField1, setInput1Field] = React.useState({
    firstName: "",
    houseNo: "",
    street: "",
    // city: "",
    state: "",
    country: "",
    zip: "",
  });


  const filteredAddCity =
    Addquery === ""
      ? cities.slice(0, 5)
      : cities
        .filter((Addcity) => {
          return (
            Addcity.country.toLowerCase().includes(Addquery.toLowerCase()) ||
            Addcity.name.toLowerCase().replace("ā", "a")
              .replace("ò", "o")
              .replace("à", "a").includes(Addquery.toLowerCase())
          );
        })
        .slice(0, 5);

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await getStorage("user"));
      setUser(e);
      if (e === null) return null;
      let ed = e.desc;
      if (ed !== "null" || ed !== null) {
        setAboutDetail(ed);
      }
      if (aboutDetail === null) {
        setAboutDetail([]);
      }

      let eb = e.billing;
      if (eb !== "null" || eb !== null) {
        setBillingDetail(ed);
      }
      if (aboutDetail === null) {
        setBillingDetail([]);
      }

      let country = await getCountryList();
      setSelectedCountry(country.data.countries[0].country);

      let tax_id = await fetchCountry();
      setTax(tax_id.data.countries);
    };
    initial();
  }, []);

  const save = async (values) => {

    let fieldErrors = {}

    setcnameError(null)
    setCityError(null)
    setStateError(null)
    setCountryError(null)

    if(!values?.firstName || values?.firstName === undefined || values?.firstName === ""){
      // setcnameError("Required")
      // return
      fieldErrors.cname = "Required"
    }
    else if(/^\s/.test(values?.firstName)){
      // setCityError("City name cannot start with space")
      // return
      fieldErrors.cname = "Company name cannot start with space"
    }
    else if(!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values?.firstName)){
      // setcnameError("Only alphabets and spaces are allowed or limit exeeds")
      // return
      fieldErrors.cname = "Only alphabets and spaces are allowed or limit exeeds"
    }

    if(!values?.city || values?.city === undefined || values?.city === ""){
      // setCityError("Required")
      // return
      fieldErrors.city = "Required"
    }
    else if(/^\s/.test(values?.city)){
      // setCityError("City name cannot start with space")
      // return
      fieldErrors.city = "City name cannot start with space"
    }
    else if(!/^[a-zA-Z][(\w+\s?)][a-zA-Z ]{0,49}$/.test(values?.city)){
      // setCityError("Only alphabets are allowed")
      // return
      fieldErrors.city = "Only alphabets are allowed"
    }

    if(!values.state){
      // setStateError("")
    }
    else if(/^\s/.test(values?.state)){
      // setCityError("City name cannot start with space")
      // return
      fieldErrors.state = "State name cannot start with space"
    }
    else if(!/^[a-zA-Z][(\w+\s?)]+$/.test(values.state))
    {
      // setStateError('Only alphabets are allowed or limit exeeds')
      // return
      fieldErrors.state = "Only alphabets are allowed or limit exeeds"
    }
    if (!values.country) {
      // setCountryError("Required")
      // return
      fieldErrors.country = "Required"
    } else if (!/^[a-zA-Z][a-zA-Z ]{0,60}$/.test(values.country)) {
      // setCountryError('Only alphabets are allowed  or limit exeeds')
      // return
      fieldErrors.country = "Only alphabets are allowed  or limit exeeds"
    }

    if (Object.keys(fieldErrors).length > 0) {
      setFieldErrors(fieldErrors); // Set field-specific errors object
      return;
  }

    if (values.firstName) {
      if (!conerror) {
        let user = JSON.parse(getStorage("user"));
        console.log("user",user)
        let city = selectedAddCity;

        if (selectedAddCity.name) {
          city = selectedAddCity.name
        }
        user.username = values.username;
        user.firstName = values.firstName;
        // user.lastname = values.lastName;
        user.houseNo = values.houseNo;
        user.street = values.street;
        user.city = city;
        // user.country = values.country;
        user.country = "India"
        user.state = values.state;
        user.zip = values.zip;
        setUser(user);
        ls.set("user", JSON.stringify(user));
        
        let data = {
          firstName: values.firstName,
          // lastName: values.lastName,
          desc: values.desc,
          billing: values.billing,
          houseNo: values.houseNo,
          street: values.street,
          city: values.city,
          country: values.country,
          state: values.state,
          zip: values.zip,
        };
        if (EmailOTP) {
          data.email = values.email;
        }
        if (ContactOTP) {
          data.contact = values.contact;
        }
        console.log(data);
        let res = await updateUserDetails(
          { user_id: user._id, updates: {data} },
          { access_token: access_token }
        );
    
        if (res.data.Error) {
          if (res.data.contact) {
            setError(res.data.Error);
            return;
          }
          if (res.data.email) {
            setError(res.data.Error);
            return;
          }
        } else if (res) {
          swal({
            icon: "success",
            title: "EditProfile",
            text: "Details Updated Succesfully",
            button: "Continue",
          }).then(async () => {
            await ls.set("user", JSON.stringify(res.data.user));
            window.location.href = "/company/profile";
          });
        } else {
        }
        // swal({
        //   icon: "success",
        //   title: "EditProfile",
        //   text: "Details Saved",
        //   button: "Continue",
        // });
      } else {
        swal({
          icon: "error",
          title: "EditProfile",
          text: "Incorrect Details",
          button: "Continue",
        });
      }
    }

    if (values.about) {
      let e = JSON.parse(await getStorage("user"));
      const temp = [...user.desc];
      temp[0] = values;
      e.desc = temp;
      setUser(e);
      await ls.set("user", JSON.stringify(e));
      await setAboutDetail(temp);
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

    if (values.gst || values.pan) {
      if (!error) {
        let e = JSON.parse(await getStorage("user"));
        const temp = [...user.billing];
        temp[0] = values;
        e.billing = temp;
        setUser(e);
        await ls.set("user", JSON.stringify(e));
        await setBillingDetail(temp);
        swal({
          icon: "success",
          title: "EditProfile",
          text: "Details Saved",
          button: "Continue",
        });
      } else {
        swal({
          icon: "error",
          title: "EditProfile",
          text: "Incorrect Details",
          button: "Continue",
        });
      }
    }
  };

  const submit = async (values) => {
    let wait = 0;
    if (EmailOTP === null && ContactOTP === null)
      wait = await SendOTPFunction(values);
    if (wait !== 0) return;
    if (EmailOTP && ContactOTP) {
      if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Email OTP and Contact OTP");
        return;
      }
    }
    if (EmailOTP && values.emailOTP !== EmailOTP) {
      setError("Invalid Email OTP");
      return;
    }
    if (ContactOTP && values.contactOTP !== ContactOTP) {
      setError("Invalid Contact OTP");
      return;
    }
    // update(user);
  };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({ email: values.email });
      if (emailValidate.data.email === true) {
        setError("Email Already Registered");
        return 1;
      }
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      let contactValidate = await validateSignupDetails({
        contact: values.contact,
      });
      if (contactValidate.data.contact === true) {
        setError("Contact Already Registered");
        return 1;
      }
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    return wait;
  };

  // const update = async (values) => {

  //   let data = {
  //     firstName: values.firstName,
  //     // lastName: values.lastName,
  //     desc: values.desc,
  //     billing: values.billing,
  //     houseNo: values.houseNo,
  //     street: values.street,
  //     city: values.city,
  //     country: values.country,
  //     state: values.state,
  //     zip: values.zip,
  //   };
  //   if (EmailOTP) {
  //     data.email = values.email;
  //   }
  //   if (ContactOTP) {
  //     data.contact = values.contact;
  //   }
  //   console.log(data);
  //   let res = await updateUserDetails(
  //     { user_id: user._id, updates: {data} },
  //     { access_token: access_token }
  //   );

  //   if (res.data.Error) {
  //     if (res.data.contact) {
  //       setError(res.data.Error);
  //       return;
  //     }
  //     if (res.data.email) {
  //       setError(res.data.Error);
  //       return;
  //     }
  //   } else if (res) {
  //     swal({
  //       icon: "success",
  //       title: "EditProfile",
  //       text: "Details Updated Succesfully",
  //       button: "Continue",
  //     }).then(async () => {
  //       await ls.set("user", JSON.stringify(res.data.user));
  //       window.location.href = "/company/profile";
  //     });
  //   } else {
  //   }
    
  // };

  const isSubmitDisabled = () => {
    return (
      !inputField.about ||
      !inputField.motto ||
      !inputField.website ||
      !inputField.industry ||
      !inputField.company_size
    );
  };

  const isSubmitDisabled1 = () => {
    return (
      !inputField1.firstName ||
      !inputField1.houseNo ||
      !inputField1.street ||
      !inputField1.city ||
      !inputField1.state ||
      !inputField1.country ||
      !inputField1.zip
    );  
  };
  

  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      if (access_token1 === "null" || access_token === "undefined")
        await ls.set("access_token", user.access_token);
      if (user && user.profileImg) {
        let image = JSON.parse(await getStorage("profileImg"));
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfilePic(src);
      }
      await setUser(user);
      await setToken(access_token1);
    };
    initial();
  }, []);

  return (
    <div className="Tabs w-full">
      <div className="tabList flex w-full">
        <div className={`tabHead ${index === 0 && 'active'}`} onClick={() => { setIndex(0) }}>
          <p className="md:visible hidden content">Contact</p><p className="icons hidden"><AiOutlineHome /></p>
        </div>
        {/* <div className={`tabHead ${index === 1 && 'active'}`} onClick={() => { setIndex(1) }}><p className="md:visible hidden content">About</p><p className="icons hidden"><AiOutlineUser /></p>
        </div> */}
        {/* <div className={`tabHead ${index === 2 && 'active'}`} onClick={() => { setIndex(2) }}> <p className="md:visible hidden content">Billing Details</p><p className="icons hidden"><RiBillLine /></p>
        </div> */}
      </div>
      <div className="tabContent bg-white w-full p-5" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              firstName: user.firstName,
              username: user.username,
              email: user.email ? user.email : " ",
              contact: user.contact
                ? [
                  user.googleId,
                  user.microsoftId,
                  user.linkedInId,
                  user.username,
                  user.githubId,
                ].includes(user.contact)
                  ? " "
                  : user.contact
                : " ",
              emailOTP: "",
              contactOTP: "",
              houseNo: user.houseNo,
              street: user.street,
              city: user.city,
              // country: user.country,
              country : "India",
              state: user.state,
              zip: user.zip,
            }}
            onSubmit={(values) => submit(values)}
            // onSubmit={(values)=>save(values)}
            validate={async (values) => {
              const errors = {};
              if (values.username !== user.username) {
                let check = await validateSignupDetails({
                  username: values.username,
                });
                if (check.data.username) {
                  errors.username = "Username already exists";
                }
              }
              if (!values.firstName) {
                errors.firstName = "Required";
              }
              else if(/^\s/.test(values?.firstName)){
                errors.firstName = "Company name cannot start with space"
              }
              else if(values?.firstName.length > 50){
                values?.firstName?.trim()
                errors.firstName = "Limit Exceeds"
              }
              else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(values?.firstName)) {
                values?.firstName?.trim()
                errors.firstName = "Only alphabets and spaces are allowed"; 
              }
              // else if (!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values.firstName)) {
              //   errors.firstName = 'Only alphabets and spaces are allowed or limit exeeds';
              // }
              
              // if (!values.houseNo) {
              //   errors.houseNo = "Required";
              // } else if (!/^[a-zA-Z0-9][a-zA-Z0-9 ]{0,10}$/.test(values.houseNo)) {
              //   errors.houseNo = 'Only alphanumeric characters and spaces are allowed  or limit exeeds';
              // }
              // if (!values.street) {
              //   errors.street = "Required";
              // } else if (!/^[a-zA-Z0-9][a-zA-Z0-9]{0,10}$/.test(values.street)) {
              //   errors.street = 'Only alphanumeric characters are allowed  or limit exeeds';
              // }
              if (!values.city || values.city === undefined || values.city === null || values.city === "") {
                errors.city = "Required";
              }
              else if(/^\s/.test(values?.city)){
                errors.city = "City name cannot start with space"
              }
              // else if(!/^[a-zA-Z][(\w+\s?)][a-zA-Z ]{0,49}$/.test(values?.city)){
              //   errors.city = "Only alphabets are allowed"
              // }
              else if(values?.city.length > 50){
                values?.city?.trim()
                errors.city = "Limit Exceeds"
              }
              else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(values?.city)) {
                values?.city?.trim()
                errors.city = "Only alphabets are allowed"; 
              }

              if (!values.state) {
                // errors.state = "Required";
                errors.state = ""
              }
              else if(/^\s/.test(values?.state)){
                errors.state = "State name cannot start with space"
              }
              //  else if (!/^[a-zA-Z][a-zA-Z]{0,20}$/.test(values.state)) 
              // else if(!/^[a-zA-Z][(\w+\s?)]+$/.test(values.state))
              // {
              //   errors.state = 'Only alphabets are allowed  or limit exeeds';
              // }
              else if(values?.state.length > 20){
                values?.state?.trim()
                errors.state = "Limit Exceeds"
              }
              else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(values?.state)) {
                values?.state?.trim()
                errors.state = "Only alphabets are allowed "; 
              }
              if (!values.country) {
                errors.country = "Required";
              } else if (!/^[a-zA-Z][a-zA-Z ]{0,60}$/.test(values.country)) {
                errors.country = 'Only alphabets are allowed  or limit exeeds';
              }
              // if (!values.zip) {
              //   errors.zip = "Required";
              // } else if (!/^[1-9][0-9]{0,8}$/.test(values.zip)) {
              //   errors.zip = 'Only numbers are allowed  or limit exeeds';
              // }
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid Email Address";
              }
              if (!values.contact) {
                errors.contact = "Required";
              } else if (
                !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                  values.contact
                )
              ) {
                errors.contact = "Invalid Contact Number";
              }
              if (errors.firstName ||
                // errors.houseNo ||
                // errors.street ||
                errors.city ||
                errors.state ||
                errors.country ||
                // errors.zip ||
                errors.email ||
                errors.contact) {
                setConError(true);
              } else {
                setConError(false);
              }
              return errors;
            }}
          >
            {({ values }) => (
              <Form>
                {Error && <p className="text-sm text-red-500">{Error}</p>}
                <div className="flex flex-wrap w-full gap-y-5">
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Name
                      <span className = "text-sm text-red-600"><b>  * </b></span>
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      required
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-sm text-red-600"
                      // message="*Required"
                    />
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Address
                    </label>
                    <div className="md:w-3/5 sm:w-full md:mx-5 px-4 ">
                      <div
                        className="grid grid-cols-1 gap-32 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 ml-2 md:ml-0 align-middle">
                          {/* <label className="font-semibold text-md py-2">
                            House/ Flat No.
                          </label>
                          <div className="">
                            <Field
                              name="houseNo"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              value={values.houseNo}
                              required
                            />
                            <ErrorMessage
                              name="houseNo"
                              component="div"
                              className="text-sm text-red-600"
                              // message = "*House No. Required"
                            />
                          </div> */}
                        </div>
                        <div className="grid grid-cols-1 mr-3 md:mr-0 lg:grid-cols-2 align-middle ">
                          {/* <label className="font-semibold text-md ml-2 py-2">
                            Street
                          </label>
                          <div >

                            <div className="">
                              <Field
                                name="street"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                value={values.street}
                                required
                              />
                              <ErrorMessage
                                name="street"
                                component="div"
                                className="text-sm text-red-600"
                              />
                            </div>
                          </div> */}
                        </div>
                      </div>
                      {/* <div>
                        <p>
                          Current City :{" "}
                          {values.city ? values.city : ""}
                        </p>
                      </div> */}

                      <div
                        className="grid grid-cols-1 gap-32 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        {/* <div className=" grid grid-cols-1 lg:grid-cols-2 ml-2 md:ml-0 align-middle">
                          <label className="font-semibold text-md py-2">
                            City
                            <span className = "text-sm text-red-600"><b>  * </b></span>
                          </label>
                          <div className="">
                            <Combobox
                              value={selectedAddCity}
                              onChange={setSelectedAddCity}
                            >
                              <Combobox.Input
                                onChange={(event) =>
                                  setAddQuery(event.target.value)
                                }
                                className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-2 py-2"
                                style={{ borderRadius: "3px" }}
                              />
                              <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                {Addquery.length > 0 ? (
                                  // <Combobox.Option className="p-2" value={`${Addquery}`}>
                                  //   Create "{Addquery}"
                                  // </Combobox.Option>
                                  <Combobox.Option
                                  className="p-2"
                                  value={Addquery ? `${Addquery}` : `${values.city}`}
                                >
                                  {Addquery ? `Create "${Addquery}"` : `Use "${values.city}"`}
                                </Combobox.Option>
                                
                                ) : (
                                  <p className="text-red-500">Please enter a valid query.</p>
                                )}

                                {filteredAddCity.length > 0 ? (
                                  filteredAddCity.map((city) => (
                                    <Combobox.Option
                                      key={city.name}
                                      value={`${city.name.replace("ā", "a")
                                        .replace("ò", "o")
                                        .replace("à", "a")},`}
                                    >
                                      {({ active, selected }) => (
                                        <li
                                          className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                            }`}
                                        >
                                          {city.name.replace("ā", "a")
                                            .replace("ò", "o")
                                            .replace("à", "a")}
                                        </li>
                                      )}
                                    </Combobox.Option>
                                  ))
                                ) : (
                                  <p className="text-red-500">No results found.</p>
                                )}
                              </Combobox.Options>

                            </Combobox>

                            <ErrorMessage
                              name="city"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div> */}

                        {/* Update for city */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 align-middle">
                          <label className="font-semibold text-md py-2">
                            City
                            <span className = "text-sm text-red-600"><b>  * </b></span>
                          </label>
                          <div >
                            <div className="">
                              <Field
                                name="city"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                value={values.city}
                                // required
                              />
                              <ErrorMessage
                                name="city"
                                component="div"
                                className="text-sm text-red-600"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 align-middle">
                          <label className="font-semibold text-md py-2">
                            State/<br />Region
                          </label>
                          <div >
                            <div className="">
                              <Field
                                name="state"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                value={values.state}
                                // required
                              />
                              <ErrorMessage
                                name="state"
                                component="div"
                                className="text-sm text-red-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-32 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 align-middle">
                          <label className="font-semibold text-md py-2">
                            Country
                            <span className = "text-sm text-red-600"><b>  * </b></span>
                          </label>
                          <div className="">
                            <Field
                              component="select"
                              id="country"
                              name="country"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              value={values.country}

                              multiple={false}
                              required
                            >
                              {country &&
                                country.map((item) => {
                                  return (
                                    <option value={item.name}>{item.name}</option>
                                  );
                                })}
                            </Field>
                            <ErrorMessage
                              name="country"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 align-middle">
                          {/* <label className="font-semibold text-md ml-2 py-2">
                            Zip Code
                          </label>
                          <div >

                            <div className="">
                              <Field
                                name="zip"
                                type="text"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                className="block border-gray-200 py-1 w-full"
                                value={values.zip}
                                required
                              />

                              <ErrorMessage
                                name="zip"
                                component="div"
                                className="text-sm text-red-600"
                              />
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Email
                      <span className = "text-sm text-red-600"><b>  * </b></span>
                    </label>
                    <Field
                      name="email"
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      // disabled={EmailOTP !== null || ContactOTP !== null}
                      disabled = {true}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Contact
                      <span className = "text-sm text-red-600"><b>  * </b></span>
                    </label>
                    <Field
                      name="contact"
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                      style={{ borderRadius: "5px" }}
                      // disabled={EmailOTP !== null || ContactOTP !== null}
                      disabled = {true}
                    />
                    <ErrorMessage
                      name="contact"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                  {EmailOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-5">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                        style={{ borderRadius: "5px" }}
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-5">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-2 px-4 md:w-3/5 sm:w-4/5 mx-5"
                        style={{ borderRadius: "5px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1  text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Submit
                  </button>

                  {/* <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => !isSubmitDisabled1() && update(user)}
                  >
                    Submit
                  </button> */}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 1}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              about: user?.desc[0]?.about,
              motto: user.desc[0]?.motto,
              industry: user.desc[0]?.industry,
              found: user.desc[0]?.found,
              website: user.desc[0]?.website,
              company_size: user.desc[0]?.company_size,
            }}
            onSubmit={(values)=>save(values)}
            validate={(values) => {
              setInputField({...inputField,
                about:values.about,
                motto:values.motto,
                industry:values.industry,
                found:values.found,
                website:values.website,
                company_size:values.company_size
              })
              const errors = {};
              if (!values.about) {
                errors.about = "Required";
            }
            if (!values.motto) {
              errors.motto = "Required";
            }
            if (!values.industry) {
              errors.industry = "Required";
            }
            if (!values.found) {
              errors.found = "Required";
            }
            if (!values.website) {
              errors.website = "Required";
            }
            if (!values.company_size) {
              errors.company_size = "Required";
            }
              return errors;
            }}
          >
            {/* {({ values, isSubmitting }) => ( */}
            {({ values }) => (
              <Form>
                <div className="flex flex-wrap w-full gap-y-5">

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Overview
                    </label>
                    <div className="flex flex-col md:w-3/4 w-full">
                    <Field
                      type="textarea"
                      className="block border-gray-400 py-2 px-4"
                      style={{
                        borderRadius: "5px",
                        border: "rgb(156 163 175) solid 0.5px",
                      }}
                      name="about"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                    <ErrorMessage
                    name="about"
                    component="div"
                    className="text-sm text-red-600"
                  />
                  </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0 md:flex w-full space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">Motto</label>
                    <div className="flex flex-col md:w-3/4 w-full">
                      <Field
                        type="text"
                        className="block border-gray-400 py-2 px-4"
                        style={{ borderRadius: "5px" }}
                        name="motto"
                        maxLength="450"
                        required
                      />
                      {/* <span className="text-sm text-red-600">
                        {inputField.motto === undefined || inputField.motto === "" ? "Required" : null}
                      </span> */}
                      <ErrorMessage
                        name="motto"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>


                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Website
                    </label>
                    <div className="flex flex-col md:w-3/4 w-full">
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4"
                      style={{ borderRadius: "5px" }}
                      name="website"
                      required
                    />
                    <ErrorMessage
                    name="website"
                    component="div"
                    className="text-sm text-red-600"
                  />
                  </div>
                  </div>



                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Industry
                    </label>
                    <div className="flex flex-col md:w-3/4 w-full">
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4"
                      style={{ borderRadius: "5px" }}
                      name="industry"
                      required
                    />
                    <ErrorMessage
                    name="industry"
                    component="div"
                    className="text-sm text-red-600"
                  />
                  </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Size
                    </label>
                    <div className="flex flex-col md:w-3/4 w-full">
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4"
                      style={{ borderRadius: "5px" }}
                      name="company_size"
                      required
                    />
                    <ErrorMessage
                    name="company_size"
                    component="div"
                    className="text-sm text-red-600"
                  />
                  </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Company Founded on
                    </label>
                    <Field
                      type="text"
                      className="block border-gray-400 py-2 px-4 md:w-3/4 w-full"
                      style={{ borderRadius: "5px" }}
                      name="found"
                    />
                  </div>
                </div>
                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Save
                  </button>
                  {/* <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => !isSubmitDisabled() && update(user)}
                  >
                    Submit
                  </button> */}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 2}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              gst: user.billing[0] ? user.billing[0].gst : "",
              pan: user.billing[0] ? user.billing[0].pan : "",
              location: user.billing[0] ? user.billing[0].location : "",
            }}
            validate={(values) => {
              const errors = {};
              if (!/^[0-9]{8}$/.test(values.pan)) {
                errors.pan = "Invalid Pan Number";
              }

              if (errors.pan) {
                setFormError(true);
              } else {
                setFormError(false);
              }
              return errors;
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <div className="flex flex-wrap w-full gap-y-5">

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1 -space-x-3">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      Tax ID.
                    </label>
                    <div className='shadow-sm border-gray-10 md:w-3/5 pl-2 flex py-2' >
                      <Field
                        component="select"
                        id="location"
                        name="location"
                        className="block border-gray-100 py-1 w-1/6"
                        style={{
                          borderRadius: "5px 0 0 5px",
                          border: "solid 0.5px rgb(156 163 175)",
                        }}
                        multiple={false}
                      >
                        {tax && tax.map((item) => {
                           
                            return (
                              <option value={item.tax_id}>{item.country}</option>
                            );
                          })}
                      </Field>

                      <Field
                        type="text"
                        className="block border-gray-100  py-2 w-5/6"
                        name="gst"
                        style={{
                          borderRadius: " 0 5px 5px 0",
                          border: "solid 0.5px rgb(156 163 175)",
                        }}
                      ></Field>
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-5">
                      PAN
                    </label>
                    <div className="py-1 md:w-3/5">
                      <Field
                        type="text"
                        className="block border-gray-400 w-full py-1  "
                        name="pan"
                      />{" "}
                      <ErrorMessage
                        name="pan"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full text-center">
                  <button
                    onClick={() => save(values)}
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                  >
                    Save
                  </button>
                  {/* <button
                    type="submit"
                    className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-sm my-5"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => update(user)}
                  >
                    Submit
                  </button> */}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

