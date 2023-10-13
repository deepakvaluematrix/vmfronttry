import React, { useState } from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import {
  slotDetailsOfUser,
  updateInterviewApplication,
  updateWallet,
  getFeedBackInvitation,
} from "../../service/api.js";

import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { Fragment } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import swal from "sweetalert";
import SupportTable from "./SupportTable.jsx";
import moment from 'moment'
import InterviewReport from "./InterviewReport.jsx";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
const JobList = (props) => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [jobsExist, setjobsExist] = React.useState(false);
  const [index, setIndex] = React.useState(props.index);
  const [page, setPage] = useState(1);
  const [jobAccepted, setjobAccepted] = React.useState(false);
  const [hasReport, setHasReport] = React.useState([[]]);
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = useState(null);
  let token = getStorage("access_token");

  React.useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(getStorage("user"));
      setUser(user);
      let res = await slotDetailsOfUser(user._id);
      if (res && res.data[0]) {
        setJobs(res.data);
        setLoader(false);
        setjobsExist(true);
        let arr = [...res.data];
        const jsonObj = JSON.stringify(arr);
        // save to localStorage
        ls.set("jobsdetails", jsonObj);
        let hasReport = new Map ([[]]); 
        arr.forEach((value)=>{
          if(value?.interviewApplication[0]){
            hasReport.set(value?.interviewApplication[0]?._id,value?.interviewApplication[0]?.hasReport);
          }
        });
        setHasReport(hasReport);
      } else {
        setjobsExist(false);
      }
    };
    getData();
  }, []);

  // const getFeedback = async () => {
  //   try {
  //     const token = getStorage("access_token");

  //     const feedbackResults = await Promise.all(
  //       jobs?.map(async (job) => {
  //         const feedback = await getFeedBackInvitation({ id: job.interviewId }, token);
  //         return { interviewId: job.interviewId, hasReport: feedback.data.hasReport };
  //       })
  //     );

  //     const hasReportObj = feedbackResults?.reduce(
  //       (acc, { interviewId, hasReport }) => ({
  //         ...acc,
  //         [interviewId]: hasReport,
  //       }),
  //       {}
  //     );

  //     setHasReport(hasReportObj);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // React.useEffect(() => {
  //   //getFeedback();
  // }, [jobs]);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= jobs.length; i++) {
      document?.getElementById("intercard" + i)?.classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document?.getElementById("intercard" + ((p - 1) * 5 + j))?.classList.remove("hidden");
    }
  };
  const showJoinButton = (startDate) => {
    const diffVal = moment
      .duration(moment(startDate).diff(moment()))
      .asMinutes();
    return diffVal > -10 && diffVal < 60;
  };
  return (
    <div className="flex sm:p-1 bg-slate-50 overflow-hidden">
      <div className="container mx-auto bg-slate-50 mt-8 ">
        <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5 ">
          <p className="text-s flex mx-4 font-black mt-4 pt-4">
            Hey! {user && user.firstName ? user.firstName : "User"} -{" "}
            <p className="text-gray-400 px-2">
              {" "}
              Here's what's happening today!
            </p>
          </p>
          <div className="">
            <div className="px-4 w-full md:flex mx-auto">
              <div className="w-full">
               
                {jobsExist && loader ? (
                  <p className="text-center font-semibold my-4">...Loading</p>
                ) : (
                  <>
                    <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4">
                      <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                        <div className="">
                          <p className="text-l text-slate-500">
                            All Interviews
                          </p>
                          
                        </div>
                        <div className="text-xs text-green-600 font-black mt-1 mr-3">
                          
                        </div>
                      </div>
                      <div className="w-full">
                        {jobs &&
                          jobs.map((job, index) => {
                            if (job.slotType == "SuperXI") {
                              return (
                                <div
                                  id={"intercard" + (index + 1)}
                                  className={
                                    index < 5
                                      ? "w-full px-3 bg-white py-1 my-2 border-b "
                                      : "w-full px-3 bg-white py-1 my-2 border-b hidden"
                                  }
                                >
                                  <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-1">
                                    <div className=" my-2 text-md col-span-2 space-y-1">
                                      <p>
                                        Interview with
                                        <span className="font-semibold">
                                          {" "}
                                          {job.XI[0]._id}
                                        </span>
                                      </p>
                                      <p>
                                        <span className="font-semibold">
                                          Upgrade to XI{" "}
                                        </span>{" "}
                                      </p>
                                      {job.xiinterviewApplication &&
                                      job.xiinterviewApplication.length > 0 ? (
                                        <p className="text-sm">
                                          <span className="font-semibold">
                                            Interview Id :
                                          </span>
                                          {job.interviewId}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="px-5 my-2 text-md">
                                      <p>
                                        {" "}
                                        {new Date(job.startDate).getDate() +
                                          "-" +
                                          (new Date(job.startDate).getMonth() +
                                            1) +
                                          "-" +
                                          new Date(job.startDate).getFullYear()}
                                      </p>
                                      <p className="text-gray-400 text-sm">
                                        {new Intl.DateTimeFormat("en-US", {
                                          weekday: "long",
                                        }).format(new Date(job.startDate))}
                                      </p>
                                    </div>
                                    <div className="px-5 my-2 text-md">
                                      <p>
                                        {new Date(job.startDate).getHours() +
                                          ":" +
                                          new Date(
                                            job.startDate
                                          ).getMinutes()}{" "}
                                        -{" "}
                                        {new Date(job.endDate).getHours() +
                                          ":" +
                                          new Date(job.endDate).getMinutes()}
                                      </p>
                                      <p className="text-red-400 text-xs">
                                        <Moment to={new Date(job.startDate)}>
                                          {new Date()}
                                        </Moment>
                                      </p>
                                    </div>
                                    <div className="flex space-x-3 items-center">
                                      <div className="px-5 text-center my-5 text-md">
                                        <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                          {job.status}
                                        </span>
                                      </div>

                                      {new Date(job.endDate) < new Date() ? (
                                        <div
                                          className="px-5 text-center my-5 text-md cursor-pointer"
                                          onClick={async () => {}}
                                        >
                                          <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-red-500 text-red-500 cursor-pointer">
                                            Closed
                                          </span>
                                        </div>
                                      ) : (
                                        showJoinButton(job.startDate) && (
                                          <div
                                            className="px-5 text-center my-5 text-md cursor-pointer"
                                            onClick={async () => {

                                            }}
                                          >
                                            <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black cursor-pointer">
                                              Join
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>

                                    <div className="px-4 mx-2 py-4 align-middle absolute -right-2 top-0">
                                      <Popover className="relative mt-1">
                                        {({ open }) => (
                                          <>
                                            <Popover.Button
                                              className={`${open ? "" : "text-opacity-90"} focus:outline-0`}
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
                                                    <div className="flex items-center  text-gray-800 space-x-2">
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}`}
                                                        >
                                                          View Details{" "}
                                                        </Link>
                                                      </p>{" "}
                                                    </div>
                                                    {/* <div className="flex items-center  text-gray-800 space-x-2">
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}?qry=cancel`}
                                                        >
                                                          Cancel Interview{" "}
                                                        </Li  nk>
                                                      </p>{" "}
                                                    </div>
                                                    <div className="flex items-center  text-gray-800 space-x-2">
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}?qry=reschedule`}
                                                        >
                                                          Reschedule Interview{" "}
                                                        </Link>
                                                      </p>{" "}
                                                    </div> */}
                                                    <div key={job.interviewId}>
                                                        {hasReport.get(job.interviewId)?
                                                        <div className="flex items-center text-gray-800 space-x-2">
                                                        <p className="text-sm font-semibold py-2">
                                                          <a href={`/user/InterviewReport/${job.interviewId}`} >
                                                            View Feedback
                                                          </a>
                                                        </p>{" "}
                                                      </div> 
                                                        :<></>
                                                        }
                                                    </div>
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
                            } else {
                              return (
                                <div
                                  id={"intercard" + (index + 1)}
                                  className={
                                    index < 5
                                      ? "w-full bg-white "
                                      : "w-full bg-white  hidden"
                                  }
                                >
                                  <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-2 border-b-2">
                                    {job.XI[0] ? (
                                      <div className=" mx-3 my-2 text-md col-span-2 space-y-1">
                                        <p>
                                          <span className="font-semibold">
                                            Job :{" "}
                                          </span>{" "}
                                          {job.job[0] && job.job[0].jobTitle}
                                        </p>
                                        <p className="text-xs text-emerald-800	">
                                          <span className="font-semibold">
                                            Interviewer Id :{" "}
                                          </span>

                                          {job.XI[0]._id}
                                        </p>

                                        <p className="text-xs text-emerald-800	">
                                          <span className="font-semibold">
                                            Interview Id :{" "}
                                          </span>
                                          {job.interviewId}
                                        </p>
                                      </div>
                                    ) : (
                                      <div>Interview Scheduled</div>
                                    )}
                                    <div className="px-2 my-2 text-md">
                                      <p>
                                        {" "}
                                        {new Date(job.startDate).getDate() +
                                          "-" +
                                          (new Date(job.startDate).getMonth() +
                                            1) +
                                          "-" +
                                          new Date(job.startDate).getFullYear()}
                                      </p>
                                      <p className="text-gray-400 text-sm">
                                        {new Intl.DateTimeFormat("en-US", {
                                          weekday: "long",
                                        }).format(new Date(job.startDate))}
                                      </p>
                                    </div>
                                    <div className="px-2 my-2 text-md">
                                      <p>
                                        {new Date(job.startDate).getHours() +
                                          ":" +
                                          new Date(
                                            job.startDate
                                          ).getMinutes()}{" "}
                                        -{" "}
                                        {new Date(job.endDate).getHours() +
                                          ":" +
                                          new Date(job.endDate).getMinutes()}
                                      </p>
                                      <p className="text-red-400 text-xs">
                                        <Moment to={new Date(job.startDate)}>
                                          {new Date()}
                                        </Moment>
                                      </p>
                                    </div>
                                    <div className="flex space-x-3 items-center row">
                                      <div className="px-2 text-center my-3 text-md w-full">
                                      {(() => {
                                          if(job?.interviewApplication[0]?.interviewState===0){
                                            return (
                                              <span className="bg-gray-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                               <strong>{job.status}</strong> 
                                              </span>
                                            )
                                          }else if(job?.interviewApplication[0]?.interviewState===1){
                                            return (
                                              <span className="bg-green-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                <strong>Ongoing</strong>
                                              </span>
                                            )
                                          }else if(job?.interviewApplication[0]?.interviewState===2){
                                            return (
                                              <span className="bg-blue-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                <strong>Ended</strong>
                                              </span>
                                            )
                                          }else if(job?.interviewApplication[0]?.interviewState===3){
                                            return (
                                              <span className="bg-red-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                <strong>No show</strong>
                                              </span>
                                            )
                                          }else{
                                            return (
                                              <span className="bg-gray-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                <strong>{job.status}</strong>
                                              </span>
                                            )
                                          }
                                        })()}
                                      </div>
                                      {job.status === "Accepted" ||
                                      job.status === "Pending" ? (
                                        <div
                                          className="px-2 text-center my-3 text-md w-full"
                                          onClick={async () => {
                                            //let update = await updateInterviewApplication(job.uploadBy, { status: "Interviewed" });
                                            {
                                              new Date(job.endDate) <
                                              new Date() ? (
                                                <div className="px-5 text-center my-5 text-md cursor-pointer">
                                                  <span className="text-xs font-medium mr-2 px-3 py-0.5 rounded-3xl text-red-500 my-2 py-2 border-2 border-red-100 cursor-pointer">
                                                    Closed
                                                  </span>
                                                </div>
                                              ) : (
                                                showJoinButton(job.startDate) && 
                                                  (job?.interviewApplication[0]?.interviewState===0 || job?.interviewApplication[0]?.interviewState===1) && (
                                                  <div
                                                    className="px-5 text-center my-5 text-md cursor-pointer"
                                                    onClick={async () => {
                                                      //let update = await updateInterviewApplication(job.uploadBy, { status: "Interviewed" });
                                                      //let update2 = await updateWallet(job._id);
                                                    }}
                                                  >
                                                    <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black cursor-pointer">
                                                      Join
                                                    </span>
                                                  </div>
                                                )
                                              );
                                            }
                                            //let update2 = await updateWallet(job._id);
                                          }}
                                        >
                                          {job.status === "Accepted" ? (
                                            <>
                                              {new Date(job.endDate) <
                                              new Date() ? (
                                                <span className="text-xs text-red-500 font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-red-100">
                                                  Closed
                                                </span>
                                              ) : (
                                                showJoinButton(job.startDate) 
                                                && (job?.interviewApplication[0]?.interviewState===0 || job?.interviewApplication[0]?.interviewState===1)
                                                && (
                                                  
                                                  <Link
                                                    to={`/interview/${job.interviewApplication[0]._id}`}
                                                  >
                                                    <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                                      Join
                                                    </span>
                                                  </Link>
                                                )
                                              )}
                                            </>
                                          ) : null}
                                        </div>
                                      ) : (
                                        <div
                                          className="px-5 text-center my-5 text-md"
                                          onClick={async () => {
                                            swal({
                                              title:
                                                "Interviewed Already Completed",
                                              message: "Success",
                                              icon: "success",
                                              button: "OK",
                                            });
                                          }}
                                        >
                                          <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                            Completed
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="px-2 mx-2 -right-0">
                                      <Popover className="relative mt-1">
                                        {({ open }) => (
                                          <>
                                            <Popover.Button
                                              className={`
                              ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                            >
                                              <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 mt-5" />
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
                                                    <div className="flex items-center  text-gray-800 space-x-2">
                                                      {/* <BsThreeDots className="text-md" /> */}
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}`}
                                                        >
                                                          View Details{" "}
                                                        </Link>
                                                      </p>{" "}
                                                    </div>
                                                    {/* <div className="flex items-center  text-gray-800 space-x-2">
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}?qry=cancel`}
                                                        >
                                                          Cancel Interview{" "}
                                                        </Link>
                                                      </p>{" "}
                                                    </div>
                                                    <div className="flex items-center  text-gray-800 space-x-2">
                                                      <p className="text-sm font-semibold py-2">
                                                        <Link
                                                          to={`/user/interviewDetails/${job._id}?qry=reschedule`}
                                                        >
                                                          Reschedule Interview{" "}
                                                        </Link>
                                                      </p>{" "}
                                                    </div> */}

                                                    <div key={job.interviewId}>
                                                        {hasReport.get(job.interviewId)?
                                                        <div className="flex items-center text-gray-800 space-x-2">
                                                        <p className="text-sm font-semibold py-2">
                                                          <a href={`/user/InterviewReport/${job.interviewId}`} >
                                                            View Feedback
                                                          </a>
                                                        </p>{" "}
                                                      </div> 
                                                        :<></>
                                                        }
                                                        {/* <div className="flex items-center text-gray-800 space-x-2">
                                                          <p className="text-sm font-semibold py-2">
                                                            <a href={`/user/InterviewReport/${job.interviewId}`} >
                                                              View Report
                                                            </a>
                                                          </p>{" "}
                                                        </div>  */}
                                                    </div>
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
                          }
                        })}

                        {profile && <InterviewReport profile={profile} />}

                      {jobs && jobs.length === 0 && (
                        <p className="text-center font-semibold my-5">
                          No Interviews Scheduled
                        </p>
                      )}
                      </div>
                      <div className="w-full">
                      <div className="flex justify-between my-2 mx-1">
                        {Math.ceil(jobs.length / 5) ? (
                          <div>
                            Page {page} of {Math.ceil(jobs.length / 5)}
                          </div>
                        ) : null}

                        <div>
                          {" "}
                          {jobs &&
                            jobs.map((job, index) => {
                              return index % 5 == 0 ? (
                                <span
                                  className="mx-2"
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
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;