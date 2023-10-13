import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import swal from "sweetalert";

// Assets
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { adminLogin, authenticateLogin, url } from "../../service/api";
import logo from "../../assets/images/logo.png";
import CircularProgress from "@mui/material/CircularProgress";
import { Bar, Pie, Radar } from "react-chartjs-2";
import Avatar from "../../assets/images/UserAvatar.png";

import ProgressBar from "@ramonak/react-progress-bar";

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

import { getProfileImage, getPsychDetails } from "../../service/api";
import {
  getInterviewApplication,
  slot_by_interviewId,
} from "../../service/api";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const VmLiteProReport = (props) => {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [application, setApplication] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [slot, setSlot] = useState(null);
  const [job, setJob] = useState(null);
  const [psycsdetails, setpsycsdetails] = useState(null);
  const [evaluated, setevaluated] = useState(null);
  const [jobskills, setjobskills] = useState(null);
  const [selfassested, setselfassested] = useState(null);
  const [persona, setpersona] = useState(null);
  const { id } = useParams();
  const [jdSkills, setJDSkills] = React.useState([]);
  const [profileImg, setProfileImg] = React.useState(null);
  const [codeArea, setCodeArea] = React.useState("");
  const [whiteBoardAreaImage, setWhiteBoardAreaImage] = React.useState("");
  const [proactiveness, setProactiveness] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [lAbility, setLability] = useState(0);
  const [stability, setStability] = useState(0);
  const [teamwork, setTeamwork] = useState(0);
  let [q1, setQ1] = useState(0);
  let [q2, setQ2] = useState(0);
  let [q3, setQ3] = useState(0);
  let [q4, setQ4] = useState(0);
  let [q5, setQ5] = useState(0);
  let [q6, setQ6] = useState(0);
  let [q7, setQ7] = useState(0);

  const [psyscore, setPsyscore] = React.useState(null);

  // const datax = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };

  useEffect(() => {
    let user = JSON.parse(getStorage("user"));

    console.log(user._id);

    let psyResp = getPsychDetails({ id: user._id }, user.access_token);

    console.log(psyResp);
    psyResp.then((value) => {
      let psyscore = value?.data?.data;

      console.log(value);

      q1 =
        (Math.floor(psyscore?.disc?.details[0].score) +
          Math.floor(psyscore?.disc?.details[3].score)) *
        5;
      q2 =
        (Math.floor(psyscore?.disc?.details[1].score) +
          Math.floor(psyscore?.disc?.details[3].score)) *
        5;
      q3 =
        (Math.floor(psyscore?.disc?.details[0].score) +
          Math.floor(psyscore?.disc?.details[3].score) +
          Math.floor(psyscore?.ocean?.details[1].score)) *
        3.33;
      q4 =
        (Math.floor(psyscore?.disc?.details[0].score) +
          Math.floor(psyscore?.disc?.details[3].score)) *
        5;
      q5 =
        (Math.floor(psyscore?.disc?.details[1].score) +
          Math.floor(psyscore?.ocean?.details[2].score)) *
        5;
      q6 =
        (Math.floor(psyscore?.ocean?.details[0].score) +
          Math.floor(psyscore?.ocean?.details[4].score)) *
        5;
      q7 =
        (Math.floor(psyscore?.disc?.details[0].score) +
          Math.floor(psyscore?.disc?.details[3].score) +
          Math.floor(psyscore?.persona?.details.needForAutonomy.score)) *
        3.33;

      console.log(q1);
      // console.log(q2);
      // console.log(q3);
      // console.log(q4);
      // console.log(q5);
      // console.log(q6);
      // console.log(q7);
    });

    const getuserdata = async () => {
      let user = JSON.parse(await getStorage("user"));

      setUser(user);
    };

    getuserdata();

    // console.log("snceian");
    // console.log(psyResp);
  }, []);

  return (
    <>
      <div className="flex sm:p-1 bg-slate-50 overflow-hidden">
        {user !== null && user !== undefined && (
          <div className="container mx-auto bg-slate-50 mt-8 ">
            <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5 ">
              <p className="text-xl flex mx-4 font-black mt-4 pt-4">
                {/* Hey! {user && user.firstName ? user.firstName : "User"} - {" "} */}
                VMLite Pro Report
                <p className="text-gray-400 px-2"> </p>
              </p>
              <div className="row">
                <div className="sm:w-full md:w-full lg:w-2/3 h-auto rounded-r-lg  ">
                  {/* <div className="sm:w-full md:w-full lg:w-1/2 pb-10 h-auto rounded-r-lg bg-white "> */}
                  {/* <PersonalityRadarChart details={persona}/> */}
                  <div className="">
                    <div className="px-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-1">
                          <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                            <div className="">
                              <p className="text-l text-slate-500">
                                General Insight
                              </p>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="">
                            {/* <p className="m-3">
                              Aditya thinks thenci ha the skill of the main
                              charater
                            </p> */}
                            <div className="border-b-2">
                              <Radar
                                data={{
                                  labels: [
                                    "Proactiveness",
                                    "Attitude",
                                    "Learning ability",
                                    "Stability",
                                    "Teamwork",
                                  ],
                                  datasets: [
                                    {
                                      label: "Scored",
                                      data: [
                                        proactiveness,
                                        attitude,
                                        lAbility,
                                        stability,
                                        teamwork,
                                      ],
                                      backgroundColor: "#64c4ae",
                                      borderColor: "#056144",
                                      borderWidth: 3,
                                    },
                                  ],
                                }}
                                height={400}
                                width={600}
                                options={{
                                  indexAxis: "y",
                                  maintainAspectRatio: false,
                                  scales: {
                                    xAxes: [
                                      {
                                        ticks: {
                                          beginAtZero: true,
                                          steps: 1,
                                          stepValue: 5,
                                          max: 100,
                                        },
                                      },
                                    ],
                                  },
                                  legend: {
                                    labels: {
                                      fontSize: 25,
                                    },
                                  },
                                }}
                              />
                            </div>

                            <div className="">
                              <p className="m-3">Probable Strenghts</p>

                              <div className="bg-slate-100 rounded-lg px-3 py-px m-3">
                                <ul className="list-disc m-4">
                                  <li>Objectivity & clarity</li>

                                  <li>Analysis and planning</li>

                                  <li>Precision and accuracy</li>
                                </ul>
                              </div>

                              <p className="m-3">Probable weakness</p>

                              <div className="bg-slate-100 rounded-lg px-3 py-px m-3">
                                <ul className="list-disc m-4">
                                  <li>Lack of enthusiasm</li>

                                  <li>Reluctance to make decisions</li>

                                  <li>Overly cautious</li>
                                </ul>
                              </div>
                            </div>

                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="px-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-2">
                          <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                            <div className="">
                              <p className="text-l text-slate-500">
                                Personality Insight
                              </p>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="relative">
                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  How adaptable he is at changing work
                                  environment ?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={54} />
                              </div>
                            </div>

                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  Is he ready to take new challenges and work
                                  positively towards it?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={37} />
                              </div>
                            </div>

                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  Is he comfortable at working with cross
                                  functional teams
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={64} />
                              </div>
                            </div>

                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  Is he good with communicating ideas and
                                  clearly convey ideas to everyone?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={60} />
                              </div>
                            </div>

                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  Can he analyse the situations and give
                                  creative solutions instantly ?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={55} />
                              </div>
                            </div>

                            <div className="m-3 row border-b-2 ">
                              <div className="">
                                <p className="font-medium">
                                  Is he has good command over his emotions and
                                  can handle pressure?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={52} />
                              </div>
                            </div>

                            <div className="m-3 row  ">
                              <div className="">
                                <p className="font-medium">
                                  Is he dependable at workplace and can meet the
                                  deadline criteria ?
                                </p>
                                <div className="mt-2 mb-3 row">
                                  <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                                    Positive
                                  </p>
                                </div>
                              </div>

                              <div className="w-25 right-0 absolute mr-3">
                                <ProgressBar bgColor="#046458" completed={71} />
                              </div>
                            </div>
                            <p></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:w-full md:w-full lg:w-1/3 pb-10 h-auto rounded-r-lg">
                  {/* <div className="sm:w-full md:w-full lg:w-1/2 pb-10 h-auto rounded-r-lg bg-white "> */}
                  {/* <PersonalityRadarChart details={persona}/> */}
                  <div className="">
                    <div className="pr-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4">
                          <div className="border-b border-gray-200 py-2  flex justify-between">
                            <div className="col">
                              <p className="text-l text-slate-500">
                                Candidate Details
                              </p>
                              <button
                                className="top-0 right-0 absolute text-indigo-600"
                                onClick={() =>
                                  window.open(user.linkedinurl, "_blank")
                                }
                              >
                                Linkedin
                              </button>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="">
                            <img
                              className="w-80 m-5 rounded object-contain"
                              src={
                                user && user.profileImg && profileImg
                                  ? profileImg
                                  : Avatar
                              }
                            ></img>

                            <div className="col">
                              <div className="row px-3 my-1 relative">
                                <p>Name</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.firstName} {user.lastname}
                                </p>
                              </div>
                              <div className="row  px-3 my-2 relative">
                                <p>Email</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.email}
                                </p>
                              </div>
                              <div className="row px-3 my-2 relative">
                                <p>Phone</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.contact}
                                </p>
                              </div>
                              <div className="row px-3 my-2 relative">
                                <p>Username</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.username}
                                </p>
                              </div>
                              <div className="row px-3 my-2 relative">
                                <p>Last Company</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.experience[0].company_name}
                                </p>
                              </div>
                              <div className="row px-3 my-2 relative">
                                <p>Last Position</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {user.experience[0].title}
                                </p>
                              </div>

                              {/* {user !== null &&
                                user !== undefined &&
                                user.experience.map(() => {
                                  return (
                                    <>
                                    <div className="row px-3 my-2 relative">
                                        <p>Last Company</p>
                                        <p className="top-0 right-0 absolute mr-3">
                                          {user.experience[0].company_name}
                                        </p>
                                      </div>
                                      <div className="row px-3 my-2 relative">
                                        <p>Last Position</p>
                                        <p className="top-0 right-0 absolute mr-3">
                                          {user.experience[0].title}
                                        </p>
                                      </div>
                                    </>
                                    
                                  );
                                })} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="pr-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4">
                          <div className="border-b border-gray-200 py-2  flex justify-between">
                            <div className="col">
                              <p className="text-l text-slate-500">
                                Test Description
                              </p>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>

                          <div className="row px-3 my-2 relative mx-1">
                            <p>Required score</p>
                            <p className="top-0 right-0 absolute mr-3">12</p>
                          </div>
                          <div className="row px-3 my-2 relative mx-1">
                            <p>Score received</p>
                            <p className="top-0 right-0 absolute mr-3">15</p>
                          </div>
                          <p className="text-sm text-slate-400 mx-4 text-justify">
                            The VM test measures the cognitive aptitude of any
                            individual by performing various online psychometric
                            tests. Through this test, we assess the skills
                            suited for the job success of this position.
                            <br /> <br />
                            Each skill is rated on a scale of 1 to 10. This
                            higher the score, the better the individual is in
                            that particular field.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="pr-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4">
                          <div className="border-b border-gray-200 py-2  flex justify-between">
                            <div className="col">
                              <p className="text-l text-slate-500">
                                Probable Matches
                              </p>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="rounded-lg outline outline-offset-2 outline-2 outline-slate-200 m-4 p-3">
                            <div className="row relative">
                              <img></img>
                              <p className="mb-[15px] ml-3 text-lg">Google</p>
                              <p className="mt-1 top-0 right-0 absolute mr-3">
                                80%
                              </p>
                            </div>

                            <ProgressBar bgColor="#046458" completed={80} />
                          </div>
                          <div className="rounded-lg outline outline-offset-2 outline-2 outline-slate-200 m-4 p-3">
                            <div className="row relative">
                              <img></img>
                              <p className="mb-[15px] ml-3 text-lg">Google</p>
                              <p className="mt-1 top-0 right-0 absolute mr-3">
                                67%
                              </p>
                            </div>

                            <ProgressBar bgColor="#046458" completed={67} />
                          </div>
                          <div className="rounded-lg outline outline-offset-2 outline-2 outline-slate-200 mt-4 mx-4 p-3">
                            <div className="row relative">
                              <img></img>
                              <p className="mb-[15px] ml-3 text-lg">Google</p>
                              <p className="mt-1 top-0 right-0 absolute mr-3">
                                50%
                              </p>
                            </div>

                            <ProgressBar bgColor="#046458" completed={60} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="px-4 w-full md:flex mx-auto">
                  <div className="w-full">
                    <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4">
                      <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                        <div className="">
                          <p className="text-l text-slate-500">
                            Result Analysis
                          </p>
                        </div>
                        <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                      </div>
                      <div className="relative">
                        <div className="m-3 row pb-3 ">
                          <div className="row w-50">
                            <p className="font-medium ml-3 mt-1">
                              Dominant traits
                            </p>
                            <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                              Positive
                            </p>
                            <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-min">
                              Positive
                            </p>
                            <div className="mt-2 mb-3 row"></div>
                          </div>

                          <div className="w-50 right-0 absolute mr-3">
                            <p className="text-sm text-slate-400 mx-4 text-justify">
                              The results defined in the data below are based on
                              20 mins cognitive report of the candidate and does
                              not guarantee any accuracy of any ability in real
                              life situations.
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg grid gap-4 grid-cols-2 m-3">
                          <div className="bg-white ml-3 mt-3 outline outline-offset-2 outline-2 outline-slate-200 rounded-lg">
                            <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                              <div className="">
                                <p className="text-l text-slate-500">
                                  Brain Skills
                                </p>
                              </div>
                              
                            </div>
                          </div>
                          <div className="bg-white mr-3 mt-3 rounded-lg outline outline-offset-2 outline-2 outline-slate-200">
                          <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                              <div className="">
                                <p className="text-l text-slate-500">
                                Judgement analysis
                                </p>
                              </div>
                              
                            </div>
                          </div>
                          <div className="bg-white ml-3 mb-3 rounded-lg outline outline-offset-2 outline-2 outline-slate-200">
                          <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                              <div className="">
                                <p className="text-l text-slate-500">
                                Emotional quotient
                                </p>
                              </div>
                              <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                            </div>
                          </div>
                          <div className="bg-white mr-3 mb-3 rounded-lg outline outline-offset-2 outline-2 outline-slate-200">
                          <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                              <div className="">
                                <p className="text-l text-slate-500">
                                Focus capabilities
                                </p>
                              </div>
                              <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {""}
      </div>
    </>
  );
};

export default VmLiteProReport;
