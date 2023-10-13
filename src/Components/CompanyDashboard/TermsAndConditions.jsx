import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import data from "../../Components/Login/termsAndConditions.json";
import { LogoutAPI, acceptTermsAndConditions } from "../../service/api";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";

const TermsAndConditions = () => {
    const [modal, setModal] = React.useState(true);
    const [expandButton, setExpandButton] = React.useState(false);
    const [expandButtonIndex, setExpandButtonIndex] = React.useState(null);

    const Logout = async () => {
		let user = await getStorage("user");
		user = JSON.parse(user);
		let res = await LogoutAPI(user._id);
		await ls.set("user", null);
		await ls.set("access_token", null);
		window.location.href = "/login";
	};

    const handleTermsAndConditionsAccept = async () => {
        let user = await getStorage("user");
		user = JSON.parse(user);
        let data = {"id": user._id}
        let res = await acceptTermsAndConditions(data);
    }
  
    return (
        <div className="px-7 pt-5  lg:p-7 mx-[100px] lg:mx-[30px]">
            {modal && (
                <Transition
                    appear
                    show={modal}
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
                            <div className="flex min-h-full items-center justify-center p-4 text-center max-w-6xl m-auto">
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
                                        <div className={`${!modal ? "hidden" : "block"} h-full`}>
                                            <div className="w-full h-full">
                                                <div className="w-full h-full">
                                                    <div className="">
                                                        <div className="my-6 px-4 w-3/4 md:w-full text-left flex justify-between">
                                                            <div className="mt-auto mb-auto">
                                                                <p className="font-semibold text-[#333333]">Terms of services</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-[77vh] overflow-y-scroll">
                                                        {data.map((details, index) => {
                                                            return (
                                                                <div className="w-full bg-[#FFFFFF] flex flex-col justify-between"
                                                                    onClick={() => {
                                                                        setExpandButton(!expandButton);
                                                                        setExpandButtonIndex(index);
                                                                    }}
                                                                >
                                                                    <div className="flex flex-row justify-between hover:border-b cursor-pointer px-4  py-3 hover:shadow ">
                                                                        <div className="mt-auto mb-auto">
                                                                            <p >{details.title}</p>
                                                                        </div>
                                                                        <span >
                                                                            {expandButton===true && expandButtonIndex === index ? (
                                                                                <>
                                                                                    <AiOutlineUp />
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <AiOutlineDown />
                                                                                </>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {expandButton===true && expandButtonIndex === index ? (
                                                                        <>
                                                                            <div className="overflow-x-auto py-3 px-4 bg-[#FAFAFA]">
                                                                                <p>{data[expandButtonIndex].descrption.split("\n").map(item=><div>{item}</div>)}</p>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>  
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="w-full my-4 flex justify-start mx-4 gap-6">
                                                        <button className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-xl px-4 py-2 text-white focus:outline-none rounded-2xl font-bold" 
                                                            onClick={() => {
                                                                setModal(false);
                                                                handleTermsAndConditionsAccept();
                                                            }}
                                                        >
                                                            Accept and continue
                                                        </button>
                                                        <button
                                                            className="bg-[unset] text-[#D6615A] rounded px-4 py-2 focus:outline-none font-bold"
                                                            onClick={() => {
                                                                Logout();
                                                            }}
                                                        >
                                                            Decline
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
        </div>
    )
}

export default TermsAndConditions;