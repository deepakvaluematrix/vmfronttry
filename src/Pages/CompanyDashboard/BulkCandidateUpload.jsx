import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Papa from "papaparse";
import Swal from "sweetalert2";
import swal from "sweetalert";
import { addCandidateInfoBulk } from "../../service/api";
import { useNavigate } from "react-router";

const  BulkCandidateUpload = (props) => {
    const [modal, setModal] = React.useState(true);
    const [acceptedData, setAcceptedData] = React.useState([]);
    const [rejectedData, setRejectedData] = React.useState([]);
    const [processedCount, setProcessedCount] = React.useState(0);
    const [toSubmitData, setToSubmitData] = React.useState([]);


    const downloadBlankCsvTemplate = () => {
        const csvContent = "FirstName,LastName,Email,Contact,Address\n"; // CSV header
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "add_candidate_bulk_template.csv";
        link.click();
    };

    const handleFileUpload = (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                Papa.parse(file, {
                    complete: (result) => {
                        const newAcceptedData = [];
                        const newRejectedData = [];
                        const toSubmitData = [];
                        const processedIdentifiers = new Set(); // Set to store unique identifiers

                        props?.invitedCandidates?.forEach((dupRow) => {
                            let data = {
                                FirstName : dupRow.firstName,
                                LastName : dupRow.lastName,
                                Contact : dupRow.phoneNo,
                                Address : dupRow.address,
                                Email : dupRow.email,
                            }
                            const uniqueIdentifier = `${data.FirstName}${data.LastName}${data.Email}${data.Contact}`;
                            processedIdentifiers.add(uniqueIdentifier);
                            newAcceptedData.push(data);
                        });

                        // Add data from props.candidateDataDup to processedIdentifiers
                        props?.candidateDataDup?.forEach((dupRow) => {
                            let data = {
                                FirstName : dupRow.firstName,
                                LastName : dupRow.lastName,
                                Contact : dupRow.phoneNo,
                                Address : dupRow.address,
                                Email : dupRow.email,
                            }
                            const uniqueIdentifier = `${data.FirstName}${data.LastName}${data.Email}${data.Contact}`;
                            processedIdentifiers.add(uniqueIdentifier);
                            newAcceptedData.push(data);
                        });
                        result?.data?.forEach((row, index) => {
                            const { FirstName, LastName, Email, Contact, Address } = row;
                            // Create a unique identifier for the row based on the data fields
                            const uniqueIdentifier = `${FirstName}${LastName}${Email}${Contact}`;
                            if (processedIdentifiers.has(uniqueIdentifier)) {
                                // If the identifier already exists, reject the row as a duplicate
                                const rejectionReasons = ["Duplicate Record"];
                                newRejectedData.push({ ...row, rejectionReasons });
                            } else {
                                // Perform your validation checks here
                                const isValidFirstName = /^[A-Za-z\s]*$/.test(FirstName); // Allow letters and spaces
                                const isValidLastName = /^[A-Za-z\s]*$/.test(LastName);   // Allow letters and spaces
                                const isValidEmail = /\S+@\S+\.\S+/.test(Email);
                                const isValidContact = /^[0-9]{10}$/.test(Contact); // Validate as a 10-digit phone number
                                const isValidAddress = Address?.trim() !== '';
    
                                if (
                                    isValidFirstName &&
                                    isValidLastName &&
                                    isValidEmail &&
                                    isValidContact
                                    // isValidAddress
                                ) {
                                    newAcceptedData.push(row);
                                    toSubmitData.push(row);
                                    processedIdentifiers.add(uniqueIdentifier); // Add identifier to processed set
                                } else {
                                    const rejectionReasons = [];
                                    if (!isValidFirstName) rejectionReasons.push("Invalid FirstName");
                                    if (!isValidLastName) rejectionReasons.push("Invalid LastName");
                                    if (!isValidEmail) rejectionReasons.push("Invalid Email");
                                    if (!isValidContact) rejectionReasons.push("Invalid Contact");
                                    // if (!isValidAddress) rejectionReasons.push("Invalid Address");
                                    //rejectionReasons.push("Duplicate Record"); // Add "Duplicate Record" to rejection reasons
                                    newRejectedData.push({ ...row, rejectionReasons });
                                }
                            }
                        });
                        const processedCount = newAcceptedData.length + newRejectedData.length;
                        setProcessedCount(processedCount);
                        setAcceptedData(newAcceptedData);
                        setRejectedData(newRejectedData);
                        setToSubmitData(toSubmitData);
                    },
                    header: true, // If the first row contains headers
                    skipEmptyLines: true,
                });
    
                // Reset the value of the input to allow for the same file to trigger onChange again
                event.target.value = null;
            }
        } catch (err) {
            //console.error("Error while handling file upload:", err);
        }
    };

    const resetData = () => {
        if (acceptedData.length > 0 || rejectedData.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">This action would remove all the data from the table</div></div>',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Confirm",
                customClass: {
                  popup: 'swal-wide',
                  icon: 'icon-class'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    setAcceptedData([]);
                    setRejectedData([]);
                    setProcessedCount(0);
                }
            });
        }
    };

    const submitCandidates = async() =>{
        if (props?.id && props?.companyId) {
            Swal.fire({
                title: "Add candidates",
                html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Candidates details without issues would be added.</div></div>',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Confirm",
                customClass: {
                  popup: 'swal-wide',
                  icon: 'icon-class'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let resp = await addCandidateInfoBulk(toSubmitData,props.id,props.companyId);
                    if(resp){
                        props.updateFlag(false);
                        props.updateCandidates(resp?.data?.respNames);
                    }else{
                        swal({
                            icon: "error",
                            title: "Something went wrong",
                            text: "Please contact support@valuematrix.ai", 
                            button: "Ok",
                        });
                    }
                }
            });
        }else{
            swal({
                icon: "error",
                title: "Job id or company id not found",
                text: "Please contact support@valuematrix.ai", 
                button: "Continue",
              });
        }
    }   
    
    return (
        <div>
            {modal && (
                <Transition appear show={modal} as={Fragment} style={{zIndex:999}}>
                    <Dialog
                        as="div"
                        className="relative z-10 w-[80%] mx-auto"
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
                                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[90vh]">
                                        <div className={` ${!modal ? "hidden" : "block"} h-full`}>
                                            <div className="w-full h-full">
                                                <div className="">
                                                    <div className="my-6 px-4 w-3/4 md:w-full text-left flex justify-between">
                                                        <div className="mt-auto mb-auto">
                                                            <h2 className="font-semibold text-[#333333]">Add candidates in bulk</h2>
                                                            (Click <a href="#" onClick={downloadBlankCsvTemplate}> here </a> to download template)
                                                        </div>
                                                        {processedCount>0 ? 
                                                        <div className="mt-auto mb-auto">
                                                            <label className="hover:bg-[#93c47d] focus:outline-none bg-[#93c47d] rounded-xl px-4 py-2 text-black focus:outline-none rounded-2xl font-bold cursor-pointer">
                                                                {processedCount}
                                                            </label>
                                                        </div>
                                                        :null}
                                                    </div>
                                                    <div className="max-h-[400px] overflow-y-auto">
                                                        <table className="w-full border border-collapse">
                                                            <thead className="text-white" style={{ backgroundColor: "#228276" }}>
                                                                <tr className="font-bold">
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left" align="center">
                                                                        #
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        First name
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        Last name
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        Email
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        Contact
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        Address
                                                                    </th>
                                                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                                                        Issues
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="max-h-[500px] overflow-y-auto">
                                                                    {acceptedData.map((row, index) => (
                                                                        <tr key={index} className="text-black border">
                                                                            <td className="text-sm px-6 py-4 text-left" >{index + 1}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">{row.FirstName}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">{row.LastName}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">{row.Email}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">{row.Contact}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">{row.Address}</td>
                                                                            <td className="text-sm px-6 py-4 text-left"></td> {/* Empty cell for accepted data */}
                                                                        </tr>
                                                                    ))}

                                                                {/* Grey ribbon as a separator
                                                                {acceptedData.length > 0 && rejectedData.length > 0 && (
                                                                        <tr>
                                                                            <td colSpan="8" className="bg-gray-300 py-3"></td>
                                                                        </tr>
                                                                    )} */}

                                                                    {rejectedData.map((row, index) => (
                                                                        <tr key={index} className="border">
                                                                            <td className="text-sm px-6 py-4 text-left">{acceptedData.length + index + 1}</td> {/* Increment the counter based on accepted data length */}
                                                                            <td className={row.rejectionReasons.includes("Invalid FirstName") ? "text-red-700 font-semibold text-sm px-6 py-4 text-left" : "text-sm px-6 py-4 text-left"} align="center">{row.FirstName}</td>
                                                                            <td className={row.rejectionReasons.includes("Invalid LastName") ? "text-red-700 font-semibold text-sm px-6 py-4 text-left" : "text-sm px-6 py-4 text-left"}>{row.LastName}</td>
                                                                            <td className={row.rejectionReasons.includes("Invalid Email") ? "text-red-700 font-semibold text-sm px-6 py-4 text-left" : "text-sm px-6 py-4 text-left"}>{row.Email}</td>
                                                                            <td className={row.rejectionReasons.includes("Invalid Contact") ? "text-red-700 font-semibold text-sm px-6 py-4 text-left" : "text-sm px-6 py-4 text-left"}>{row.Contact}</td>
                                                                            <td className={row.rejectionReasons.includes("Invalid Address") ? "text-red-700 font-semibold text-sm px-6 py-4 text-left" : ""}>{row.Address}</td>
                                                                            <td className="text-sm px-6 py-4 text-left">
                                                                                {row.rejectionReasons.map((reason, i) => (
                                                                                    <div key={i}>{reason}</div>
                                                                                ))}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>   
                                                        </table>                                                    
                                                    </div>
                                                    <div className="w-full my-4 flex justify-start mx-4 gap-6">
                                                       <label className="hover:bg-[#93c47d] focus:outline-none bg-[#93c47d] rounded-xl px-4 py-2 text-black focus:outline-none rounded-2xl font-bold cursor-pointer">
                                                            Upload
                                                            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload}/>
                                                        </label>
                                                        {(acceptedData.length > 0 || rejectedData.length > 0) && (
                                                            <label className="hover:bg-[#f02718] focus:outline-none bg-[#f02718] rounded-xl px-4 py-2 text-white focus:outline-none rounded-2xl font-bold cursor-pointer" onClick={resetData}>
                                                                Reset
                                                            </label>
                                                        )}
                                                        <label className="hover:bg-[#bcbcbc] focus:outline-none bg-[#bcbcbc] rounded-xl px-4 py-2 text-black focus:outline-none rounded-2xl font-bold cursor-pointer"  onClick={() => {props.updateFlag(false)}} >
                                                            Cancel
                                                        </label>
                                                        {(toSubmitData.length > 0) && (
                                                        <label className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-xl px-4 py-2 text-white focus:outline-none rounded-2xl font-bold cursor-pointer"  onClick={submitCandidates}>
                                                             Submit
                                                        </label>
                                                        )}

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
};

export default BulkCandidateUpload;
