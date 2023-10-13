/* eslint-disable no-undef */
import React, { useState, Fragment, useCallback } from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";

// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  getProfileImage,
  uploadCandidateResume,
  updateProfileImage
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop.jsx";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
import EditTabs from "../../Components/Dashbaord/EditTabs.jsx";
import Loader from "../../assets/images/loader.gif";
import swal from "sweetalert";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
//image cropper
import Cropper from "react-easy-crop";
import { getCroppedImg, getRotatedImage } from "./canvasUtils.js";
import { url } from "../../service/api";
import axios from "axios";
import { BlockList } from "net";


const EditProfile = (props) => {
  // Sets OTPs to NULL
  const [error, seterror] = React.useState(null);
  const [showBtn, setShowBtn] = useState(false)
  const [loading, setLoading] = React.useState(false);
  const [loadings, setLoadings] = React.useState(false);
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [profileImg, setProfileImg] = React.useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [timer, setTimer] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const storedFileName = ls.get('uploadedFileName');
    if (storedFileName) {
      setFileName(storedFileName);
    }
  }, []);

  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);

  React.useEffect(() => {
    if (uploadStatus === "uploading") {
      setTimer(setTimeout(() => {
        setLoading(false);
        setUploadStatus("timeout");
      }, 60000));
    }
    return () => clearTimeout(timer);
  }, [uploadStatus, timer]);

  const resetUpload = () => {
    setFile(null);
    setFileName("");
    setLoading(false);
    setError(null);
    setUploadStatus("");
    setTimer(null);
  };

  const handleChange = async (e) => {
    ls.remove('uploadedFileName')
    setLoading(true);
    setError(null);
    setUploadStatus("uploading");
    if (e.target && e.target.files) {
      let filename = e.target.files[0].name.split('.').pop();
      filename = filename?.toLowerCase()
      if (filename === "pdf" || filename === "docx" || filename === "PDF") {
        let user = JSON.parse(await getStorage("user"));
        let access_token = await getStorage("access_token");
        // console.log(user, " ", access_token);
        let fd = new FormData();
        fd.append("user_id", user._id);
        fd.append("file", e.target.files[0]);

        let response = await uploadCandidateResume(fd, access_token);
        if (response && response.status === 200) {
          //console.log(response);
          // ls.set("resumeInfo", JSON.stringify(response.data));
          // await setFile(e.target.files[0]);
          // setFileName(e.target.files[0].name);
          // setUploadStatus("timeout");
          // ls.set('uploadedFileName', e.target.files[0].name);
          ls.remove("user");
          ls.set("user", JSON.stringify(response?.data?.user));
          setLoading(false);
          swal({
            icon: "success",
            title: "Resume upload",
            text: "Please review your profile and edit details wherever is required.",
            button: "Ok",
          }).then(()=>{
            if(user?.user_type === "User"){
              navigate("/user/profile")
            }
            else if(user?.user_type === "XI"){
              navigate("/XI/profile")
            }
          });

        } else {
          swal({
            icon: "error",
            title: "Resume upload",
            text: "Something went wrong while parsing your resume, Please enter your details manually",
            button: "Ok",
          }).then(()=>{
             if(user?.user_type === "User"){
              navigate("/user/profile")
            }
            else if(user?.user_type === "XI"){
              navigate("/XI/profile")
            }
          });
        }
      } else {
        swal({
          icon: "error",
          title: "Only PDF and DOCX files allowed",
          button: "Ok",
        }).then(()=>{
          window.location.reload()
        });
      }
    }
  };

  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await getStorage("user"));
      //  console.log("user",user)
      let access_token = getStorage("access_token");
      if (user && user.profileImg) {
        let image = await getProfileImage({ id: user._id }, user.access_token);
        if (image?.status === 200) {
          await ls.set("profileImg", JSON.stringify(image));
          // let base64string = btoa(
          //  String.fromCharCode(...new Uint8Array(image.data.Image.data))
          // );
          let base64string = btoa(new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, '')
          );

          let src = `data:image/png;base64,${base64string}`;
          await setProfileImg(src);
        }
      }
      if (access_token === null) window.location.href = "/login";

      await setUser(user);
    };
    func();
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

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);

  const [upImg, setUpImg] = React.useState(null);

  // Form Edit Submission
  const submit = async (values) => {
    let wait = 0;
    //console.log("values");
    if (EmailOTP === null && ContactOTP === null)
      wait = await SendOTPFunction(values);
    if (wait) return;
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

    update(values);
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

  const update = async (values) => {
    let data = {
      firstName: values.firstName,
      lastname: values.lastName,
      about: values.about,
    };
    if (EmailOTP) {
      data.email = values.email;
    }
    if (ContactOTP) {
      data.contact = values.contact;
    }
    //console.log(user, data);
    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );
    if (res.data.user) {
      await ls.set("user", JSON.stringify(res.data.user));
    }
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
      window.location.href = "/user/profile";
    } else {
      //console.log("Error");
    }
  };

  // Sets User And Access_token
  // React.useEffect(() => {
  //   const getData = async () => {
  //     let access_token1 = await getStorage("access_token");
  //     let user = await JSON.parse(getStorage("user"));
  //     await setUser(user);
  //     await setToken(access_token1);
  //     if (access_token1 === "null")
  //       await ls.set("access_token", user.access_token);
  //       if (user && user.profileImg) {
  //         let image = await getProfileImage({id: user._id}, user.access_token);
  //           await ls.set("profileImg", JSON.stringify(image));
  //         let base64string = btoa(
  //           String.fromCharCode(...new Uint8Array(image.data.Image.data))
  //         );
  //         let src = `data:image/png;base64,${base64string}`;
  //         await setProfilePic(src);
  //       }
  //   };
  //   getData();
  // }, []);

  // const handleShow = () => {
  //   setShowBtn(!showBtn)
  // }
  const handleClick = (e) => {
    setShowBtn(true);
  };

  //image cropper
  const [imageSrc, setImageSrc] = React.useState(props.upImg);
  const [crop, setCrop] = useState({ x: 0, y: 1 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  // const [loading, setLoading] = React.useState(false);

  let user1 = ReactSession.get("user");
  const [users, setUsers] = React.useState(user1);
  const btnRef = React.useRef(null);
  

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      setLoadings(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
     
      let userS = getStorage("user");
      let user = JSON.parse(userS);
      let access_token1 = getStorage("access_token");
      await setCroppedImage(croppedImage);

      const formData = new FormData();
      let blob = await fetch(croppedImage).then(r => r.blob());
      blob.originalname = user._id + "-profile";
      formData.append("user_id", user._id);
      formData.append("file", blob);

      let res = await updateProfileImage(formData, user._id, access_token1);
      if (res.status === 200 && res.data.Success === true) {
        setLoadings(false)
        let image = await getProfileImage(
          { id: user._id },
          access_token1
        );
        user.profileImg = user._id + "-profile";
        await ls.set("user", JSON.stringify(user));
        await ls.set("profileImg", JSON.stringify(image.data.Image));
        setImageSrc(image.data.Image);
        // setLoadings(false);
        window.location.reload();
        
      }
      else {
        setLoadings(false)
        if (res.status === 200 && res.data.Message !== undefined) {
          swal({
            icon: "error",
            title: "Oops",
            text: res.data.Message,
            button: "Continue",
          });
        } else {

          swal({
            icon: "error",
            title: "Oops",
            text: "Something Went Wrong",
            button: "Continue",
          });

        }
      }
      
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
    setImageSrc(null);
  }, []);
  

  return (
    <div className="px-3 h-100 bg-white">
      {user !== null && (
        <div className="m-1 bg-white">
          <div
            className="md:h-48 h-24 w-full relative -z-[0]"
            style={{ background: "#FFFFFF" }}
          ></div>
          <div className="relative  rounded-md w-full  md:flex  ">
            <div className="absolute  sm:left-9 sm:px-2 -top-20 md:-top-28 md:left-9  ">
              <img
                src={
                  user && user.profileImg && profileImg ? profileImg : Avatar
                }
                //src={Avatar}
                className=" h-36 w-36 md:h-32 md:w-32 lg:h-56 lg:w-56 rounded-full relative"
                alt="userAvatar"
              />
            </div>
            <div className=" md:ml-80 md:px-5  sm:mx-5 md:text-left">
              <p className="font-semibold md:text-2xl text-xl text-[#228276]" >
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400  text-lg">{user.username}</p>
            </div>
            <div className=" mt-3 md:text-right  md:ml-auto sm:text-left  flex">
              <div className="mt-2">
                {uploadStatus === "timeout" ? (
                  <button
                    className="py-2.5 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
                    style={{ backgroundColor: "#228276" }}
                    onClick={resetUpload}
                  >
                    Upload Resume
                  </button>
                // ) : uploadStatus === "uploaded" || fileName ? (
                ) : uploadStatus === "uploaded" || !user.resume ? (
                  <div>
                    {/* <button> */}
                    {loading ? (
                      <button
                        className="py-2.5 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
                        style={{ backgroundColor: "#228276" }}
                      >
                        Uploading...
                      </button>
                    ) : (
                      <label
                        htmlFor="resume"
                        className=" ml-2 py-2.5 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
                        style={{ backgroundColor: "#228276" }}
                      >
                        {/* Reupload Resume */}
                        Upload Resume
                        <input
                          type="file"
                          name="resume"
                          className="hidden"
                          id="resume"
                          accept="application/pdf, application/msword , application/PDF , .pdf , .PDF"
                          onChange={handleChange}
                        />
                        {filePreviewUrl && <embed src={filePreviewUrl} width="400" height="400" alt={fileName} />}
                      </label>
                    )}
                  </div>
                ) : (

                  <>
                    {/* {loading ? (
                      <button
                        className="py-2.5 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
                        style={{ backgroundColor: "#228276" }}
                      >
                        Uploading...
                      </button>
                    ) : (
                      <label
                        htmlFor="resume"
                        className="py-2.5 px-8 font-semibold cursor-pointer bg-blue-500 rounded text-white text-xs"
                        style={{ backgroundColor: "#228276" }}
                      >
                        Upload Resume
                        <input
                          type="file"
                          name="resume"
                          className="hidden"
                          id="resume"
                          accept="application/pdf, application/msword"
                          onChange={handleChange}
                        />
                        {filePreviewUrl && <embed src={filePreviewUrl} width="400" height="400" alt={fileName} />}
                      </label>
                    )} */}
                  </>
                )}
              </div>
              {/* <div className="mt-2">
                <button
                  className="  hover:bg-blue-700 text-white font-bold py-2.5 px-8 mx-3 md:mx-4 text-xs rounded"
                  style={{ backgroundColor: "#228276" }}
                  // onClick={() => ModalBtnRef.current.click()}
                  onClick={(e) => handleShow()}
                >
                  Upload Image
                </button>
                {showBtn && (
                  <>
                    <div className="modal-dialog relative w-[40vw] pointer-events-none my-5">
                      <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                          <h5
                            className="text-xl font-medium leading-normal text-gray-800"
                            id="exampleModalLabel"
                          >
                            Update Profile Image
                          </h5>
                        </div>
                        <div className="modal-body relative p-4">
                          <ReactCropper Modal={ModalRef} user="User" />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="hidden px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                        data-bs-dismiss="modal"
                        ref={ModalRef}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div> */}
              <div className="mt-2">
                {imageSrc ? (
                  <div className="block">
                    <div className="block">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape="round"
                        showGrid={false}
                        style={{
                          containerStyle: {
                            height: "40vh",
                            width: "40vh",
                            marginTop: "-9em",
                            marginRight: "20px",
                            backgroundColor: "transparent",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)"
                          },
                          cropAreaStyle: { width: "110px" },
                        }}

                        objectFit="auto-cover"
                        zoomWithScroll={true}
                      />


                    </div>
                  </div>
                ) : (
                  <label>
                    <p className="hover:bg-blue-700 text-white font-bold py-2.5 px-8 mx-3 md:mx-4 text-xs rounded"
                      style={{ backgroundColor: "#228276" }}>
                      Upload Image
                    </p>
                    <input
                      type="file"
                      onChange={onFileChange}
                      accept="image/png , image/jpeg, image/jpg , image/JPG , image/JPEG"
                      className="hidden"
                    />
                  </label>

                )}

                {/* <div
        className= {`flex justify-content-end  ${imageSrc ? "mt-[43vh]" : "mt-3"
          }`}
      > */}
                {props.Modal && imageSrc && (
                  <button
                    className=" border-[0.5px] border-red-400 text-red-400 rounded-sm px-4 py-1 cursor-pointer w-fit ml-auto"
                    // onClick={() => {
                    //   setLoadings(false);
                    //   setCroppedImage(null);
                    //   setImageSrc(null);
                    //   props.Modal.click();
                    // }}
                    onClick={() => {
                      setLoading(false);
                      onClose(); // Close the cropped image view and clear the image source
                      props.Modal.current.click();
                    }}
                  >
                    Cancel
                  </button>
                )}
                
                {imageSrc && (
                  <button
                    onClick={() => showCroppedImage()}
                    className="hover:bg-blue-700 text-white font-bold py-2.5 px-8 mx-3 md:mx-4 text-xs rounded"
                    style={{ backgroundColor: "red" }}
                  >
                    {loadings ? (
                      // <img src={Loader} className="h-7" alt="loader" />
                      "uploading..."
                    ) : (
                      "Upload"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          {fileName && (
//             <div className="text-end font-bold py-1 px-8 mx-3 md:mx-4 text-xs rounded">
//               <button
//                 type="button"
//                 className="bg-green-600 text-white font-bold py-1 px-2 text-xm rounded"
//                 style={{ backgroundColor: "#228276" }}
//               >
//                 Uploaded file: {fileName.length > 25 ? `${fileName.substring(0, 25)}...` : fileName}
//               </button>
//             </div>
            ""
          )}
          <div className="my-3  rounded-md w-full  mt-6 pt-3">
            {<EditTabs />}
          </div>
        </div>
      )}

      {/* Modal For Cropping Image */}
      {/* <button
        type="button"
        className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out hidden"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ModalBtnRef}
      >
        Launch static backdrop modal
      </button>
      <div
        className="modal fade fixed ml-[25vw] top-20 hidden h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-[40vw] pointer-events-none my-5">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Update Profile Image
              </h5>
            </div>
            <div className="modal-body relative p-4">
              <ReactCropper Modal={ModalRef} user="User" />
            </div>
          </div>
          <button
            type="button"
            className="hidden px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            data-bs-dismiss="modal"
            ref={ModalRef}
          >
            Close
          </button>
        </div>
      </div> */}
      {/* Modal For Cropping Image */}
    </div>
  );
};
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
export default EditProfile;
