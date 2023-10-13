import React, { useEffect, useState, Fragment } from "react";

// Assets

import swal from "sweetalert";
import { BsThreeDots } from "react-icons/bs";
import Sidebar from "../../Components/Dashbaord/sidebar";
import RecentPeople from "./RecentPeople.jsx";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Moment from "react-moment";
import { BsFillBookmarkFill } from "react-icons/bs";


import {
  PaymentSuccess,
  newOrder,
  getUserCurrentCredit,
  handleCandidateJobInvitation,
  getUserStats,
  updateSlot,
  slotDetailsOfUser,
  resendOTP,
  updateUserDetails,
  handleXIInterview,
  getJobInvitations,
  bookSlot,
  sendInterviewOTPEmail,
  availableSlotsByJob,
  priorityEngine,
  createTaskScheduler,
  getUserFromId,
  availableSlotsFromXIPanel

} from "../../service/api.js";
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
} from "react-icons/hi";
import { Link } from "react-router-dom";

import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import { AiOutlineArrowUp } from "react-icons/ai";
import logo from "../../assets/images/logo.png";
import { Dialog, Transition, Popover } from "@headlessui/react";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import SelectSlots from "./SelectSlots";
const Panel = () => {
  const [Loading, setLoading] = React.useState(true);

  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [xiInter, setxiInter] = React.useState(false);
  const [invitation, setInvitation] = React.useState(null);
  const [otp, setotp] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [slot, setSlot] = React.useState([]);
  const [type, setType] = React.useState(null);
  const [page, setPage] = useState(1);


  const [user, setUser] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [invited, setInvited] = React.useState(0);
  const [scheduled, setScheduled] = React.useState(0);
  const [pending, setPending] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [currentCredit, setCurrentCredit] = React.useState(null);
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [JobInvitationbin, setJobInvitationbin] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);
  const [smsOTP, setsmsOTP] = React.useState("");
  const [profileCompleted,setProfileCompleted] = useState(false)


   // Pending, accepted and completed
   const [pendingInterview , setPendingInterview] = useState([])
   const [acceptedInterview , setAcceptedInterview] = useState([])
   const [completedInterview , setCompletedInterview] = useState([])
 
   // Pending Interview Invitations
   const [invitePending , setInvitePending] = React.useState([])

   const [selectedJobId, setSelectedJobId] = React.useState(null);
   const [isSlotBooked, setSlotBooked] = React.useState(false);

  useEffect(()=>{
    const fetchUser = async() => {
      let access_token = getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      let user1 = await getUserFromId({ id: user?._id }, access_token);
      setUser(user1);
      if (!user1?.data?.user?.profileImg || !user1?.data?.user?.linkedinurl || user1?.data?.user?.tools.length == 0) {
        setProfileCompleted(false);
      } else {
        setProfileCompleted(true);
      }
    };
    fetchUser();
  },[profileCompleted])

  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };

  React.useEffect(() => {

    const getCredit = async () => {
      let user = JSON.parse(getStorage("user"));
      let res = await getUserCurrentCredit(user._id);
      if (res) {
        setCurrentCredit(res.data.data.credit);
      }
    };
    const getStats = async () => {
      let user = JSON.parse(getStorage("user"));
      let res = await getUserStats(user._id);
      if (res) {
        setInvited(res.data.invited);
      }
      let res2 = await slotDetailsOfUser(user._id);
      if (res2) {
        // let records = res2.data;
        setInterviews(res2?.data)
        let records = []
        let penInt = []
        let accInt = []
        let comInt = []
        res2?.data?.map((response)=>{
          const createTime = new Date(Date.now())
          const validTill = new Date(response?.endDate);
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
            records.push(response)
            if(response?.status === "Pending"){
              penInt.push(response)
            }
            else if(response?.status === "Accepted"){
              accInt.push(response)
            }
            else if(response?.status === "Completed") {
              comInt.push(response)
            }
          }
        })
        setPendingInterview(penInt)
        setAcceptedInterview(accInt)
        setCompletedInterview(comInt)
        // setInterviews(records);
        let pending = 0;
        let scheduled = 0;
        let completed = 0;
        for (let i = 0; i < records.length; i++) {
          if (records[i].status === "Accepted") {
            scheduled += 1;
          }
          if (records[i].status === "Pending") {
            pending += 1;
          }
          if (records[i].status === "Completed") {
            completed += 1;
          }
        }
        setScheduled(scheduled);
        setPending(pending);
        setCompleted(completed);
      }
    };
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );
      if (res && res.status === 200) {
        const newJobInvitations = [];
        res?.data?.jobInvites?.map((job)=>{
          const createTime = new Date(Date.now())
          const validTill = new Date(job?.validTill);

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
        });
        // console.log("newJobInvitations: ",newJobInvitations);
        let arr1 = pendingInterview
        let arr2 = newJobInvitations
        let arr3 = arr1.concat(arr2)
        setInvitePending(arr3);

        setJobInvitation(newJobInvitations);
        setJobInvitationbin(res.data.jobInvitesbin);
      }
    };
    getCredit();
    getStats();
    initial();
  }, []);
  const data = React.useMemo(
    () => [
      {
        label: "Series 1",
        data: [
          [0, 1],
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 7],
        ],
      },
      {
        label: "Series 2",
        data: [
          [0, 3],
          [1, 1],
          [2, 5],
          [3, 6],
          [4, 4],
        ],
      },
    ],
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { type: "ordinal", position: "left" },
    ],
    []
  );
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  function getDaysAgo(date) {
    const today = new Date();
    const validTillDate = new Date(date);
    const timeDiff = Math.abs(today.getTime() - validTillDate.getTime());
    const daysAgo = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysAgo;
  }

  async function displayRazorpay(amt) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await newOrder({
      user_type: user.user_type,
      amount: amt,
      userId: user._id,
    });
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.order;
    // let amount = result.data.order.amount
    // let order_id = result.data.order.order_id
    // let currency = result.data.order.currency
    let transactionId = result.data.id;
    const options = {
      key: "rzp_test_6ri9glEbS06F1H", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Value Matrix",
      description: "Test Transaction",
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result1 = await PaymentSuccess({
          data: data,
          id: transactionId,
          userId: user._id,
          amount: amount,
        });
        swal({
          title: "Payment Completed Successfully",
          message: "Success",
          icon: "success",
          button: "OK",
        }).then(() => {
          window.location.reload();
        });
      },
      prefill: {
        name: "Value Matrix",
        email: "vmdeveloper171@gmail.com",
        contact: "9999999999",
      },
      notes: {
        address: "Value Matrix Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  // const handleJobInvitation = async (job, accept) => {
  //   try {
  //     let user = JSON.parse(await getStorage("user"));
  //     let interviewer = [];
  //     interviewer.push(slotId.createdBy);
  //     let res = await handleCandidateJobInvitation(
  //       {
  //         job_id: job._id,
  //         user_id: user._id,
  //         accept: accept,
  //         interviewers: interviewer,
  //       },
  //       user.access_token
  //     );
  //     if (res && res.status === 200) {
  //       let res1 = await updateSlot(slotId._id, {
  //         interviewId: res.data.data._id,
  //       });

  //       let date = new Date();
  //       date = new Date(date.getTime() + 1800000);
  //       let res2 = await createTaskScheduler({
  //         applicantId: user._id,
  //         interviewerId: slotId.createdBy,
  //         nextTime: date,
  //         priority: slotId.priority,
  //         slotId: slotId._id,
  //         interviewId: res.data.data._id,
  //         startDate: slotId.startDate,
  //       });
  //       let d = JobInvitation.filter((el) => {
  //         return el !== job;
  //       });
  //       await setJobInvitation(d);
  //       await setJobInvitation(d);
  //       swal({
  //         title: "Success",
  //         text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
  //         icon: "success",
  //         button: "Ok",
  //       });

  //       setslotId(null);
  //       setotpModal(false);
  //     } else {
  //       swal({
  //         title: "Error",
  //         text: "Something went wrong",
  //         icon: "error",
  //         button: "Ok",
  //       });
  //     }
  //   } catch (err) {
  //     swal({
  //       title: "Error",
  //       text: "Something went wrong",
  //       icon: "error",
  //       button: "Ok",
  //     });
  //   }
  // };

  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await getStorage("user"));
      let interviewer = [];
      interviewer.push(slotId.createdBy);
      let res = await handleCandidateJobInvitation(
        {
          job_id: job._id,
          user_id: user._id,
          accept: accept,
          interviewers: interviewer,
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

  let handleCloseChooseSlot = async () =>{
    setchooseSlot(false);
  }

  const handleSlotBooked = async() =>{
    setchooseSlot(false);
    setSlotBooked(true);
  }


  return (
    <div className="flex sm:p-1 bg-slate-50 overflow-hidden">
      {/* <Sidebar /> */}
     
      <div className="container mx-auto bg-slate-50 mt-8 ">
        <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5 ">
          <p className="text-s flex mx-4 font-black my-4 pt-4">
            Hey! {user && user.firstName ? user.firstName : "User"} -{" "}
            <p className="text-gray-400 px-2">
              {" "}
              Here's what's happening today!
            </p>
          </p>
          <div class="grid grid-cols-4 gap-4 mx-4">
            <div>
              <div className=" grid grid-cols-2 text-sm font-semibold rounded-xl text-gray-900 bg-slate-100 p-3">
                <div class="grid  place-content-start">
                  {" "}
                  
                  <div>Interview</div>
                  <div>Invitations</div>
                </div>
                <div class="grid text-3xl place-content-end">{invitePending?.length}</div>
              </div>
            </div>
            <div>
              <div className=" grid grid-cols-2 text-sm font-semibold rounded-xl text-gray-900 bg-slate-100 p-3">
                <div class="grid  place-content-start">
                  {" "}
                  <div>Scheduled</div>
                  <div>Interviews</div>
                </div>
                <div class="grid text-3xl place-content-end">{scheduled}</div>
              </div>
            </div>
            <div>
              <div className=" grid grid-cols-2 text-sm font-semibold rounded-xl text-gray-900 bg-slate-100 p-3">
                <div class="grid  place-content-start">
                  {" "}
                  <div>Completed</div>
                  <div>Interviews</div>
                </div>
                <div class="grid text-3xl place-content-end">{completed}</div>
              </div>
            </div>
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
                          <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-auto">
                            <div className="py-4 w-full flex"
                                                              style={{ backgroundColor: "#228276" }}
                                                              >
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

                            <div className="flex my-16 justify-center">
                              <button
                                className=" text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#228276" }}

                                onClick={async () => {
                                  if (smsOTP == otp) {
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
              // <Transition
              //   appear
              //   show={chooseSlot}
              //   as={Fragment}
              //   className="relative z-10 w-full "
              //   style={{ zIndex: 1000 }}
              // >
              //   <Dialog
              //     as="div"
              //     className="relative z-10 w-5/6 "
              //     onClose={() => {}}
              //     static={true}
              //   >
              //     <div
              //       className="fixed inset-0 bg-black/30"
              //       aria-hidden="true"
              //     />
              //     <Transition.Child
              //       as={Fragment}
              //       enter="ease-out duration-300"
              //       enterFrom="opacity-0"
              //       enterTo="opacity-100"
              //       leave="ease-in duration-200"
              //       leaveFrom="opacity-100"
              //       leaveTo="opacity-0"
              //     >
              //       <div className="fixed inset-0 bg-black bg-opacity-25" />
              //     </Transition.Child>

              //     <div className="fixed inset-0 overflow-y-auto ">
              //       <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
              //         <Transition.Child
              //           as={Fragment}
              //           enter="ease-out duration-300"
              //           enterFrom="opacity-0 scale-95"
              //           enterTo="opacity-100 scale-100"
              //           leave="ease-in duration-200"
              //           leaveFrom="opacity-100 scale-100"
              //           leaveTo="opacity-0 scale-95"
              //         >
              //           <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all min-h-[75vh]">
              //             <div className="rounded-lg bg-white w-full">
              //               <div className="flex items-start space-x-3 	">
              //                 <div
              //                   className="py-4 w-full flex"
              //                   style={{ backgroundColor: "#228276" }}
              //                 >
              //                   <p className="text-lg mx-5 text-center text-white font-semibold">
              //                     Schedule an Interview
              //                   </p>
              //                 </div>
              //               </div>

              //               <div className="flex gap-3 mx-16 my-4">
              //                 <div className="w-auto">
              //                   <h2 className="font-semibold">
              //                     Company :{" "}
              //                     {xiInter
              //                       ? "Upgrade To XI"
              //                       : invitation.hiringOrganization}
              //                   </h2>
              //                   <p className="text-xs">
              //                     {xiInter && invitation?.jobTitle}
              //                   </p>
              //                 </div>
              //               </div>

              //               <div className="w-auto h-0.5 rounded-lg bg-gray-100 mx-16"></div>

              //               <div class="grid grid-cols-2 divide-x min-h-[45vh]">
              //                 <div>
              //                   <div className=" items-start space-x-3 	">
              //                     <div className="py-1 my-5 mx-10 ">
              //                       <p className="text-sm font-semibold ml-4">
              //                         <DatePicker
                                    
              //                           minDate={new Date()}
              //                           onChange={setStartTime}
              //                           value={startTime}
              //                           disableClock
              //                         />

              //                       </p>
              //                     </div>
              //                   </div>
                                
              //                 </div>
              //                 <div>
                                
              //                   <div className="mx-7 mt-5">
              //                     <div className="mx-2">
              //                       <label>Avialable slots on : {""}
              //                         <Moment format="D MMM YYYY" withTitle>
              //                           {new Date(startTime)}
              //                         </Moment>
              //                       </label>
              //                       <br />
              //                       <div className="row my-2 gap-2 ">
              //                         {slot &&
              //                           slot.map((item, index) => {
              //                             if (
              //                               new Date(
              //                                 item.startDate
              //                               ).getDate() ===
              //                               new Date(startTime).getDate()
              //                             ) {
              //                               return (
              //                                 <span
              //                                   className={`${
              //                                     slotId &&
              //                                     slotId._id === item._id
              //                                       ? "bg-blue text-white-600"
              //                                       : "bg-white text-gray-600"
              //                                   } border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer`}
              //                                   onClick={async () => {
              //                                     let priority = await priorityEngine(item.startDate,type);
              //                                     setslotId(priority.data.slot);
              //                                     if (priority.status == 200) {
              //                                       let max = 0;
              //                                       let usrId = user?.data?.user?._id;
              //                                       let res = await sendInterviewOTPEmail({userId:usrId});
              //                                       if (res) {
              //                                         if (xiInter) {
              //                                           let userRequestUpdate =
              //                                             await userRequestUpdate(
              //                                               user._id
              //                                             );
              //                                         }
              //                                         setchooseSlot(false);
              //                                         setotpModal(true);
              //                                         setotp(res.otp);
              //                                         setxiInter(false);
              //                                       }
              //                                     }
              //                                   }}
              //                                 >
              //                                   {new Date(
              //                                     item.startDate
              //                                   ).getHours() +
              //                                     ":" +
              //                                     new Date(
              //                                       item.startDate
              //                                     ).getMinutes()}{" "}
              //                                   -{" "}
              //                                   {new Date(
              //                                     item.endDate
              //                                   ).getHours() +
              //                                     ":" +
              //                                     new Date(
              //                                       item.endDate
              //                                     ).getMinutes()}
              //                                 </span>
              //                               );
              //                             }
              //                           })}
              //                       </div>
              //                     </div>
              //                   </div>
                                
                                
              //                 </div>
              //               </div>
              //               <div className="w-auto mx-auto flex justify-center my-3">
              //                     <button
              //                       className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
              //                       onClick={() => {
              //                         setchooseSlot(false);
              //                         setxiInter(false);
              //                       }}
              //                     >
              //                       Close
              //                     </button>
              //                   </div>
              //             </div>
              //           </Dialog.Panel>
              //         </Transition.Child>
              //       </div>
              //     </div>
              //   </Dialog>
              // </Transition>
              
              <SelectSlots handleSlotBooked={handleSlotBooked}  jobId={selectedJobId} userId={user?.data?.user?._id} email={user?.data?.user?.email} jobTitle={invitation?.jobTitle} panelID={invitation?.panelId} company={invitation?.hiringOrganization} chooseSlot={chooseSlot} handleCloseChooseSlot={handleCloseChooseSlot} />
          )}


          <div className="lg:flex">
            <div className="md:w-full md:mx-1 lg:w-5/6 mx-10 sm:w-full md:pr-8">
              <div className="w-full rounded-lg my-4 lg:mx-5 bg-white outline outline-offset-2 outline-2 outline-slate-200		">
                <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                  <div className="">
                    <p className="text-l text-slate-500">
                      Pending Interview Invitations
                    </p>
                  </div>
                  {profileCompleted?
                  <div
                    className="text-xs text-green-600 font-black mt-1 mr-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "/user/interviewInvitations";
                    }}
                  >
                    View All
                  </div>
                  :null}
                </div>
                
                {invitePending.length === 0 && JobInvitationbin.length === 0 ? (
                  <div className="text-center py-5 text-l md:w-4/4">
                    No Interview Invitations
                  </div>
                ) : (
                  <div className="w-full">
                    {invitePending.map((job, index) => {
                      if (job.status && job.status === "Active") {

                        return (
                          <div
                            id={"invcrd" + (index + 1)}
                            className={
                              index < 5
                                ? "w-full px-1 bg-white py-1 border-b"
                                : "w-full px-1 bg-white py-1 border-b hidden"
                            }
                          >
                            <div className="grid grid-row-1  gap-4 md:grid-cols-3 sm:grid-cols-3  my-3 col">
                              <div className="col-span-2">
                                <div className="col-span-2">
                                  <h5 className="text-black-900 text-md font-bold mb-1 ">
                                    {job.jobTitle}
                                    <p className="text-sm font-bold mt-2 text-gray-400 font-semibold">
                                      {job.hiringOrganization}
                                    </p>
                                  </h5>
                                </div>
                                <div className="grid grid-cols-3 grid-flow-col gap-3">
                                  <div className="flex py-1">
                                    <div className="text-md py-1 text-gray-500 font-semibold ">
                                      <CgWorkAlt />
                                    </div>

                                    <p className=" px-1 text-xs text-gray-500 font-semibold mt-1">
                                      {job.jobType}
                                    </p>
                                  </div>
                                  <div className="flex py-1">
                                    <div className="text-md py-1 text-gray-500 font-semibold ">
                                      <HiOutlineLocationMarker />
                                    </div>

                                    <p className=" px-1 text-xs text-gray-500 font-semibold mt-1">
                                      {job.location}
                                    </p>
                                  </div>
                                  
                                  <div className="flex py-1">
                                    <div className="text-md py-1 text-gray-500 font-semibold ">
                                      <BsCashStack />
                                    </div>
                                    <p className=" px-1 text-xs text-gray-500 font-semibold mt-1">
                                      {typeof job.salary === "object"
                                        ?  job.salary[0].symbol + job.salary[1] + " - " + job.salary[0].symbol + job.salary[2]
                                        : job.salary}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="col">

                                <div className="row justify-end ">

                                <div className="flex col-span-2 justify-end">
                                  {profileCompleted?
                                  <a
                                    href={`/user/jobDetails/${job._id}`}
                                    
                                    className="    rounded-lg   px-3  py-2 text-xs font-bold flex items-center text-[#228276] "
                                  >
                                    View Details
                                  </a>
                                  :null}
                                </div>

                                <div className="flex col-span-1 justify-end">
                                  {/* button here */}
                                  {profileCompleted?
                                  <a
                                    onClick={async () => {
                                      
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
                                    style={{ background: "#228276" }}
                                    className="  rounded-lg ml-2  px-3  py-2 text-sm font-bold flex items-center text-white cursor-pointer	"
                                  >
                                    Accept
                                  </a>
                                  :null}
                                </div>

                                
                                </div>

                                <div className="row justify-end ">
                                <div className="flex py-1 justify-end mt-2">
                                    

                                  <p className=" px-1 text-xs text-gray-400 font-bold mt-2">
                                  Expiring On :
                                    </p>
                                    <p className=" px-1 text-xs text-gray-600 font-bold mt-2">
                                       {
                                      
                                      new Date(job.validTill).toLocaleDateString('en-us', { weekday:"long", month:"long", day:"numeric"}) 

                                      } 
                                    </p>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                    {JobInvitationbin.map((job, index) => {
                      if (1) {
                        return (
                          <div
                            id={"invcrd" + (index + 1)}
                            className={
                              index < 5
                                ? "w-full px-5 bg-white py-1 border border-b"
                                : "w-full px-5 bg-white py-1 border border-b hidden"
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

                                  <p className="px-4 text-sm text-gray-400 font-semibold">
                                    {typeof job.salary === "object"
                                      ? job.salary[2]
                                      : job.salary}
                                  </p>
                                </div>
                              </div>
                              <div className="flex col-span-2">
                                {/* button here */}
                                <a
                                  href={`/user/jobDetails/${job._id}`}
                                  style={{ background: "#3ED3C5" }}
                                  className="  rounded-lg my-2  px-3 mx-2 py-1 text-sm font-bold flex items-center text-white"
                                >
                                  View Details
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="sm:w-full md:w-full md:mx-1 lg:w-2/6 my-4 lg:mr-7 ">
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
                          <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                            <div className={`${!modal ? "hidden" : "block"}`}>
                              <div className="w-full">
                                <div className="w-full my-5">
                                  <img src={logo} width="100" />
                                  <h3 className="my-5">
                                    Enter the number of credit you want to
                                    purchase
                                  </h3>
                                  <input
                                    id="amount"
                                    name="amount"
                                    className="block border border-gray-200 my-4 py-1 px-3 w-full"
                                    onChange={async (event) => {
                                      setAmount(event.target.value);
                                    }}
                                    min={1}
                                    onKeyPress={(e) => {
                                      if (
                                        e.key === "-" ||
                                        e.key === "+" ||
                                        (e.target.value === "" &&
                                          e.key === "0") ||
                                        e.key === "e" ||
                                        e.key === "." ||
                                        e.key === "," ||
                                        e.key === "E" ||
                                        e.key === " " ||
                                        e.key === "Enter" ||
                                        e.key === "Backspace" ||
                                        e.key === "Delete" ||
                                        e.key === "ArrowLeft" ||
                                        e.key === "ArrowRight" ||
                                        e.key === "ArrowUp" ||
                                        e.key === "ArrowDown"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                  ></input>
                                  <div className="" style={{ display: "flex" }}>
                                    <button
                                      className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                      style={{ backgroundColor: "#034488" }}
                                      onClick={() => {
                                        displayRazorpay(amount);
                                      }}
                                    >
                                      Buy
                                    </button>
                                    <button
                                      className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                      style={{ backgroundColor: "#034488" }}
                                      onClick={() => {
                                        setModal(false);
                                      }}
                                    >
                                      Close
                                    </button>
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
              {/* <div className=" py-2 bg-white w-full rounded-lg mb-4 outline outline-offset-2 outline-2 outline-slate-200">
                <div className="w-full rounded-lg  bg-white">
                  <div className="pb-3 ">
                    <p className="text-l text-left border-b border-gray-200 pb-2">
                      <p className="text-left text-l text-slate-500 font-semibold pl-3 ">
                        Wallet Credit
                      </p>
                    </p>
                    <div className="flex flex-col items-center">
                      <p className="text-3xl my-3">{currentCredit}</p>
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs flex text-center rounded-lg"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <p className="py-1">Buy Credits</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className=" py-2 bg-white w-full rounded-lg mb-4 outline outline-offset-2 outline-2 outline-slate-200">
                <div className="">
                  <div className="">
                    <p className="text-l text-left border-b border-gray-200 pb-2 ">
                      <p className="text-left text-l text-slate-500 font-semibold pl-3">
                        {/* Scheduled Interviews */}
                        All Interviews
                      </p>
                    </p>
                  </div>
                </div>
                {interviews.length === 0 ? (
                  <>
                    <h5 className="text-center py-5 text-l md:w-4/4">
                      No Interviews Found
                    </h5>
                  </>
                ) : (
                  <>
                    {interviews.map((interview, index) => {
                      if (
                        interview &&
                        interview?.status === "Accepted" &&
                        index <= 5
                      ) {
                        return (
                          <div className="w-full bg-white py-3 border-b px-3 ">
                            <h5 className="text-l mb-1">
                              <strong>{interview?.job[0]?.jobTitle}</strong>
                            </h5>
                            <h5 className="text-sm text-slate-600	">
                              {interview?.job[0]?.hiringOrganization}
                            </h5>
                            {profileCompleted ? 
                            <a
                              href={`/user/interviewDetails/${interview._id}`}
                              className="text-green-600 text-xs  "
                            >
                              View Details
                            </a>
                            :null}
                          </div>
                        );
                      }
                    })}
                    {profileCompleted?
                    <div className="text-right px-6 mt-2">
                      <a
                        href={`/user/interviews`}
                        className="text-green-600 text-sm"
                      >
                        View More
                      </a>
                    </div>
                    :null}
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

export default Panel;
