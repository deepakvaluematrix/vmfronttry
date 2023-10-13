import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import {
  DyteParticipantTile,
  DyteNameTag,
  DyteAudioVisualizer,
  DyteChat,
  DyteMeetingTitle,
  DyteMicToggle,
  DyteCameraToggle,
  DyteGrid,
  DyteParticipantsAudio,
  DyteMeeting,
} from "@dytesdk/react-ui-kit";
import Navbar from "../Components/XIDashboard/Navbar.js";
import { useState } from "react";
import { useEffect } from "react";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
  startinterview,
  endinterview,
  stopproctoring,
  getproctoring,
  handlerecording,
  savecode,
  handleLeave,
  handleNoShow,
  showQuestion,
  pushQuestion,
} from "../service/api";
import Editor from "@monaco-editor/react";
import renderHTML from "react-render-html";

import {
  getxiquestions,
  getinterviewjob,
  checkinterviewdetails,
  getlivestatus,
  setquestionresult,
} from "../service/api.js";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import logo from "../assets/images/logo.png";

import UpdateInterviewApplication from "./XIDashboard/UpdateInterviewApplication.jsx";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import Intvwhiteboard from "./Intvwhiteboard.js";
import InterviewerEditor from "./InterviewerEditor.jsx";
import ls from "localstorage-slim";
import { getStorage } from "../service/storageService.js";

export default function MyMeeting() {
  const navigate = useNavigate();
  const { meeting } = useDyteMeeting();
  const [user, setUser] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [language, setlanguage] = useState(null);
  const [livestats, setLiveStats] = useState(null);
  const [theme, settheme] = useState(null);
  const [code, setcode] = useState(null);
  const [usercode, setusercode] = useState("");
  const [receivedcode, setreceivedcode] = useState("//Write your code here...");
  const [xiquestion, setxiquestion] = useState(null);
  const [selectedlanguage, setselectedlanguage] = useState("Javascript");
  const [currentUser, setCurrentUser] = useState(null);
  const [interviewStatus, setInterviewStatus] = useState(null);
  const [nqtype, setnqtype] = useState(null);
  const [nqlevel, setnqlevel] = useState(null);
  const [nqexperience, setnqexperience] = useState(null);
  const [nqcategory, setnqcategory] = useState(null);
  const [lateststats, setlateststats] = useState(null);
  const [codeInputs, setCodeInputs] = useState("");
  const [codeOutputs, setCodeOutputs] = useState("");
  const [timestamptext, settimestamptext] = useState("");
  const [pscount, setpscount] = useState(0);
  const [gqcount, setgqcount] = useState(0);
  const [activearea, setactivearea] = useState(0);
  const [intvboard, setintvboard] = useState(null);
  const [outputDetails, setoutputDetails] = useState(null);
  const [customInput, setCustomInput] = useState("");
  let [noShow, setNoShow] = useState(false);
  const [value, setValue] = useState("");
  const [interviewJobTitle, setInterviewJobTitle] = useState(null);
  const { id } = useParams();
  const [showTopic, setShowTopic] = useState(false);
  const [questionType, setQuestionType] = useState("pb");
  const [showCandidateBtn , setShowCandidateBtn] = useState(true)
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Accomodating dyte V2
  const videoEnabled = useDyteSelector((meeting) => meeting.self.videoEnabled);
  const audioEnabled = useDyteSelector((meeting) => meeting.self.audioEnabled);
  const [isJoining, setIsJoining] = useState(false);
  const hasJoinedRoom = useDyteSelector((meeting) => meeting.self.roomJoined);

  const handleClick = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const goPrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const removePTags = (htmlString) => {
    const regex = /<p[^>]*>(.*?)<\/p>/g;
    return htmlString.replace(regex, "$1");
  };

  const pushQuestions = async()=>{
    let meetingId = id
    let qnIndex = currentIndex
    let currentQuestion = questions[currentIndex];
    let res = await pushQuestion({interviewID : meetingId,currentQuestion})
    if (res && res.status == 200) {
      console.log('Questions send to candiadte')
    } else {
      console.log('Some error while sending question to candidate')
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      let qnType = questionType == "pb" ? "problem_based" : "skill_based";
      if(qnType === "skill_based"){
        setShowCandidateBtn(false)
      }
      else {
        setShowCandidateBtn(true)
      } 
      let res = await showQuestion(qnType);
      if (res && res.data) {
        const regex = /<p[^>]*>(.*?)<\/p>/g;
        let formatedQuestionArr = [];
        if (res?.data?.data.length > 0) {
          for (let i = 0; i < res?.data?.data.length; i++) {
            const elem = res.data.data[i];
            let formatedQuestions = removePTags(elem?.question);
            elem.question = formatedQuestions;
            formatedQuestionArr.push(elem);
          }
        }

        setQuestions(formatedQuestionArr);
      }
    };
    fetchQuestions();
  }, [questionType]);

  let savecc = null;
  let fetchinter = null;
  let getstats = null;

  const handleEditorChange = async (value) => {
    setValue(value);
    // setcode(value);
    savecc = await savecode(id, btoa(value), customInput, "");
  };

  const handlecustominput = (e) => {
    setCustomInput(e.target.value);
  };
  const getOutput2 = () => {
    let statusId = outputDetails?.status?.id;
  };
  const leaveCall = async () => {
    let resp = await handleLeave(
      access_token,
      interviewStatus?.data?.meetingID,
      id
    );
    meeting.leaveRoom();
    navigate("/XI/updateEvaluationDetails/" + id);
  };

  const startcall = async () => {
    let start = await startinterview(id);
  };

  const handletimestamp = (e) => {
    settimestamptext(e.target.value);
  };
  const handletype = (e) => {
    setnqtype(e.target.value);
  };

  const handlelevel = (e) => {
    setnqlevel(e.target.value);
  };

  const handlexperience = (e) => {
    setnqexperience(e.target.value);
  };

  const handlecategory = (e) => {
    setnqcategory(e.target.value);
  };

  const setcorrect = async () => {
    let intvquestion = {
      question: xiquestion.question,
      level: xiquestion.level,
      type: xiquestion.type,
      answer: xiquestion.answer,
      experience: xiquestion.experience,
      category: xiquestion.category,
      submission: "Correct",
    };
    setxiquestion(null);
    let setques = await setquestionresult(id, intvquestion);
  };

  const setincorrect = async () => {
    let intvquestion = {
      type: xiquestion.question,
      level: xiquestion.level,
      type: xiquestion.type,
      answer: xiquestion.answer,
      experience: xiquestion.experience,
      category: xiquestion.category,
      submission: "Incorrect",
    };
    setxiquestion(null);
    let setques = await setquestionresult(id, intvquestion);
  };

  const noShowEvent = async () => {
    let resp = await handleNoShow(
      access_token,
      interviewStatus?.data?.meetingID,
      id
    );
    meeting.leaveRoom();
    window.location.href = "/XI/evaluationlist";
  };

  const setskipped = async () => {
    let intvquestion = {
      type: xiquestion.question,
      level: xiquestion.level,
      type: xiquestion.type,
      answer: xiquestion.answer,
      experience: xiquestion.experience,
      category: xiquestion.category,
      submission: "Skipped",
    };
    setxiquestion(null);
    let setques = await setquestionresult(id, intvquestion);
  };

  const getnextquestion = async () => {
    if (
      nqtype == null ||
      nqlevel == null ||
      nqexperience == null ||
      nqcategory == null
    ) {
      swal({
        title: "Do select all the fields to get next question!",
        message: "Do select all the fields.",
        icon: "error",
        button: "Ok",
      });
    } else {
      if (nqtype === "General Question") {
        let xiquestion = await getxiquestions(
          nqtype,
          nqlevel,
          nqexperience,
          nqcategory
        );
        setxiquestion(xiquestion.data.ques);
        setgqcount(gqcount + 1);
      } else {
        let xiquestion = await getxiquestions(
          nqtype,
          nqlevel,
          nqexperience,
          nqcategory
        );
        setxiquestion(xiquestion.data.ques);
        setpscount(pscount + 1);
      }
    }
  };

  // dyte v2 webcam and audio is mandatory
  useEffect(() => {
    if (hasJoinedRoom) {
      if (videoEnabled) {
        if (!audioEnabled) {
          handleMicError();
        }
      } else {
        handleWebcamError();
      }
    }
  }, [hasJoinedRoom, videoEnabled, audioEnabled]);

  const handleMicError = () => {
    swal({
      icon: "error",
      title: "Mic issue",
      text: "Your mic is not enabled or having problems. Please check your browser or system settings",
      button: "Ok",
    }).then(() => {
      window.location.reload();
    });
  };

  const handleWebcamError = () => {
    swal({
      icon: "error",
      title: "Webcam issue",
      text: "Your webcam is not enabled or having problems. Please check your browser or system settings",
      button: "Ok",
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const joiningRoom = async () => {
      if (isJoining) {
        return; // Return early if the room joining process is already in progress
      }
      setIsJoining(true);
      try {
        await meeting.joinRoom();
      } catch (error) {
        //console.log(error);
      } finally {
        setIsJoining(false);
      }
    };

    const initial = async () => {
      let user = JSON.parse(getStorage("user"));
      let access_token = getStorage("access_token");
      setAccessToken(access_token)
      if (user === null) {
        navigate("/login");
      } else {
        if (user.isXI === true) {
          setCurrentUser(user);
          let interviewStatus = await checkinterviewdetails(id, user);
          setInterviewStatus(interviewStatus);

          if (interviewStatus?.data?.data === "Data Retrieved") {
            let interviewjob = await getinterviewjob(
              interviewStatus.data.jobid
            );
            setInterviewJobTitle(interviewjob.data.job.jobTitle);
            let xiquestion = await getxiquestions(
              "General Question",
              "Easy",
              "Beginner",
              interviewjob.data.job.skills[0].role
            );
            setxiquestion(xiquestion.data.ques);
          } else {
            // console.log("Error");
          }
        } else {
          navigate("/login");
        }
      }
    };

    joiningRoom();
    initial();

    fetchinter = setInterval(async () => {
      getstats = await getlivestatus(id);
      setLiveStats(getstats.data.stats.livestats);
      setlateststats(getstats.data.stats);
      setValue(btoa(getstats.data.stats.codearea));
      setCodeInputs(getstats.data.stats.codestdin);
      let val = getstats.data.stats.codestdout; 
      try{
        let deCodeVal = atob(val);
        setCodeOutputs(deCodeVal);
      }catch(err){
        setCodeOutputs(val);
      }
      // setCodeOutputs(getstats.data.stats.codestdout);
      setselectedlanguage(getstats.data.stats.codelanguage);
    }, 2000);
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#080808" }}
      className="flex flex-col"
    >
      <div
        className="flex m-0"
        style={{
          backgroundColor: "#080808",
          position: "relative",
          height: "92vh",
        }}
      >
        <div className="md:w-1/2 h-full pl-2">
          <div className="w-full flex mt-4">
            <div className="w-1/2">
              <div
                className={
                  activearea === 0
                    ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer"
                    : "border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer"
                }
                onClick={() => {
                  setactivearea(0);
                }}
                style={{ borderRadius: "10px 0px 0px 10px" }}
              >
                CODING
              </div>
            </div>
            <div className="w-1/2">
              <div
                className={
                  activearea === 1
                    ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer"
                    : "border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer"
                }
                onClick={() => {
                  setactivearea(1);
                }}
                style={{ borderRadius: "0px 0px 0px 0px" }}
              >
                WHITEBOARD
              </div>
            </div>
            {/* <div className="w-1/3">
              <div className={activearea === 2 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer" : "border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer"} onClick={() => { setactivearea(2) }} style={{ borderRadius: "0px 10px 10px 0px" }}>EVALUATION</div>
            </div> */}
          </div>
          {!activearea ? (
            <div>
              <div className="flex justify-between my-4">
                <div className="text-white">
                  <strong>
                    <p>
                      Please click on <i>" No show "</i> if the candidate
                      doesn't join the interview
                    </p>
                  </strong>
                </div>
              </div>
              <div className="flex justify-between my-4">
                <div className="text-white">
                  <strong>Selected Language: </strong> {selectedlanguage}
                </div>
              </div>
              <InterviewerEditor selectedlanguage={selectedlanguage} />
              <div className="flex mb-8" style={{ height: "14vh" }}>
                <div className="md:w-1/2 mr-2">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    <pre className="px-2 py-1 font-normal text-xs text-white">
                      {codeInputs}
                    </pre>
                  </div>
                </div>
                <div className="md:w-1/2 ml-2">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    <pre className="px-2 py-1 font-normal text-xs text-white">
                      {codeOutputs}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {!(activearea - 1) ? (
                <div className="w-full py-2">
                  <Intvwhiteboard id={id} />
                </div>
              ) : (
                <div
                  className="w-full my-2 py-2 bg-white"
                  style={{ height: "72vh", overflowY: "scroll" }}
                >
                  <UpdateInterviewApplication />
                </div>
              )}
            </div>
          )}
          {/* <div className="bg-gray-900 text-white p-4 rounded-2xl text-md flex" style={{ height: "10vh" }}>
            <textarea onChange={handletimestamp} className="w-5/6 bg-gray-900 text-white border-0" placeholder="Timestamp the session..."></textarea>
            <button className="bg-green-500 w-1/6 text-white text-md font-bold rounded-xl">Set Timestamp</button>
          </div> */}
        </div>
        <div className="md:w-1/2 h-full">
          <div className="w-full py-4 pr-2 pl-4">
            <div className="flex gap-3" style={{ height: "28vh" }}>
              <div className="w-full">
                <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
                  <div className="row">
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        onChange={(e) => setQuestionType(e.target.value)}
                      >
                        <option value="pb">Problem Based Questions</option>
                        <option value="sb">Skill Based Questions</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      {/* {questionType == 'pb' && (
                        <select className='form-control'>
                          <option value='tp1'>Topic 1</option>
                          <option value='tp2'>Topic 2</option>
                        </select>
                      )} */}
                    </div>
                  </div>
                  <>
                    {questions && (
                      <>
                        {questions ? (
                          questions[currentIndex]?.type == "pb" ? (
                            <>
                              <strong>
                                {questions
                                  ? questions[currentIndex]?.question
                                  : ""}
                              </strong>
                              <br />
                              {/* <p>{questions[currentIndex]?.answer ? questions[currentIndex]?.answer : 'No answer'}</p> */}
                              <strong>
                                <u>Instructions</u>
                              </strong>
                              <p>{questions[currentIndex]?.instructions?.length > 0 ? questions[currentIndex].instructions.map((inst,index)=>(
                                <ul>
                                  <li>{index + 1 }{" "} {inst}</li>
                                </ul>
                              )) : (<p>No instructions available</p>) }</p>
                            </>
                          ) : (
                            <>
                              <strong>
                                {questions
                                  ? questions[currentIndex]?.question
                                  : ""}
                              </strong>
                            </>
                          )
                        ) : null}

                        <br />
                        <div
                          className="option_section"
                          style={{ overflowY: "scroll", maxHeight: "105px" }}
                        >
                          {questions[currentIndex]?.options.map((option) => (
                            <div className="container-fluid">
                              <input type="radio" />
                              {option}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                  <button className="btn btn-primary mt-2 m-1" onClick={goPrev}>
                    Prev
                  </button>
                  <button
                    className="btn btn-success mt-2 m-1"
                    onClick={handleClick}
                  >
                    Next
                  </button>
                  {
                    showCandidateBtn && (
                    <button
                    className="btn btn-danger mt-2 m-1"
                    onClick={pushQuestions}
                  >
                    Send to candidate
                  </button>
                    )
                  }
                  {/* {xiquestion ? <>
                    <strong>Question: </strong> {renderHTML(xiquestion.question)}
                    <strong>Answer: </strong> {xiquestion.answer}<br />
                    <strong>Type: </strong> {xiquestion.type}<br />
                    <strong>Level: </strong> {xiquestion.level}<br />
                    <strong>Category: </strong> {xiquestion.category}<br />
                    <button className="rounded border-2 border-green-500 bg-green-500 text-white font-bold px-4 py-2 mr-2 mt-4" onClick={setcorrect}>Correct</button>
                    <button className="rounded border-2 border-red-500 bg-red-500 text-white font-bold px-4 py-2 mr-2 mt-4" onClick={setincorrect}>Incorrect</button>
                    <button className="rounded border-2 border-gray-200 text-gray-200 font-bold px-4 py-2 mt-4" onClick={setskipped}>Skip</button>
                  </> : <>
                    <div>
                      <h2 className="text-white font-bold mb-3">Loading Next Question...</h2>
                    </div>
                  </>} */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex pb-4" style={{ height: "60vh" }}>
            <div className="md:w-1/2 px-4">
              <DyteChat
                className="rounded-2xl"
                meeting={meeting}
                style={{
                  minHeight: "50vh",
                  width: "100%",
                  backgroundColor: "#111827",
                  color: "#fff",
                }}
              />
            </div>
            <div className="md:w-1/2" style={{ overflowY: "auto" }}>
              <div style={{ height: "120%", overflowY: "hidden" }}>
                <DyteMeeting
                  mode="fill"
                  meeting={meeting}
                  className="dytemaster"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex bg-white justify-center items-center"
        style={{ height: "8vh" }}
      >
        <div className="md:w-1/6 px-6">
          <img src={logo} style={{ height: "4vh" }} />
        </div>
        <div className="md:w-4/6 flex justify-center items-center">
          {lateststats ? (
            <>
              {lateststats.interviewState === 1 ? (
                <>
                  <div className="mx-3 my-2">
                    <div>
                      <button
                        className="rounded-2xl bg-red-600 text-white px-4 py-2 font-bold"
                        onClick={leaveCall}
                      >
                        End Interview
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {lateststats.interviewState === 0 ? (
                <>
                  <div>
                    <button
                      className="rounded-2xl bg-green-600 text-white px-4 py-2 font-bold"
                      onClick={startcall}
                    >
                      Start Interview
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
              {lateststats.interviewState === 0 ||
              lateststats.interviewState === 1 ? (
                <>
                  <div>
                    <button
                      className="rounded-2xl bg-red-600 text-white px-4 py-2 font-bold"
                      onClick={noShowEvent}
                    >
                      No show
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : null}
        </div>
        <div className="md:w-[auto] px-6">{interviewJobTitle}</div>
      </div>
    </div>
  );
}
