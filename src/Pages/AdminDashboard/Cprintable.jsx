import React, { useEffect, useState, Fragment } from "react";
import { browserName } from "react-device-detect";
//new
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


import { Bar, Pie, Radar } from "react-chartjs-2";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import {Chart,ArcElement,BarElement,CategoryScale,LinearScale,Title,Tooltip,Legend,
  RadialLinearScale,PointElement,LineElement,Filler,} from "chart.js";
Chart.register(RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);


const CPrintableAdmin = () => {
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
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const gia = async (usr) => {
      setRecordingURLS([]);
      setIsLoading(true);
      let res = await getInterviewApplication({ id: id }, usr.access_token);
      console.log("res.data.data",res.data.data);
      setIsLoading(false);
      const { applicant, application, job } = res.data.data;
      const recordingURLS = res?.data?.recordingsURL;
      setRecordingURLS(recordingURLS);
      setApplication(application);
      let intrv = application.interviewers;
      setevaluated(application.evaluations[intrv]);

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
        { id: applicant._id },
        usr.access_token
      );
      let base64string = "";
      base64string = btoa(
        new Uint8Array(image?.data?.Image?.data).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, "")
      );
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
    faceTest = evaluated.faceTest;
    gazeTest = evaluated.gazeTest;
    earpieceDetectionStatus = evaluated.earpieceDetectionStatus;
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
  return (
    <>
      {isLoading ? (
        // Show loader here
<div className="mt-40" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Oval/><Oval/><Oval/><Oval/><Oval/>
</div>


      ) : (
        user && application ? (
          <>
          
           <div className="mt-2">
        <div className="lg:flex mx-5 mt-10">
          <div className="left lg:w-2/3 mt-2">
          <div className="lg:mx-10 lg:flex gap-4 mx-5 mt-20">
             
              <div className="lg:w-1/2 w-full rounded-lg my-2">
                <div
                  className="bg-white rounded-lg shadow pt-4 pb-1"
                  style={{ background: "#FFFFFF" }}
                >
                 {/* { console.log("applicants",applicant)} */}
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
                    
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full rounded-lg my-2">
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

            { <div className='lg:mx-10 mx-4 mt-3 rounded-lg'>
            <div className="text-xl py-4 rounded-lg font-bold  flex"
              style={{ backgroundColor: "#FFFFFF" }}>
              <p className="px-3 mx-2 text-lg">Candidate Personality</p>
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
                </div>

              </div>
            </div>
          </div> }
            <div className="lg:mx-10 mx-4 my-5">
              <div className="shadow sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-lg">
                <div
                  className="text-xl py-5 rounded-lg font-bold  flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-3 mx-2  text-lg">Technical Assessment </p>
                </div>

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
                    <p className="py-2 ">
                      The complete interview session is available for your
                      review 
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
                </>
              )}
            </div>


            <div className="shadow sm:w-full md:w-full lg:w-full my-3 pb-10 h-auto bg-white rounded-lg ">
              <div
                className="text-xl py-5 rounded-lg bg-blue-600 ex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="px-3 mx-2 text-lg">
                  What Candidate Have To Say{" "}
                </p>
              </div>
              <div className="flex my-4 vertical-align-middle">
                <div className="flex w-full mx-5 justify-between">
                  {" "}
                  <p className="py-2 font-bold text-base">
                    Interview experience
                  </p>
                  <div className="flex gap-1">
                    {application ? (
                      <>
                        {application?.candidateFeedback?.candidate_rating > 0 ? <BsFillStarFill /> : null}
                        {application?.candidateFeedback?.candidate_rating > 1 ? <BsFillStarFill /> : null}
                        {application?.candidateFeedback?.candidate_rating > 2 ? <BsFillStarFill /> : null}
                        {application?.candidateFeedback?.candidate_rating > 3 ? <BsFillStarFill /> : null}
                        {application?.candidateFeedback?.candidate_rating > 4 ? <BsFillStarFill /> : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex my-4 vertical-align-middle">
                <div className="flex w-full mx-5 justify-between">
                  {" "}
                  <p className="py-2 font text-base">
                      {application && application?.candidateFeedback?.feedback
                        ?(<i>"{application?.candidateFeedback?.feedback}"</i>)
                        :(<i> </i>)
                      }
                  </p>
                </div>
              </div>

              <div className="mx-5">
                {application ? (
                  <p className="text-gray-400 text-sm">
                    {application.candidatefeedback}
                  </p>
                ) : null}
              </div>
            </div>
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
        )
      )}
    </>
  );
//  console.log("application 22",application)
//  console.log("application user",user)  
  
};

export default CPrintableAdmin;
