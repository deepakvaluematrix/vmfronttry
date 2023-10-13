import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInterviewApplication,
  updateEvaluation,
  updateEvaluationSkills,
  getUser,
  getSkills,
  updateSkills,
} from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

import Switch from "@mui/material/Switch";

import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Disclosure } from "@headlessui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { getProfileImage } from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import ls from "localstorage-slim";
import { getStorage } from "../../service/storageService";
const UpdateInterviewApplication = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const [positives, setPositives] = React.useState(null);
  const [lowlights, setLowlights] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [initialRating, setInitialRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [clickedUpdateSkill, setClickedUpdateSkill] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const [XIEvaluations, setXIEvaluations] = React.useState([]);
  const [showEvalForm, setShowEvalForm] = React.useState(false);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [editIndex, setEditIndex] = React.useState(null);

  // skills
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [skillSet, setSkillSet] = React.useState([]);
  const [candidate, setCandidate] = React.useState([]);
  const [jdSkills, setJDSkills] = React.useState([]);

  // for toggle buttons
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);
  const [checked4, setChecked4] = React.useState(false);
  const [checked5, setChecked5] = React.useState(false);
  const [demeanorOfCandidate, setDemeanorOfCandidate] = useState("Calm");
  const [userImage, setUserImage] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [anotherPerson, setAnotherPerson] = useState("");

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange2 = (event) => {
    setChecked2(event.target.checked);
  };

  const handleChange3 = (event) => {
    setChecked3(event.target.checked);
  };

  const handleChange4 = (event) => {
    setChecked4(event.target.checked);
  };

  const handleChange5 = (event) => {
    setChecked5(event.target.checked);
  };

  const placeHolderforPositives = `Example : 
  Strong technical knowledge and expertise in relevant technologies.
  Excellent problem-solving skills and ability to think analytically.
  Good communication and interpersonal skills, demonstrated through clear explanations.
  Quick learner and adaptable to new technologies and challenges.
  Proactive and takes initiative in suggesting innovative solutions.`;

  const placeHolderforLowlights = `Example : 
  Lack of experience in specific technology/framework mentioned in the job description.
  Limited practical exposure to large-scale projects or complex systems.
  Need to improve time management skills to meet project deadlines consistently.
  Could benefit from more hands-on experience in collaborating within a team.
  Could enhance coding practices to improve code quality and maintainability.
  `;

  const placeHolderforFeedback = `Example : 
  The candidate displays a solid foundation in technical knowledge, problem-solving, and communication skills. While they may lack certain specific experiences or skills, their adaptability and willingness to learn make them a promising candidate. With some improvements in time management, collaborative work, and coding practices, they can become a valuable asset to the team.
  `;

  React.useEffect(() => {
    let initial = async () => {
      let user = await JSON.parse(getStorage("user"));
      await setUser(user);
      let res = await getInterviewApplication({ id: id }, user.access_token);
      if (res?.data?.data) {
        //console.log(res.data.data);
        let candidate = await getUser(
          { id: res?.data?.data?.application?.applicant },
          user?.access_token
        );

        setCandidate(candidate?.data?.user);
        setDbSkills(res?.data?.data?.job?.skills);
        let uniqueRoles = [
          ...new Set(res?.data?.data?.job?.skills?.map((item) => item.role)),
        ];
        setJDSkills(uniqueRoles);
        if (res?.data?.data?.application?.evaluations) {
          setSkillSet(
            res?.data?.data?.application?.evaluations[user._id]?.skills
          );
        } else {
          setSkillSet([]);
        }
        let image = await getProfileImage(
          { id: res?.data?.data?.application?.applicant },
          user.access_token
        );
        let base64string = "";
        base64string = btoa(
          new Uint8Array(image?.data?.Image?.data).reduce(function (
            data,
            byte
          ) {
            return data + String.fromCharCode(byte);
          },
          "")
        );
        //console.log(base64string);
        if (base64string !== "") {
          setProfileImage(`data:image/png;base64,${base64string}`);
        }
        let primarySkills = {};
        let roles = new Set([]);
        let tempArray = [];

        if (res?.data?.data?.application?.evaluations) {
          res?.data?.data?.application?.evaluations[user._id]?.skills?.forEach(
            (skill) => {
              roles.add(skill?.role);
              if (primarySkills[skill?.role]) {
                primarySkills[skill?.role].add(skill?.primarySkill);
              } else {
                primarySkills[skill?.role] = new Set([skill?.primarySkill]);
              }
            }
          );
        } else {
          primarySkills = {};
        }
        if (Array.from(roles)) {
          setCRoles(Array.from(roles));
        } else {
          setCRoles({});
        }
        Array.from(roles).length > 0 &&
          Array.from(roles).map((el) => {
            primarySkills[el] = Array.from(primarySkills[el]);
          });
        if (primarySkills) setSkillsPrimary(primarySkills);
        else {
          setSkillsPrimary([]);
        }
        if (res?.data?.data?.job?.questions) {
          let answers = new Array(res.data.data.job.questions.length).fill("");
          setEvaluation(answers);
        }
        if (
          res?.data?.data?.application?.evaluations &&
          res?.data?.data?.application?.evaluations[user?._id]
        ) {
          if (res?.data?.data?.application?.evaluations[user?._id]?.status) {
            setCurrStatus(
              res?.data?.data?.application?.evaluations[user?._id]?.status
            );
            setStatus(
              res?.data?.data?.application?.evaluations[user?._id]?.status
            );
          }
          if (
            res?.data?.data?.application?.evaluations[user?._id]
              ?.candidate_rating
          ) {
            setInitialRating(
              res?.data?.data?.application?.evaluations[user?._id]
                ?.candidate_rating
            );
            setRating(
              res?.data?.data?.application?.evaluations[user?._id]
                ?.candidate_rating
            );
          }
        } else if (res?.data?.data?.application) {
          if (res?.data?.data?.application?.status) {
            setCurrStatus(res?.data?.data?.application?.status);
            setStatus(res?.data?.data?.application?.status);
          }
        } else {
          setInitialRating(0);
          setRating(0);
          setCurrStatus("Pending");
          setStatus("Pending");
        }
        setInterview(res?.data?.data);
      }
      setLoading(false);
    };
    initial();
  }, []);

  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let p = JSON.parse(await getStorage("prof"));
      let pr1 = JSON.parse(await getStorage("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }

        await setRolesProf(pr1);
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        //await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const updateEvaluationReport = async () => {
    if (clickedUpdateSkill) {
      let res = await updateEvaluation({
        updates: {
          status: status,
          feedback: feedback,
          positives: positives,
          lowlights: lowlights,
          imageMatched: checked,
          hasHeadPhone: checked2,
          facedCamera: checked3,
          othersExistsInroom: checked4,
          demeanorOfCandidate: demeanorOfCandidate,
          anotherPerson: anotherPerson,
        },
        user_id: user._id,
        application_id: interview.application._id,
      });
      if (res && res.status === 200) {
        swal("Success", "Evaluation Updated", "success").then((result) => {
          ls.remove("leavecall");
          window.location.href = "/XI";
        });
      } else {
        swal("Error", "Something went wrong", "error");
      }
    } else {
      swal({
        icon: "error",
        title: "Evaluation",
        text: "Please update the skills section",
        button: "Continue",
      });
    }
  };

  const updateSkill = async () => {
    let skills = [];

    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });

    let res = await updateEvaluationSkills({
      updates: { skills: skills },
      user_id: user._id,
      application_id: interview.application._id,
    });
    setSkillSet(skills);
    let primarySkills = {};
    let roles = new Set([]);
    skills.forEach((skill) => {
      roles.add(skill.role);
      if (primarySkills[skill.role]) {
        primarySkills[skill.role].add(skill.primarySkill);
      } else {
        primarySkills[skill.role] = new Set([skill.primarySkill]);
      }
    });
    setCRoles(Array.from(roles));
    Array.from(roles).map((el) => {
      primarySkills[el] = Array.from(primarySkills[el]);
    });
    setSkillsPrimary(primarySkills);

    if (res.status !== 200) {
      swal({
        icon: "error",
        title: "Evaluation",
        text: "Something went wrong",
        button: "Continue",
      });
    } else {
      await ls.remove("prof");
      await ls.remove("RolesProf");
      swal({
        icon: "success",
        title: "Evaluation",
        text: "Skills Evaluated Succesfully",
        button: "Continue",
      });
      setClickedUpdateSkill(true);
    }
  };

  return (
    <div className="bg-slate-100">
      <div className="mx-5 mt-3 p-5">
        <p className="font-bold text-2xl ">Interview Details</p>
        {loading && (
          <p className="text-center font-semibold text-lg">Loading Data...</p>
        )}
        {!loading && (
          <div>
            {interview && (
              <p className="my-2 text-sm">
                <span className="font-semibold">Interview Id : </span>{" "}
                {interview.application._id}
              </p>
            )}
            {interview && interview.applicant && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Candidate ID :</span>{" "}
                    {interview.application.applicant}{" "}
                    {
                      //interview.applicant.lastname
                    }
                    <div className="my-3">
                      <div>
                        {profileImage !== "" ? (
                          <img
                            className="rounded-lg"
                            src={profileImage}
                            width="10%"
                            alt=""
                          />
                        ) : (
                          <img
                            className="rounded-lg"
                            src={Avatar}
                            width="10%"
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {/*interview.applicant.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {interview.applicant.email}
                      </p>
                    )*/}
                    {/*interview.applicant.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {interview.applicant.contact}
                      </p>
                    )*/}
                  </div>
                </div>
              </div>
            )}
            {interview && interview.job && (
              <div className="my-5">
                <div className="flex justify-between">
                  <p className="my-3 font-semibold text-lg">Job Details</p>
                  {/*<Link
                    to={`/XI/jobDetails/${interview.job._id}`}
                    target="_blank"
                  >
                    View Job Details
                  </Link>*/}
                </div>
                <div className="w-full  bg-white border border-b">
                  <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6 relative">
                    <div className="col-span-2 flex align-middle">
                      <div className="">
                        <img
                          src={""}
                          className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700 object-contain"
                          alt="Company_Logo"
                        />
                      </div>
                      <div className="pt-3">
                        <h5 className="text-black-900 text-lg font-bold mb-1 ">
                          {interview.job.jobTitle}
                        </h5>
                        <p className="text-sm font-bold  text-gray-400 font-semibold">
                          {interview.job.hiringOrganization}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <CgWorkAlt />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.jobType}
                        </p>
                      </div>
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <HiOutlineLocationMarker />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.location}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <BsCashStack />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.salary[1] - interview.job.salary[2]}{" "}
                          {interview.job.salary[0].code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {interview && (
              <div className="my-5">
                <div>
                  <p className="font-semibold text-lg my-3">
                    Post interview check
                  </p>
                  <div className="w-full  bg-white border border-b px-9 py-6 space-y-2">
                    <div className="flex items-center w-3/4">
                      <p className="font-semibold">
                        The person attended the interview was the same person as
                        shown in the picture?{" "}
                      </p>
                      <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </div>
                    <p>
                      {" "}
                      <span className="font-semibold">
                        Was the candidate wearing headphones or ear piece during
                        the interview?
                      </span>{" "}
                      <Switch
                        checked={checked2}
                        onChange={handleChange2}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </p>
                    <p>
                      {" "}
                      <span className="font-semibold">
                        Was the candidate was looking at the monitor or camera
                        during the course of the interview?
                      </span>{" "}
                      <Switch
                        checked={checked3}
                        onChange={handleChange3}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </p>
                    <p>
                      {" "}
                      <span className="font-semibold">
                        Was there any person other than candidate in the room
                        during the course of the interview?
                      </span>{" "}
                      <Switch
                        checked={checked4}
                        onChange={handleChange4}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      {checked4 == true && (
                        <textarea
                          className="px-4 py-1 my-3 w-3/4 block"
                          rows="5"
                          style={{ borderRadius: "5px" }}
                          onChange={(e) => {
                            setAnotherPerson(e.target.value);
                          }}
                        ></textarea>
                      )}
                    </p>
                    <p>
                      {" "}
                      <span className="font-semibold">
                        What was the demeanor of the candidate during the course
                        of interview?
                      </span>{" "}
                      <select
                        className="border border-gray-400 rounded-md px-4 py-1 ml-2 "
                        onChange={(e) => setDemeanorOfCandidate(e.target.value)}
                        name="status"
                        id="status"
                      >
                        <option value="Calm">Calm</option>
                        <option value="Tensed">Tensed</option>
                        <option value="Somewhere in between">
                          Somewhere in between
                        </option>
                      </select>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg my-3">Recommendation</p>
                  <div className="w-full  bg-white border border-b px-9 py-6 space-y-2">
                    <div className="flex items-center w-3/4">
                      <p className="font-semibold">Update Status : </p>
                      <select
                        className="border border-gray-400 rounded-md px-4 py-1 ml-2 "
                        onChange={(e) => setStatus(e.target.value)}
                        name="status"
                        id="status"
                      >
                        <option value="Pending" selected={status === "Pending"}>
                          Pending
                        </option>
                        <option
                          value="Recommended"
                          selected={status === "Recommended"}
                        >
                          Recommended
                        </option>
                        <option
                          value=" Not Recommended"
                          selected={status === " Not Recommended"}
                        >
                          Not Recommended
                        </option>
                      </select>
                    </div>
                    {/* <p>
                      {" "}
                      <span className="font-semibold">
                        Current Status :
                      </span>{" "}
                      {currStatus ? currStatus : null}
                    </p> */}
                  </div>
                  <div className="w-full bg-white p-2 mt-8">
                    <div className="row">
                      <p className="font-semibold text-lg my-3 px-4">Skills</p>{" "}
                      <p className="mt-3" style={{ color: "red" }}>
                        ( Skills required*)
                      </p>
                    </div>
                    {showRoles ? (
                      <>
                        {showRoles.length > 0 &&
                          showRoles.map((el, index) => {
                            if (jdSkills.includes(el)) {
                              return (
                                <div key={index}>
                                  <Disclosure>
                                    {({ open }) => (
                                      <div
                                        className={`${open ? "shadow-md" : ""}`}
                                      >
                                        <Disclosure.Button
                                          className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                            open ? "shadow-lg " : ""
                                          }`}
                                        >
                                          <span>{el}</span>
                                          <div className="ml-auto mr-5 flex items-center space-x-2">
                                            <p>0</p>
                                            <input
                                              type="range"
                                              min="0"
                                              max="5"
                                              value={rolesProf[index]}
                                              onChange={(e) => {
                                                dbSkills.forEach((skill) => {
                                                  if (skill.role === el) {
                                                    skill.proficiency =
                                                      e.target.value;
                                                    let inde =
                                                      dbSkills.findIndex(
                                                        (el) => {
                                                          return el === skill;
                                                        }
                                                      );
                                                    let p = prof;
                                                    p[inde] = e.target.value;
                                                    setProf(p);
                                                    skill.rating =
                                                      e.target.value;
                                                  }
                                                });

                                                let rp = rolesProf;
                                                rp[index] = e.target.value;
                                                setRolesProf(rp);
                                                ls.set(
                                                  "RolesProf",
                                                  JSON.stringify(rolesProf)
                                                );
                                              }}
                                            />
                                            <p>5</p>
                                          </div>
                                          <ChevronUpIcon
                                            className={`${
                                              !open
                                                ? "rotate-180 transform"
                                                : ""
                                            } h-5 w-5 text-blue-500`}
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="p-3 px-4">
                                          {primarySkills[el] &&
                                            primarySkills[el].map(
                                              (skill, index) => {
                                                return (
                                                  <div>
                                                    <Disclosure>
                                                      {({ open }) => (
                                                        <div
                                                          className={`${
                                                            open
                                                              ? "shadow-md"
                                                              : ""
                                                          }`}
                                                        >
                                                          <Disclosure.Button
                                                            className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${
                                                              open
                                                                ? "shadow-lg"
                                                                : ""
                                                            } `}
                                                          >
                                                            <span>{skill}</span>
                                                            <ChevronUpIcon
                                                              className={`${
                                                                !open
                                                                  ? "rotate-180 transform"
                                                                  : ""
                                                              } h-5 w-5 text-blue-500`}
                                                            />
                                                          </Disclosure.Button>
                                                          <Disclosure.Panel className="p-3 px-12">
                                                            {dbSkills
                                                              .filter(
                                                                (secSkill) => {
                                                                  return (
                                                                    secSkill.primarySkill ===
                                                                      skill &&
                                                                    secSkill.role ===
                                                                      el
                                                                  );
                                                                }
                                                              )
                                                              .map(
                                                                (
                                                                  secSkill,
                                                                  index
                                                                ) => {
                                                                  let d =
                                                                    dbSkills;
                                                                  let index1 =
                                                                    d.findIndex(
                                                                      (el) => {
                                                                        return (
                                                                          el ===
                                                                          secSkill
                                                                        );
                                                                      }
                                                                    );
                                                                  return (
                                                                    <div className="flex my-2 text-sm justify-between items-center px-3 py-1">
                                                                      <p>
                                                                        {
                                                                          secSkill.secondarySkill
                                                                        }
                                                                      </p>

                                                                      <div className="flex items-center space-x-2">
                                                                        <p>0</p>
                                                                        <input
                                                                          type="range"
                                                                          min="0"
                                                                          max="5"
                                                                          value={
                                                                            prof[
                                                                              index1
                                                                            ]
                                                                          }
                                                                          onChange={async (
                                                                            e
                                                                          ) => {
                                                                            let d =
                                                                              dbSkills;
                                                                            d[
                                                                              index1
                                                                            ] =
                                                                              {
                                                                                ...d[
                                                                                  index1
                                                                                ],
                                                                                proficiency:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              };
                                                                            let p =
                                                                              prof;
                                                                            prof[
                                                                              index1
                                                                            ] =
                                                                              e.target.value;
                                                                            await ls.set(
                                                                              "prof",
                                                                              JSON.stringify(
                                                                                p
                                                                              )
                                                                            );
                                                                            await setProf(
                                                                              [
                                                                                ...p,
                                                                              ]
                                                                            );
                                                                            await setDbSkills(
                                                                              [
                                                                                ...d,
                                                                              ]
                                                                            );
                                                                            if (
                                                                              e
                                                                                .target
                                                                                .value >
                                                                              0
                                                                            ) {
                                                                              let u =
                                                                                user;
                                                                              let to =
                                                                                u.tools;
                                                                              to.push(
                                                                                {
                                                                                  proficiency:
                                                                                    e
                                                                                      .target
                                                                                      .value,
                                                                                  ...secSkill,
                                                                                }
                                                                              );
                                                                              u.tools =
                                                                                to;
                                                                              await setUser(
                                                                                {
                                                                                  ...u,
                                                                                }
                                                                              );
                                                                            }
                                                                          }}
                                                                        />
                                                                        <p>5</p>
                                                                        {/* <p className="text-xs font-italics">
                                                            {prof[index1] > 0
                                                              ? "Self-assetsted"
                                                              : "Unassested"}
                                                          </p> */}
                                                                      </div>
                                                                    </div>
                                                                  );
                                                                }
                                                              )}
                                                          </Disclosure.Panel>
                                                        </div>
                                                      )}
                                                    </Disclosure>
                                                  </div>
                                                );
                                              }
                                            )}
                                        </Disclosure.Panel>
                                      </div>
                                    )}
                                  </Disclosure>
                                </div>
                              );
                            }
                          })}

                        <button
                          className="mt-4 hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-4 sm:mx-0 text-xs rounded"
                          style={{ backgroundColor: "#034488" }}
                          onClick={() => updateSkill()}
                        >
                          Update Skills
                        </button>

                        <div className="p-5">
                          {rolesC.length > 0
                            ? rolesC.map((item, index) => {
                                return (
                                  <div className="py-2">
                                    <p className="font-semibold text-md md:w-1/2  md:flex w-full  space-y-2 my-5">
                                      {item}
                                    </p>
                                    {skillsPrimary[item] &&
                                      skillsPrimary[item].map((el) => (
                                        <div className="py-1">
                                          <p className="text-sm my-2">{el}</p>
                                          <div className="md:flex flex-wrap">
                                            {skillSet
                                              .filter(
                                                (tool) =>
                                                  tool.role === item &&
                                                  tool.primarySkill === el
                                              )
                                              .map((item1, index) => (
                                                <p className="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800 ">
                                                  {item1.secondarySkill}{" "}
                                                  {item1.proficiency &&
                                                    `(${item1.proficiency})`}
                                                </p>
                                              ))}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                );
                              })
                            : "No Skills"}
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Positives</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Positives</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        placeholder={placeHolderforPositives}
                        style={{ borderRadius: "5px" }}
                        onChange={(e) => {
                          setPositives(e.target.value);
                        }}
                      />
                      {positives?.length < 150 && (
                        <p style={{ color: "red" }}>
                          Please input 150 characters minimum in Positives.{" "}
                        </p>
                      )}
                      {!positives && (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          Required !
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Lowlights</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Lowlights</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        placeholder={placeHolderforLowlights}
                        onChange={(e) => {
                          setLowlights(e.target.value);
                        }}
                      />
                      {lowlights?.length < 150 && (
                        <p style={{ color: "red" }}>
                          Please input 150 characters minimum in Lowlights.{" "}
                        </p>
                      )}
                      {!lowlights && (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          Required !
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="my-5">
                    <p className="font-semibold text-lg my-3">Feedback</p>
                    <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                      <p className="font-semibold">Add Feedback</p>
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        placeholder={placeHolderforFeedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                      />
                      {feedback?.length < 150 && (
                        <p style={{ color: "red" }}>
                          Please input 150 characters minimum in Feedback.{" "}
                        </p>
                      )}
                      {!feedback && (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          Required !
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded-md my-3"
                style={{ backgroundColor: "#034488" }}
                disabled={
                  !positives ||
                  !feedback ||
                  !lowlights ||
                  feedback?.length < 150 ||
                  lowlights?.length < 150 ||
                  positives?.length < 150
                }
                onClick={updateEvaluationReport}
              >
                Complete Evaluation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInterviewApplication;
