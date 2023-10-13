import React, { useState, Fragment, useEffect } from "react";
import JobCard from "../../Components/CompanyDashboard/CandidateCard.jsx";
import {
	getCandidateList,
	addCandidate,
	deleteCandidate,
	eligibleJobsForCandidate,
	sendJobInvitations,
	sendInvitation,
	getCandidateListofCompany,
	addCandidateInfo,
} from "../../service/api.js";
import {
	HiOutlineLocationMarker,
	HiOutlineCurrencyDollar,
	HiOutlineCalendar,
	HiOutlinePlay,
} from "react-icons/hi";
import swal from "sweetalert";
import ls from 'localstorage-slim';
import { CSVLink } from "react-csv";
import * as xlsx from "xlsx/xlsx.mjs";
import { ImCross } from "react-icons/im";
import { BarLoader } from "react-spinners";
import { CgWorkAlt } from "react-icons/cg";
import { Oval } from "react-loader-spinner";
import { Popover } from "@headlessui/react";
import SupportTable from "./SupportTable.jsx";
import { HiOutlineUser } from "react-icons/hi";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../assets/images/loader.gif";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FilterCompany } from "../../service/api.js";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { getStorage } from "../../service/storageService";
import { Formik, Field, Form, ErrorMessage } from "formik";

const JobList = (props) => {
	const [jobs, setJobs] = React.useState([]);
	const [jobId, setJobId] = React.useState([]);
	const [user, setUser] = React.useState(null);
	const candidateInputRef = React.useState(null);
	const [modal, setModal] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [companyId, setCompanyId] = React.useState('');
	const [loading, setLoading] = React.useState(null);
	const [showjobs, setShowJobs] = React.useState(false);
	const [editIndex, setEditIndex] = React.useState(null);
	const [rejectedData, setRejectedData] = React.useState([]);
	const [selectedData, setSelectedData] = React.useState([]);
	const [candidateData, setCandidateData] = React.useState([]);
	const [sendCandidate, setSendCandidate] = React.useState([]);
	const [showRejected, setShowRejected] = React.useState(false);
	const [showCandidate, setShowCandidate] = React.useState(false);
	const [candidateInitial, setCandidateInitial] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNo: "",
		Address: "",
	});
	const [listEligibleJobs, setListEligibleJobs] = React.useState([]);
	const [showCandidateForm, setShowCandidateForm] = React.useState(false);

	useEffect(() => {
		let user = JSON.parse(getStorage("user"));
		setUser(user);
	}, []);
	const headerso = [
		{ label: "job_id", key: "_id" },
		{ label: "job_title", key: "jobTitle" },
		{ label: "createTime", key: "createTime" },
		{ label: "uploadedBy", key: "uploadBy" },
		{ label: "location", key: "location" },
		{ label: "job_type", key: "jobType" },
		{ label: "applicants", key: "applicants" },
		{ label: "valid_till", key: "validTill" },
		{ label: "hiring_organization", key: "hiringOrganization" },
		{ label: "basic_salary", key: "basicSalary" },
	];

	const csvReport = {
		filename: "jobs.csv",
		headers: headerso,
		data: jobs,
	};

	// Pagination
	const [index, setIndex] = React.useState(props.index);
	const [page, setPage] = React.useState(1);
	const paginate = (p) => {
		setPage(p);
		for (var i = 1; i <= jobs.length; i++) {
			document.getElementById("candcrd" + i).classList.add("hidden");
		}
		for (var j = 1; j <= 5; j++) {
			document
				.getElementById("candcrd" + ((p - 1) * 5 + j))
				.classList.remove("hidden");
		}
	};

	useEffect(() => {
		const getData = async () => {
			let c_id = JSON.parse(getStorage("user"));
			let id = c_id._id;
			setCompanyId(c_id.company_id);
			setLoader(true)
			let res = await getCandidateList(id);
			let candidadateRes = await getCandidateListofCompany({ companyId: c_id.company_id })

			if (candidadateRes && candidadateRes?.data?.length != 0) {
				setJobs(candidadateRes.data);
			}
			setLoader(false)
		};
		getData();
	}, []);

	const archiveCandidate = async (job) => {
		let res = await deleteCandidate(job.candidate_id, user._id, job.isDeleted);
		setJobs(res.data);

		swal("Candidate has been Archived!", {
			icon: "success",
		});
	};

	// Handle Candidates File Upload
	const handleCandidateFileUpload = async (e) => {
		try {
			e.preventDefault();
			setShowCandidateForm(false);
			if (e.target.files) {
				const reader = new FileReader();
				reader.onload = async (e) => {
					const data = e.target.result;
					const workbook = xlsx.read(data, { type: "array" });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					let d = selectedData;
					let r = rejectedData;
					const json = await xlsx.utils.sheet_to_json(worksheet);
					json.forEach((item) => {
						const EmailIndex = d.findIndex((el) => {
							return (
								(el.email !== null &&
									el.email !== undefined &&
									el.email !== "undefined" &&
									item.email !== undefined &&
									el.email.trim().toLowerCase() ===
									item.email.trim().toLowerCase()) ||
								el.phoneNo === item.phoneNo
							);
						});
						const RejectIndex = r.findIndex(
							(el) =>
								(el.email !== null &&
									item.email !== undefined &&
									(el.email !== undefined && el.email.trim().toLowerCase()) ===
									item.email.trim().toLowerCase()) ||
								el.phoneNo === item.phoneNo
						);

						if (EmailIndex !== -1 || RejectIndex !== -1) {
							r.push({
								firstName: item["firstName"] ? item["firstName"] : "",
								lastName: item["lastName"] ? item["lastName"] : "",
								email: item.email ? item.email : "",
								phoneNo: item.phoneNo ? item.phoneNo : "",
								Reason: "email/phoneNo Already Added",
							});
							return;
						}
						if (
							item.email === null ||
							item.email === undefined ||
							item.email.trim() === "" ||
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
								item.email.trim()
							)
						) {
							r.push({
								firstName: item["firstName"] ? item["firstName"] : "",
								lastName: item["lastName"] ? item["lastName"] : "",
								email: item.email ? item.email : "",
								phoneNo: item.phoneNo ? item.phoneNo : "",
								Reason: "Invalid email",
							});
							return;
						}
						if (item.phoneNo === null || !/^[0-9]{10}$/i.test(item.phoneNo)) {
							r.push({
								firstName: item["firstName"] ? item["firstName"] : "",
								lastName: item["lastName"] ? item["lastName"] : "",
								email: item.email ? item.email : "",
								phoneNo: item.phoneNo ? item.phoneNo : "",
								Reason: "Invalid phoneNo",
							});
							return;
						}
						if (
							item["firstName"] === null ||
							item["firstName"] === undefined ||
							item["firstName"].trim() === ""
						) {
							r.push({
								firstName: item["firstName"] ? item["firstName"] : "",
								lastName: item["lastName"] ? item["lastName"] : "",
								email: item.email ? item.email : "",
								phoneNo: item.phoneNo ? item.phoneNo : "",
								Reason: "Invalid firstName",
							});
							return;
						}
						if (EmailIndex === -1) {
							d.push({
								firstName: item["firstName"] ? item["firstName"] : "",
								lastName: item["lastName"] ? item["lastName"] : "",
								email: item.email ? item.email : "",
								phoneNo: item.phoneNo ? item.phoneNo : "",
								company_id: user._id,
								job_id: user._id,
							});
						}
					});
					await setCandidateData(d);
					await setRejectedData(r);
					await setSelectedData(d);
					candidateInputRef.current.value = "";
				};
				reader.readAsArrayBuffer(e.target.files[0]);
			}
		} catch (error) { }
	};

	const handleAddCandidate = () => {
		setModal(true)
		setShowCandidateForm(false);
	}

	return (
		<div className="bg-slate-100">
			<div
				className="flex mx-5 mt-3"
				style={{ justifyContent: "space-between" }}
			>
				<p className="text-xs lg:text-xl md:text-sm flex my-5 mx-5 font-semibold">
					Hey {user && user.firstName ? user.firstName : "Company"} -
					<p className="text-gray-400 px-2"> here's what's happening today!</p>
				</p>

				<div className="py-3 flex">
					<div className="mx-1">
						<button
							className=" p-1 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
							style={{ backgroundColor: "#034488" }}
							onClick={handleAddCandidate}
						>
							Add Candidate
						</button>
					</div>
				</div>
			</div>
			<div className="min-h-screen p-4 w-full md:flex mx-auto">
				<div className=" md:w-3/4 mb-4 md:mx-5">
					{loader ? (
						<>
							<div className="flex justify-between w-full bg-white">
								<div
									className="py-4 px-5 md:py-2 md:px-2"
									style={{ borderRadius: "6px 6px 0 0" }}
								>
									<p className="text-gray-900 w-full font-bold">
										All Candidates
									</p>
								</div>
							</div>
							<div className="mt-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<BarLoader color="#228276" height={3} width={"100%"} />
							</div>
						</>
					) : (
						<>
							<div className="flex justify-between w-full bg-white">
								<div
									className="py-4 px-5 md:py-2 md:px-2"
									style={{ borderRadius: "6px 6px 0 0" }}
								>
									<p className="text-gray-900 w-full font-bold">
										All Candidates
									</p>
								</div>
							</div>
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
													<Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
														<div className={`${!modal ? "hidden" : "block"}`}>
															<div className="w-full mt-9">
																<div className="w-full m-5 mx-7">
																	<div className="my-3 w-3/4 md:w-full text-left flex justify-between">
																		<div>
																			<p className="font-semibold">
																				Add Candidate Details Sheet
																			</p>
																			<p className="text-sm mt-3 mb-1 break-words">
																				( Headers Conventions: firstName,
																				lastName, email, phoneNo, Address)
																			</p>
																			<p className="text-sm break-words">
																				(Data must contain candidate's email
																				Address and phoneNumber)
																			</p>
																		</div>
																		<div>
																			<button
																				className="rounded-sm px-4 py-1 my-2 mx-4"
																				onClick={() => setModal(false)}
																				style={{
																					// backgroundColor: "#fff",
																					color: "#034488",
																				}}
																			>
																				<ImCross />
																			</button>
																		</div>
																	</div>
																	<div className="flex space-x-10 my-3">
																		<button
																			className="bg-[#034488] text-white rounded-sm px-4 py-1"
																			onClick={() => {
																				setShowCandidateForm(true);
																			}}
																		>
																			Add User
																		</button>
																		{candidateData.length === 0 &&
																			rejectedData.length === 0 && (
																				<label
																					for="candidatesInput"
																					className="cursor-pointer bg-[#034488] text-white rounded-sm px-4 py-1"
																					onClick={() => {
																						if (candidateInputRef.current)
																							candidateInputRef.current.click();
																					}}
																				>
																					{" "}
																					Add File{" "}
																				</label>
																			)}
																		<input
																			ref={candidateInputRef}
																			type="file"
																			className="hidden"
																			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
																			onChange={handleCandidateFileUpload}
																		/>
																		{(rejectedData.length > 0 ||
																			selectedData.length > 0) && (
																				<button
																					className="bg-[#034488] text-white rounded-sm px-2 py-1"
																					onClick={() => {
																						setCandidateData([]);
																						setSelectedData([]);
																						setRejectedData([]);
																						setShowCandidateForm(false);
																						if (candidateInputRef.current)
																							candidateInputRef.current.value =
																								null;
																					}}
																				>
																					Reset Data
																				</button>
																			)}
																	</div>
																	{showCandidateForm && (
																		<div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
																			<Formik
																				initialValues={candidateInitial}
																				validate={(values) => {
																					const errors = {};
																					let d = selectedData;

																					const res = d.findIndex((el) => {
																						return el.email === values.email;
																					});
																					const res2 = d.findIndex((el) => {
																						return el.phoneNo == values.phoneNo;
																					});
																					if (!values.firstName) {
																						errors.firstName = "*Name Required";
																					} else if (!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values.firstName)) {
																						errors.firstName = 'Only alphabets and spaces are allowed or limit exeeds';
																					}
																					if (!values.lastName) {
																						errors.lastName = "*Required";
																					} else if (!/^[a-zA-Z][a-zA-Z ]{0,19}$/.test(values.lastName)) {
																						errors.lastName = 'Only alphabets and spaces are allowed or limit exeeds';
																					}
																					if (
																						!values.email ||
																						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
																							values.email.trim()
																						)
																					) {
																						errors.email = "Invalid email";
																					} else if (res !== -1) {
																						errors.email =
																							"email already exists";
																					}
																					if (
																						!values.phoneNo ||
																						!/^[0-9]{10}$/i.test(values.phoneNo)
																					) {
																						errors.phoneNo = "Invalid phoneNo";
																					} else if (res2 !== -1) {
																						errors.phoneNo =
																							"phoneNo already exists";
																					}
																					return errors;
																				}}
																				onSubmit={async (values) => {
																					let d = selectedData;
																					let r = rejectedData;
																					let data = {
																						company_id: user._id,
																						job_id: user._id,
																						firstName: values.firstName,
																						lastName: values.lastName,
																						phoneNo: values.phoneNo,
																						email: values.email,
																					};
																					d.push(data);
																					await setSelectedData(d);
																					await setCandidateData(d);
																					await setRejectedData(r);
																					await setShowCandidate(true);
																					await setShowCandidateForm(false);

																					setCandidateInitial({
																						firstName: "",
																						lastName: "",
																						email: "",
																						phoneNo: "",
																						Address: "",
																					});
																					swal({
																						title:
																							"Candidate Added Successfully !",
																						message: "Success",
																						icon: "success",
																						button: "Continue",
																					});
																				}}
																			>
																				{({ values }) => {
																					return (
																						<Form>
																							<p className="text-left font-semibold py-2">
																								Add User
																							</p>
																							<div className="flex my-3 flex-wrap text-left">
																								<div className="w-1/2">
																									<label>firstName</label>
																									<Field
																										name="firstName"
																										type="text"
																										className="text-600 rounded-sm block px-4 py-1"
																										style={{
																											borderRadius: "5px",
																										}}
																									/>
																									<ErrorMessage
																										name="firstName"
																										component="div"
																										className="text-sm text-red-500"
																									/>
																								</div>
																								<div className="w-1/2">
																									<label>lastName</label>
																									<Field
																										name="lastName"
																										type="text"
																										className="text-600 rounded-sm block px-4 py-1"
																										style={{
																											borderRadius: "5px",
																										}}
																									/>
																									<ErrorMessage
																										name="lastName"
																										component="div"
																										className="text-sm text-red-500"
																									/>
																								</div>
																							</div>
																							<div className="flex my-3 flex-wrap text-left">
																								<div className="w-1/2">
																									<label>email</label>
																									<Field
																										name="email"
																										type="text"
																										className="text-600 rounded-sm block px-4 py-1"
																										style={{
																											borderRadius: "5px",
																										}}
																									/>
																									<ErrorMessage
																										name="email"
																										component="div"
																										className="text-sm text-red-500"
																									/>
																								</div>
																								<div className="w-1/2">
																									<label>phoneNo</label>
																									<Field
																										name="phoneNo"
																										type="text"
																										className="text-600 rounded-sm block px-4 py-1"
																										style={{
																											borderRadius: "5px",
																										}}
																									/>
																									<ErrorMessage
																										name="phoneNo"
																										component="div"
																										className="text-sm text-red-500"
																									/>
																								</div>
																							</div>

																							<div>
																								<button
																									className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
																									type="submit"
																									style={{
																										backgroundColor: "#034488",
																									}}
																								>
																									Add
																								</button>
																								<button
																									className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
																									onClick={() => {
																										setCandidateInitial({
																											firstName: "",
																											lastName: "",
																											email: "",
																											phoneNo: "",
																											Address: "",
																										});
																										setShowCandidateForm(false);

																										setEditIndex(null);
																									}}
																								>
																									Cancel
																								</button>
																							</div>
																						</Form>
																					);
																				}}
																			</Formik>
																		</div>
																	)}{" "}
																	<div className="my-9 lg:w-3/4">
																		{rejectedData.length > 0 && (
																			<div className="flex items-center w-full justify-between">
																				<p>
																					Rejected Data ({rejectedData.length})
																				</p>
																				<p>
																					{showRejected ? (
																						<p
																							// className="text-sm text-blue-500 cursor-pointer ml-auto"
																							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm cursor-pointer rounded-md py-2 px-4 hover:shadow-md transition duration-300 ease-in-out"
																							onClick={() => {
																								setShowRejected(false);
																							}}
																						>
																							Hide
																						</p>
																					) : (
																						<p
																							// className="text-sm text-blue-500 cursor-pointer ml-auto"
																							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm cursor-pointer rounded-md py-2 px-4 hover:shadow-md transition duration-300 ease-in-out"
																							onClick={() => {
																								setShowRejected(true);
																							}}
																						>
																							Show
																						</p>
																					)}
																				</p>
																			</div>
																		)}
																		{showRejected &&
																			rejectedData.length > 0 && (
																				<div className="my-4">
																					<table className="w-full">
																						<thead className="bg-white border-b">
																							<tr>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									#
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									email
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									Contact
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									Reason
																								</th>
																							</tr>
																						</thead>
																						<tbody>
																							{rejectedData.map(
																								(user, index) => {
																									return (
																										<tr
																											className={`${index % 2 === 0
																													? "bg-gray-100"
																													: "bg-white"
																												} border-b`}
																										>
																											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
																												{index + 1}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.email}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.phoneNo}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.Reason}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												<RiEditBoxLine
																													className="text-sm text-blue-500 cursor-pointer"
																													onClick={() => {
																														setCandidateInitial(
																															user
																														);
																														setEditIndex(index);
																														setShowCandidateForm(
																															true
																														);
																													}}
																												/>
																											</td>
																										</tr>
																									);
																								}
																							)}
																						</tbody>
																					</table>
																				</div>
																			)}
																	</div>
																	<div className="my-9">
																		{candidateData.length > 0 && (
																			<div className="flex items-center lg:w-3/4 justify-between">
																				<p className="font-semibold">
																					Candidate Data ({candidateData.length}
																					)
																				</p>
																				<p>
																					{showCandidate ? (
																						<p
																							// className="text-sm text-blue-500 cursor-pointer ml-auto"
																							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm cursor-pointer rounded-md py-2 px-4 hover:shadow-md transition duration-300 ease-in-out"
																							onClick={() => {
																								setShowCandidate(false);
																							}}
																						>
																							Hide
																						</p>
																					) : (
																						<p
																							// className="text-sm text-blue-500 cursor-pointer ml-auto"
																							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm cursor-pointer rounded-md py-2 px-4 hover:shadow-md transition duration-300 ease-in-out"
																							onClick={() => {
																								setShowCandidate(true);
																							}}
																						>
																							Show
																						</p>
																					)}
																				</p>
																				<button
																					// className="bg-primary text-white rounded-sm py-1 my-2 px-4"
																					className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm cursor-pointer rounded-md py-2 px-4 hover:shadow-md transition duration-300 ease-in-out"
																					onClick={async () => {
																						let response = await addCandidateInfo({ candidateDataDup: selectedData, jobId: "", companyId: companyId });
																						if (
																							response &&
																							response.status == 200
																						) {
																							swal({
																								title:
																									"Candidate Added Successfully !",
																								message: "Success",
																								icon: "success",
																								button: "Continue",
																							});
																							window.location.reload()
																						} else {
																							swal({
																								title:
																									"Candidate already exists with this email",
																								message: "Error",
																								icon: "error",
																								button: "Continue",
																							});
																						}
																						// setJobs(res?.data);
																						setCandidateInitial({
																							firstName: "",
																							lastName: "",
																							email: "",
																							phoneNo: "",
																							Address: "",
																						});

																					}}
																				>
																					Confirm
																				</button>
																			</div>
																		)}
																		{showCandidate &&
																			candidateData.length > 0 && (
																				<div className="my-4">
																					<table className="w-3/4">
																						<thead className="bg-white border-b text-left">
																							<tr>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									#
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									firstName
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									lastName
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									Email ID
																								</th>
																								<th
																									scope="col"
																									className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
																								>
																									Phone No
																								</th>
																							</tr>
																						</thead>
																						<tbody>
																							{candidateData.map(
																								(user, index) => {
																									return (
																										<tr
																											className={`${index % 2 === 0
																													? "bg-gray-100"
																													: "bg-white"
																												} border-b`}
																										>
																											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
																												{index + 1}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.firstName}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.lastName}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.email}
																											</td>
																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												{user.phoneNo}
																											</td>

																											<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
																												<AiOutlineDelete
																													className="text-sm  text-red-500 cursor-pointer"
																													onClick={() => {
																														setCandidateData(
																															candidateData.filter(
																																(item) =>
																																	item.email !==
																																	user.email
																															)
																														);
																														setSelectedData(
																															selectedData.filter(
																																(item) =>
																																	item.email !==
																																	user.email
																															)
																														);
																													}}
																												/>
																											</td>
																										</tr>
																									);
																								}
																							)}
																						</tbody>
																					</table>
																				</div>
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
							{showjobs && (
								<Transition
									appear
									show={showjobs}
									as={Fragment}
									className="relative z-1050 w-full overflow-hidden"
									style={{ zIndex: 1000 }}
								>
									<Dialog
										as="div"
										className="relative z-1050 w-5/6"
										onClose={() => { }}
										static={true}
									>
										<div
											className="fixed inset-0 bg-black/25"
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

										<div className="fixed mb-10 inset-0 overflow-hidden ">
											<div className="flex h-full items-center overflow-y-auto justify-center text-center my-7 py-7 rounded-lg max-w-4xl mx-auto">
												<Transition.Child
													as={Fragment}
													enter="ease-out duration-300"
													enterFrom="opacity-0 scale-95"
													enterTo="opacity-100 scale-100"
													leave="ease-in duration-200"
													leaveFrom="opacity-100 scale-100"
													leaveTo="opacity-0 scale-95"
												>
													<Dialog.Panel className="w-9/12 h-full overflow-y-auto px-7 transform  rounded-xl bg-white text-left align-middle shadow-xl transition-all">
														<div className="w-full mt-9 text-right flex justify-between">
															{" "}
															<p className="font-semibold text-xl my-5">
																Send Job Request
															</p>{" "}
															<button
																className="rounded-sm py-1 my-2 px-4"
																onClick={() => {
																	setShowJobs(false);
																}}
																style={{
																	backgroundColor: "#fff",
																	color: "#034488",
																}}
															>
																<ImCross />
															</button>
														</div>

														{loading && (<img src={Loader} className="h-7" alt="loader" />)}
														{listEligibleJobs && listEligibleJobs.length > 0 ?
															listEligibleJobs.map((job) => {
																return (
																	<div className="w-full px-5 bg-white py-1 border border-b">
																		<div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
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
																							(new Date(
																								job.validTill
																							).getMonth() +
																								1) +
																							"-" +
																							new Date(
																								job.validTill
																							).getFullYear()}
																					</p>
																				</div>
																				<div className="flex py-1">
																					<div className="text-md py-1 text-gray-400 font-semibold ">
																						<BsCashStack />
																					</div>

																					{job.salary &&
																						job.salary.length >= 2 && (
																							<p className="px-4 text-md text-gray-400 font-semibold">
																								{job.salary[0].symbol}{" "}
																								{job.salary[1]}{" "}
																								{job.salary.length === 3 && (
																									<span>- {job.salary[2]}</span>
																								)}
																							</p>
																						)}
																				</div>
																			</div>
																			<div className="flex col-span-2">

																				{job.archived ? (
																					<button
																						className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
																					>
																						Archived{" "}
																					</button>
																				) : new Date().toISOString() <
																					job.validTill ? (
																					jobId.find((item) => {
																						return item == job._id;
																					}) ? (
																						<button
																							className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
																						>
																							Requested{" "}
																						</button>
																					) : (
																						<div>
																							{" "}
																							<button
																								style={{
																									background: "#3ED3C5",
																								}}
																								className="px-5 py-3 rounded-3xl text-xs  text-gray-900 font-semibold"
																								onClick={async () => {
																									let res1 =
																										await sendInvitation(
																											{
																												job_id: job._id,
																												candidates:
																													sendCandidate,
																												user_id: job.uploadBy,
																											},
																											user.access_token
																										);

																									if (res1.status === 200) {
																										swal({
																											title:
																												"Invitation Send !",
																											message: "Success",
																											icon: "success",
																											button: "Continue",
																										}).then((result) => { });
																									} else {
																										swal({
																											title:
																												" Error Posting Job !",
																											message:
																												"OOPS! Error Occured",
																											icon: "Error",
																											button: "Ok",
																										});
																									}
																								}}
																							>
																								Send Request{" "}
																							</button>
																						</div>
																					)
																				) : (
																					<div className="lg:mx-auto">
																						{" "}
																						<button
																							className=" bg-white border border-gray-400 rounded-3xl px-5 py-3 mx-auto my-3 text-xs text-gray-900 font-semibold"
																						>
																							Ended{" "}
																						</button>
																					</div>
																				)}
																			</div>
																		</div>
																	</div>
																);
															}) : (<label className="font-semibold text-lg w-2/5 mx-2">
																No Jobs Available
															</label>)}
													</Dialog.Panel>
												</Transition.Child>
											</div>
										</div>
									</Dialog>
								</Transition>
							)}
							<div className="w-full">
								{jobs && jobs.length !== 0 && jobs.length > 0 &&
									jobs?.map((job, index) => {
										return (
											<div
												id={"candcrd" + (index + 1)}
												className={
													index < 5
														? "w-full px-5 bg-white py-1 border border-b"
														: "w-full px-5 bg-white py-1 border border-b hidden"
												}
											>
												<div className="grid grid-cols-1 gap-4 lg:grid-cols-10 sm:grid-cols-4 my-3">
													<div className="col-span-3">
														<h5 className="text-black-900 text-xs lg:text-lg md:text-sm font-bold mb-1 ">
															{job.firstName} {job.lastName}
														</h5>
													</div>
													<div className="col-span-4">
														<div className="flex py-1">
															<div className="text-md py-1 text-gray-400 font-semibold ">
																<CgWorkAlt />
															</div>

															<p className="px-4 text-sm text-gray-400 font-semibold">
																{job.email}
															</p>
														</div>
													</div>
													<div className="col-span-2">
														<div className="flex py-1">
															<div className="text-sm py-1 text-gray-400 font-semibold ">
																<HiOutlineCalendar />
															</div>

															<p className="px-2 text-md text-gray-400 font-semibold">
																{job.phoneNo}
															</p>
														</div>
													</div>
													<div className="flex col-span-1">
														<div className="px-4 mx-2 py-4 align-middle">
															<Popover className="relative mt-1">
																{({ open }) => (
																	<>
																		<Popover.Button
																			className={`${open ? "" : "text-opacity-90"} focus:outline-0`}>
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
																							<p className="text-sm font-semibold py-2">
																								<Link
																									to={`/company/candidateReport/${job._id}`}
																								>
																									View Details{" "}
																								</Link>
																							</p>{" "}
																						</div>
																						<div
																							className="flex items-center border-b text-gray-800 space-x-2"
																							onClick={async () => {
																								let d = [];
																								d.push({
																									Email: job.email,
																									Contact: job.phoneNo,
																									FirstName: job.firstName,
																									LastName: job.lastName,
																								});
																								setSendCandidate(d);
																								setShowJobs(true);
																								let res =
																									await eligibleJobsForCandidate(
																										job.email,
																										user._id
																									);
																								setLoading(true)
																								if (res) {
																									setListEligibleJobs(res.data);
																									setLoading(false)
																								}
																								var arr = job.jobId.split(",");

																								setJobId(arr);
																							}}
																						>
																							{/* <p className="text-sm font-semibold py-2">
																								Add to Job{" "}
																							</p>{" "} */}
																						</div>
																						{/* *******************temporary hold **********************																				 */}
																						{/* <div
																							className="flex items-center text-gray-800 space-x-2"
																							onClick={() =>
																								archiveCandidate(job)
																							}
																						>
																							
																							<p className="text-sm font-semibold py-1 cursor-pointer">
																								
																								{job.isDeleted
																									? "Unarchive"
																									: "Archive"}
																								
																							</p>{" "}
																						</div> */}
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
									})}
							</div>
							<div className="w-full">
								{jobs?.length > 0 && Math.ceil(jobs.length / 5) != 0 ? (
									<div className="flex justify-between my-2 mx-1">
										<div>
											Page {page} of {Math.ceil(jobs?.length / 5)}
										</div>
										<div>
											{" "}
											{jobs &&
												jobs?.map((job, index) => {
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
								) : (
									<>
										<h5 className="text-center font-bold mt-4">
											No Candidates Found
										</h5>
									</>
								)}
							</div>
						</>
					)}
				</div>

				<div className="md:w-1/4">
					<div className="shadow-lg px-3 my-0 py-5 rounded-lg bg-white w-full">
						<p className="text-xl mx-auto text-gray-700 font-bold  flex">
							<p className="p-1">
								<BsFillBookmarkFill />
							</p>
							<p className=" mx-2  text-sm ">Count</p>
						</p>
						{loader ? (
							<>
								<div className="flex justify-between my-4 py-4">
									<p className="font-bold text-xs">Candidates</p>
									<p className="text-gray-400 font-semibold text-xs">
									{" "}
								{jobs?.length > 0 ? jobs.length : 0}
									</p>
								</div>
								<div className="mt-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<BarLoader color="#228276" height={3} width={"100%"} />
								</div>
							</>
						) : (
							<div className="border-b border-gray-600 flex justify-between my-4 py-4">
								<p className="font-bold text-xs">Candidates</p>
								<p className="text-gray-400 font-semibold text-xs">
								{" "}
								{jobs?.length > 0 ? jobs.length : 0}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobList;
