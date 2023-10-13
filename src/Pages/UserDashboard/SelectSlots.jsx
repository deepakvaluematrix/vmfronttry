import { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import Moment from "react-moment";
import moment from "moment";
import { acceptInvitation, getSlotByDate } from "../../service/slotService";
import Switch from 'react-switch';
import { ThreeDots } from 'react-loader-spinner';
import EmailOTP from "./EmailOTP";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { sendInterviewOTPEmail } from "../../service/api";

const SelectSlots = (props) => {
  const [loading, setLoading] = useState(false);
  // for otp sending
  const [otpLoading, setOTPLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(Date.now);
  const [dateList, setDateList] = useState([]);
  let [slots, setSlots] = useState(null);
  const currentDate = moment();
  const endDate = moment().add(2, "days");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAM, setShowAM] = useState(true); // State variable to track the slider input
  const [showOTP, setShowOTP] = useState(false); 
  const [verifiedOTP, setVerifiedOTP] = useState(false); 
  const navigate = useNavigate();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const [sendOTP, setSendOTP] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [otp, setOTP] = useState(null);
  const [userOTP, setUserOTP] = useState(null);


    // Function to toggle between "AM" and "PM" slots
    const toggleAM = () => {
        setSelectedItem(null);
        setShowAM(!showAM);
    };

    // Filter slots based on the slider input
    const filteredSlots = slots?.filter((slot) => {
        const startDate = new Date(slot.startDate);
        // Convert to local time string
        const localTime = startDate.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        // Check if it's in the AM (morning) or PM (afternoon/evening)
        const isAM = localTime.includes('AM');
        return showAM ? isAM : !isAM;    
    });

  const handleClick = (index) => {
    setSelectedItem(index);
    setShowOTP(false);
    setOTPLoading(false);
    setSeconds(120);
    setIsRunning(false);
  };

  const handleBooking = async ()=>{
    setShowOTP(true);
    setShowResend(false);
    sendEmailOTP();
  }

  const handleResendClick = async () => {
    // Handle resend logic here
    let resp = await sendInterviewOTPEmail({ userId: props.userId });
    setSeconds(120);
    setIsRunning(false);
    setOTPLoading(true);
    if (resp && resp?.otp) {
      setIsRunning(true);
      setSendOTP(true);
      setOTP(resp?.otp);
      setOTPLoading(false); // Set loading to false once the request is complete  
    } else {
      swal({
        title: "Error",
        text: "Something went wrong. Check if the email is right.",
        icon: "error",
        button: "Ok",
      }).then(() => {
        props.handleCloseChooseSlot(false);
      });
    }
  };

  const sendEmailOTP = async () => {
    // initiate the email otp
    let resp = await sendInterviewOTPEmail({ userId: props.userId });
    setSeconds(120);
    setIsRunning(false);
    if (resp && resp?.otp) {
      setOTP(resp?.otp);
      setIsRunning(true);
      setSendOTP(true);
      setOTPLoading(false); // Set loading to false once the request is complete  
    } else {
      swal({
        title: "Error",
        text: "Something went wrong. Check if the email address is valid.",
        icon: "error",
        button: "Ok",
      }).then(() => {
        props.handleCloseChooseSlot(false);
      });
    }
  };

  const handleSubmitClick = async () => {
    // Handle submit logic here
    if (userOTP && otp && userOTP === otp) {
      handleVerifiedEmailOTP();
    } else {
      swal({
        title: "Error",
        text: "Invalid verification code.",
        icon: "error",
        button: "Ok",
      });
    }
  };

  useEffect(() => {
    const initial = async () => {
      const dates = new Set(); 
      while (currentDate.isBefore(endDate)) {
        dates.add(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, "day");
      }
      dates.add(endDate.format("YYYY-MM-DD"));
      const uniqueDates = Array.from(dates); 
      setDateList(uniqueDates);
      // get the slots for today's date
      handleGetSlotForDate(uniqueDates[0]);
    };

    initial();
  }, []);

  useEffect(() => {
  }, [slots,selectedItem,showOTP,otpLoading,sendOTP]);

  useEffect(() => {
    let intervalId;
    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      setShowResend(true);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, seconds]);

  const handleVerifiedEmailOTP = async() =>{
    setVerifiedOTP(true);
    setShowOTP(false);
    if(filteredSlots && filteredSlots[selectedItem] && 
        filteredSlots[selectedItem]?.slotId && filteredSlots[selectedItem]?.createdBy){
        //(userId,slotId,interviewer,jobId)
        let resp = await acceptInvitation(props.userId,filteredSlots[selectedItem]?.slotId,filteredSlots[selectedItem]?.createdBy,props.jobId);
        if(resp){
            window.location.reload();
        }else{
            swal({
                title: "Error",
                text: "Something went wrong. Please try after some time.",
                icon: "error",
                button: "Ok",
            });
        }
    }
  }

  const handleOTP = (e) => {
    setUserOTP(e.target.value);
  };


  const handleGetSlotForDate = async(date) =>{
    setLoading(true);
    setSelectedItem(null);
    setSelectedDate(date);
    setSlots(null);
    setShowOTP(false);
    setOTPLoading(false);
    setSeconds(120);
    setIsRunning(false);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // pass the panel id, selected date, current date and timezone.
    let slotResp = await getSlotByDate(props.panelID,new Date(date),new Date(Date.now()).toISOString(),timeZone);
    if(slotResp && slotResp?.data && slotResp?.data?.data){
        //setSlots(slotResp?.data?.data);
        // Create an object to keep track of seen combinations
        const seenCombinations = {};

        // Filter the JSON array to remove duplicates
        const uniqueSlots = slotResp?.data?.data.filter((slot) => {
        const key = `${slot.startDate}-${slot.endDate}`;

            // If the combination is not seen, mark it as seen and keep it in the result
            if (!seenCombinations[key]) {
                seenCombinations[key] = true;
                return true;
            }

            // If the combination is seen before, discard it
            return false;
         });
        if(uniqueSlots){
            setSlots(uniqueSlots);
        }
    }else{
        setSlots(null);
    }
    setLoading(false);
  }

    // Format the remaining seconds as "MM:SS".
    const formattedTime = `${String(Math.floor(seconds / 60)).padStart( 2,"0")}:${String(seconds % 60).padStart(2, "0")}`;
        
    return (
        <>
        {/* { showOTP ?
            <EmailOTP email={props.email} showOTP={showOTP} userId={props.userId} handleCloseEmailOTP={handleCloseEmailOTP} handleVerifiedEmailOTP={handleVerifiedEmailOTP} 
            emailOTPInputRef={emailOTPInputRef}/>
        :null
        } */}
        <Transition appear show={props.chooseSlot} as={Fragment} className="relative z-10 w-full " style={{ zIndex: 1000 }}>
            <Dialog as="div" className="relative z-10 w-5/6 " onClose={() => { }} static={true}>
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
                    <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all min-h-[75vh]">
                                <div className="rounded-lg bg-white w-full">
                                    <div className="flex items-start space-x-3 	">
                                        <div
                                            className="py-4 w-full flex"
                                            style={{ backgroundColor: "#228276" }}
                                        >
                                            <p className="text-lg mx-5 text-center text-white font-semibold">
                                                Schedule an Interview
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mx-16 my-4">
                                        <div className="w-auto">
                                            <h2 className="font-semibold">
                                                {props.jobTitle} 
                                            </h2>
                                            <p>
                                                {props.company}
                                            </p>
                                        </div>
                                        <div>
                                            <label>
                                                <b>PM {" "}</b>
                                                    <Switch onChange={toggleAM} checked={showAM} className="react-switch" uncheckedIcon={false} checkedIcon={false} handleDiameter={24} height={30}  width={60}/> 
                                                <b>{" "} AM</b>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w-auto h-0.5 rounded-lg bg-gray-400 mx-16"></div>

                                    <div className="grid grid-cols-2 divide-x min-h-[40vh]">
                                        <div className="flex flex-col items-center justify-center">
                                            {dateList.map((date) => (
                                            <div key={date} className="my-2">
                                                <button className="text-white px-8 py-2 rounded" style={{ backgroundColor: "#228276" }}
                                                onClick={()=>{handleGetSlotForDate(date)}}>
                                                {date}
                                                </button>
                                            </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="mx-7 mt-5">
                                            <div>

                                                <div className="mx-2">
                                                    <label>
                                                    Available slots for{" "}
                                                    <b>
                                                        <Moment format="D MMM YYYY" withTitle>
                                                        {new Date(selectedDate)}
                                                        </Moment>
                                                    </b>
                                                    </label>
                                                    <br />
                                                    {!loading ?
                                                    <>
                                                        {filteredSlots?.length > 0 ? (
                                                        <div className="row my-2 gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                            {filteredSlots.map((slot, index) => {
                                                            const startDate = new Date(slot.startDate);
                                                            const endDate = new Date(slot.endDate);

                                                            const formatTime = (date) => {
                                                                const hours = date.getHours();
                                                                const minutes = date.getMinutes();
                                                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                                                const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                                                                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                                                                return `${formattedHours}:${formattedMinutes} ${ampm}`;
                                                            };

                                                            return (
                                                                <span
                                                                key={index}
                                                                style={{
                                                                    borderRadius: '5px',
                                                                    backgroundColor: selectedItem === index ? '#228276' : 'lightgrey',
                                                                    color: selectedItem === index ? 'white' : 'black',
                                                                    padding: '5px 10px',
                                                                    cursor: 'pointer',
                                                                    margin: '5px',
                                                                }}
                                                                onClick={() => handleClick(index)}
                                                                >
                                                                {formatTime(startDate)} - {formatTime(endDate)}
                                                                </span>
                                                            );
                                                            })}
                                                        </div>
                                                        ) : (
                                                        <div>
                                                            <b>No slots available</b>
                                                        </div>
                                                        )}
                                                    </>
                                                    :
                                                    <ThreeDots height="100" width="100" radius="12" color="#4fa94d"  ariaLabel="three-dots-loading"
                                                    wrapperStyle={{}} wrapperClassName="" visible={true} />
        
                                                    }
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="w-auto h-0.5 rounded-lg bg-gray-400 mx-16"></div>
                                        <br/>
                                        {showOTP  && (
                                            <div className="grid grid-cols-2 min-h-[10vh]">
                                                <div className="flex flex-col items-center justify-left">
                                                        Please enter the code sent to <b>{props.email}</b>
                                                </div>
                                                { otpLoading &&
                                                <div className="mx-2">
                                                    <ThreeDots height="100" width="100" radius="12" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true}/>
                                                </div>
                                                }
                                                {!otpLoading &&
                                                <div className="mx-2">
                                                  <input id="emailOTP" type="text" name="emailOTP" onChange={handleOTP} placeholder="Enter verification code here" 
                                                        style={{
                                                            borderRadius: "12px",
                                                            marginTop: "5px",
                                                            }}
                                                        />
                                                    {isRunning && sendOTP?
                                                    <span style={{
                                                    border: "0px solid lightgreen",
                                                    color: "maroon",
                                                    padding: "4px",
                                                    }}
                                                        >{"  "}
                                                        {formattedTime}
                                                    </span>
                                                    :
                                                   null}
                                                  {showResend && !isRunning ? (  
                                                    <button
                                                        type="button"
                                                        className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-sm text-center px-2 py-1 cursor-pointer"
                                                        style={{ backgroundColor: "#228276" }}
                                                        onClick={handleResendClick}
                                                    >
                                                        Resend
                                                    </button>
                                                    ) : null}
                                                 </div>
                                                }
                                            </div>
                                        )}
                                    <div className="w-auto mx-auto flex justify-center my-3">
                                        <button
                                            className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                            onClick={() => {
                                                props.handleCloseChooseSlot(false);
                                            }}
                                        >
                                            Close
                                        </button>
                                        {selectedItem !== null && !showOTP?
                                        (
                                        <button className="text-white font-bold px-8 py-2 rounded border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                            style={{ backgroundColor: "#228276" }}
                                            onClick={() => {handleBooking()}}>
                                            Book
                                        </button>
                                        )
                                        :
                                        null
                                        }
                                        {selectedItem !== null && showOTP && !otpLoading?
                                        (
                                        <button
                                            className="text-white font-bold px-8 py-2 rounded border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                            style={{ backgroundColor: "#228276" }}
                                            onClick={handleSubmitClick}
                                          >
                                            Verify code
                                        </button>
                                                          )
                                        :
                                        null
                                        }
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    );

}

export default SelectSlots;