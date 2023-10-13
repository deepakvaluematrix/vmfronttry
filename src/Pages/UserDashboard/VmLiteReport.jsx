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
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import ProgressBar from "@ramonak/react-progress-bar";
import {BsArrowDownCircleFill} from "react-icons/bs";
import {BsArrowUpCircleFill} from "react-icons/bs";

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

import { getProfileImage, getPsychDetails, getUser } from "../../service/api";
import { Oval } from "react-loader-spinner";
import {
  getInterviewApplication,
  slot_by_interviewId,
} from "../../service/api";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const VmLiteReport = (props) => {
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
  let [q1Length, setQ1Length] = useState(0);
  let [q2Length, setQ2Length] = useState(0);
  let [q3Length, setQ3Length] = useState(0);
  let [q4Length, setQ4Length] = useState(0);
  let [q5Length, setQ5Length] = useState(0);
  let [q6Length, setQ6Length] = useState(0);
  let [q7Length, setQ7Length] = useState(0);
  const [psyscore, setPsyscore] = React.useState(null);
  const [weaknessByLowestScore, setWeaknessByLowestScore] = useState([]);
  const [strengthByHighestScore, setStrengthByHighestScore] = useState([]);
  const [candidateExperience, setCandidateExperience] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);

  const personalityInsightScoreValue1 = ["Flexible", "Robust", "Adaptive"];
  const personalityInsightScoreValue2 = ["Adaptive", "Calm", "Quick Thinker", "Expeditious"];
  const personalityInsightScoreValue3 = ["Cooperative", "Synergetic", "Communal"];
  const personalityInsightScoreValue4 = ["Unflappable", "Inperturable", "Composed"];
  const personalityInsightScoreValue5 = ["Aivd learner", "Enthusiastic", "Inquisitive"];
  const personalityInsightScoreValue6 = ["Humanitarian", "Benevolent", "Supportive", "Professional", "Practitioner"];
  const personalityInsightScoreValue7 = ["Methodical", "Systematic", "Disciplined"];

  const dominanceList = {
    strength: ["Gets results", "Focuses on solutions", "Dynamic and engaging", "Makes decisions quickly", "New accomplishments", "Encourages innovation", "Straightforward feedback"],
    weakness: ["Tension and burnout", "Lack of structure or planning", "Difficulty prioritizing", "Overemphasizes status", "Overly blunt", "Impatient", "Too aggressive"]
  }
  const influenceList = {
    strength: ["Contagious optimism", "Open to change", "Creative problem solving", "Motivate others to achieve", "Negotiates conflict", "Creates caring environment", "Promotes ideas"],
    weakness: ["Impulsive", "Disorganized", "Lacks follow-through", "Changes direction frequently", "Unstructured", "Inattentive to detail", "May manipulate"]
  }
  const steadinessList = {
    strength: ["Diplomacy", "High level of team work", "Nurtures the culture", "Creates stable environment", "Customer service orientation", "Follow-throuh", "Empathy"],
    weakness: ["Indecisive", "Passive resistance", "May be complacent", "Sensitive to criticism", "Can stifie innovation", "Fails to challenge ideas", "Avoid critical feedback"]
  }
  const calculativenessList = {
    strength: ["Focus", "Objectivity & clarity", "Dependability", "Analysis & planning", "Precision & accuracy", "Well-defined goals", "Risk assessment"],
    weakness: ["Perfectionism", "Finding faults vs. solutions", "Bogged down in details", "Reluctance to make decisions", "Lack of enthusiasm", "Closed off to outsiders", "Overly cautious"]
  }


  useEffect(() => {
    const getPsychometricDetails = async (user, access_token) => {
      let psyResp = await getPsychDetails({ id: id}, access_token);
      let psyscore = psyResp?.data?.data;

      setpsycsdetails(psyscore);
      getPersonalityInsightData(psyscore);
      let persona = psyResp?.data?.data?.persona;
      setpersona(persona);
      let proactiveness =  Math.floor(persona?.details?.actionOrientedness?.score);
      setProactiveness(proactiveness);

      let attitude = Math.floor(persona?.details?.attitudeAndOutlook?.score);
      setAttitude(attitude);

      let lAbility = Math.floor(persona?.details?.learningAbility?.score);
      setLability(lAbility);

      let stability = Math.floor(persona?.details?.stabilityPotential?.score);
      setStability(stability);

      let teamwork = Math.floor(persona?.details?.teamWorkSkills?.score);
      setTeamwork(teamwork);


      const discScoreArr = []
      psyscore?.disc?.details.map((details) => {
        discScoreArr.push(details.score)
      })
      const highestScore = Math.max(...discScoreArr);
      const lowestScore = Math.min(...discScoreArr);
      if(highestScore == psyscore?.disc?.details[0].score) {
        setStrengthByHighestScore(influenceList)
      }
      if(highestScore == psyscore?.disc?.details[1].score) {
        setStrengthByHighestScore(dominanceList)
      }
      if(highestScore == psyscore?.disc?.details[2].score) {
        setStrengthByHighestScore(steadinessList)
      }
      if(highestScore == psyscore?.disc?.details[3].score) {
        setStrengthByHighestScore(calculativenessList)
      }

      if(lowestScore == psyscore?.disc?.details[0].score) {
        setWeaknessByLowestScore(influenceList)
      }
      if(lowestScore == psyscore?.disc?.details[1].score) {
        setWeaknessByLowestScore(dominanceList)
      }
      if(lowestScore == psyscore?.disc?.details[2].score) {
        setWeaknessByLowestScore(steadinessList)
      }
      if(lowestScore == psyscore?.disc?.details[3].score) {
        setWeaknessByLowestScore(calculativenessList)
      }
    }
    const getuserdata = async () => {
      let access_token = getStorage("access_token");
      const data = {id : id}
      const userById = await getUser(data, access_token);
      let sortedUserExperience = user?.experience?.sort((a,b)=>
        new Date(a.end_date) - new Date(b.end_date)
      );
      if (id) {
        let image = await getProfileImage({id: id}, access_token);
        if(image != undefined) {
          let base64string = btoa(
            String.fromCharCode(...new Uint8Array(image?.data?.Image?.data))
          );
          let src = `data:image/png;base64,${base64string}`;
          await setProfileImg(src);
        }
      }
      setCandidateExperience(sortedUserExperience);
      setUser(userById?.data?.user);
      getPsychometricDetails(userById.data.user, access_token);   
    };
    getuserdata();

    setTimeout(function() {
      setLoaderStatus(false)
    }, 8000)
  }, []);

  const formatPersonalityInsightData = (score) => {
    const newScore = ((20/100) * 100 ) + (8/10 * q1);
    return newScore;
  }

  const getPersonalityInsightData = (psyscore) => {
    console.log(psyscore?.disc?.details[0].score)
    console.log(psyscore?.disc?.details[3].score)
    q1 =
      ((psyscore?.disc?.details[0].score +
        psyscore?.disc?.details[3].score) / 2) * 10;
    q1 = formatPersonalityInsightData(q1);
    setQ1(Math.floor(q1));
    if(q1 > 40 && q1 <= 60) {
      setQ1Length(2)
    }
    if(q1 > 60 && q1 <= 80) {
      setQ1Length(3)
    }
    if(q1 > 80 && q1 <= 100) {
      setQ1Length(4)
    }
    q2 =
      ((psyscore?.disc?.details[1].score +
        psyscore?.disc?.details[3].score) / 2) * 10;
    q2 = formatPersonalityInsightData(q2);
    setQ2(Math.floor(q2))
    if(q2 > 40 && q2 <= 60) {
      setQ2Length(2)
    }
    if(q2 > 60 && q2 <= 80) {
      setQ2Length(3)
    }
    if(q2 > 80 && q2 <= 100) {
      setQ2Length(4)
    }
    q3 =
      ((psyscore?.disc?.details[0].score +
        psyscore?.disc?.details[3].score +
        psyscore?.ocean?.details[1].score) / 3) * 10
    q3 = formatPersonalityInsightData(q3);
    setQ3(Math.floor(q3));
    if(q3 > 40 && q3 <= 60) {
      setQ3Length(2)
    }
    if(q3 > 60 && q3 <= 80) {
      setQ3Length(3)
    }
    if(q3 > 80 && q3 <= 100) {
      setQ3Length(4)
    }
    q4 =
      ((psyscore?.disc?.details[0].score +
        psyscore?.disc?.details[3].score) / 2) * 10;
    q4 = formatPersonalityInsightData(q4);
    setQ4(Math.floor(q4));
    if(q4 > 40 && q4 <= 60) {
      setQ4Length(2)
    }
    if(q4 > 60 && q4 <= 80) {
      setQ4Length(3)
    }
    if(q4 > 80 && q4 <= 100) {
      setQ4Length(4)
    }
    q5 =
      ((psyscore?.disc?.details[1].score +
        psyscore?.ocean?.details[2].score) / 2) * 10;
    q5 = formatPersonalityInsightData(q5);
    setQ5(Math.floor(q5));
    if(q5 > 40 && q5 <= 60) {
      setQ5Length(2)
    }
    if(q5 > 60 && q5 <= 80) {
      setQ5Length(3)
    }
    if(q5 > 80 && q5 <= 100) {
      setQ5Length(4)
    }
    q6 =
      ((psyscore?.ocean?.details[0].score +
        psyscore?.ocean?.details[4].score) / 2) * 10;
    q6 = formatPersonalityInsightData(q6);
    setQ6(Math.floor(q6));
    if(q6 > 40 && q6 <= 60) {
      setQ6Length(2)
    }
    if(q6 > 60 && q6 <= 80) {
      setQ6Length(3)
    }
    if(q6 > 80 && q6 <= 100) {
      setQ6Length(4)
    }
    q7 =
      ((psyscore?.disc?.details[0].score +
        psyscore?.disc?.details[3].score +
        psyscore?.persona?.details.needForAutonomy.score) / 3) * 10;
    q7 = formatPersonalityInsightData(q7);
    setQ7(Math.floor(q7));
    if(q7 > 40 && q7 <= 60) {
      setQ7Length(2)
    }
    if(q7 > 60 && q7 <= 80) {
      setQ7Length(3)
    }
    if(q7 > 80 && q7 <= 100) {
      setQ7Length(4)
    }
  }
  
  return user && psycsdetails && persona ? (
    <>
      <div className="flex sm:p-1 bg-slate-50 overflow-hidden">
        {user !== null && user !== undefined && (
          <div className="container mx-auto bg-slate-50 mt-8 ">
            <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2" >
              <p className="text-xl flex mx-4 font-black mt-4 pt-4">
                {/* Hey! {user && user.firstName ? user.firstName : "User"} - {" "} */}
                VMLite Report 
                <p className="text-gray-400 px-2"> </p>
              </p>
              <div className="row">
                <div className="sm:w-full md:w-full lg:w-2/3 pb-10 h-auto rounded-r-lg  ">
                  {/* <div className="sm:w-full md:w-full lg:w-1/2 pb-10 h-auto rounded-r-lg bg-white "> */}
                  {/* <PersonalityRadarChart details={persona}/> */}
                  <div className="">
                    <div className="px-10 w-full md:flex mx-auto">
                      <div className="w-full">
                        <div className="w-full rounded-lg my-4 bg-white border  border-solid border-[#E3E3E3] pb-1">
                          <div className="border-b border-solid border-[#E3E3E3] py-3 pl-3 flex justify-between">
                            <div className="">
                              <p className="text-lg font-bold">
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
                            <div className="py-3">
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
                                    r: {
                                      min: 0,
                                      max: 10
                                    },
                                  },
                                  legend: {
                                    labels: {
                                      fontSize: 25,
                                    },
                                  },
                                }}
                              />
                            </div>
                            <div className="border-t border-solid border-[#E3E3E3] ml-4 pr-4 py-4">
                              <div className="">
                                 
                                 <div className="w-full">
                                  <div className="row py-2 gap-2">
                                    <p className="px-3 font-bold">Probable Strenghts</p>
                                    <BsArrowUpCircleFill className="mt-1 text-[#228276]"/>
                                  </div>
                                  <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                                    <div className="flex w-full gap-3 pl-4">
                                      <ul className="list-disc px-3 flex flex-col gap-4">
                                        {strengthByHighestScore?.strength?.slice(0, 4).map((strength) => {
                                          return (
                                            <li>{strength}</li>
                                          )
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full">
                                  <div className="row py-2 gap-2">
                                    <p className="font-bold px-3">Probable weakness</p>
                                    <BsArrowDownCircleFill className="mt-1 text-[#D6615A]"/>
                                  </div>
                                  <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                                    <div className="flex w-full gap-3 pl-4">
                                      <ul className="list-disc px-3 flex flex-col gap-4">
                                        {weaknessByLowestScore?.weakness?.slice(0, 4).map((weakness) => {
                                          return (
                                            <li>{weakness}</li>
                                          )
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
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
                        <div className="w-full rounded-lg my-4 bg-white  border  border-solid border-[#E3E3E3] pb-4">
                          <div className="border-b  border-solid border-[#E3E3E3] py-3 pl-3 flex justify-between">
                            <div className="">
                              <p className="text-lg font-bold">
                                Personality Insight
                              </p>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="px-4 py-4" style={{borderTop: "1px solid #E3E3E3"}}>
                            <div className="sm:w-full md:w-full lg:w-full h-auto rounded-l-lg bg-white ">
                              <div className="">
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2 border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      How adaptable he is at changing work
                                      environment ?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue1.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q1Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q1 > 0 && q1 <= 50) ? '#D6615A' : (q1 > 50 && q1 <= 70) ? '#D99442' : (q1 > 70 && q1 <= 100) ? '#228276' : ''} completed={q1} />
                                  </div>
                                </div>
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2  border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Is he ready to take new challenges and work
                                      positively towards it?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue2.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q2Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q2 > 0 && q2 <= 50) ? '#D6615A' : (q2 > 50 && q2 <= 70) ? '#D99442' : (q2 > 70 && q2 <= 100) ? '#228276' : ''} completed={q2} />
                                  </div>
                                </div>
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2  border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Is he comfortable at working with cross
                                      functional teams
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue3.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q3Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q3 > 0 && q3 <= 50) ? '#D6615A' : (q3 > 50 && q3 <= 70) ? '#D99442' : (q3 > 70 && q3 <= 100) ? '#228276' : ''} completed={q3} />
                                  </div>
                                </div>
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2  border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Is he good with communicating ideas and
                                      clearly convey ideas to everyone?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue4.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q4Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q4 > 0 && q4 <= 50) ? '#D6615A' : (q4 > 50 && q4 <= 70) ? '#D99442' : (q4 > 70 && q4 <= 100) ? '#228276' : ''} completed={q4} />
                                  </div>
                                </div>
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2  border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Can he analyse the situations and give
                                      creative solutions instantly ?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue5.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q5Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q5 > 0 && q5 <= 50) ? '#D6615A' : (q5 > 50 && q5 <= 70) ? '#D99442' : (q5 > 70 && q5 <= 100) ? '#228276' : ''} completed={q5} />
                                  </div>
                                </div>
                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2  border-b-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Is he has good command over his emotions and
                                      can handle pressure?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue6.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q6Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q6 > 0 && q6 <= 50) ? '#D6615A' : (q6 > 50 && q6 <= 70) ? '#D99442' : (q6 > 70 && q6 <= 100) ? '#228276' : ''} completed={q6} />
                                  </div>
                                </div>

                                <div className="mx-1 mt-3 flex flex-row justify-between gap-2 ">
                                  <div className="">
                                    <p className="font-medium">
                                      Is he dependable at workplace and can meet the
                                      deadline criteria ?
                                    </p>
                                    <div className="mt-2 mb-3 row">
                                      {personalityInsightScoreValue7.map((value, index) => {                         
                                        return (
                                          <div>
                                            {index <= q7Length-1 ? (
                                              <p className="bg-teal-100 text-s p-1 px-2 ml-3 rounded w-max">
                                                {value}
                                              </p>
                                            ) : (
                                              <></>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-25 right-0">
                                    <ProgressBar bgColor={(q7 > 0 && q7 <= 50) ? '#D6615A' : (q7 > 50 && q7 <= 70) ? '#D99442' : (q7 > 70 && q7 <= 100) ? '#228276' : ''} completed={q7} />
                                  </div>
                                </div>
                                <p></p>
                              </div>
                            </div>
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
                        <div className="w-full rounded-lg my-4 bg-white  border  border-solid border-[#E3E3E3] pb-4">
                          <div className="border-b  border-solid border-[#E3E3E3] py-3 ">
                            <div className="flex col justify-between">
                              <p className="text-lg font-bold">
                                Candidate Details
                              </p>
                              <div className="flex justify-between gap-2 cursor-pointer"
                                onClick={() =>
                                  window.open(user.linkedinurl, "_blank")
                                }
                              >
                                <div className="flex justify-center h-[27px]">
                                  <img className="border-solid-[#0078d4] mb-1 pt-[2px] " src={Linkedin}/>
                                </div>
                                <button
                                  className="text-[#333333] text-sm"
                                >
                                  Linkedin
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-green-600 font-black mt-1 mr-3"></div>
                          </div>
                          <div className="">
                            <img
                              className="w-80 m-auto py-4 rounded object-contain"
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
                                <p>Last Company</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {(candidateExperience?.length) > 0 ? candidateExperience[candidateExperience.length -1]?.company_name : ""}
                                </p>
                              </div>
                              <div className="row px-3 my-2 relative">
                                <p>Last Position</p>
                                <p className="top-0 right-0 absolute mr-3">
                                  {(candidateExperience?.length) > 0 ? candidateExperience[candidateExperience.length - 1]?.title : ""}
                                </p>
                              </div>
                              {/* {user !== null &&
                                user !== undefined &&
                                user.experience.map((item) => {
                                  return (
                                    <>
                                    <div className="row px-3 my-2 relative">
                                        <p>Last Company</p>
                                        <p className="top-0 right-0 absolute mr-3">
                                          {item.company_name}
                                        </p>
                                      </div>
                                      <div className="row px-3 my-2 relative">
                                        <p>Last Position</p>
                                        <p className="top-0 right-0 absolute mr-3">
                                          {item.title}
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
                </div>
              </div>
            </div>
          </div>
        )}
        {""}
      </div>
    </>
    ) : (
      <>
        {loaderStatus == true ? (
          <div className="h-[92vh]">
            <div
              className="mt-[38vh]"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Oval
                height={80}
                width={80}
                color="#3FD2C7"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#9ddaf7"
                strokeWidth={2}
                strokeWidthSecondary={2}
              /> This won't be long. Please wait..
            </div>{" "} 
          </div>
        ) : (
          <div className="flex justify-center h-[92vh] overflow-hidden">
            <div className="mt-[38vh] text-lg font-bold">
              VmLite report not generated yet for this user. 
            </div>
          </div>
        )}
      </>  
  );
};

export default VmLiteReport;
