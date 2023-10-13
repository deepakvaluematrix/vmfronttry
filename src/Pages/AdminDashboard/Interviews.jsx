import React, { useState, Fragment, useEffect } from "react";
import moment from "moment";
import { Dialog, Transition } from "@headlessui/react";
import ReactPlayer from 'react-player';
import { Carousel } from 'react-responsive-carousel';
import { ImCross } from "react-icons/im";
import { ImEnlarge } from "react-icons/im";
import { AiOutlineClose } from "react-icons/ai";
import DoneIcon from '@mui/icons-material/Done';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaClock, FaVideo, FaFileAlt } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import { AiOutlineEye } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import ReactHlsPlayer from 'react-hls-player';
import ImageCarousel from "react-simply-carousel";
import Swal from "sweetalert2";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import {
  getInterviewList, getInterviewsTableData,
  getRecordingsURL, getLiveStreamURLData, sendReminderEmailtoCandidate,
  sendReminderEmailtoXI, getBaseLiningImagesFace, getBaseLiningImagesPerson,
  getBaseLiningImagesEar, getBaseLiningImagesGaze, availableSlotsByJob,
  priorityEngine, updateUserDetails, updateCurrentSlot, matchedXiUsername,
  rescheduleSlot, getHighlightedDates
} from "../../service/api";
import axios from "axios";
import swal from "sweetalert";
import { MdOutlineWorkOutline } from "react-icons/md";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const InterviewList = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [interviewListByCompany, setInterviewListByCompany] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [editStatus, setEditStatus] = useState('not-edit');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [modal1, setModal1] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [recordingURLS, setRecordingURLS] = useState([]);
  const [liveStreamURLS, setLiveStreamURLS] = useState([]);
  const [fullScreenVideo, setFullScreenVideo] = useState(false);
  const [preinterviewImages, setPreinterviewImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [spectate, setSpectate] = useState(false);
  const [candidateSearchInput, setCandidateSearchInput] = useState('');
  const [interviewerSearchInput, setInterviewerSearchInput] = useState('');
  const [matchedXis, setMatchedXis] = useState([])
  const [selectedXi, setSelectedXi] = useState('')
  const [disableBtn, setDisableBtn] = useState(true)
  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [slot, setSlot] = React.useState([]);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [type, setType] = React.useState("XI");
  const [candidateId, setCandidateId] = useState('')
  const [end, setEnd] = useState('')
  const [xiSlot, setXiSlot] = useState([]);
  const [interviewState0, setInterviewState0] = useState([]);
  const [interviewState1, setInterviewState1] = useState([]);
  const [interviewState2, setInterviewState2] = useState([]);
  const [interviewState3, setInterviewState3] = useState([]);
  const [interviewState4, setInterviewState4] = useState([]);
  const [activeTab, setActiveTab] = React.useState("On-going");
  const [nodata, setNodata] = React.useState(false);
  const [upcoming, setupcoming] = useState(0);
  const [ongoing, setongoing] = useState(0);
  const [completed, setcompleted] = useState(0);
  const [page, setPage] = React.useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getData = async () => {
    let user = JSON.parse(getStorage("user"));
    setUser(user);
    let res = await getInterviewList();
    if (res && res.status === 200) {
      setCompanyList(res.data);
    }
    if (!selectedCompany || selectedCompany == null || selectedCompany == undefined || selectedCompany?.trim()==""){
      setSelectedCompany(res.data[0]._id)
    }
    // setSelectedCompany(res.data[0]._id)
  };

  useEffect(() => {
    getData();
  }, []);

  const paginate_upcoming = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res.data;
      const upcoming = resData.data.upcoming;
      setInterviewState0(upcoming)
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const paginate_ongoing = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res.data;
      const ongoing = resData.data.ongoing;
      setInterviewState1(ongoing)
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const paginate_completed = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res.data;
      const completed = resData.data.completed;
      setInterviewState4(completed)
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  const getTableData = async (selectedJobTitle, candidateSearchInput, interviewerSearchInput) => {
    let data = { companyName: selectedCompany };
    let res = await getInterviewsTableData(data,page);
    let resData = res.data;
    let count = resData.counts;
    const upcoming = resData.data.upcoming;
    const ongoing = resData.data.ongoing;
    const completed = resData.data.completed;
    setupcoming(count.upcoming)
    setongoing(count.ongoing)
    setcompleted(count.completed)
    let filteredData = [...upcoming, ...ongoing, ...completed];
    if (selectedJobTitle) {
      filteredData = filteredData.filter(interview =>
        interview.jobTitle === selectedJobTitle
      )
    }

    filteredData = filteredData.sort((a, b) =>
      new Date(a.slots.startDate) - new Date(b.slots.startDate)
    )

    if (candidateSearchInput !== '') {
      filteredData = filteredData.filter(candidate => {
        return candidate.applicant.firstName.toLowerCase().startsWith(candidateSearchInput.toLowerCase());
      });
    }

    if (interviewerSearchInput !== '') {
      filteredData = filteredData.filter(interviewer => {
        return interviewer.interviewers.firstName.toLowerCase().startsWith(interviewerSearchInput.toLowerCase());
      });
    }
    setInterviewListByCompany(filteredData);


    const jobTitlesArr = []
    filteredData.forEach(inteviews => {
      if (!jobTitlesArr.includes(inteviews.jobTitle)) {
        jobTitlesArr.push(inteviews.jobTitle)
      }
    });
    setJobTitles(jobTitlesArr);
  }

  const handleCompanyNameChange = (companyName) => {
    setSelectedCompany(companyName);
    setSelectedJobTitle('');
    setCandidateSearchInput('');
    setInterviewerSearchInput('');
  }

  const handleJobTitleChange = (jobTitle) => {
    if (jobTitle !== "Select a job title") {
      setSelectedJobTitle(jobTitle);
    } else {
      setSelectedJobTitle('');
    }
  }

  useEffect(() => {
    getTableData(selectedJobTitle, candidateSearchInput, interviewerSearchInput);
  }, [selectedCompany, selectedJobTitle, candidateSearchInput, interviewerSearchInput]);

  const getBaseLiningImagesData = async (interview) => {
    let data = { id: interview.applications._id };
    const images = [];
    const faceDataResponse = await getBaseLiningImagesFace(data);
    if (faceDataResponse.status === 200) {
      images.push(faceDataResponse.data.image);
    }
    const personDataResponse = await getBaseLiningImagesPerson(data);
    if (personDataResponse.status === 200) {
      images.push(personDataResponse.data.image);
    }
    const earDataResponse = await getBaseLiningImagesEar(data);
    if (earDataResponse.status === 200) {
      images.push(earDataResponse.data.image);
    }
    const gazeDataResponse = await getBaseLiningImagesGaze(data);
    if (gazeDataResponse.status === 200) {
      images.push(gazeDataResponse.data.image);
    }
    setPreinterviewImages(images);
  }

  const handleViewRecordings = async (meetingID, interview) => {
    let access_token = getStorage("access_token");
    let data = { id: meetingID };
    const res = await getRecordingsURL(data, access_token);
    setRecordingURLS(res.data.recordings);
    getBaseLiningImagesData(interview);
  }

  const handleSpectate = async (meetingID) => {
    let access_token = getStorage("access_token");
    let data = { id: meetingID };
    const res = await getLiveStreamURLData(data, access_token);
    setLiveStreamURLS([res.data.data]);
  }

  const handleCandidateReminderEmail = async (interview) => {
    const data = {
      "id": interview.applicant._id,
      "dateTime": `${moment(interview.slots.startDate).format('DD-MM-YYYY HH:mm')}IST`,
      "jobTitle": interview.jobTitle
    }
    const res = await sendReminderEmailtoCandidate(data);
    return res;
  }

  const handleXIReminderEmail = async (interview) => {
    const data = {
      "id": interview.interviewers._id,
      "dateTime": `${moment(interview.slots.startDate).format('DD-MM-YYYY HH:mm')}IST`,
      "jobTitle": interview.jobTitle
    }
    const res = await sendReminderEmailtoXI(data);
    return res;
  }
  const handleReminderEmail = async (interview) => {
    Swal.fire({
      title: "Confirm reminder email",
      html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Are you sure you want to send reminder email to interviewer and candidate ?</div></div>',
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonText: "Confirm",
      customClass: {
        popup: 'swal-wide',
        icon: 'icon-class'
      }
    }).then(async (willDelete) => {
      if (willDelete.isConfirmed) {
        const candidateReminderResponse = await handleCandidateReminderEmail(interview);
        const xiReminderResponse = await handleXIReminderEmail(interview);

        if (candidateReminderResponse.status === 200 && xiReminderResponse.status === 200) {
          Swal.fire({
            title: "Send Reminder",
            html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Reminder email has been send to interviewer and candidate.</div></div>',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Ok",
            customClass: {
              popup: 'swal-wide',
              icon: 'icon-class'
            }
          }).then(() => {
          })
        }
      }
    });
  }

  const handleReschedule = () => {

  }

  const scheduleSlot = async () => {
    let start = new Date(startTime);
    let updateData = {
      slotId: chooseSlot?.slots?._id,
      startDate: slotId?.startDate,
      endDate: slotId?.endDate,
      createdBy: selectedXi,
      status: "Pending"
    }

    let res = await rescheduleSlot(updateData);

    if (res && res.status === 200) {
      Swal.fire({
        title: "Update Slots",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot Updated Succesfully.</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Continue",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(() => {
        window.location.href = "/admin/interviews";
      });
    } else {
      Swal.fire({
        title: "Update Slots",
        html: '<div class="container"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Something went wrong</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Continue",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(() => { });
    }
  }


  const [highlight, setHighlight] = useState([])

  const highlightDates = () => {
    var today = new Date();
    var datesArray = [];
    for (var i = 0; i < 30; i++) {
      var currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      datesArray.push(currentDate);
    }

    let dateArrwithSlots = []
    xiSlot.length > 0 && xiSlot.map((item) => {
      dateArrwithSlots.push(new Date(item.startDate))
    })
    dateArrwithSlots = [...new Set(dateArrwithSlots)];

    // setHighlight(dateArrwithSlots)
  }


  const handleActionsOnHover = async (meetingID, value, interview) => {
    setCandidateId(interview?.applicant?._id)
    let xis = await matchedXiUsername(interview._id)
    const selectedXi = interview.interviewers.firstName
    let selectedXIId = interview.interviewers._id
    const xiArray = xis.data

    setchooseSlot(interview)

    xiArray.sort((a, b) => {
      if (a._id === selectedXIId) {
        return -1;
      } else if (b._id === selectedXIId) {
        return 1;
      }
      return 0;
    });

    setMatchedXis(xiArray)
    if (xiArray.length == 1) {
      showXiSlot(xiArray[0]?._id);
      setSelectedXi(xiArray[0]?._id);
    }
    highlightDates()

    switch (value) {
      case 0:
        handleReminderEmail(interview);
        break;
      case 1:
        setModal2(true);
        handleSpectate(meetingID);
        setSpectate(true);
        break;
      case 2:
        setModal2(true);
        handleViewRecordings(meetingID, interview);
        break;
      case 3:
        setModal1(true);
        handleReschedule(meetingID);
        break;
      case 4:
        setModal2(true);
        handleViewRecordings(meetingID, interview);
        break;
      case "Reschedule":
        setModal1(true);
        handleReschedule(meetingID);
        break;
    }
    let slots = await availableSlotsByJob({
      jobId: interview._id
    });
    const key = "startDate";

    const arrayUniqueByKey = [...new Map(slots.data.map((item) => [item[key], item])).values(),];
    setSlot(arrayUniqueByKey);
  }


  const showXiSlot = async (id) => {
    let res = await getHighlightedDates({ createdBy: id })
    if (res && res.data) {
      setXiSlot(res.data)
      let dateArrwithSlots = []
      res.data.length > 0 && res.data.map((item) => {
        dateArrwithSlots.push(new Date(item.startDate))
      })
      dateArrwithSlots = [...new Set(dateArrwithSlots)];

      setHighlight(dateArrwithSlots)
    }
  }

  const cancelInterview = async (interview) => {
    let slotId = interview?.slots?._id
    const interviewId = interview?.applications?._id
    let dataForUpdate = {
      slotId,
      interviewId
    }
    swal({
      title: "Do you want to Cancel the Interview ?",
      text: "You will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          let res = await axios.post(`${BACKEND_URL}/cancel-interview`, dataForUpdate)
          if (res && res.status == 200) {
            swal("Interview Cancelled", {
              icon: "success",
            });
            window.location.reload()
          }

        } else {
          swal("Your Interview is safe!");
        }
      });
  }
  useEffect(() => {
    if (interviewListByCompany) {
      const sortedInterviews = interviewListByCompany.reduce((acc, interview) => {
        const state = interview.applications.interviewState;
        if (state === 0) {
          return { ...acc, state0: [...acc.state0, interview] };
        }
        else if (state === 1) {
          return { ...acc, state1: [...acc.state1, interview] };
        }
        else if (state === 2) {
          return { ...acc, state2: [...acc.state2, interview] };
        }
        else if (state === 3) {
          return { ...acc, state3: [...acc.state3, interview] };
        }
        else if (state === 4) {
          return { ...acc, state4: [...acc.state4, interview] };
        }
        return acc;
      }, { state0: [], state1: [], state2: [], state3: [], state4: [] });

      setInterviewState0(sortedInterviews.state0);
      setInterviewState1(sortedInterviews.state1);
      setInterviewState2(sortedInterviews.state2);
      setInterviewState3(sortedInterviews.state3);
      setInterviewState4(sortedInterviews.state4);

    }
  }, [interviewListByCompany]);

  return (
    <div className="pl-[50px] flex lg:w-[98%] mt-20 sm:p-1  bg-gray-150 overflow-hidden ">
      <div className=" bg-white w-[100%] mt-10 drop-shadow-md rounded-lg">
        <div className=" bg-white ">
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <p className="text-sm flex my-5 mx-4 font-semibold">
              Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
              <p className="text-gray-400 px-2"> here's what's happening today!</p>
            </p>
          </div>
        </div>
        <div className="p-4 w-full md:flex flex-col mx-auto bg-slate-100">

          {/* Dropdown Section */}

          <div className="flex gap-4">
            <span>
              <select className="focus:outline-none  border-none focus:ring-[#EEEEEE] bg-[#FAFAFA] rounded-xl hover:bg-[#FAFAFA]"
                onChange={(e) => { handleCompanyNameChange(e.target.value) }}
                defaultValue={selectedCompany}
              >
                {companyList.map((company, index) => (
                  <option key={index} value={company._id}>
                    {company._id}
                  </option>
                ))}
              </select>
            </span>
            <span>
              <select className="focus:outline-none  border-none focus:ring-[#EEEEEE] bg-[#FAFAFA] rounded-xl hover:bg-[#FAFAFA]"
                value={selectedJobTitle}
                onChange={(e) => { handleJobTitleChange(e.target.value) }}
              >
                <option>Select a job title</option>
                {jobTitles.map((job, index) => (
                  <option key={index}>
                    {job}
                  </option>
                ))}
              </select>
            </span>
            <span>
              <input className="focus:outline-none  border-none focus:ring-[#EEEEEE] bg-[#FAFAFA] rounded-xl hover:bg-[#FAFAFA]"
                type="text" placeholder="Search for interviewer..." value={interviewerSearchInput} onChange={(e) => setInterviewerSearchInput(e.target.value)}
              >
              </input>
            </span>
            <span>
              <input className="focus:outline-none  border-none focus:ring-[#EEEEEE] bg-[#FAFAFA] rounded-xl hover:bg-[#FAFAFA]"
                type="text" placeholder="Search for candidate..." value={candidateSearchInput} onChange={(e) => setCandidateSearchInput(e.target.value)}
              >
              </input>
            </span>
          </div>

          {/* tab sections  */}

          {selectedCompany || selectedJobTitle || interviewerSearchInput || candidateSearchInput ? (
            <div className="py-2 px-1 flex ml-2 bg-slate-100">
              <p
                className={`flex items-center text-gray-900 ml-3 font-bold cursor-pointer ${activeTab === "On-going" ? "border-b-4 border-green-500" : ""}`}
                onClick={() => handleTabClick("On-going")}
              >
                <FaVideo className={`mr-1 ${activeTab === "On-going" ? "text-green-500" : ""}`} />
                <span className="ml-1">On-going Interviews</span>

              </p>
              <p
                className={`flex items-center text-gray-900 ml-16 font-bold cursor-pointer ${activeTab === "Upcoming" ? "border-b-4 border-green-500" : ""}`}
                onClick={() => handleTabClick("Upcoming")}
              >
                <FaVideo className={`mr-1 ${activeTab === "Upcoming" ? "text-green-500" : ""}`} />
                <span className="ml-1">Upcoming Interviews</span>
              </p>
              <p
                className={`flex items-center text-gray-900 ml-16 font-bold cursor-pointer ${activeTab === "Completed" ? "border-b-4 border-green-500" : ""}`}
                onClick={() => handleTabClick("Completed")}
              >
                <FaVideo className={`mr-1 ${activeTab === "Completed" ? "text-green-500" : ""}`} />
                <span className="ml-1">Completed Interviews</span>
              </p>

              <hr />
            </div>
          ) : null
          }


          {/* Table Section */}

          <div className="mb-5 mt-2">
            <div className="mt-3">
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-white border-b">
                          <tr>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] px-6 py-4 text-left"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] px-2 py-4 text-left"
                              style={{ width: "300px", overflow: "hidden", display: "inline-block" }}
                            >
                              Job ID
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] pr-4 py-4 text-left"
                            >
                              Interviewer
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] pr-4 py-4 text-left"
                            >
                              Candidate
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] pr-4 py-4 text-left"
                            >
                              Candidate email
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] pr-4 py-4 text-left"
                            >
                              Candidate contact
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] px-2 py-4 text-left"
                            >
                              Timing
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] px-2 py-4 text-left"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-[#888888] px-2 py-4 text-left"
                              style={{ width: "320px", overflow: "hidden", display: "inline-block" }}
                            >
                              Date
                            </th>
                          </tr>
                        </thead>
                        {activeTab === "On-going" && (
                          <>
                            {interviewState1 && interviewState1.map((interview, index) => {
                              return (
                                <tbody key={index}>
                                  {/* {console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                                  <tr
                                    onMouseOver={() => setEditStatus(index)}
                                    onMouseOut={() => setEditStatus('not-edit')}
                                    className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"} border-b  py-4`}
                                  >
                                    {editStatus !== index || editStatus === 'not-edit' ? (
                                      <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {index + 1}
                                        </td>
                                        <td className=" text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {interview._id}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.interviewers.firstName} {interview.interviewers.lastname}
                                        </td>

                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.firstName} {interview.applicant.lastname}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.email}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.contact}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                        </td>
                                        <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
                                          <span style={{
                                            color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
                                            backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
                                          }}
                                            className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
                                          >
                                            {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
                                          </span>
                                          <span className="text-[#D6A45A]">
                                            {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
                                          </span>
                                        </td>
                                        <td style={{ marginRight: "6px" }} className="flex justify-start text-xs text-[#888888] font-light px-6 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('DD:MM:YYYY')}
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td></td>
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {interview.jobTitle}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ left: "-150px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => cancelInterview(interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Cancel" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Reschedule" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                          // onClick={() => { /* Handle click event */ }}
                                          >
                                            <span className="cursor-pointer flex flex-row">
                                              <span className="pr-1">
                                                {interview.applications.interviewState === 4 ? (
                                                  <FaFileAlt />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState === 4 && (
                                                <a
                                                  href={`/admin/CPrintAbleAdmin/${interview.applications._id}`}
                                                >
                                                  View Feedback
                                                </a>
                                              )}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                            onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                          >
                                            <span className="pr-2">
                                              {interview.applications.interviewState == 0 ? (
                                                <FaRegCalendarAlt />
                                              ) : interview.applications.interviewState == 1 ? (
                                                <AiOutlineEye />
                                              ) : interview.applications.interviewState == 2 ? (
                                                <FaVideo />
                                              ) : interview.applications.interviewState == 3 ? (
                                                <FcClock />
                                              ) : interview.applications.interviewState == 4 ? (
                                                <FaVideo />
                                              ) : (
                                                <></>
                                              )}
                                            </span>
                                            {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                          </span>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </tbody>
                              )
                            })}
                            {ongoing > 0 && (

                              <div className="w-full">
                                <div className="flex justify-between my-2 mx-1">
                                  {Math.ceil(ongoing / 5) ? (
                                    <div className="flex items-center">
                                      <span className="text-gray-600">Page</span>
                                      <div className="flex mx-2">
                                        {page > 1 && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-blue-500"
                                            onClick={() => {
                                              paginate_ongoing(page - 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &lt;
                                          </span>
                                        )}
                                        {page > 6 && (
                                          <>
                                            <span
                                              className={`mx-2 cursor-pointer hover:text-blue-500`}
                                              onClick={() => {
                                                paginate_ongoing(1);
                                              }}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                border: "1px solid #34D399", // Border color for the square
                                                backgroundColor: "transparent", // Transparent background
                                              }}
                                            >
                                              1
                                            </span>
                                            <span className="mx-1 text-gray-600">...</span>
                                          </>
                                        )}
                                        {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                          if (pageNumber > 0 && pageNumber <= Math.ceil(ongoing / 5)) {
                                            return (
                                              <span
                                                className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                                  }`}
                                                key={pageNumber}
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  borderRadius: "4px",
                                                  backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                                }}
                                                onClick={() => {
                                                  paginate_ongoing(pageNumber);
                                                }}
                                              >
                                                {pageNumber}
                                              </span>
                                            );
                                          }
                                          return null;
                                        })}
                                        {page < Math.ceil(ongoing / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                        {page < Math.ceil(ongoing / 5) - 4 && (
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-green-500`}
                                            onClick={() => {
                                              paginate_ongoing(Math.ceil(ongoing / 5));
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            {Math.ceil(ongoing / 5)}
                                          </span>
                                        )}
                                        {page < Math.ceil(ongoing / 5) && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-green-500"
                                            onClick={() => {
                                              paginate_ongoing(page + 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &gt;
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-gray-600">of {Math.ceil(ongoing / 5)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {activeTab === "Upcoming" && (
                          <>
                            {interviewState0 && interviewState0.map((interview, index) => {
                              return (
                                <tbody key={index}>
                                  {/* {console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                                  <tr
                                    onMouseOver={() => setEditStatus(index)}
                                    onMouseOut={() => setEditStatus('not-edit')}
                                    className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"} border-b  py-4`}
                                  >
                                    {editStatus !== index || editStatus === 'not-edit' ? (
                                      <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {index + 1}
                                        </td>
                                        <td className=" text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {interview._id}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.interviewers.firstName} {interview.interviewers.lastname}
                                        </td>

                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.firstName} {interview.applicant.lastname}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.email}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.contact}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                        </td>
                                        <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
                                          <span style={{
                                            color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
                                            backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
                                          }}
                                            className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
                                          >
                                            {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
                                          </span>
                                          <span className="text-[#D6A45A]">
                                            {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
                                          </span>
                                        </td>
                                        <td style={{ marginRight: "6px" }} className="flex justify-start text-xs text-[#888888] font-light px-6 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('DD:MM:YYYY')}
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td></td>
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {interview.jobTitle}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ left: "-150px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => cancelInterview(interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Cancel" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Reschedule" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                          // onClick={() => { /* Handle click event */ }}
                                          >
                                            <span className="cursor-pointer flex flex-row">
                                              <span className="pr-1">
                                                {interview.applications.interviewState === 4 ? (
                                                  <FaFileAlt />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState === 4 && (
                                                <a
                                                  href={`/admin/CPrintAbleAdmin/${interview.applications._id}`}
                                                >
                                                  View Feedback
                                                </a>
                                              )}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                            onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                          >
                                            <span className="pr-2">
                                              {interview.applications.interviewState == 0 ? (
                                                <FaRegCalendarAlt />
                                              ) : interview.applications.interviewState == 1 ? (
                                                <AiOutlineEye />
                                              ) : interview.applications.interviewState == 2 ? (
                                                <FaVideo />
                                              ) : interview.applications.interviewState == 3 ? (
                                                <FcClock />
                                              ) : interview.applications.interviewState == 4 ? (
                                                <FaVideo />
                                              ) : (
                                                <></>
                                              )}
                                            </span>
                                            {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                          </span>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </tbody>
                              )
                            })}
                            {upcoming > 0 && (

                              <div className="w-full">
                                <div className="flex justify-between my-2 mx-1">
                                  {Math.ceil(upcoming / 5) ? (
                                    <div className="flex items-center">
                                      <span className="text-gray-600">Page</span>
                                      <div className="flex mx-2">
                                        {page > 1 && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-blue-500"
                                            onClick={() => {
                                              paginate_upcoming(page - 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &lt;
                                          </span>
                                        )}
                                        {page > 6 && (
                                          <>
                                            <span
                                              className={`mx-2 cursor-pointer hover:text-blue-500`}
                                              onClick={() => {
                                                paginate_upcoming(1);
                                              }}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                border: "1px solid #34D399", // Border color for the square
                                                backgroundColor: "transparent", // Transparent background
                                              }}
                                            >
                                              1
                                            </span>
                                            <span className="mx-1 text-gray-600">...</span>
                                          </>
                                        )}
                                        {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                          if (pageNumber > 0 && pageNumber <= Math.ceil(upcoming / 5)) {
                                            return (
                                              <span
                                                className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                                  }`}
                                                key={pageNumber}
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  borderRadius: "4px",
                                                  backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                                }}
                                                onClick={() => {
                                                  paginate_upcoming(pageNumber);
                                                }}
                                              >
                                                {pageNumber}
                                              </span>
                                            );
                                          }
                                          return null;
                                        })}
                                        {page < Math.ceil(upcoming / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                        {page < Math.ceil(upcoming / 5) - 4 && (
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-green-500`}
                                            onClick={() => {
                                              paginate_upcoming(Math.ceil(upcoming / 5));
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            {Math.ceil(upcoming / 5)}
                                          </span>
                                        )}
                                        {page < Math.ceil(upcoming / 5) && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-green-500"
                                            onClick={() => {
                                              paginate_upcoming(page + 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &gt;
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-gray-600">of {Math.ceil(upcoming / 5)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {activeTab === "Completed" && (
                          <>
                            {interviewState4 && interviewState4.map((interview, index) => {
                              return (
                                <tbody key={index}>
                                  {/* {console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                                  <tr
                                    onMouseOver={() => setEditStatus(index)}
                                    onMouseOut={() => setEditStatus('not-edit')}
                                    className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"} border-b  py-4`}
                                  >
                                    {editStatus !== index || editStatus === 'not-edit' ? (
                                      <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {index + 1}
                                        </td>
                                        <td className=" text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {interview._id}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.interviewers.firstName} {interview.interviewers.lastname}
                                        </td>

                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.firstName} {interview.applicant.lastname}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.email}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                          {interview.applicant.contact}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                        </td>
                                        <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
                                          <span style={{
                                            color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
                                            backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
                                          }}
                                            className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
                                          >
                                            {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
                                          </span>
                                          <span className="text-[#D6A45A]">
                                            {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
                                          </span>
                                        </td>
                                        <td style={{ marginRight: "6px" }} className="flex justify-start text-xs text-[#888888] font-light px-6 py-4 whitespace-nowrap">
                                          {moment(interview.slots.startDate).format('DD:MM:YYYY')}
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td></td>
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {interview.jobTitle}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ left: "-150px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => cancelInterview(interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Cancel" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                            className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                          >
                                            <span className="cursor-pointer flex flex-row"
                                              onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
                                            >
                                              <span className="pr-1">
                                                {interview.applications.interviewState == 0 ? (
                                                  <AiOutlineClockCircle />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState == 0 ? "Reschedule" : ''}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                          // onClick={() => { /* Handle click event */ }}
                                          >
                                            <span className="cursor-pointer flex flex-row">
                                              <span className="pr-1">
                                                {interview.applications.interviewState === 4 ? (
                                                  <FaFileAlt />
                                                ) : (
                                                  <></>
                                                )}
                                              </span>
                                              {interview.applications.interviewState === 4 && (
                                                <a
                                                  href={`/admin/CPrintAbleAdmin/${interview.applications._id}`}
                                                >
                                                  View Feedback
                                                </a>
                                              )}
                                            </span>
                                          </span>
                                          <span
                                            style={{ width: '130px', cursor: "pointer" }}
                                            className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                            onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                          >
                                            <span className="pr-2">
                                              {interview.applications.interviewState == 0 ? (
                                                <FaRegCalendarAlt />
                                              ) : interview.applications.interviewState == 1 ? (
                                                <AiOutlineEye />
                                              ) : interview.applications.interviewState == 2 ? (
                                                <FaVideo />
                                              ) : interview.applications.interviewState == 3 ? (
                                                <FcClock />
                                              ) : interview.applications.interviewState == 4 ? (
                                                <FaVideo />
                                              ) : (
                                                <></>
                                              )}
                                            </span>
                                            {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                          </span>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </tbody>
                              )
                            })}
                            {completed > 0 && (

                              <div className="w-full">
                                <div className="flex justify-between my-2 mx-1">
                                  {Math.ceil(completed / 5) ? (
                                    <div className="flex items-center">
                                      <span className="text-gray-600">Page</span>
                                      <div className="flex mx-2">
                                        {page > 1 && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-blue-500"
                                            onClick={() => {
                                              paginate_completed(page - 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &lt;
                                          </span>
                                        )}
                                        {page > 6 && (
                                          <>
                                            <span
                                              className={`mx-2 cursor-pointer hover:text-blue-500`}
                                              onClick={() => {
                                                paginate_completed(1);
                                              }}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                border: "1px solid #34D399", // Border color for the square
                                                backgroundColor: "transparent", // Transparent background
                                              }}
                                            >
                                              1
                                            </span>
                                            <span className="mx-1 text-gray-600">...</span>
                                          </>
                                        )}
                                        {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                          if (pageNumber > 0 && pageNumber <= Math.ceil(completed / 5)) {
                                            return (
                                              <span
                                                className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                                  }`}
                                                key={pageNumber}
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  borderRadius: "4px",
                                                  backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                                }}
                                                onClick={() => {
                                                  paginate_completed(pageNumber);
                                                }}
                                              >
                                                {pageNumber}
                                              </span>
                                            );
                                          }
                                          return null;
                                        })}
                                        {page < Math.ceil(completed / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                        {page < Math.ceil(completed / 5) - 4 && (
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-green-500`}
                                            onClick={() => {
                                              paginate_completed(Math.ceil(completed / 5));
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            {Math.ceil(completed / 5)}
                                          </span>
                                        )}
                                        {page < Math.ceil(completed / 5) && (
                                          <span
                                            className="mx-2 cursor-pointer hover:text-green-500"
                                            onClick={() => {
                                              paginate_completed(page + 1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}
                                          >
                                            &gt;
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-gray-600">of {Math.ceil(completed / 5)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal2 && (
        <Transition
          appear
          show={modal2}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
            static={true}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
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
              {fullScreenVideo == false ? (
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-xl ml-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                      <div className={`${!modal2 ? "hidden" : "block"} h-full`}>
                        <div className="w-full h-full">
                          <div className="w-full h-full">
                            <div className="border-b-2	">
                              <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                <div>
                                  <p className="font-semibold text-[#888888]">View media</p>
                                </div>
                                <div className="focus:outline-none border-none"
                                >
                                  <button onClick={() => {
                                    setModal2(false);
                                    setRecordingURLS([]);
                                    setLiveStreamURLS([]);
                                    setPreinterviewImages([]);
                                  }}
                                    className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"

                                    style={{
                                      color: "#034488",
                                      border: `none${`!important`}`
                                    }}
                                  >
                                    <ImCross />
                                  </button>
                                  <span className="text-[#D6615A]">Cancel</span>
                                </div>
                              </div>
                            </div>

                            <div className="w-full px-4 py-2" style={{ height: "95%", backgroundColor: "#FFFFFF" }}>
                              <div className="">
                                {recordingURLS.length > 0 || liveStreamURLS.length > 0 ? (
                                  <div className="relative flex flex-col w-full justify-around mt-3">
                                    {recordingURLS.length > 0 ? (
                                      <>
                                        <h2 className="font-bold text-lg mb-3">Interview recordings</h2>
                                        <Carousel className="block">
                                          {
                                            recordingURLS.map((value, index) => {
                                              return (
                                                <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                                  style={{ backgroundColor: "#6a6f6a" }}>
                                                  {<ReactPlayer
                                                    url={value.url}
                                                    controls={true}
                                                    width="100%"
                                                    height="265px"
                                                  />}
                                                </div>
                                              )
                                            })
                                          }
                                        </Carousel>
                                      </>
                                    ) : (
                                      <>
                                        <h2 className="font-bold text-lg mb-3">Live streaming</h2>
                                        <Carousel className="block">
                                          {
                                            liveStreamURLS.map((value, index) => {
                                              return (
                                                <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                                  style={{ backgroundColor: "#6a6f6a" }}>
                                                  {
                                                    <ReactHlsPlayer
                                                      src={value.playback_url}
                                                      autoPlay={false}
                                                      controls={true}
                                                      width="100%"
                                                      height="265px"
                                                    />
                                                  }
                                                </div>
                                              )
                                            })
                                          }
                                        </Carousel>
                                      </>
                                    )}
                                    <ImEnlarge className="absolute top-2 right-12 cursor-pointer text-[white]"
                                      onClick={() => {
                                        setFullScreenVideo(true);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    {spectate !== true ? (
                                      <>
                                        <h2 className="font-bold text-lg mb-3">Interview recordings</h2>
                                        <div className="relative flex w-full justify-center my-4">
                                          No recordings available !
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <h2 className="font-bold text-lg mb-3">Live streaming</h2>
                                        <div className="relative flex w-full justify-center my-4">
                                          No recordings available !
                                        </div>
                                      </>
                                    )}
                                  </>
                                )
                                }
                                {preinterviewImages.length > 0 ? (
                                  <div>
                                    <div className="font-bold text-lg">Baselining images</div>
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
                                        preinterviewImages.map((value, index) => {
                                          return (
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
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              ) : (
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-full">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white align-middle shadow-xl transition-all h-[95vh]">
                      <div className="relative">
                        {recordingURLS.length > 0 ? (
                          <Carousel className="block">
                            {
                              recordingURLS.map((value, index) => {
                                return (
                                  <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                    style={{ backgroundColor: "#6a6f6a" }}>
                                    {<ReactPlayer
                                      url={value.url}
                                      controls={true}
                                      width="100%"
                                      height="95vh"
                                    />}
                                  </div>
                                )
                              })
                            }
                          </Carousel>
                        ) : (
                          liveStreamURLS.map((value, index) => {
                            return (
                              <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                style={{ backgroundColor: "#6a6f6a" }}>
                                {
                                  <ReactHlsPlayer
                                    src={value.playback_url}
                                    autoPlay={false}
                                    controls={true}
                                    width="100%"
                                    height="auto"
                                  />
                                }
                              </div>
                            )
                          })
                        )}
                        <AiOutlineClose className="absolute cursor-pointer text-white w-5 h-5 top-1 right-12"
                          onClick={() => { setFullScreenVideo(false) }}
                        />
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              )
              }
            </div>
          </Dialog>
        </Transition>
      )}

      {modal1 && (
        <Transition
          appear
          show={modal1}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
            static={true}
          >
            <div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
            />
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
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-xl ml-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                    <div className={`${!modal1 ? "hidden" : "block"} h-full`}>
                      <div className="w-full h-full">
                        <div className="w-full h-full">
                          <div className="border-b-2	">
                            <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                              <div>
                                <p className="font-semibold">Availability</p>
                              </div>
                              <button className="focus:outline-none border-none" onClick={() => {
                                setModal1(false);
                              }}>
                                <button
                                  className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"

                                  style={{
                                    color: "#034488",
                                    border: `none${`!important`}`
                                  }}
                                >
                                  <ImCross />
                                </button>
                                <span className="text-[#D6615A]">Cancel</span>
                              </button>
                            </div>
                          </div>

                          <div className="w-full px-4 py-4" style={{ height: "95%", backgroundColor: "#FFFFFF" }}>
                            <>
                              <div className="">
                                <h2 className="font-bold text-lg">Select date</h2>
                                <div className="flex w-full justify-center my-2">
                                  {(() => {
                                    return (
                                      <DatePicker
                                        locale="id"
                                        minDate={new Date()}
                                        onChange={setStartTime}
                                        value={startTime}
                                        // selected={startDate}
                                        dateFormat="MM/dd/yyyy"
                                        highlightDates={highlight}
                                        inline
                                      />
                                    );
                                  })()}
                                </div>
                                <h2
                                  className={`text-center font-bold text-2xl`}
                                >
                                  Select Interviewer{" "}
                                </h2>
                                <select
                                  className="form-control mt-3"
                                  onChange={(e) => {
                                    setSelectedXi(e.target.value)
                                    highlightDates()
                                    showXiSlot(e.target.value)
                                  }
                                  }
                                >
                                  {matchedXis && matchedXis.length > 0 ? (
                                    matchedXis.map((xi) => (
                                      <>
                                        <option value={xi._id}>
                                          <div>
                                            {xi.firstName + " " + xi.lastname}
                                          </div>
                                          <br />
                                          <p style={{ color: "gray", fontSize: "5px", float: "right" }}>
                                            {" "} {xi.email}
                                          </p>
                                        </option>
                                      </>
                                    ))
                                  ) : (
                                    <option>All</option>
                                  )}
                                </select>
                                <div>
                                  <div className="mt-4">
                                    {xiSlot &&
                                      xiSlot.map((item, index) => {
                                        if (
                                          new Date(
                                            item.startDate
                                          ).getDate() ===
                                          new Date(startTime).getDate()
                                        ) {
                                          return (
                                            <span
                                              className={`${slotId &&
                                                slotId._id === item._id
                                                ? "bg-blue text-white-600"
                                                : "bg-white text-gray-600"
                                                } border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer`}
                                              onClick={async () => {

                                                let priority =
                                                  await priorityEngine(
                                                    item.startDate,
                                                    type
                                                  );

                                                if (priority.status == 200) {
                                                  setDisableBtn(false);
                                                }

                                                setslotId(
                                                  priority.data.slot
                                                );
                                              }}
                                            >
                                              {new Date(
                                                item.startDate
                                              ).getHours() +
                                                ":" +
                                                new Date(
                                                  item.startDate
                                                ).getMinutes()}{" "}
                                              -{" "}
                                              {new Date(
                                                item.endDate
                                              ).getHours() +
                                                ":" +
                                                new Date(
                                                  item.endDate
                                                ).getMinutes()}
                                            </span>
                                          );
                                        }
                                      })}
                                  </div>
                                </div>
                              </div>
                            </> <>
                              <div
                              >
                                {/* <h2 className="font-bold text-lg pt-4xl">Select time frame</h2>
                              <div className="rounded-lg bg-white border border-[#E3E3E3] w-full my-4 overflow-y-scroll h-2/5">
                                <div className="my-2 mx-2">
                                </div>
                              </div> */}
                                <div className="w-full my-4 flex justify-end">
                                  <button className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-2xl rounded px-4 py-2 text-white font-bold" disabled={disableBtn}
                                    style={
                                      disableBtn === true
                                        ? {
                                          backgroundColor:
                                            "rgba(34, 130, 118, 0.1)",
                                        }
                                        : { backgroundColor: "#228276" }
                                    }
                                    onClick={() => { scheduleSlot() }}>Save
                                    <DoneIcon className="ml-3 mb-1" />
                                  </button>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}

export default InterviewList;





// hiii

// {interviewListByCompany && interviewListByCompany.map((interview, index) => {
//   return (
//     <tbody key={index}>
//       {/* {console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
//       <tr
//         onMouseOver={() => setEditStatus(index)}
//         onMouseOut={() => setEditStatus('not-edit')}
//         className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"} border-b  py-4`}
//       >
//         {editStatus !== index || editStatus === 'not-edit' ? (
//           <>
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               {index + 1}
//             </td>
//             <td className=" text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
//               {interview._id}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.interviewers.firstName} {interview.interviewers.lastname}
//             </td>

//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.firstName} {interview.applicant.lastname}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.email}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.contact}
//             </td>
//             <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
//               {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
//             </td>
//             <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
//               <span style={{
//                 color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
//                 backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
//               }}
//                 className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
//               >
//                 {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
//               </span>
//               <span className="text-[#D6A45A]">
//                 {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
//               </span>
//             </td>
//             <td style={{ marginRight: "6px" }} className="flex justify-start text-xs text-[#888888] font-light px-6 py-4 whitespace-nowrap">
//               {moment(interview.slots.startDate).format('DD:MM:YYYY')}
//             </td>
//           </>
//         ) : (
//           <>
//             <td></td>
//             <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               {interview.jobTitle}
//             </td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td style={{ left: "-150px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
//               <span
//                 style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
//                 className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
//               >
//                 <span className="cursor-pointer flex flex-row"
//                   onClick={() => cancelInterview(interview)}
//                 >
//                   <span className="pr-1">
//                     {interview.applications.interviewState == 0 ? (
//                       <AiOutlineClockCircle />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState == 0 ? "Cancel" : ''}
//                 </span>
//               </span>
//               <span
//                 style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
//                 className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
//               >
//                 <span className="cursor-pointer flex flex-row"
//                   onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
//                 >
//                   <span className="pr-1">
//                     {interview.applications.interviewState == 0 ? (
//                       <AiOutlineClockCircle />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState == 0 ? "Reschedule" : ''}
//                 </span>
//               </span>
//               <span
//                 style={{ width: '130px', cursor: "pointer" }}
//                 className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
//               // onClick={() => { /* Handle click event */ }}
//               >
//                 <span className="cursor-pointer flex flex-row">
//                   <span className="pr-1">
//                     {interview.applications.interviewState === 4 ? (
//                       <FaFileAlt />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState === 4 && (
//                     <a
//                       href={`/admin/CPrintAbleAdmin/${interview.applications._id}`}
//                     >
//                       View Feedback
//                     </a>
//                   )}
//                 </span>
//               </span>
//               <span
//                 style={{ width: '130px', cursor: "pointer" }}
//                 className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
//                 onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
//               >
//                 <span className="pr-2">
//                   {interview.applications.interviewState == 0 ? (
//                     <FaRegCalendarAlt />
//                   ) : interview.applications.interviewState == 1 ? (
//                     <AiOutlineEye />
//                   ) : interview.applications.interviewState == 2 ? (
//                     <FaVideo />
//                   ) : interview.applications.interviewState == 3 ? (
//                     <FcClock />
//                   ) : interview.applications.interviewState == 4 ? (
//                     <FaVideo />
//                   ) : (
//                     <></>
//                   )}
//                 </span>
//                 {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
//               </span>
//             </td>
//           </>
//         )}
//       </tr>
//     </tbody>
//   )
// })}


// hiiend