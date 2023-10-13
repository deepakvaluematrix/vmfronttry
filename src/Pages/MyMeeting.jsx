import { useDyteMeeting,useDyteSelector } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteSetupScreen, DyteLeaveButton, DyteParticipantsAudio, DyteMeeting, DyteParticipant, DyteParticipantCount, DyteGrid, DyteSimpleGrid, DyteParticipants } from "@dytesdk/react-ui-kit";
import { useEffect, useState } from "react";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import Editor from "@monaco-editor/react";
import axios from "axios";
import logo from "../assets/images/logo.png";

import Intvwhiteboard from "./Intvwhiteboard.js";

import { compilecode, checkcompilestatus, savecode, getlivestatus, stopproctoring, handleproctoring, checkinterviewdetails, proctoringurl,getInterviewStatus, updateCodeLanguage } from "../service/api.js";

import "../assets/stylesheet/dyte.css";

import { languageOptions } from "../Components/languageOption.js";
import { useNavigate, useParams } from "react-router-dom";
import renderHTML from "react-render-html";

// import { DrawingBoard  } from "react-fabricjs-whiteboard";

import { ReactSketchCanvas } from "react-sketch-canvas"
import swal from "sweetalert";
import InterviewEditor from "./InterviewEditor.jsx";
import ls from 'localstorage-slim';
import { getStorage } from "../service/storageService.js";

export default function MyMeeting() {
  const navigate = useNavigate();
  const { meeting } = useDyteMeeting();
  const [user, setUser] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [language, setlanguage] = useState(null);
  const [languageid, setlanguageid] = useState(63);
  const [theme, settheme] = useState(null);
  const [code, setcode] = useState(null);
  const [outputDetails, setoutputDetails] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [activearea, setactivearea] = useState(0);
  const [interviewStatus, setInterviewStatus] = useState(null);
  const videoEnabled = useDyteSelector((meeting) => meeting.self.videoEnabled);
  const audioEnabled = useDyteSelector((meeting) => meeting.self.audioEnabled);
  const screenShareEnabled = useDyteSelector((meeting) => meeting.self.screenShareEnabled);
  const [isJoining, setIsJoining] = useState(false);
  const hasJoinedRoom = useDyteSelector((meeting) => meeting.self.roomJoined)

  // End Interview from XI condition

  const [endInterview , setEndInterview] = useState(null)

  // For show a message if code is Empty
  const [codeEmpty,setCodeEmpty] = useState(false)

  const [value, setValue] = useState(code || "");
  const { id } = useParams();

  const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
  };

  let savecc = null;
  let fetchinter = null;
  let getstats = null;

  const handleEditorChange = async (value) => {
    setValue(value);
    setcode(value);
    if (outputDetails) {
      savecc = await savecode(id, btoa(value), customInput, getOutput2());
    } else {
      savecc = await savecode(id, btoa(value), customInput, "");
    }
  };

  const handleScreenShareError = () => {
    swal({
      icon: "error",
      title: "Screen share issue",
      text: "The screen share is not enabled, please enable it to continue.",
      button: "Ok"
    }).then(() => {
      window.location.reload();
    });
  };

  const handleMicError = () => {
    swal({
      icon: "error",
      title: "Mic issue",
      text: "Your mic is not enabled or having problems. Please check your browser or system settings",
      button: "Ok"
    }).then(() => {
      window.location.reload();
    });
  };

  const handleWebcamError = () => {
    swal({
      icon: "error",
      title: "Webcam issue",
      text: "Your webcam is not enabled or having problems. Please check your browser or system settings",
      button: "Ok"
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(()=>{
    if(endInterview === 2){
      swal({
        icon: "success",
        title: "Interview Ended",
        text: "Your Interview has been ended by interviewer.",
        button: "Ok"
      }).then(()=>{
        meeting.leaveRoom();
        window.location.href = "/user/submitfeedback/"+id;
      })
    }
  } , [endInterview])
  
  useEffect(() => {
    const joiningRoom = async() =>{
      if (isJoining) {
        return; // Return early if the room joining process is already in progress
      }
      setIsJoining(true);
      try{
        await meeting.joinRoom();
      }catch(error){
        //console.log(error);
      }finally{
        setIsJoining(false);
      }
    }
    window.addEventListener('keyup', (event) => {
      // console.log(event.keyCode);
      if (event.keyCode === 9) {
        event.preventDefault();
      }
    });
    const initial = async () => {
      let user = JSON.parse(getStorage("user"));
      let access_token = getStorage("access_token");
      

      //let interviewStatus = await checkinterviewdetails(id, user);
      //setInterviewStatus(interviewStatus);

      if (user === null) {
        navigate("/login");
      } else {
        setCurrentUser(user);
        setAccessToken(access_token);
      }
    }
    joiningRoom();
    initial();
    fetchinter = setInterval(async () => {
      getstats = await getlivestatus(id);
      // console.log(getstats.data.stats);
      setLiveStats(getstats.data.stats.livestats);
      let interviewStatus;
      setTimeout(async () => {
                //interviewStatus = await checkinterviewdetails(id, user);
        interviewStatus = await getInterviewStatus({meetingID:id},access_token);
        if (interviewStatus) {
          if(interviewStatus?.data?.interviewState === 2){
            setEndInterview(2)
          }
          if (interviewStatus.data.status === "Interviewed") {
            document.getElementById("leavebutton").click();
          }
        }
      }, 2000);
    }, 2000);
  }, []);
  const getCodeFromLiveStatus = async () => {
    let updatewb = await getlivestatus(id);
    if (updatewb.status == 200 && value != atob(updatewb?.data?.stats?.codearea)) {
      setValue(atob(updatewb?.data?.stats?.codearea))
    }
  }

  useEffect(() => {
    if(hasJoinedRoom){
      if (videoEnabled) {
        if (audioEnabled) {
          meeting.self.enableScreenShare().then(() => {
            if (meeting.self.screenShareEnabled) {
              
              if (meeting.self.roomJoined) {
                // Room joined successfully, perform further actions
              }
            } else {
              handleScreenShareError();
            }
          });
        } else {
          handleMicError();
        }
      } else {
        handleWebcamError();
      }
    }
  }, [hasJoinedRoom,videoEnabled, audioEnabled, screenShareEnabled]);


  const leaveCall = async () => {
    //TODO proctoring not working
    /*let stopproct = await stopproctoring(id, interviewStatus.data.livestream);
    let proctoringreport = await axios.post(proctoringurl + "/statistics", {
      job_id: id
    });
    console.log(proctoringreport);
    let saveproctoring = await handleproctoring(id, proctoringreport.data);
    console.log(saveproctoring);
    if (saveproctoring) {
      meeting.leaveRoom();
      navigate("/user/submitfeedback/" + id);
    } else {
      swal({
        icon: "error",
        title: "Something Went Wrong!",
        button: "Ok"
      });
      ////console.log(proctoringreport);
      let saveproctoring = await handleproctoring(id, proctoringreport.data);
      ////console.log(saveproctoring);
      if(saveproctoring){
        meeting.leaveRoom();
        window.location.href = "/user/submitfeedback/"+id;
      }else{
        swal({
          icon: "error",
          title: "Something Went Wrong!",
          button: "Ok"
        });
      } }*/
      meeting.leaveRoom();
      window.location.href = "/user/submitfeedback/"+id;
  
  }

  const modifyLanguage = (e) => {
    setlanguage(languageOptions[e.target.value].name);
    setlanguageid(languageOptions[e.target.value].id);
    updateCodeLanguage(id,languageOptions[e.target.value].name);

  }

  const handlecustominput = (e) => {
    setCustomInput(e.target.value);
  }

  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };

  const getOutput2 = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (outputDetails?.compile_output);
    } else if (statusId === 3) {
      return (outputDetails.stdout);
    } else if (statusId === 5) {
      return ("Time Limit Exceeded");
    } else {
      return (outputDetails?.stderr);
    }
  };

  const handleCompile = async () => {
    setoutputDetails(null);
    setProcessing(true);
    const formData = {
      language_id: languageid,
      source_code: btoa(code),
      stdin: btoa(customInput),
      id:id,
    };

    const cc = await compilecode(formData); 
    if (cc.data.data === "Token Generated") {
      const ccs = await checkcompilestatus(cc.data.token);
      setoutputDetails(ccs.data.rsp);
      setProcessing(true);
      setCodeEmpty(false)
    } else {
      setCodeEmpty(true)
      // console.log("Something Went Wrong!!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808" }} className="flex flex-col">
      <div className="flex m-0" style={{ backgroundColor: "#080808", position: "relative", height: "92vh" }}>
        <div className="md:w-1/2 h-full pl-2">
          <div className="w-full flex mt-4">
            <div className="w-1/2">
              <div className={activearea === 0 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer" : "border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer"} onClick={() => { setactivearea(0) }} style={{ borderRadius: "10px 0px 0px 10px" }}>CODING</div>
            </div>
            <div className="w-1/2">
              <div className={activearea === 1 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer" : "border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer"} onClick={() => { setactivearea(1) }} style={{ borderRadius: "0px 10px 10px 0px" }}>WHITEBOARD</div>
            </div>
          </div>
          {activearea === 0 ?
            <div className="w-full">
              <div className="flex justify-between my-4">
                <div className="text-white">
                  Select Language
                  <select onChange={modifyLanguage} className="bg-gray-900 text-white mx-2">
                    {languageOptions.map((data, key) => {
                      return (<>
                        {key === 0 ?
                          <option value={key} selected>{data.name}</option> :
                          <option value={key}>{data.name}</option>
                        }
                      </>);
                    })
                    }
                  </select>
                </div>
                <div>
                  <button className="bg-green-500 rounded-xl text-white font-bold px-4 py-2" onClick={handleCompile}>Compile</button>
                </div>
              </div>

              <InterviewEditor selectedlanguage={language} />
              <div className="flex mb-8" style={{ height: "16vh" }}>
                <div className="md:w-1/2 mr-2 h-full">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    <textarea className="bg-transparent w-full h-full p-0 font-normal text-xs border-0" onChange={handlecustominput}>Enter Your Inputs Here</textarea>
                  </div>
                </div>
                <div className="md:w-1/2 ml-2 h-full">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    {outputDetails ? <>{getOutput()}</> : <pre className="px-2 py-1 font-normal text-xs text-white">
                      {processing ? <>Processing</> : <>Code Output Appears Here</>}...
                    </pre>}
                    {codeEmpty && (<>Code is empty. Please enter code before compiling.</>)}
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="w-full py-2">
              <Intvwhiteboard id={id} />
            </div>
          }
        </div>
        <div className="md:w-1/2 h-full">
          <div className="w-full py-4 pr-2 pl-4" style={{ height: "30vh" }}>
            <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
              {liveStats ? <>
                {liveStats.codequestion ? <>{renderHTML(liveStats.codequestion)}</> : <>Interview Coding Question Appears Here...</>}
              </> : <>Interview Coding Question Appears Here...</>}
            </div>
          </div>
          <div className="flex pb-4" style={{ position: "absolute", bottom: 0 }}>
            <div className="md:w-1/2 px-4 pt-4">
              <DyteChat
                className="rounded-2xl"
                meeting={meeting}
                style={{ minHeight: '60vh', width: '100%', backgroundColor: '#111827', color: "#fff" }}
              />
            </div>
            <div className="md:w-1/2" style={{ overflowY: "hidden" }}>
              <div style={{ height: "120%", overflowY: "hidden" }}>
                <DyteMeeting mode="fill" meeting={meeting} className="dytemaster" style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-white justify-center items-center" style={{ height: "8vh" }}>
        <div className="md:w-1/6 px-6">
          <img src={logo} style={{ height: "4vh" }} />
        </div>
        <div className="md:w-4/6 flex justify-center items-center">
          <button className="rounded-2xl bg-red-600 text-white px-4 py-2 font-bold" id="leavebutton" onClick={leaveCall}>Leave Room</button>
        </div>
        <div className="md:w-1/6"></div>
      </div>
    </div>
  );
}