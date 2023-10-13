import React, { useEffect, useState, Fragment } from "react";
import { browserName } from "react-device-detect";

// import { AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
import { BsFillStarFill } from "react-icons/bs";
import StackedChart from "../../Components/CompanyDashboard/StackedChart";
import PrintAble from "../CompanyDashboard/PrintAble.jsx";
import { Dialog, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";

import { getProfileImage,getPsychDetails } from "../../service/api";

import Avatar from "../../assets/images/UserAvatar.png";

import { useParams } from "react-router-dom";
import {
  getInterviewApplication,
  slot_by_interviewId,
} from "../../service/api";
import moment from "moment";
import { Oval } from "react-loader-spinner";
import ReactPlayer from 'react-player'
import { Carousel } from 'react-responsive-carousel'
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {Chart,ArcElement,BarElement,CategoryScale,LinearScale,Title,Tooltip,Legend,
  RadialLinearScale,PointElement,LineElement,Filler,} from "chart.js";
Chart.register(RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);

const InterviewReport = () => {
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
  const [profileImage, setProfileImage] = React.useState("");
  const [codeArea, setCodeArea] = React.useState("");
  const [whiteBoardAreaImage, setWhiteBoardAreaImage] = React.useState("");
  const [proactiveness, setProactiveness] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [lAbility, setLability] = useState(0);
  const [stability, setStability] = useState(0);
  const [teamwork, setTeamwork] = useState(0);
  const [recordingURLS, setRecordingURLS] = useState([]);



  useEffect(() => {
    setRecordingURLS([]);
    const gia = async (usr) => {

      let res = await getInterviewApplication({ id: id }, usr.access_token);
      const { applicant, application, job } = res.data.data;
      const recordingURLS = res?.data?.recordingsURL;
      setRecordingURLS(recordingURLS);
      setApplication(application);
      setApplicant(applicant);
      setJob(job);
      let base64stringCodeArea = "";
      if( application.codearea){
        base64stringCodeArea=atob(application.codearea);
      }
      if (base64stringCodeArea !== "") {
        setCodeArea(base64stringCodeArea);
      }

      if(application.whiteboard){
        setWhiteBoardAreaImage(application.whiteboard);
      }
      let image = await getProfileImage(
        { id: applicant?._id },
        usr.access_token
      );
      let base64string = "";
      base64string = btoa(
        new Uint8Array(image?.data?.Image?.data).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, "")
      );
      //console.log(base64string !== "");
      if (base64string !== "") {
        setProfileImage(`data:image/png;base64,${base64string}`);
      }

      let slot_res = await slot_by_interviewId(application._id);

      const slot = slot_res.data;
      setSlot(slot);
      let psyResp =  await getPsychDetails({ id: res?.data?.data?.application?.applicant}, usr.access_token);
      
      setpsycsdetails(psyResp?.data?.data);
      let persona= psyResp?.data?.data?.persona;

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
      setpersona(persona?.details);
      let intrv = application.interviewers;
      setevaluated(application.evaluations[intrv]);
      setselfassested(applicant.skills);
      let uniqueRoles = [...new Set(job.skills?.map((item) => item.role))];
      setJDSkills(uniqueRoles);
      setjobskills(job.skills);
    };

    const getuserdata = async () => {
      let user = JSON.parse(await getStorage("user"));
      setUser(user);
      gia(user);
    };
    getuserdata();
  }, []);

  let leftEyeBlinkRate, faceTest, gazeTest, earpieceDetectionStatus;
  if (application) {
    leftEyeBlinkRate = application.leftEyeBlinkRate * 10;
    faceTest = evaluated?.faceTest?evaluated?.faceTest:false;
    gazeTest = evaluated?.gazeTest?evaluated?.gazeTest:false;
    earpieceDetectionStatus = evaluated?.earpieceDetectionStatus?evaluated?.earpieceDetectionStatus:false;
    if (parseFloat(leftEyeBlinkRate.toFixed(2)) > 4) leftEyeBlinkRate = "High";
    else if (parseFloat(leftEyeBlinkRate.toFixed(2)) < 2.8)
      leftEyeBlinkRate = "Low";
    else leftEyeBlinkRate = "Medium";
  }
  let interview_date = "";
  if (slot) {
    const { startDate } = slot;
    interview_date = moment(startDate).format("DD-MM-YYYY | h:mm a");
  }

  // //console.log("application 22",application)
  return user && application ? (
    <>
      <div>
        <div
          className="flex mx-5 mt-3"
          style={{ justifyContent: "space-between"}}
        >
          <p className="text-2xl flex my-3 mx-5 font-semibold" style={{color:"#228276"}}>
            Hey {user && user.firstName ? user.firstName : "Company"}
            <p className=" text-2xl text-gray-400 px-2">
              {" "}
              here's what's happening today!
            </p>
          </p>
          <button
            className=" mx-3 hidden lg:px-5 lg:py-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
            style={{ backgroundColor: "#034488" }}
            onClick={() => {
              setModal(true);
            }}
          >
            Save
          </button>
        </div>
        
        {modal && (
          <Transition
            appear
            show={modal}
            as={Fragment}
            className="relative z-1050 w-full"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-1050 w-5/6"
              onClose={() => {}}
              static={true}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-screen-2xl mx-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                      <div className={`${!modal ? "hidden" : "block"}`}>
                        <div className="w-full">
                          <button
                            className="bg-[#034488] text-white rounded-sm py-1 mt-5"
                            onClick={() => setModal(false)}
                            style={{
                              backgroundColor: "#fff",
                              color: "#034488",
                            }}
                          >
                            <ImCross />
                          </button>
                          <PrintAble />
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
        <div className="lg:flex mx-5">
          <div className="left lg:w-2/3">
          <div className="lg:mx-10 lg:flex gap-4 mx-5">
              {/* <div className="lg:w-1/3 w-full rounded-lg my-2">
              <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
                <div className=" text-sm mx-2 font-semibold text-gray-900 my-2">
                  <div className=''>
                    <p className='text-xs'>Candidate Job Specific</p>
                    <p className='text-xs'>Success Recommendation</p>
                  </div>
                  <div className=''>

                  </div>
                </div>
              </div>
            </div> */}
              <div className="lg:w-1/3 w-full rounded-lg my-2">
                <div
                  className="bg-white rounded-lg shadow pt-4 pb-1"
                  style={{ background: "#FFFFFF" }}
                >
                  
                  <p className="text-lg font-semibold mx-2 pl-3">
                    Candidate Details
                  </p>
                  <div className="text-sm mx-3 my-2 flex justify-between pl-3">
                    <div className="">
                      <p className="text-xs mt-2 text-gray-500">Name:</p>
                      <p className="text-base text-gray-700 mb-2"><strong>
                        {applicant &&
                          applicant.firstName + " " + applicant.lastname}</strong>
                      </p>
                      <p className="text-xs mt-2 text-gray-500">Email:</p>
                      <p className="text-base mb-2 text-gray-700 "><strong>
                        {applicant && applicant.email}</strong>
                      </p>
                      <p className="text-xs mt-2 text-gray-500">Contact:</p>
                      <p className="text-base mb-2 text-gray-700 "><strong>
                        {applicant && applicant.contact}</strong>
                      </p>
                    </div>
                    <div className="">
                     
                      
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 w-full rounded-lg my-2">
                <div
                  className="bg-white rounded-lg shadow pt-4 pb-1"
                  style={{ background: "#FFFFFF" }}
                >
                  <p className="text-lg font-semibold mx-2 pl-3">
                    Interview Details
                  </p>
                  <div className="col text-sm mx-2 my-2 flex justify-between pl-3">
                    <div className="">
                      <p className="text-xs mt-2 text-gray-500">Job Title:</p>
                      <p className="text-base mb-2 font-bold text-gray-700"><strong>{job && job.jobTitle}</strong></p>

                      <p className="text-xs mt-2 text-gray-500">Job Type:</p>
                      <p className="text-base mb-2 text-gray-700"><strong>{job && job.jobType}</strong></p>

                      <p className="text-xs mt-2 text-gray-500">Interview Date:</p>
                      <p className="text-base mb-2 text-gray-700"><strong>{interview_date}</strong></p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='lg:mx-10 mx-4 my-5'>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">SUMMARY</p>
              </div>
              <div className="flex my-4 px-5 vertical-align-middle" >
                <div> <h3 className="py-2 font-md">This summary is generated by “Heimdall”, valuematrix.ai proprietary AI engine.

                  The probability of deception is captured through various parameters monitored and processed during the interview by valuematrix.ai
                  proprietary engine and internal QC process.
                </h3>
                </div>
              </div>

              <div className="my-4 px-5 vertical-align-middle" >
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Composure</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Calm to mild aggressive</p></div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Emotions</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Tensed, Surprise and Happy</p></div>
                </div>
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Communications</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Very good</p>
                  </div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Global exposure
                    </p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Yes</p>
                  </div>
                </div>
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Mindset</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Open</p>
                  </div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Probability of deception</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">5%</p>
                  </div>
                </div>
                <div className='m-5'>
                  <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">How to read probability of deception
                    0% to 20%

                    20% to 40%

                    40% to 50%

                    No to mild

                    Mild to medium, this could be due to varied reasons like not knowing answers, tensed or stressed etc.

                    High levels of deception.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

            {/* <div className="lg:mx-10 mx-4 my-5 ">
              <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
                <div
                  className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                  style={{ backgroundColor: "rgb(3, 68, 136)" }}
                >
                  <p className="px-6 mx-2  text-xl">
                    Candidate Personality Report
                  </p>
                </div>
                <div className="my-4 px-5 vertical-align-middle">
                  {persona ? (
                    <p className="text-gray-500 text-lg">
                      <span className="font-semibold pb-4">
                        Folowing traits are observed for{" "}
                        <strong>{applicant && applicant.firstName}</strong>.
                      </span>
                      <br />- Action orientness is{" "}
                      <strong>{persona?.actionOrientedness?.level}</strong>.{" "}
                      <br />- Has a{" "}
                      <strong>{persona?.attitudeAndOutlook?.level}</strong>{" "}
                      attitude and outlook. <br />- The team work skills are{" "}
                      <strong>{persona?.teamWorkSkills?.level}</strong>. <br />-
                      The learning ability is{" "}
                      <strong>{persona.learningAbility?.level}</strong>. <br />-
                      Has a <strong>{persona.needForAutonomy?.level}</strong>{" "}
                      need for autonomy. <br />- The general behavior is{" "}
                      <strong>{persona.generalBehavior?.level}</strong>.
                    </p>
                  ) : <strong>No personality assessment found for the candidate.</strong>}
                  {/* <div> <p className="py-2 font-bold">Personality (OCEAN)</p>
                  <p className="text-gray-500 text-lg">This Big Five assessment measures your scores on five major dimensions of personality Openness, Conscientiousness, Extraversion,
                    Agreeableness, and Neuroticism (OCEAN).</p>
                </div>
                <div>
                  {psycsdetails?
                  <BarChart psydata={psycsdetails.data} />
                  :null}
                </div> }
                </div>
              </div>
            </div> */}

            { <div className='lg:mx-10 mx-4 mt-3 rounded-lg'>
            <div className="text-xl py-4 rounded-lg font-bold  flex"
              style={{ backgroundColor: "#FFFFFF" }}>
              <p className="px-3 mx-2 text-lg">Your Personality</p>
            </div>
            <div className="lg:flex">
              <div className="shadow sm:w-full md:w-full lg:w-1/2 pb-5 h-auto rounded-l-lg bg-white ">

              <div className="px-3 vertical-align-middle h-full">
                  {persona ? (

                    <p className="text-gray-700 text-base py-6 px-6  ml-2 bg-gray-100 h-full rounded-lg vertical-align-middle">

                      <span className="font-semibold pb-4">
                        Folowing traits are observed for{" "}
                        <strong>{applicant && applicant.firstName}</strong>.
                      </span>
                      <br />- Action orientness is{" "}
                      <strong>{persona?.actionOrientedness?.level}</strong>.{" "}
                      <br />- Has a{" "}
                      <strong>{persona?.attitudeAndOutlook?.level}</strong>{" "}
                      attitude and outlook. <br />- The team work skills are{" "}
                      <strong>{persona?.teamWorkSkills?.level}</strong>. <br />-
                      The learning ability is{" "}
                      <strong>{persona.learningAbility?.level}</strong>. <br />-
                      Has a <strong>{persona.needForAutonomy?.level}</strong>{" "}
                      need for autonomy. <br />- The general behavior is{" "}
                      <strong>{persona.generalBehavior?.level}</strong>.
                    </p>
                  ) : <strong>No personality assessment found for the candidate.</strong>}
                  {/* <div> <p className="py-2 font-bold">Personality (OCEAN)</p>
                  <p className="text-gray-500 text-lg">This Big Five assessment measures your scores on five major dimensions of personality Openness, Conscientiousness, Extraversion,
                    Agreeableness, and Neuroticism (OCEAN).</p>
                </div>
                <div>
                  {psycsdetails?
                  <BarChart psydata={psycsdetails.data} />
                  :null}
                </div> */}
                </div>


              </div>
              {/* <div className='w-1 bg-gray-200'></div> */}
              <div className="shadow sm:w-full md:w-full lg:w-1/2 pb-10 h-auto rounded-r-lg bg-white ">

                {/* <PersonalityRadarChart details={persona}/> */}

                <div className="">
                  <div>
                    <Radar
                      data={{
                        labels: ["Proactiveness","Attitude","Learning ability","Stability","Teamwork",],
                        datasets: [
                          {
                            label: "Scored",
                            data: [proactiveness,attitude,lAbility,stability,teamwork],
                            backgroundColor: "#31D89B",
                            borderColor: "#228276",
                            borderWidth: 1,
                          }
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
                                max: 100
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
                </div>

              </div>
            </div>
          </div> }

          { /*
          <div className='lg:mx-10 mx-4 mt-10 '>
            <div className="text-xl py-5 rounded-t-lg text-white font-bold  flex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Cognitive Aptitude</p>
            </div>
            <div className="lg:flex">
              <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">

                <div className='mx-5'> <p className="py-2 font-bold">The Cognitive aptitude are scored as percentiles</p>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">Required
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">Score
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Critical Thinking
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Problem Solving
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Attention to details
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Numerical reasoning
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>
                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Spatial reasoning
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>


              </div>
              <div className='w-1 bg-gray-200'></div>
              <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">

                <RadarChart />
              </div>
            </div>
          </div> */}

            <div className="lg:mx-10 mx-4 my-5">
              <div className="shadow sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-lg">
                <div
                  className="text-xl py-5 rounded-lg font-bold  flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-3 mx-2  text-lg">Technical Assessment </p>
                </div>
                {/*
                <div className="flex my-4 px-5 vertical-align-middle">
                  <div className="flex justify-around ">
                    {" "}
                    <p className="font-bold">Coding assessment language :   {" "}
                      <span className={"text-green-500"}>{application && application.codelanguage}</span>
                    </p>
                  </div>
                  <div>
                  <p className="text-gray-400 text-sm font-semibold  m-5">
                      {
                        codeAreaImage !== "" ? (<strong>{codeAreaImage}</strong>) : (<strong>""</strong>)
                      }
                      <h5>
                        <strong>Language:</strong>{" "}
                        
                      </h5>
                    </p>

                  </div>
                </div>*/}

                <div className="w-full">
                  <p className="py-2 mx-5 font-bold">
                  Coding assessment language :   {" "}
                      <span className={"text-green-500"}>{application && application.codelanguage}</span>
                    </p>
                  <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                      {codeArea !== "" ? (<strong>{codeArea}</strong>) : (<strong>""</strong>)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <p className="py-2 mx-5 font-bold">White board </p>
                  <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                      {whiteBoardAreaImage !== "" ? (
                        <img className="rounded-lg" src={whiteBoardAreaImage} width="100%" alt=""/>) 
                        : (<img className="rounded-lg" src={""} width="100%" alt=""/>)
                      }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:mx-10 mx-4 my-5">
              <div className="shadow sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-lg">
                <div
                  className="text-xl py-5 rounded-lg font-bold  flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-3 mx-2 text-lg">
                    Interviewers Score & Notes
                  </p>
                </div>
                <div>
                  {/*console.log(selfassested)*/}
                  {evaluated && jobskills && selfassested ? (
                    <StackedChart
                      evaluated={evaluated.skills}
                      jobskills={jobskills}
                      selfassested={selfassested}
                      jdSkills={jdSkills}
                    />
                  ) : null}
                </div>
                <div className="w-full">
                  <p className="py-2 mx-5 font-bold">Positives</p>
                  <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                        {evaluated?.positives}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <p className="py-2 mx-5 font-bold">Lowlights</p>
                  <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                        {evaluated?.lowlights}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <p className="py-2 mx-5 font-bold">Interviewer Feedback</p>
                  <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                        {evaluated?.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:mx-10 mx-4 my-5 h-fit">
              <div className="shadow sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-lg">
                <div
                  className="text-xl py-5 rounded-lg font-bold  flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-3 mx-2 text-lg">Recordings and playback</p>
                </div>
                <div className="my-4 px-5 vertical-align-middle">
                  <div>
                    <p className="py-2">
                      Candidate interviewed by{" "}
                      <strong> {application?.interviewers} </strong> on{" "}
                      {interview_date}
                    </p>
                    {/* <p className="py-2 font-bold">Feedback reviewed by Paula Rose on 2nd August 2022 at 6:30 am GMT.
                  </p>
                  <p className="py-2 font-bold">Quality check by YJKLXXXXMD (masked id) on 2nd August 2022 at 1 pm GMT.
                  </p> */}
                    <p className="py-2 ">
                      The complete interview session is available for your review below
                      <Carousel>
                        {
                          recordingURLS.map((value)=>{
                            return(
                              <div className="text-xl py-4 rounded-lg font-bold  flex"
                              style={{ backgroundColor: "#6a6f6a" }}>
                                { <ReactPlayer 
                                  url={value.url} 
                                  controls={true}
                                  width="100%"
                                />}
                              </div>
                            )
                          })
                        }        
                      </Carousel>
                    </p>
                  </div>
                </div>
                {/* <div className="w-full px-8">
                  <video width="100%" controls>
                  <source src={application?.recording} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                </div> */}
              </div>
            </div>
          </div>

          <div className="right lg:w-1/3 mr-2 lg:mx-0">
          <div className="my-3">
              <div>
                {applicant && profileImage !== "" ? (
                  <img
                    className="rounded-lg"
                    src={profileImage}
                    width="100%"
                    alt=""
                  />
                ) : (
                  <img
                    className="rounded-lg"
                    src={Avatar}
                    width="100%"
                    alt=""
                  />
                )}
              </div>
              {/*
              <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white ">
                <div className="text-xl pt-5 rounded-lg text-black font-bold flex">
                  <p className="mx-5 text-lg">Candidate Details</p>
                </div>
              </div>
              <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white ">
                <div className="text-xl pt-5 rounded-lg text-black font-bold flex">
                  <p className="mx-5 text-base">
                    Name:{" "}
                    <span className="font-medium text-gray-900">
                      {applicant &&
                        applicant.firstName + " " + applicant.lastname}
                    </span>
                  </p>
                </div>
              </div>*/}
            </div>
            <div className="shadow sm:w-full md:w-full lg:w-full pb-10 h-fit my-3 bg-white ">
              <div
                className="text-xl py-4 rounded-lg font-bold  flex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="px-3 mx-2 text-lg">
                  Heimdall Anti Deception Engine
                </p>
              </div>
              {application && (
                <>
                  <div className="flex mb-3 px-5 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="text-base text-gray-700">Browser/OS</p>
                      <p className="text-gray-400 text-sm text-right font-bold ml-8">
                        {browserName}
                      </p>
                    </div>
                  </div>
                  <div className="flex my-3 px-5 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="text-base text-gray-700">Face Detection</p>
                      <p className="text-gray-400 text-sm text-right font-bold ml-8">
                        {faceTest ? (
                          <span className={"text-green-500"}>Detected</span>
                        ) : (
                          <span className={"text-red-500"}>Not Detected</span>
                        )}{" "}
                      </p>

                      {/* <p className="text-gray-400 text-sm text-right ml-8">Detected Individual identified as Peter

                  (verified & matched with Profile and LinkedIn picture) </p> */}
                    </div>
                  </div>
                  <div className="flex my-3 px-5 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="text-base text-gray-700">Gaze Tracking</p>
                      <p className="text-gray-400 text-sm text-right font-bold ml-8">
                        {gazeTest ? (
                          <span className={"text-green-500"}>Detected</span>
                        ) : (
                          <span className={"text-red-500"}>Not Detected</span>
                        )}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex my-3 px-5 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="text-base text-gray-700">Earpiece Detection</p>
                      <p className="text-gray-400 text-sm text-right font-bold ml-8">
                        {earpieceDetectionStatus ? (
                          <span className={"text-red-500"}>Detected</span>
                        ) : (
                          <span className={"text-green-500"}>Not Detected</span>
                        )}{" "}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex my-3 px-5 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="text-base text-gray-700">Eye Blink Rate</p>
                      <p className="text-gray-400 text-sm text-right font-bold ml-8">
                        {leftEyeBlinkRate}
                      </p>
                    </div>
                  </div> */}
                </>
              )}
            </div>

            {/* <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-fit my-3 bg-white ">
            <div className="text-xl py-5 rounded-t-lg text-white font-bold  flex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Candidate Other Exposures</p>
            </div>
            <div className="mt-3">
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Look alike Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Hint Control </p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">DE&I</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">XI & Candidate Collision Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Candidate Peer Collision Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
            </div>
          </div> */}

            

        
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div
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
        />
      </div>{" "}
    </>
  );
};

export default InterviewReport;
