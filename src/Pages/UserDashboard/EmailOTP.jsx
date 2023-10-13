import { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { sendInterviewOTPEmail } from "../../service/api";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";

const EmailOTP = (props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const [sendOTP, setSendOTP] = useState(false);
  const [otp, setOTP] = useState(null);
  const [userOTP, setUserOTP] = useState(null);
  const [loading, setLoading] = useState(true); // Initially set to true
  // Create a ref to the input element
  const inputRef = useRef(null);

  const handleResendClick = async () => {
    // Handle resend logic here
    setLoading(true); // Set loading to true when resend is clicked
    let resp = await sendInterviewOTPEmail({ userId: props.userId });
    setLoading(false); // Set loading to false once the request is complete
    setSeconds(120);
    setIsRunning(false);
    if (resp && resp?.otp) {
      setIsRunning(true);
      setSendOTP(true);
      setOTP(resp?.otp);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong. Check if the email is right.",
        icon: "error",
        button: "Ok",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const handleOTP = (e) => {
    setUserOTP(e.target.value);
  };

  const handleSubmitClick = async () => {
    // Handle submit logic here
    if (userOTP && otp && userOTP === otp) {
      props.handleVerifiedEmailOTP();
    } else {
      swal({
        title: "Error",
        text: "Invalid verification code.",
        icon: "error",
        button: "Ok",
      });
    }
  };

  const handleCloseClick = () => {
    props.handleCloseEmailOTP();
  };

  useEffect(() => {
    const initial = async () => {
      setLoading(true);
      // initiate the email otp
      let resp = await sendInterviewOTPEmail({ userId: props.userId });
      setSeconds(120);
      setIsRunning(false);
      if (resp && resp?.otp) {
        setOTP(resp?.otp);
        setSendOTP(true);
        setIsRunning(true);
      } else {
        swal({
          title: "Error",
          text: "Something went wrong. Check if the email address is valid.",
          icon: "error",
          button: "Ok",
        }).then(() => {
          handleCloseClick();
        });
      }
      setLoading(false); // Set loading to false once the request is complete
      // Set focus on the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    initial();
  }, [props.userId]); // Include props.userId as a dependency if it's used in the effect

  useEffect(() => {
    let intervalId;
    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, seconds]);

  // Format the remaining seconds as "MM:SS".
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(
    2,
    "0"
  )}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <Transition
        appear
        show={props.showOTP}
        as={Fragment}
        className="relative z-10 w-full "
        style={{ zIndex: 1000 }}
      >
        <Dialog
          as="div"
          className="relative z-10 w-5/6 "
          onClose={handleCloseClick}
          static={true}
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Dialog content */}
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

          {/* Dialog panel */}
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
                  {/* Header */}
                  <div
                    className="py-4 w-full flex"
                    style={{ backgroundColor: "#228276" }}
                  >
                    <p className="text-lg mx-5 text-center text-white font-semibold">
                      Code verification
                    </p>
                  </div>
                  {/* Code input */}
                  <div className="my-4 " />
                  {/* OTP input and Resend button */}
                  {loading ? (
                    <div className="flex my-16 justify-center">
                      <ThreeDots
                        height="100"
                        width="100"
                        radius="12"
                        color="#4fa94d"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mx-56">
                        <h2 className="mx-auto w-fit">
                          Please enter the code sent to <b>{props.email}</b>
                        </h2>
                        <div className="flex items-center mt-3">
                          <input
                            id="emailOTP"
                            type="text"
                            name="emailOTP"
                            onChange={handleOTP}
                            placeholder="Enter verification code here"
                            className="w-full mr-2"
                            style={{
                              borderRadius: "12px",
                              marginTop: "5px",
                            }}
                            ref={props.emailOTPInputRef}
                          />
                          <span
                            style={{
                              border: "1px solid lightgreen",
                              color: "maroon",
                              padding: "4px",
                            }}
                          >
                            {formattedTime}
                          </span>
                        </div>
                        {sendOTP && !isRunning ? (
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
                      <div className="flex my-16 justify-center">
                        <button
                          className="text-white font-bold px-8 py-2 rounded border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                          style={{ backgroundColor: "#228276" }}
                          onClick={handleSubmitClick}
                        >
                          Submit
                        </button>
                        <button
                          className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                          onClick={handleCloseClick}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EmailOTP;
