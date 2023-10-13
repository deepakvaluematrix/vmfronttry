import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "tw-elements";
import ProgressBar from "@ramonak/react-progress-bar";
import imagePath from "../assets/images/interviewPanelTestImg.json";

const InterviewPanelTesting = (props) => {
  const [isOpen, setisOpen] = useState(props.isOpen);
  const [progressRange, setProgressRange] = useState(0);

  useEffect(() => {
    props.testProcess(imagePath.path);
    setProgressRange(99);
    if(props.progress == 100) {
      setProgressRange(100);
    }
  },[props.progress])

  
  return (
    <>
      <Transition appear show={isOpen} as={Fragment} className="relative z-50 w-full">
        <Dialog
          as="div"
          className="relative z-120  w-5/6"
          onClose={() => {}}
          static={true}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center max-w-md mx-auto">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full  transform overflow-hidden rounded-2xl p-6 text-left align-middle transition-all"
                >
                  <ProgressBar bgColor="#046458" completed={progressRange}/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InterviewPanelTesting;
