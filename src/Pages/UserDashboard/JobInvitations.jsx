import React, { useEffect, useRef, useState } from "react";
import {
  availableSlotsByJob,
  bookSlot,
  sendInterviewOTPEmail,
  findCandidateByEmail,
  getJobInvitations,
  handleCandidateJobInvitation,
  resendOTP,
  updateSlot,
  updateInterviewApplication,
  updateUserDetails,
  getUserFromId,
  handleXIInterview,
  priorityEngine,
  userRequestUpdate,
  createTaskScheduler,
  sendInterviewAcceptNotification,
  selectXisBySlot,
  availableSlotsFromXIPanel,
  sendJobReceivedNotification,
  getPanelDetails,
} from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import swal from "sweetalert";
import Swal from "sweetalert2";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Loader from "../../assets/images/loader.gif";
import Moment from "react-moment";

import { Fragment } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import DatePicker from "react-date-picker";
import DateTimePicker from "react-datetime-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import SupportTable from "./SupportTable.jsx";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import SelectSlots from "./SelectSlots";

const JobInvitations = (props) => {
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [JobInvitationbin, setJobInvitationbin] = React.useState([]);
  const [Loading, setLoading] = React.useState(true);
  const [xiInter, setxiInter] = React.useState(false);
  const [Error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [slot, setSlot] = React.useState([]);
  const [invitation, setInvitation] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);
  const [otp, setotp] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [smsOTP, setsmsOTP] = React.useState("");
  const [page, setPage] = useState(1);
  const [slotCompare, setSlotCompare] = useState({});
  const [index, setIndex] = React.useState(props.index);
  const [type, setType] = React.useState(null);
  const [filteredSlot, setFilteredSlot] = React.useState([]);
  const [selectedJobId, setSelectedJobId] = React.useState(null);
  const [isSlotBooked, setSlotBooked] = React.useState(false);
  

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= JobInvitation.length; i++) {
      document.getElementById("invcrd" + i)?.classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("invcrd" + ((p - 1) * 5 + j))?.classList.remove("hidden");
    }
  };


  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };
  
  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let user1 = await getUserFromId({ id: user._id }, user.access_token);
      setUser(user1.data.user);
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );
      if (res && res.status === 200) {
        const newJobInvitations = [];
        res?.data?.jobInvites?.map((job)=>{
          const createTime = new Date(Date.now())
          const validTill = new Date(job?.validTill);
          // if (validTill >= currentDate) {
          //   // validTill is greater than createTime
          //   newJobInvitations.push(job);
          // } 

          // Extract year, month, and day from createTime
          const createYear = createTime.getFullYear();
          const createMonth = createTime.getMonth();
          const createDay = createTime.getDate();
                  
          // Extract year, month, and day from validTill
          const validYear = validTill.getFullYear();
          const validMonth = validTill.getMonth();
          const validDay = validTill.getDate();
                  
          // Compare year, month, and day components
          if (
            validYear > createYear ||
            (validYear === createYear && validMonth > createMonth) ||
            (validYear === createYear && validMonth === createMonth && validDay >= createDay)
          ) {
            // validTill is greater than createTime
             newJobInvitations.push(job);
            }
          // if(job?.validTill > Date.now()){
          //   setJobInvitation(res.data.jobInvites);
          // }
        })
        setJobInvitation(newJobInvitations);
        setJobInvitationbin(res.data.jobInvitesbin);
        setLoading(false);
      }
      let candidate = await findCandidateByEmail(user.email);
      setCandidate(candidate.candidate_id);
    };
    initial();
  }, [isSlotBooked]);

  let handleCloseChooseSlot = async () =>{
    setchooseSlot(false);
  }

  const handleSlotBooked = async() =>{
    setchooseSlot(false);
    setSlotBooked(true);
  }

  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await getStorage("user"));
      let interviewer = [];
      interviewer.push(slotId.createdBy);
      // interviewer.push("6450a1c4a20f2fdb62c13a1f") // just for development
      
      // if (interviewer.length > 0) {
      //   let notificationData = {
      //     jobId : job?._id,
      //     xiIds: interviewer
      //   }
      //   await sendInterviewAcceptNotification(notificationData)
      // }
      // let res = await handleCandidateJobInvitation(
      //   {
      //     job_id: job._id,
      //     user_id: user._id,
      //     accept: accept,
      //     interviewers: interviewer,
      //   },
      //   user.access_token
      // );
      let interviewers = []
      let panelDetails = await getPanelDetails({ panelId: job.panelId })
      let data = {
        "matchedXis": panelDetails?.data?.panelData?.xiIds,
        "slotTime": slotId.startDate
      }
      let matchedXis = await selectXisBySlot(data)
      if (matchedXis && matchedXis?.data?.matchedXiswithSlot &&  matchedXis?.data?.matchedXiswithSlot.length > 0) {
        interviewers = matchedXis.data.matchedXiswithSlot
      }
      let res = await handleCandidateJobInvitation(
        {
          job_id: job._id,
          user_id: user._id,
          accept: accept,
          interviewers: interviewers
        },
        user.access_token
      );
      if (res && res.status === 200) {
        let res1 = await updateSlot(slotId._id, {
          interviewId: res.data.data._id,
        });

        let date = new Date();
        date = new Date(date.getTime() + 1800000);
        let res2 = await createTaskScheduler({
          applicantId: user._id,
          interviewerId: slotId.createdBy,
          nextTime: date,
          priority: slotId.priority,
          slotId: slotId._id,
          interviewId: res.data.data._id,
          startDate: slotId.startDate,
        });
        let d = JobInvitation.filter((el) => {
          return el !== job;
        });
        await setJobInvitation(d);
        await setJobInvitation(d);
        swal({
          title: "Success",
          text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
          icon: "success",
          button: "Ok",
        });

        setslotId(null);
        setotpModal(false);
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    } catch (err) {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  useEffect(() => {
    const filteredTimeSlots = [];
    slot.map((item) => {
      if (new Date(item.startDate).getDate() === new Date().getDate()) {
        const availableSlot = new Date(item.startDate);
        if(availableSlot > startTime) {
          filteredTimeSlots.push(item);
        }
      } else {
        filteredTimeSlots.push(item);
      }
      setFilteredSlot(filteredTimeSlots)
    })
  },[chooseSlot])

  useEffect(() => {
  },[isSlotBooked])
  
  return (
    <div className="flex sm:p-1 bg-slate-50 overflow-hidden">
      {/* <Sidebar /> */}
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
            <div className="p-4 w-full md:flex mx-auto">
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
                          <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-auto">
                            <div className="py-4 w-full flex" style={{ backgroundColor: "#228276" }}>
                              <p className="text-lg mx-5 text-center text-white font-semibold">
                                Code verification
                              </p>
                            </div>

                            <div className="my-16 w-full">
                              <h2 className="mx-auto w-fit">
                              Please enter the code sent to <b> {user.email} </b>{" "}
                              </h2>
                            </div>

                            <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-56"></div>
                            <div className="mx-56 my-5">
                              <h3>Verification code</h3>
                              <input
                                id="smsOTP"
                                type="number"
                                name="smsOTP"
                                onChange={handleOTP}
                                placeholder="Enter verification code here"
                                className="w-full"
                                style={{
                                  borderRadius: "12px",
                                  marginTop: "10px",
                                }}
                              ></input>
                            </div>

                            <div className="w-full my-16 flex justify-center">
                              <button
                                className="border-2 text-black font-bold py-3 px-8 w-fit md:mx-4 text-xs rounded"
                                onClick={async () => {
                                  let resend = await sendInterviewOTPEmail({userId:user._id}); 
                                  setotp(resend.otp);
                                }}
                              >
                                Resend code
                              </button>
                            </div>
                            {// I am looking for this 
                            }
                            <div className="flex my-16 justify-center">
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={async () => {
                                  if (smsOTP == otp) {
                                    await sendJobReceivedNotification({
                                      userId: slotId?.createdBy,
                                      jobId: invitation?._id,
                                      startDate: slotId?.startDate,
                                    });
                                    let res = await updateSlot(slotId._id, {
                                      userId: user._id,
                                      status: "Pending",
                                    });

                                    if (slotId.slotType == "SuperXI") {
                                      let res = await updateUserDetails(
                                        {
                                          user_id: user._id,
                                          updates: { status: "Applied" },
                                        },
                                        { access_token: user.access_token }
                                      );
                                      let res1 = await handleXIInterview(
                                        {
                                          slotId: slotId._id,
                                          interviewer: slotId.createdBy,
                                          applicant: user._id,
                                          status: "Pending",
                                        },
                                        user.access_token
                                      );
                                      window.location.reload();

                                      setslotId(null);
                                      setotpModal(false);
                                    } else {
                                      handleJobInvitation(invitation, true);
                                      if (res.status == 200) {
                                        setotpModal(false);
                                      }
                                    }
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
                                onClick={() => {
                                  setotpModal(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="my-16 w-full">
                              <div className="my-16 w-full">
                                <i>Please do check your spam folder in case you don't see the code in your inbox</i>
                                <h2 className="mx-auto w-fit">
                                  <i>
                                  If the email mentioned above is wrong or you have not received any code after mutiple resend, please contact us at <b> support@valuematrix.ai </b>
                                  </i>
                                </h2>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}

              {chooseSlot && (
                <SelectSlots handleSlotBooked={handleSlotBooked}  jobId={selectedJobId} userId={user._id} email={user.email} jobTitle={invitation?.jobTitle} panelID={invitation?.panelId} company={invitation?.hiringOrganization} chooseSlot={chooseSlot} handleCloseChooseSlot={handleCloseChooseSlot}/>
              )}

              <div className="  md:w-3/4 md:mx-1 w-full rounded-lg  bg-white outline outline-offset-2 outline-2 outline-slate-200 mr-3		">
                <div
                  className="justify-between w-full bg-white"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                    <p className="text-l text-slate-500 w-full">
                      Candidate Interview Invitations
                    </p>
                  </div>
                </div>
                {!Loading &&
                user.status !== "Forwarded" &&
                JobInvitation.length === 0 ? (
                  <div className="text-center py-5 text-2xl md:w-4/4">
                    No Interview Invitations
                  </div>
                ) : (
                  <div className="w-full">
                    {user && user.status == "Forwarded" && (
                      <div
                        className={"w-full px-5 bg-white py-1 border border-b"}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                          <div className="col-span-6">
                            <h5 className="text-black-900 text-md font-bold mb-1 ">
                              Upgrade to XI
                            </h5>
                          </div>
                          <div className="flex col-span-2">
                            <button
                              style={{ background: "#3ED3C5" }}
                              onClick={async () => {
                                // let slots = await availableSlotsByJob({
                                //   userId: user._id,
                                //   type: "SuperXI",
                                //   jobId: invitation._id,
                                // });
                                // let slots = await availableSlotsFromXIPanel({ jobId: invitation._id})
                                // const key = "startDate";

                                // const arrayUniqueByKey = [
                                //   ...new Map(
                                //     slots.data.map((item) => [item[key], item])
                                //   ).values(),
                                // ];

                                // setType("SuperXI");
                                // setSlot(arrayUniqueByKey);
                                setchooseSlot(true);
                                setxiInter(true);
                                setSelectedJobId(invitation._id);
                              }}
                              className="btn  rounded-3xl shadow-sm px-6 my-1 py-2 mr-3 text-xs text-gray-900 font-semibold"
                            >
                              Accept{" "}
                            </button>
                            <button
                              style={{ background: "#fff" }}
                              onClick={async () => {
                                let res = await updateUserDetails(
                                  {
                                    user_id: user._id,
                                    updates: { status: "Pending" },
                                  },
                                  { access_token: user.access_token }
                                );
                                setxiInter(false);
                              }}
                              className="bg-white border border-gray-500  rounded-3xl px-6 mx-2 my-2  py-2 text-xs text-gray"
                            >
                              Decline{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {JobInvitation.map((job, index) => {
                      if (job.status && job.status === "Active") {
                        return (
                          <div
                            id={"invcrd" + (index + 1)}
                            className={
                              index < 5
                                ? "w-full px-3 bg-white py-1 border-b"
                                : "w-full px-3 bg-white py-1 border-b hidden"
                            }
                          >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                              <div className="col-span-2">
                                <h5 className="text-black-900 text-md font-bold mb-1 ">
                                  {job.jobTitle}
                                </h5>
                                <p className="text-sm font-bold  text-gray-400 font-semibold">
                                  {job.hiringOrganization}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <div className="flex py-1">
                                  <div className="text-md py-1 text-gray-400 font-semibold ">
                                    <CgWorkAlt />
                                  </div>

                                  <p className="px-4 text-sm text-gray-400 font-semibold">
                                    {job.jobType}
                                  </p>
                                </div>
                                <div className="flex py-1">
                                  <div className="text-md py-1 text-gray-400 font-semibold ">
                                    <HiOutlineLocationMarker />
                                  </div>

                                  <p className="px-4 text-sm text-gray-400 font-semibold">
                                    {job.location}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="flex py-1">
                                  <div className="text-md py-1 text-gray-400 font-semibold ">
                                    <HiOutlineCalendar />
                                  </div>

                                  <p className="px-2 text-md text-gray-400 font-semibold">
                                    {new Date(job.validTill).getDate() +
                                      "-" +
                                      (new Date(job.validTill).getMonth() + 1) +
                                      "-" +
                                      new Date(job.validTill).getFullYear()}
                                  </p>
                                </div>
                                <div className="flex py-1">
                                  <div className="text-md py-1 text-gray-400 font-semibold ">
                                    <BsCashStack />
                                  </div>

                                  <p className="px-2 text-sm text-gray-400 font-semibold">
                                    {typeof job.salary === "object"
                                      ? job.salary[1] + " - " + job.salary[2]
                                      : job.salary}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end col-span-2">
                                <button
                                  style={{ background: "#228276" }}
                                  onClick={
                                    
                                    async () => {
                                    // let slots = await availableSlotsFromXIPanel({ jobId: job._id})
                                    // const key = "startDate";
                                    // const arrayUniqueByKey = [
                                    //   ...new Map(
                                    //     slots.data.map((item) => [
                                    //       item[key],
                                    //       item,
                                    //     ])
                                    //   ).values(),
                                    // ];

                                    setType("XI");
                                    // setSlot(arrayUniqueByKey);
                                    setInvitation(job);
                                    setchooseSlot(true);
                                    setSelectedJobId(job._id);
                                  }}
                                  className="btn rounded-3xl shadow-sm px-6 my-3 text-xs text-white font-semibold"
                                >
                                  Accept{" "}
                                </button>

                                <div className="px-4 mx-2 py-4 align-middle">
                                  <Popover className="relative mt-1">
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
                                                {/* <div
                                                  className="flex items-center border-b text-gray-800 space-x-2"
                                                  onClick={() => {
                                                    handleJobInvitation(
                                                      job,
                                                      false
                                                    );
                                                  }}
                                                >
                                                  <p className="text-sm font-semibold py-2">
                                                    Decline
                                                  </p>{" "}
                                                </div> */}
                                                <div className="flex items-center text-gray-800 space-x-2">
                                                  <p className="text-sm font-semibold py-1">
                                                    <Link
                                                      to={`/user/jobDetails/${job._id}`}
                                                    >
                                                      View Details{" "}
                                                    </Link>
                                                  </p>{" "}
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
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
                <div className="w-full">
                  <div className="flex justify-between my-2 mx-1">
                    {Math.ceil(JobInvitation.length / 5) ? (
                      <div>
                        Page {page} of {Math.ceil(JobInvitation.length / 5)}
                      </div>
                    ) : null}
                    <div>
                      {" "}
                      {JobInvitation &&
                        JobInvitation.map((job, index) => {
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
              {/* ) } */}

              <div className="md:w-1/4">
                <div className="md:mx-1 w-full rounded-lg  bg-white outline outline-offset-2 outline-2 outline-slate-200 mr-3">
                  <p className="text-xl mx-auto text-gray-700 font-bold  flex py-2 pl-2 border-b border-gray-200">
                    <p className="p-1">
                      <BsFillBookmarkFill />
                    </p>
                    <p className=" text-base ml-1 text-slate-500 w-full">
                      My Items
                    </p>
                  </p>
                  <div className="flex justify-between px-3 py-4">
                    <p className="font-bold text-gray-400 text-xs">
                      Pending Invitations
                    </p>
                    <p className=" font-bold text-xs">
                      {JobInvitation?.length}
                    </p>
                  </div>
                </div>

                {/* <SupportTable /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInvitations;
