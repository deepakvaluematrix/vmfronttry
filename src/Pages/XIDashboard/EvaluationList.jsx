import React, { useEffect, useState } from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import {
  listXIEvaluation,
  sendCalendarInvite,
  updateInterviewApplication,
} from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from "formik";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition, Dialog } from "@headlessui/react";
import InterviewListCard from "../../Components/XIDashboard/InterviewListCard.jsx";
import {
  slotDetailsOfXI,
  updateContactOTP,
  updateSlot,
  sendInterviewOTPEmail,
} from "../../service/api.js";
import { Link, Navigate, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Fragment } from "react";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import SupportTable from "./SupportTable.jsx";
import moment from "moment";
import "moment-timezone";
import ls from "localstorage-slim";
import { getStorage } from "../../service/storageService";
import { Oval } from "react-loader-spinner";
import Tabs from "./Tab.jsx";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

  const [interviewed, setinterviewed] = React.useState(0);
  const [accepted, setaccepted] = React.useState(0);
  const [pending, setpending] = React.useState(0);

  const [user, setUser] = React.useState(null);
  const [sendOTP, setsendOTP] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [interviewers, setInterviewers] = React.useState([]);

  const [index, setIndex] = useState(0);
  const [curJobs, setCurjobs] = useState([]);

  const [page, setPage] = useState(1);


  const getNewDate = (curDate) => {
     const date = new Date(curDate)
    const utcDatetime = moment.utc(curDate);

    const userDatetime = new Date(utcDatetime.toLocaleString([], { timeZone: 'auto' }));
    
    return userDatetime;
  };

  const paginate = (p) => {
    setPage(p);
  };

  // to filter data in matched interview section according to
  const filterAndSortDataToday = () => {
    // const currentMoment = '2023-07-24T04:20:00.000Z';
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const filteredData = jobs.filter((job) => {
      const startDate = new Date(job?.slots[0]?.startDate);
      return startDate >= today && startDate < tomorrow;
    });

    const sortedData = filteredData.sort((a, b) => {
      const startDateA = new Date(a?.slots[0]?.startDate);
      const startDateB = new Date(b?.slots[0]?.startDate);
      return startDateA - startDateB;
    });

    return sortedData;
  };

  const filterAndSortDataUpcoming = () => {
    // const currentMoment = '2023-03-09T10:14:50.000Z';
    const today = new Date();
   
    const filteredData = jobs.filter((job) => {
      const startDate = new Date(job?.slots[0]?.startDate);
      return startDate >= today;
    });

    const sortedData = filteredData.sort((a, b) => {
      const startDateA = new Date(a?.slots[0]?.startDate);
      const startDateB = new Date(b?.slots[0]?.startDate);
      return startDateA - startDateB;
    });

    return sortedData;
  };

  const filterAndSortDataPast = () => {
    const today = new Date();
    const filteredData = jobs.filter((job) => {
      const startDate = new Date(job?.slots[0]?.startDate);
      return startDate <= today;
    });

    const sortedData = filteredData.sort((a, b) => {
      const startDateA = new Date(a?.slots[0]?.startDate);
      const startDateB = new Date(b?.slots[0]?.startDate);
      return startDateB - startDateA;
    });

    return sortedData;
  };

  const selectTab = () => {
    // var tempJobs=[];
    if (index === 0) {
      const tempJobs = filterAndSortDataToday();
      setCurjobs(tempJobs);
    } else if (index === 1) {
      const tempJobs = filterAndSortDataUpcoming();
      setCurjobs(tempJobs);
    } else {
      const tempJobs = filterAndSortDataPast();
      setCurjobs(tempJobs);
    }
  };

  useEffect(() => {
    selectTab();
    setPage(1);
    // console.log(index)
  }, [index, jobs]);

  const getAmOrPm = (hours) => {
    if (hours >= 12) return "PM";

    return "AM";
  };



  const [otp, setotp] = React.useState(null);
  const [smsOTP, setsmsOTP] = React.useState("");
  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(getStorage("user"));
      setUser(user);
      let res = await listXIEvaluation(
        { user_id: user._id },
        user.access_token
      );
      if (res && res.data) {
        setJobs(res.data);
        setLoader(false);
        let arr = [...res.data];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        ls.set("jobsdetails", jsonObj);

        let interviewedval = 0;
        let acceptedval = 0;
        let pendingval = 0;

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status == "Interviewed") {
            interviewedval += 1;
          }
          if (res.data[i].status == "Accepted") {
            acceptedval += 1;
          }
          if (res.data[i].status == "Pending") {
            pendingval += 1;
          }
        }
        setinterviewed(interviewedval);
        setaccepted(acceptedval);
        setpending(pendingval);
      }
    };
    getData();
  }, []);

  const showJoinButton = (startDate) => {
    const diffVal = moment
      .duration(moment(startDate).diff(moment()))
      .asMinutes();
    return diffVal > -10 && diffVal < 15;
  };
  return (
    <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5">
      <div
        className="flex mx-5 mt-20"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div>

      {/* <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
        <li class="mr-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
        </li>
        <li class="mr-2" role="presentation">
            <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
        </li>
        <li class="mr-2" role="presentation">
            <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Settings</button>
        </li>
        <li role="presentation">
            <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">Contacts</button>
        </li>
    </ul>
</div>
<div id="myTabContent">
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
        <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Settings tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
        <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
</div> */}

      <div className="p-4 w-full md:flex mx-auto">
        <div className=" md:w-3/4 md:mx-5">
          {loader ? (
            // <p className="text-center font-semibold my-4">...Loading</p>
            <div
              className="mt-40"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Oval />
              <Oval />
              <Oval />
              <Oval />
              <Oval />
            </div>
          ) : (
            <>
              <div className="flex justify-between w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Interviews</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>
              {otpModal && (
                <Transition
                  appear
                  show={otpModal}
                  as={Fragment}
                  className="relative z-10 w-full "
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10 w-5/6 "
                    onClose={() => {}}
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all h-[30vh]">
                            <p>
                              Please enter the code sent to{" "}
                              <b> {user.email} </b>{" "}
                            </p>
                            <input
                              type="number"
                              name="smsOTP"
                              onChange={handleOTP}
                              placeholder="Enter code"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            ></input>
                            <div className="flex my-3">
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={async () => {
                                  if (smsOTP == otp) {
                                    let res = await updateSlot(slotId._id, {
                                      status: "Accepted",
                                    });
                                    let update =
                                      await updateInterviewApplication(
                                        slotId.interviewId,
                                        { status: "Accepted" }
                                      );
                                    swal({
                                      title: "Job Accepted Successfully !",
                                      message: "Success",
                                      icon: "success",
                                      button: "Continue",
                                    }).then((result) => {
                                      if(update){
                                        // Send calendar ics files to XI and Candidate
                                        sendCalendarInvite(slotId?.interviewId);
                                      }
                                      // handleJobInvitation(invitation, true);
                                      setotpModal(false);
                                      // window.location.reload();
                                    });
                                  } else {
                                    swal({
                                      title: "Invalid OTP !",
                                      message: "Error",
                                      icon: "error",
                                      button: "Continue",
                                    });
                                  }
                                }}
                              >
                                Submit
                              </button>
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={async () => {
                                  let resend = await sendInterviewOTPEmail({
                                    userId: user._id,
                                  });
                                  setotp(resend.otp);
                                }}
                              >
                                Resend Code{" "}
                              </button>

                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {
                                  setotpModal(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>

                            <div>
                              <i>
                                Please do check your spam folder in case you
                                don't see the code in your inbox
                              </i>
                              <h2 className="mx-auto w-fit">
                                <i>
                                  If the email mentioned above is wrong or you
                                  have not received any code after mutiple
                                  resend, please contact us at{" "}
                                  <b> support@valuematrix.ai </b>
                                </i>
                              </h2>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}



              <div style={{ margin: "0" }}>
                <Tabs
                  setIndex={setIndex}
                  length0={filterAndSortDataToday().length}
                  length1={filterAndSortDataUpcoming().length}
                  length2={filterAndSortDataPast().length}
                />
              </div>

              <div className="w-full">
                {curJobs &&
                  curJobs.slice(page * 5 - 5, page * 5).map((job) => {
                    if (job.slots.length > 0)
                      return (
                        <div className="w-full px-5 bg-white py-1 my-2">
                          <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
                            <div className="px-5 my-2 text-md col-span-2 space-y-1">
                              <p>
                                Interview with
                                <span className="font-semibold">
                                  {" "}
                                  {job.applicant[0].firstName}{" "}
                                  {job.applicant[0].lastname}
                                </span>
                              </p>
                              <p>
                                <h5 className="m-20px top-[10px] left-[15px] text-[inherit] font-bold font-inherit">
                                  {job.job[0] && job.job[0].jobTitle}
                                </h5>
                                <span className="font-semibold">Job : </span>{" "}
                                {job.job[0] && job.job[0].jobTitle}
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  Interview Id :
                                </span>
                                {job._id}
                              </p>
                            </div>
                            <div className="px-5 my-2 text-md">
                              <p>
                                {" "}
                                {new Date(
                                  getNewDate(job.slots[0].startDate)
                                ).getDate() +
                                  "-" +
                                  (new Date(
                                    getNewDate(job.slots[0].startDate)
                                  ).getMonth() +
                                    1) +
                                  "-" +
                                  new Date(
                                    getNewDate(job.slots[0].startDate)
                                  ).getFullYear()}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {new Intl.DateTimeFormat("en-US", {
                                  weekday: "long",
                                }).format(new Date(getNewDate(job.slots[0].startDate)))}
                              </p>
                            </div>
                            <div className="px-5 my-2 text-md">
                              <p>
                                {(new Date(getNewDate(job.slots[0].startDate)).getHours() %
                                  12 || 12) +
                                  ":" +
                                  new Date(
                                    getNewDate(job.slots[0].startDate)
                                  ).getMinutes() +
                                  getAmOrPm(
                                    new Date(getNewDate(job.slots[0].startDate)).getHours()
                                  )}{" "}
                                -{" "}
                                {(new Date(getNewDate(job.slots[0].endDate)).getHours() %
                                  12 || 12) +
                                  ":" +
                                  new Date(getNewDate(job.slots[0].endDate)).getMinutes() +
                                  getAmOrPm(
                                    new Date(getNewDate(job.slots[0].endDate)).getHours()
                                  )}
                              </p>
                              <p className="text-red-400 text-xs">
                                {moment(
                                  new Date(getNewDate(job.slots[0].startDate))
                                ).fromNow()}
                              </p>
                            </div>
                            <div className="flex space-x-3 items-center justify-between">
                              <div className=" text-center my-5 text-md">
                                {(() => {
                                  if (job.interviewState === 0) {
                                    return (
                                      <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                        <strong>{job.slots[0].status}</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 1) {
                                    return (
                                      <span className="bg-green-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                        <strong>Ongoing</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 2) {
                                    return (
                                      <span className="bg-blue-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                        <strong>Ended</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 3) {
                                    return (
                                      <span className="bg-red-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                        <strong>No show</strong>
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div>
                                          <span class="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-gray-900 font-semibold dark:bg-yellow-200 dark:text-gray-900 mr-3">
                                            <strong>Completed</strong>
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>
                              {job.slots[0].status === "Interviewed" && (
                                <div className="px-5 text-center my-5 text-md">
                                  <Link
                                    to={`/XI/updateEvaluationDetails/${job._id}`}
                                  >
                                    <span className="text-xs font-medium  px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                      Evaluate
                                    </span>
                                  </Link>
                                  {/* <Link to={`/XI/evaluationreport`}>
                                <span className="text-xs font-medium mr-4 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                  Update
                                </span></Link> */}
                                </div>
                              )}
                              {job.slots[0].status === "Pending" && (
                                <button
                                  style={{ background: "#3ED3C5" }}
                                  onClick={async () => {
                                    setotpModal(true);
                                    let resend = await sendInterviewOTPEmail({
                                      userId: user._id,
                                    });
                                    setotp(resend.otp);
                                    setslotId(job.slots[0]);
                                    setInterviewers(job.interviewers);
                                  }}
                                  className="btn mx-7 rounded-3xl shadow-sm px-6 my-3 py-2 text-xs text-gray-900 font-semibold"
                                >
                                  Confirm{" "}
                                </button>
                              )}
                              {job.slots[0].status === "Accepted" &&
                                showJoinButton(job.slots[0].startDate) &&
                                (job.interviewState === 0 ||
                                  job.interviewState === 1) && (
                                  <Link to={`/interviewer/${job._id}`}>
                                    <button
                                      style={{ background: "#3ED3C5" }}
                                      onClick={async () => {}}
                                      className="btn mx-7  rounded-3xl shadow-sm px-6 my-3 py-2 text-xs text-gray-900 font-semibold"
                                    >
                                      Join{" "}
                                    </button>
                                  </Link>
                                )}
                            </div>

                            <div className=" mx-2  align-middle absolute -right-2 top-7">
                              <Popover className="relative mt-7">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`
                  ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                    >
                                      <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
                                    </Popover.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-200"
                                      enterFrom="opacity-0 translate-y-1"
                                      enterTo="opacity-100 translate-y-0"
                                      leave="transition ease-in duration-150"
                                      leaveFrom="opacity-100 translate-y-0"
                                      leaveTo="opacity-0 translate-y-1"
                                    >
                                      <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                        <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                          <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
                                            <div className="flex items-center border-b text-gray-800 space-x-2">
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-2">
                                                <Link
                                                  to={`/XI/jobDetails/${job?.job?.[0]?._id}`}
                                                >
                                                  View Job Details{" "}
                                                </Link>
                                              </p>{" "}
                                            </div>
                                            {/* {(() => {
                                              if (job.interviewState === 2) {
                                                return (
                                                  <div className="flex items-center text-gray-800 space-x-2">
                                                    <p className="text-sm font-semibold py-1">
                                                      <Link to={`/XI/updateEvaluationDetails/${job._id}`}>
                                                        Feedback
                                                      </Link>
                                                    </p>{" "}
                                                  </div>
                                                )
                                              }
                                              
                                            })()} */}
                                            {(() => {
                                              if (job.interviewState === 2) {
                                                return (
                                                  <div className="flex items-center text-gray-800 space-x-2">
                                                    <p className="text-sm font-semibold py-1">
                                                      <Link
                                                        to={`/XI/updateEvaluationDetails/${job._id}`}
                                                      >
                                                        Feedback
                                                      </Link>
                                                    </p>
                                                  </div>
                                                );
                                              } else if (
                                                job.interviewState === 4
                                              ) {
                                                return (
                                                  <div className="flex items-center text-gray-800 space-x-2">
                                                    <p className="text-sm font-semibold py-1">
                                                      <Link
                                                        to={`/XI/CPrintAbleXI/${job._id}`}
                                                      >
                                                        View Feedback
                                                      </Link>
                                                    </p>
                                                  </div>
                                                );
                                              }
                                            })()}
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div>
                          </div>
                        </div>
                      );
                  })}
                {/* <div className="flex  ml-10">
                                <div>
                                  your on page 1
                                </div>
                                <div className="flex flex-row flex-end">

                                  <p>1</p>
                                  <p>2</p>
                                  <p>3</p>
                                  <p>4</p>
                                </div>
                  </div> */}

                {curJobs?.length > 0 && (
                  <div className="w-full">
                    <div className="flex justify-between my-2 mx-1">
                      <div>
                        Page {page} of {Math.ceil(curJobs.length / 5)}
                      </div>
                      <div>
                        {curJobs?.length > 0 &&
                          curJobs?.map((job, index) => {
                            return index % 5 == 0 ? (
                              <span
                                className={`mx-2 ${
                                  page == index / 5 + 1 ? "page_active" : ""
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  paginate(index / 5 + 1);
                                }}
                              >
                                {index / 5 + 1}
                              </span>
                            ) : null;
                          })}
                      </div>
                    </div>
                  </div>
                )}
                {/* No matched interviews today
No upcoming matched interviews
No completed matched interviews */}
                {curJobs && curJobs.length === 0 && (
                  <p className="text-center font-semibold my-5">
                    {index == 0 ? (
                      <span>No matched interviews today</span>
                    ) : index == 1 ? (
                      <span>No upcoming matched interviews</span>
                    ) : (
                      <span>No completed matched interviews</span>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* <div className="md:w-1/4">
          <div className="shadow-lg  py-5 justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Interviewed</p>
              <p className="text-gray-400 font-semibold text-xs">{interviewed}</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Accepted</p>
              <p className="text-gray-400 font-semibold text-xs">{accepted}</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Pending</p>
              <p className="text-gray-400 font-semibold text-xs">{pending}</p>
            </div>
          </div>

        </div> */}
      </div>
    </div>
  );
};

export default JobList;
