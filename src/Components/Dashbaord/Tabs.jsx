import React from "react";

import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field } from "formik";

import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
  AiOutlineDelete,
  AiOutlineRead,
} from "react-icons/ai";
import { IoPeople } from "react-icons/io5";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import { CgWorkAlt } from "react-icons/cg";
import { IoSchoolOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { downloadResume, getResume, getUserFromId } from "../../service/api";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import "react-multi-carousel/lib/styles.css";
import SkillsView from "../SkillsView";

export default function Tabs() {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [resume, setResume] = React.useState(null);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [secEmail, setSecEmail] = React.useState([]);
  const [secContact, setSecContact] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const [link, setLink] = React.useState({});

  // Language
  const [lang , setLang] = React.useState([])

  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await getStorage("user"));
      let user1 = await getUserFromId({ id: user._id }, user.access_token);
      let access_token = getStorage("access_token");
      if (user1 && user1?.profileImg) {
        const img = user.profileImg;
        const imgBase64 = img.toString("base64");
        // //console.log(imgBase64);
        // setProfileImg(img);
        setProfileImg(imgBase64);
      }
      if (access_token === null) window.location.href = "/login";
      setSecContact(user1.data.user.secondaryContacts);
      setSecEmail(user1.data.user.secondaryEmails);
      setLang(user1?.data?.user?.language)
      let primarySkills = {};
      let roles = new Set([]);
      user?.tools?.forEach((skill) => {
        roles.add(skill.role);
        if (primarySkills[skill.role]) {
          primarySkills[skill.role].add(skill.primarySkill);
        } else {
          primarySkills[skill.role] = new Set([skill.primarySkill]);
        }
      });
      setRoles(Array.from(roles));
      Array.from(roles).map((el) => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      setSkillsPrimary(primarySkills);
      // //console.log(user);
      if (user.language.length > 0 && user.language !== "null" && user.language !== null) {
        const hasString = user.language.some(element => typeof(element) == 'string');
        if(hasString === true) {
          user.language = user.language.filter(e => (typeof(e) !== 'string'));
        }
      }
      await setUser(user);
    };
    func();
  }, []);

  return (
    <div className="Tabs w-screen">
      <div className="tabList w-fit px-0 border-b border-gray-200 pb-3 pl-3">
        <div
          className={`tabHead ${index === 0 && "active"}`}
          onClick={() => {
            setIndex(0);
          }}
        >
          <p className="lg:visible hidden content">Contact</p>
          <p className="icons hidden">
            <AiOutlineHome />
          </p>
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
          <p className="lg:visible hidden content">Education</p>
          <p className="icons hidden">
            <IoSchoolOutline />
          </p>
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
          <p className="lg:visible hidden content">Experience</p>
          <p className="icons hidden">
            <CgWorkAlt />
          </p>
        </div>
        {/*
        ********************future requirement ****************
        <div
          className={`tabHead ${index === 3 && "active"}`}
          onClick={() => {
            setIndex(3);
          }}
        >
          <p className="lg:visible hidden content">Association</p>
          <p className="icons hidden">
            <HiOutlineOfficeBuilding />
          </p>
        </div> */}
        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
          <p className="lg:visible hidden content">Skills</p>
          <p className="icons hidden">
            <AiOutlineUnorderedList />
          </p>
        </div>
      </div>
      <div
        className="tabContent  bg-white py-4 w-full"
        hidden={index != 0}
      >
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: `${user.firstName} ${user.lastname}`,
              lastName: user.lastname,
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
              houseNo: user.houseNo,
              street: user.street,
              city: user.city,
              country: user.country,
              state: user.state,
              zip: user.zip,
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <div className="flex flex-wrap w-70 gap-y-5">
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                    <label className="font-bold text-lg lg:mx-3 md:w-2/5 mt-2">
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      disabled
                      style={{
                        border: "none",
                        height: "40px",
                      }}
                      className="block border-gray-200 py-1 md:w-2/5 sm:w-4/5 w-full"
                     />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                    <label className="font-semibold text-lg lg:mx-3 md:w-2/5">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      disabled
                      style={{
                        border: "none",
                        height: "40px",
                      }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5  w-full"
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                    <label className="font-semibold text-lg lg:mx-3 md:w-2/5">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="text"
                      disabled
                      style={{
                        border: "none",
                        height: "40px",
                      }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 w-full"
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                    <label className="font-semibold text-lg lg:mx-3 md:w-2/5">
                      Contact
                    </label>
                    <Field
                      name="contact"
                      type="text"
                      disabled
                      value={
                        user.contact
                          ? [
                            user.googleId,
                            user.microsoftId,
                            user.linkedInId,
                            user.githubId,
                          ].includes(user.contact)
                            ? " "
                            : user.contact
                          : " "
                      }
                      style={{
                        border: "none",
                        height: "40px",
                      }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 w-full"
                    />
                  </div>
                  <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                    <label className="font-semibold text-lg lg:mx-3 md:w-2/5">
                      LinkedIn Profile
                    </label>
                    <Field
                      name="linkedinurl"
                      type="text"
                      disabled
                      value={
                        user.linkedinurl
                          ? user.linkedinurl
                          : " "
                      }
                      style={{
                        border: "none",
                        height: "40px",
                      }}
                      className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 w-full"
                    />
                  </div>
                  {/* <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex-row w-full  space-y-1">
                    <label className="font-semibold lg:ml-3 text-lg md:w-2/5">
                      Address
                    </label>
                    <div className="w-full">
                      <div
                        className="grid grid-cols-1 mb-6"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-3  md:ml-0 align-middle">
                          <Field
                            name="houseNo"
                            type="text"
                            style={{
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                          <span>,</span>
                          <Field
                            name="street"
                            type="text"
                            style={{
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                        </div>                        
                      </div>
                      <div
                        className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 md:w-5/6 lg:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 md:ml-0 align-middle">
                          <label className="font-normal ml-2 text-md py-2">
                            City
                          </label>

                          <Field
                            name="city"
                            type="text"
                            style={{
                              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                              // borderRadius: "5px",
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0 md:mr-0 align-middle">
                          <label className="font-normal text-md ml-2 md:ml-0 py-2">
                            State/Region
                          </label>
                          <Field
                            name="state"
                            type="text"
                            style={{
                              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                              // borderRadius: "5px",
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2  md:w-5/6 lg:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 md:ml-0  align-middle">
                          <label className="font-normal ml-2 text-md py-2">
                            Country
                          </label>
                          <Field
                            name="country"
                            type="text"
                            style={{
                              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                              // borderRadius: "5px",
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0  align-middle">
                          <label className="font-normal text-md  ml-2 md:ml-0 py-2">
                            Zip Code
                          </label>

                          <Field
                            name="zip"
                            type="text"
                            style={{
                              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                              // borderRadius: "5px",
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 w-full"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
             <div className="md:w-1/2 my-1 sm:mx-0 md:flex-row w-full space-y-4 rounded-lg md:mx-2">
  <h2 className="font-semibold text-xl mb-4 lg:mx-3">Address</h2>
  <div className="w-full">
    <div className="grid grid-cols-1 mb-2">
      <div className="flex items-center">
        {/* <label className="font-medium text-md mr-2 text-gray-600">
          House:
        </label> */}
        <Field
          name="houseNo"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
    </div>
    <div className="grid grid-cols-1 mb-2">
      <div className="flex items-center">
        {/* <label className="font-medium text-md mr-2 text-gray-600">
          Street:
        </label> */}
        <Field
          name="street"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div className="flex items-center">
      {/* <label className="font-medium text-md text-gray-600">
          City:
        </label> */}
        <Field
          name="city"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
      <div className="flex items-center">
      {/* <label className="font-medium text-md text-gray-600">
          state:
        </label> */}
        <Field
          name="state"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div className="flex items-center">
        {/* <label className="font-medium text-md text-gray-600">
          Country:
        </label> */}
        <Field
          name="country"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
      <div className="flex items-center">
        {/* <label className="font-medium text-md text-gray-600">
          Zip:
        </label> */}
        <Field
          name="zip"
          type="text"
          style={{
            border: "none"
          }}
          className="block border-gray-200 py-1 w-full focus:outline-none"
          disabled
        />
      </div>
    </div>
  </div>
</div>





                  {secEmail.length > 0 ? (
                    <div className="md:w-1/2 md:mx-2 sm:mx-0 md:flex-row w-full my-3 space-y-1">
                      <label className="font-semibold w-2/3 text-lg lg:mx-3 md:w-2/5">
                        Secondary Emails
                      </label>

                      <div className="w-full flex gap-4">
                        {secEmail.map((item, index) => {
                          return (
                            <input
                              value={item}
                              type="text"
                              disabled
                              style={{
                                // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                // borderRadius: "5px",
                                height: "40px",
                                border: "none"
                              }}
                              className="block gap-2 border-gray-200 py-1 w-full"
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  {secContact.length > 0 ? (
                    <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0 md:flex-row w-full  space-y-1">
                      <label className="font-semibold text-lg lg:mx-3 md:w-2/5 ">
                        Secondary Contacts
                      </label>

                      {secContact.map((item, index) => {
                        return (
                          <input
                            value={item}
                            type="text"
                            disabled
                            style={{
                              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                              // borderRadius: "5px",
                              height: "40px",
                              border: "none"
                            }}
                            className="block border-gray-200 py-1 my-3 w-full"
                          />
                        );
                      })}
                    </div>
                  ) : null}
                  {user.resume && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg lg:mx-5 md:w-2/5">
                        Resume
                      </label>
                      <div className="w-full flex items-center">
                        <button
                          className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async () => {
                            let token = await getStorage(
                              "access_token"
                            );
                            let res = await downloadResume(
                              { user_id: user._id },
                              token
                            );
                            const url = window.URL.createObjectURL(
                              new Blob([
                                new Uint8Array(res.data.Resume.data).buffer,
                              ])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "Resume.pdf");
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          Download Resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div
        className="tabContent bg-white "
        hidden={index != 1}
      >
        {user !== null && user !== undefined && user.education.length === 0 && (
          <p className="my-5 text-center">No Education Details Added</p>
        )}

        {user !== null &&
          user !== undefined &&
          user.education.map((item, index) => {
            return (
              <div className="border-b border-gray-200 ml-5">
                <div
                  className="bg-white py-3 h-35 md:w-full w-full"
                  key={index}
                >
                  <div className="mr-5">
                  <div className="d-flex justify-between	">
                    <p className="font-semibold text-md md:w-2/5 flex items-center">{item.school}</p>
                    {/* <div className="my-3 w-10 h-10 d-flex" style={{background: "#FFFFFF", border: "1px solid #E3E3E3", borderRadius: "20px"}}>
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
                  </div>
                      <div className="grid grid-rows-3 align-items-right">
                        <div className="flex my-2 space-x-2 text-sm items-center">
                          {/* <FiInfo /> */}
                          <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                        </div>
                        {item.grade != "" ? (
                          <div className="space-x-2 my-2 flex items-center">
                            {/* <GrScorecard /> */}
                            <p>{item.grade}</p>
                          </div>
                        ) : (
                          <div className="space-x-2 my-2 flex items-center">
                            {/* <GrScorecard />  */}
                            <p>0</p>
                          </div>
                        )}
                        <div className="flex items-center my-2 space-x-2">
                          {/* <BsCalendar className="mr-2" /> */}
                          <p className="text-sm text-gray-600 mr-5">
                            {item.start_date}/{item.Ispresent ? "Present" : item.end_date}
                          </p>
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-2/5 ">Description :</p>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <div
        className="tabContent bg-white"
        hidden={index != 2}
      >
        {user !== null &&
          user !== undefined &&
          user?.isFresher === false &&
          user.experience.length === 0 && (
            <p className="my-5 text-center">No Experience Details Added</p>
          )}
        {user !== null &&
          user !== undefined &&
          user?.isFresher === true && (
            <p className="my-5 text-center">{user?.firstName} {user?.lastname} is an entry level candidate.</p>
        )}
        {user !== null &&
          user !== undefined &&
          user.experience.map((item, index) => {
            return (
              <div className="border-b border-gray-200 ml-5">
                <div
                  className="bg-white py-3 h-35  md:w-full"
                  key={index}
                >
                  <div className="mr-5">
                    <div className="d-flex justify-between	">
                      <div className="font-semibold flex space-x-2 items-center">
                        <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                        <p className="font-normal text-sm">{item.employment_type}</p>{" "}
                      </div>
                      {/* <div className="my-3 w-10 h-10 d-flex" style={{background: "#FFFFFF", border: "1px solid #E3E3E3", borderRadius: "20px"}}>
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
                    </div>
                    <div className="grid grid-rows-3 align-items-right">
                      <div className="space-x-2 my-2 flex items-center ">
                        {/* <FaRegBuilding /> */}
                        <p>{item.company_name}</p>
                      </div>
                      <div className="space-x-2 my-2 flex items-center">
                        {/* <CgWorkAlt /> */}
                        <p>{item.industry}</p>
                      </div>
                      <div className="flex items-center space-x-2 my-2">
                        {/* <BsCalendar /> */}
                        <p className="text-sm text-gray-600 mr-5">
                          {item.start_date}/{" "}
                          {item.Ispresent ? "Present" : item.end_date}
                        </p>
                      </div>
                    </div>
                    {item.description && (
                      <div className="py-2">
                        <p className="font-semibold text-md md:w-2/5 ">Description :</p>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      <div
        className="tabContent mx-5 bg-white py-5 px-6"
        hidden={index != 3}
      >
        {user !== null &&
          user !== undefined &&
          user.associate &&
          user.associate.length === 0 && (
            <p className="my-5 text-center">No Association Details Added</p>
          )}
        {user !== null &&
          user !== undefined &&
          user.associate &&
          user.associate.map((item, index) => {
            return (
              <div
                className=" rounded-md px-5 py-3 bg-white border border-gray-400 my-5 h-35  md:w-full mx-auto"
                key={index}
              >
                <div className="font-semibold flex space-x-2 items-center">
                  <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                  <p className="font-normal text-sm">{item.location}</p>{" "}
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 align-items-right">
                  <div className="space-x-2 flex items-center">
                    <FaRegBuilding />
                    <p>{item.company_name}</p>
                  </div>

                  <div className="space-x-2 flex items-center">
                    <CgWorkAlt />
                    <p>{item.industry}</p>
                  </div>

                  <div className="flex items-center space-x-2 my-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} -{" "}
                      {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        window.location.href = "/user/editProfile";
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {item.description && (
                  <div className="py-2">
                    <p className="font-semibold text-md md:w-2/5 ">Description :</p>
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div
        className="tabContent bg-white py-3 px-1"
        hidden={index != 4}
      >
        {user !== null && user !== undefined && (
          <div className="">
            <div className="md:w-1/2 w-full space-y-1">
              { ( user?.tools && user?.tools.length>0) ?
                <SkillsView/>
                : 
                <div className="border-b border-gray-200 pb-3  ml-3">
                  <label className="font-semibold text-lg w-2/5 mx-2 ">
                      Technical skills
                  </label>
                  <div className="my-3 px-4 flex items-center flex-wrap">
                    <p className="text-lg">No technical skills added</p>
                  </div>
                </div>
              }
            </div>

            <div className="my-2 mx-5">
              <label className="font-semibold text-lg w-2/5 mx-2 ">
                Language Skills
              </label>

              <div className=" mx-auto justify-center text-center">
                <div className="lg:w-2/3 md:w-full sm:w-full">
                  {lang &&
                    lang.map((item, index) => {
                      return (
                        <div
                          className=" rounded-md py-2 px-4 bg-white border my-4 h-35 w-full"
                          key={index}
                        >
                          <div className="font-semibold flex space-x-2 items-center">
                            <p>{item.name}</p>{" "}
                            <p className="font-normal text-sm"></p>{" "}
                          </div>
                          <div className="flex w-full md:gap-2 gap-0 justify-between">
                            <div className="w-auto flex">
                              {item.read ? (
                                <div className=" my-2 flex items-center">
                                  <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex ">
                                    <AiOutlineRead className="my-auto mx-2" />{" "}
                                    Read
                                  </p>
                                </div>
                              ) : null}
                              {item.write ? (
                                <div className=" my-2 flex items-center">
                                  <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex">
                                    <HiPencil className="my-auto mx-2" />
                                    Write
                                  </p>
                                </div>
                              ) : null}
                              {item.speak ? (
                                <div className="flex items-center my-2">
                                  <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex">
                                    <IoPeople className="my-auto mx-2" />
                                    Speak
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            {/* <div className=" flex items-center space-x-2  ">
                              <ModeEditOutlineOutlinedIcon
                                className="hover:text-blue-600 cursor-pointer"
                                onClick={() => {
                                  let url = window.location.href;
                                  let type = url.split("/")[3];
                                  window.location.href = "/" + type + "/editProfile";
                                }}
                              />

                            </div> */}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
