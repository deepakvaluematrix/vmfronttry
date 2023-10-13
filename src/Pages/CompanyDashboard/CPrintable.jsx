import React, { useEffect, useState, Fragment } from "react";
import { browserName } from "react-device-detect";

// import { AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
import { BsFillStarFill } from "react-icons/bs";
import StackedChart from "../../Components/CompanyDashboard/StackedChart";
import PrintAble from "../CompanyDashboard/PrintAble.jsx";
import { Dialog, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";
import {BsArrowDownCircleFill} from "react-icons/bs";
import {BsArrowUpCircleFill} from "react-icons/bs";

import { getProfileImage,getPsychDetails } from "../../service/api";

import Avatar from "../../assets/images/UserAvatar.png";
import Linkedin from "../../assets/images/Social/linkedin.svg";

import { useParams } from "react-router-dom";
import {
  getInterviewApplication,
  slot_by_interviewId,
  getBaseLiningImagesFace, 
  getBaseLiningImagesPerson, 
  getBaseLiningImagesEar, 
  getBaseLiningImagesGaze,
  getUserFromId
} from "../../service/api";
import moment from "moment";
import { Oval } from "react-loader-spinner";
import ReactPlayer from 'react-player';
import { Carousel } from 'react-responsive-carousel';
import ProgressBar from "@ramonak/react-progress-bar";
import ImageCarousel from "react-simply-carousel";

import { Bar, Pie, Radar } from "react-chartjs-2";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import {Chart,ArcElement,BarElement,CategoryScale,LinearScale,Title,Tooltip,Legend,
  RadialLinearScale,PointElement,LineElement,Filler,} from "chart.js";
Chart.register(RadialLinearScale,PointElement,LineElement,Filler,Tooltip,Legend);


const CPrintable = () => {
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
  const [preinterviewImages, setPreinterviewImages] = useState([]);
  const [XIDetails, setXIDetails] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [candidateExperience, setCandidateExperience] = useState([]);

  useEffect(() => {
    const gia = async (usr) => {
      setRecordingURLS([]);
      // let access_token = getStorage("access_token");
      let res = await getInterviewApplication({ id: id }, usr.access_token);
      const { applicant, application, job } = res.data.data;
      const recordingURLS = res?.data?.recordingsURL;
      setRecordingURLS(recordingURLS);
      getBaseLiningImagesData(application);
      setApplication(application);
      let intrv = application.interviewers;
      setevaluated(application.evaluations[intrv]);

      setApplicant(applicant);
      setJob(job);

      let XIDetails = await getUserFromId({ id: application.interviewers});
      setXIDetails(XIDetails.data.user);
      let candidateDetails = await getUserFromId({ id: res?.data?.data?.application?.applicant });
      let sortedUserExperience = candidateDetails.data.user.experience.sort((a,b)=>
        new Date(a.end_date) - new Date(b.end_date)
      );
      setCandidateExperience(sortedUserExperience);
      setCandidateDetails(candidateDetails.data.user);

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
        { id: application.applicant},
        usr.access_token
      );
      if (image?.status === 200) {
        let base64string = "";
        base64string = btoa(
          new Uint8Array(image?.data?.Image?.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, "")
        );
        if (base64string !== "") {
          setProfileImage(`data:image/png;base64,${base64string}`);
        }
      }

      let slot_res = await slot_by_interviewId(application._id);

      const slot = slot_res.data;
      setSlot(slot);
      let psyResp =  await getPsychDetails({ id: res?.data?.data?.application?.applicant}, usr.access_token);

      let psyscore = psyResp?.data?.data;
      setpsycsdetails(psyscore);

      let persona = psyResp?.data?.data?.persona;
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

  const getBaseLiningImagesData = async (applicationData) => {
    let data = {id:applicationData._id};
    const images = [];
    const faceDataResponse = await getBaseLiningImagesFace(data);
    if(faceDataResponse.status === 200) {
      images.push(faceDataResponse.data.image); 
    }
    const personDataResponse = await getBaseLiningImagesPerson(data);

    if(personDataResponse.status === 200) {
      images.push(personDataResponse.data.image); 
    }
    const earDataResponse = await getBaseLiningImagesEar(data);
    if(earDataResponse.status === 200) {
      images.push(earDataResponse.data.image); 
    }
    const gazeDataResponse = await getBaseLiningImagesGaze(data);
    if(gazeDataResponse.status === 200) {
      images.push(gazeDataResponse.data.image); 
    }
    setPreinterviewImages(images);
  }

  let leftEyeBlinkRate, faceTest, gazeTest, earpieceDetectionStatus, personTest;
  if (application) {
    leftEyeBlinkRate = application.leftEyeBlinkRate * 10;
    faceTest = evaluated.faceTest;
    gazeTest = evaluated.gazeTest;
    //earpieceDetectionStatus = evaluated.earpieceDetectionStatus;
    earpieceDetectionStatus = evaluated.earTest;
    personTest = evaluated.personTest;
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

  return user && application && psycsdetails && persona ? (
  <>
    <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2  ">
      <div className="lg:flex mx-5 mb-5 py-4">
        <div className="left lg:w-2/3">

          {/* Interviewers Score & Notes Section*/}

          <div className="lg:mx-10 mx-4 mt-3 rounded-lg">
            <div className="sm:w-full md:w-full lg:w-full h-auto bg-white rounded-lg" style={{border: "1px solid #E3E3E3"}}>
              <div
                className="text-xl py-3 rounded-lg font-bold  flex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="px-4 text-lg">
                  Interviewers Score & Notes
                </p>
              </div>
              <div style={{borderTop: "1px solid #E3E3E3"}}>
                {evaluated && jobskills && selfassested ? (
                  <StackedChart
                    evaluated={evaluated.skills}
                    jobskills={jobskills}
                    selfassested={selfassested}
                    jdSkills={jdSkills}
                  />
                ) : null}
              </div>

              <div className="border-t border-solid border-[#E3E3E3] ml-4 pr-4 py-4">
                <div className="">
                  {evaluated?.demeanorOfCandidate? 
                  <div className="w-full">
                    <div className="row py-2 gap-2">
                      <p className="px-3 font-bold">Demeanor of the candidate (Calm or Tensed)</p>
                    </div>
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.demeanorOfCandidate}
                        </p>
                      </div>
                    </div>
                  </div>
                :null}
                  
                  <div className="w-full">
                    <div className="row py-2 gap-2">
                      <p className="px-3 font-bold">Was the candidate alone in the room during the interview?</p>
                    </div>
                    {evaluated?.anotherPerson? 
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.anotherPerson}
                        </p>
                      </div>
                    </div>
                    :
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                         Yes
                        </p>
                      </div>
                    </div>
                    }
                  </div>

                  <div className="w-full">
                    <div className="row py-2 gap-2">
                      <p className="px-3 font-bold">Was the candidate facing the camera for the entire session?</p>
                    </div>
                    {evaluated?.facedCamera? 
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.facedCamera?
                            <>The candidate was facing the camera for the entire session.</>
                          :
                            <>The candidate was not facing the camera for the entire session.</>
                          }
                        </p>
                      </div>
                    </div>
                    :
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                         No
                        </p>
                      </div>
                    </div>
                    }
                  </div>

                </div>
              </div>


              
              <div className="border-t border-solid border-[#E3E3E3] ml-4 pr-4 py-4">
                <div className="">
                  <div className="w-full">
                    <div className="row py-2 gap-2">
                      <p className="px-3 font-bold">Positives</p>
                      <BsArrowUpCircleFill className="mt-1 text-[#228276]"/>
                    </div>
                    <div className="py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.positives}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="row py-2 gap-2">
                      <p className="font-bold px-3">Lowlights</p>
                      <BsArrowDownCircleFill className="mt-1 text-[#D6615A]"/>
                    </div>
                    <div className="text-gray-400 py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.lowlights}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="py-2 font-bold">Interviewer Feedback</p>
                    <div className="text-gray-400 py-2 text-sm bg-[#FAFAFA] rounded-lg my-2 vertical-align-middle">
                      <div className="flex w-full gap-3">
                        <p className="text-[#333333] text-sm break-all">
                          {evaluated?.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Personality Section */}

          <div className="lg:mx-10 mx-4 mt-3 rounded-lg">
            <div className="sm:w-full md:w-full lg:w-full h-auto bg-white rounded-lg" style={{border: "1px solid #E3E3E3"}}>
              <div
                className="text-xl py-3 rounded-lg font-bold  flex px-4"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-lg">
                  Candidate  personality
                </p>
              </div>
              <div className="px-4 py-4" style={{borderTop: "1px solid #E3E3E3"}}>
                <div className="sm:w-full md:w-full lg:w-full h-auto rounded-l-lg bg-white ">
                  <div className="vertical-align-middle h-full">
                    {persona ? (
                      <p className="text-gray-700 text-base h-full rounded-lg vertical-align-middle">
                        <span className="font-semibold pb-3">
                          Folowing traits are observed for{" "}
                          <strong>{applicant && applicant.firstName}</strong>.
                        </span>
                        <div className="pl-4">
                          <br className="pl-4" />- Action orientness is{" "}
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
                        </div>
                      </p>
                    ) : <strong>No personality assessment found for the candidate.</strong>}
                  </div>                  
                </div>
              </div>            
            </div>
          </div>

          {/* Candidate Feedback About XI Section */}

          <div className="lg:mx-10 mx-4 mt-3 rounded-lg">
            <div className="sm:w-full md:w-full lg:w-full h-auto bg-white rounded-lg" style={{border: "1px solid #E3E3E3"}} >
              <div className="sm:w-full md:w-full lg:w-full h-fit bg-white ">
                <div
                  className="text-xl py-3 font-semibold flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-4 text-lg">
                    Candidate Feedback
                  </p>
                </div>
              </div>
              
              <div className="lg:flex flex-col px-4 py-4 border-t border-solid border-[#E3E3E3]">
              <div className="flex vertical-align-middle">
                    <div className="flex w-full justify-between">
                      <p className="font- texmediumt-base">
                        {XIDetails.firstName} {XIDetails.lastname}
                      </p>
                      <div className="flex gap-1">
                        {application ? (
                          <>
                            {application?.candidateFeedback?.candidate_rating > 0 ? <BsFillStarFill className="text-[#228276]" /> : null}
                            {application?.candidateFeedback?.candidate_rating > 1 ? <BsFillStarFill className="text-[#228276]" /> : null}
                            {application?.candidateFeedback?.candidate_rating > 2 ? <BsFillStarFill className="text-[#228276]" /> : null}
                            {application?.candidateFeedback?.candidate_rating > 3 ? <BsFillStarFill className="text-[#228276]" /> : null}
                            {application?.candidateFeedback?.candidate_rating > 4 ? <BsFillStarFill className="text-[#228276]" /> : null}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex pt-4 vertical-align-middle">
                    <div className="flex w-full justify-between">
                      {" "}
                      <p className="font text-base">
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

          {/* Technical Assessment Section */}

          <div className="lg:mx-10 mx-4 mt-3 rounded-lg">
            <div className="sm:w-full md:w-full lg:w-full h-auto bg-white rounded-lg" style={{border: "1px solid #E3E3E3"}}>
              <div
                className="px-4 text-xl py-3 rounded-lg font-bold  flex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-lg">
                  Technical Assessment
                </p>
              </div>
              <div className="" style={{borderTop: "1px solid #E3E3E3"}}>
                <div className="w-full px-4 py-4">
                  <p className="font-bold pb-4">
                    Coding assessment
                  </p>
                  <div className="text-sm rounded-lg vertical-align-middle">
                    <div className="flex w-full gap-3">
                      <p className="text-gray-400 text-sm">
                      {codeArea !== "" ? (<strong>{codeArea}</strong>) : (<strong>""</strong>)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-4">
                  <p className="font-bold">White board </p>
                  <div className="text-gray-400 py-3 text-sm border border-solid border-[#E3E3E3] rounded-lg my-4 vertical-align-middle">
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
                <div className="" style={{borderTop: "1px solid #E3E3E3"}}>
                  <div className="w-full px-4 py-4">
                    <p className="font-bold pb-4">
                        Interview recordings
                    </p>

                      {recordingURLS.length > 0 ? (
                            <div className="relative flex flex-col w-full justify-around">
                               <p className="font-bold pb-4">
                                  
                              </p>
                              <Carousel className="block">
                                {
                                  recordingURLS.map((value, index)=>{
                                    return(
                                      <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                        style={{ backgroundColor: "#6a6f6a" }}>
                                          { <ReactPlayer 
                                              url={value.url} 
                                              controls={true}
                                              width="100%"
                                              height="500px"
                                          />}
                                      </div>
                                    )
                                  })
                                }        
                              </Carousel>
                              </div>   
                            ):(
                              <>
                                <div className="relative flex w-full justify-center">
                                  No recordings available !
                                </div>
                              </>
                            )
                          } 
                          </div>
                        </div>
                
              </div>

              
            </div>
          </div>        
        </div>

        <div className="right lg:w-1/3 mr-2 lg:mx-0">

          {/* Candidate Details Section */}

          <div className="border border-solid border-[#E3E3E3] sm:w-full md:w-full lg:w-full my-3 h-auto bg-white rounded-lg ">
            <div
              className="px-4 text-xl py-3 rounded-lg bg-blue-600 font-bold flex col justify-between"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <span>
              <p className="text-lg">
                Candidate Details
              </p>
              </span>
              <div className="flex justify-between gap-2 cursor-pointer"
                onClick={() =>
                  window.open(candidateDetails.linkedinurl, "_blank")
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
            <div className="py-4 px-4 border-t border-solid border-[#E3E3E3]">
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

              <div className="mt-4">
                <div className="flex justify-between mb-3">
                  <p className="font-medium">Name</p>
                  <p className="font-thin">
                    {applicant &&
                      applicant.firstName + " " + applicant.lastname}
                  </p>
                </div>
                <div className="flex justify-between mb-3">
                  <p className="font-medium">Email</p>
                  <p className="font-light">
                    {applicant && applicant.email}
                  </p>
                </div>
                <div className="flex justify-between mb-3">
                  <p className="font-medium">Contact</p>
                  <p className="font-light">
                    {applicant && applicant.contact}
                  </p>  
                </div>
                <div className="flex justify-between mb-3">
                  <p className="font-medium">Interviewer</p>
                  <p className="font-light">
                    {application.interviewers[0]}
                  </p>  
                </div>

                {/* <div className="flex justify-between mb-3">
                  <div className="font-medium">Last company</div>
                  <p className="font-light">
                    {(candidateExperience?.length) > 0 ? candidateExperience[candidateExperience.length -1]?.company_name : ""}
                  </p>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="font-medium">Last position</div>
                  <p className="font-light">
                    {(candidateExperience?.length) > 0 ? candidateExperience[candidateExperience.length - 1]?.title : ""}
                  </p>
                </div> */}
                {/* {evaluated && evaluated.status ?
                <div className="flex justify-between mb-3">
                  <p className="font-medium">Recommendation</p>
                  {evaluated.status==='Recommended' ? (
                    <p className="font-medium">
                      <b><span className={"text-green-500"}>{evaluated.status}</span></b>
                    </p>
                  ) : (
                    <p className="font-medium">
                      <b><span className={"text-[#D6615A]"}>{evaluated.status}</span></b>
                    </p>
                  )}{" "}
                </div>
                :null
                } */}

              </div>
            </div>
          </div>

          {/* Heimdall anti deception engine Section */}

          <div className="border border-solid border-[#E3E3E3] sm:w-full md:w-full lg:w-full my-3 h-auto bg-white rounded-lg ">
            <div className="sm:w-full md:w-full lg:w-full h-fit bg-white ">
                <div
                  className="text-xl py-3 rounded-lg font-bold flex"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <p className="px-3 mx-2 text-lg">
                    Heimdall baseline
                  </p>
                </div>
                {application && (
                  <div className="px-4 py-4 border-t border-solid border-[#E3E3E3]">
                    <div className="flex pt-2 mb-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Browser</p>
                        <p className="text-[#333333] font-normal text-sm text-right ml-8">
                          {browserName}
                        </p>
                      </div>
                    </div>
                    <div className="flex my-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Face</p>
                        <p className="text-gray-400 text-sm text-right font-bold ml-8">
                          {faceTest ? (
                            <span className={"text-green-500 font-normal"}>Detected</span>
                          ) : (
                            <span className={"text-[#D6615A] font-normal"}>Not detected</span>
                          )}{" "}
                        </p>
                      </div>
                    </div>
                    {/* <div className="flex my-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Gaze tracking</p>
                        <p className="text-gray-400 text-sm text-right font-bold ml-8">
                          {gazeTest ? (
                            <span className={"text-green-500 font-normal"}>Detected</span>
                          ) : (
                            <span className={"text-[#D6615A] font-normal"}>Not detected</span>
                          )}{" "}
                        </p>
                      </div>
                    </div> */}
                    <div className="flex my-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Earpiece</p>
                        <p className="text-gray-400 text-sm text-right font-bold ml-8">
                          {earpieceDetectionStatus ? (
                            <span className={"text-green-500 font-normal"}>Not Detected</span>
                          ) : (
                            <span className={"text-green-500 font-normal"}>Detected and Fixed</span>
                          )}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex my-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Extra Person</p>
                        <p className="text-gray-400 text-sm text-right font-bold ml-8">
                          {personTest ? (
                            <span className={"text-green-500 font-normal"}>Not Detected</span>
                          ) : (
                            <span className={"text-[#D6615A] font-normal"}>Detected</span>
                          )}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex my-3 vertical-align-middle">
                      <div className="flex w-full justify-between">
                        <p className="text-base font-semibold text-[#333333]">Eye blink rate</p>
                          <p className="text-gray-400 text-sm text-right font-bold ml-8">
                            <span className={"font-normal text-[#333333]"}>{leftEyeBlinkRate}</span>
                          </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* Personality Score Section */}

          <div className="border border-solid border-[#E3E3E3] sm:w-full lg:w-full my-3 h-auto bg-white rounded-lg ">
            <div className="sm:w-full md:w-full lg:w-full h-fit bg-white ">
              <div
                className="text-xl py-3 rounded-lg font-semibold flex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="px-4 text-lg">
                  Personality score
                </p>
              </div>
            </div>
            
            <div className="lg:flex flex-col px-4 py-4 border-t border-solid border-[#E3E3E3]">
              <div className="pt-2 sm:w-full md:w-full lg:w-full h-auto rounded-r-lg bg-white ">
                <div className="">
                  <div>
                    <Radar
                      data={{
                        labels: ["(A)","(E)","(D)","(C)","(B)",],
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
              <div>
                <div className="flex justify-between">
                  <p>A. Proactiveness</p>
                  <p>{proactiveness}/10</p>
                </div>
                <div className="flex justify-between">
                  <p>B. Team Work</p>
                  <p>{teamwork}/10</p>
                </div>
                <div className="flex justify-between">
                  <p>C. Stability</p>
                  <p>{stability}/10</p>
                </div>
                <div className="flex justify-between">
                  <p>D. Learning Ability</p>
                  <p>{lAbility}/10</p>
                </div>
                <div className="flex justify-between">
                  <p>E. Attitude</p>
                  <p>{attitude}/10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Library Section */}

          <div className="border border-solid border-[#E3E3E3] sm:w-full lg:w-full my-3 pb-4 h-auto bg-white rounded-lg ">
            <div className="sm:w-full md:w-full lg:w-full h-fit bg-white ">
              <div
                className="text-xl py-3 rounded-lg font-semibold flex"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="px-4 text-lg">
                  Baseline images
                </p>
              </div>
            </div>          
            <div className="lg:flex flex-col px-4 border-t border-solid border-[#E3E3E3]">
              <div>
                {preinterviewImages.length > 0 ? (
                  <div>
                    <img alt="Loading.." src={preinterviewImages[activeSlide]} className="mt-3 h-[150px]" width="500" /> 
                    <ImageCarousel
                      containerProps={{
                        style: {
                          width: "100%",
                          justifyContent: "space-between",
                          userSelect: "none"
                        }
                      }}
                      preventScrollOnSwipe
                      swipeTreshold={60}
                      activeSlideIndex={activeSlide}
                      activeSlideProps={{
                        
                      }}
                      onRequestChange={setActiveSlide}
                      forwardBtnProps={{
                        children: ">",
                        style: {
                          width: 30,
                          height: 30,
                          minWidth: 30,
                          alignSelf: "center",
                          outline: "None"
                        }
                      }}
                      backwardBtnProps={{
                        children: "<",
                        style: {
                          width: 30,
                          height: 30,
                          minWidth: 30,
                          alignSelf: "center",
                          outline: "None"
                        }
                      }}
                      dotsNav={{
                        show: false
                      }}
                      itemsToShow={3}
                      speed={400}
                    >
                      {
                        preinterviewImages.map((value, index)=>{
                          return(
                            <img alt="Loading.." key={index} src={value}
                              style={{
                                width: 110,
                                height: 100,
                                border: "30px solid white",
                                textAlign: "center",
                                lineHeight: "240px",
                                boxSizing: "border-box"
                              }}
                            >
                            </img>
                          )
                        })
                      }
                    </ImageCarousel>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-lg">Baselining images</div>
                    <p className="relative flex w-full justify-center my-4">Baselining images not available !</p>
                  </>
                )}             
              </div>
            </div>
          </div>        
        </div>
      </div>
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
            />
            <h2>Please wait, this wouldn't take much time</h2>
          </div>{" "}
        </div>
      ) : (
        <div className="flex justify-center h-[92vh] overflow-hidden">
          <div className="mt-[38vh] text-lg font-bold">
            Data is currently unavailable. Contact support for further assistance.
          </div>
        </div>
      )}
    </>
  );  
};

export default CPrintable;
