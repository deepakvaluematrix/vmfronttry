import React, { useState, Fragment, useEffect } from "react";
import {
	getUserList,
	getCompanyUserList,
	updateUserDetails,
	getXIList,
	getDialerToken,
	createUserByAdmin,
	uploadCandidateResume,
	countryCodeList,
	getCountryList,
} from "../../service/api";
import { Link } from "react-router-dom";
import { Combobox } from "@headlessui/react";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { MdCallEnd } from "react-icons/md";
import { BsCalendar, BsLinkedin, BsFillMicFill } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url, handleXIStatusChange } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { Device } from "@twilio/voice-sdk";
import "../../assets/stylesheet/dialer.css";
import cities from "cities.json";
import Loader from "../../assets/images/loader.gif";
import axios from "axios";
import ActionDropdown from "../../Components/AdminDashboard/ActionDropdown.jsx";
import { ImCross } from "react-icons/im";
import data from "../../data/data";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
const XIOnboarding = () => {
	const [userList, setUserList] = React.useState([]);
	const [modal, setModal] = React.useState(false);
	const [add_jobs, setadd_jobs] = React.useState(false);
	const [add_users, setadd_users] = React.useState(false);
	const [listCan, setlistCan] = React.useState(false);
	const [page, setPage] = useState(1);
	const [muted, setMuted] = useState(false);
	const [onPhone, setOnPhone] = useState(false);
	const [currentNumber, setCurrentNumber] = useState("");
	const [token, setToken] = useState("");
	const [device, setDevice] = useState(null);
	const [call, setCall] = useState(null);
	const [callUser, setCallUser] = useState(null);
	const options = ["Approved", "Forwarded"];
	const [selected, setSelected] = useState(options[0]);
	const [permissions, setPermissions] = React.useState([
		{
			title: "Add Jobs",
			id: "add_jobs",
			value: add_jobs,
		},
		{
			title: "Add Users",
			id: "add_users",
			value: add_users,
		},
		{
			title: "List Candidates",
			id: "list_candidates",
			value: listCan,
		},
	]);

	const [addUserModal, setAddUserModal] = React.useState(false);
	const [userToken, setUserToken] = useState("");
	const [loading, setLoading] = React.useState(false);
	const [uid, setUid] = useState("");
	const [userAccessToken, setUserAccessToken] = useState("");
	const [showResumeBtn, setShowResumeBtn] = useState(false);
	const [error, setError] = React.useState(null);
	const [file, setFile] = React.useState(null);
	const [fileName, setFileName] = React.useState(null);
	const [countryCode, setcountryCode] = React.useState([]);
	const [selectedAddCity, setSelectedAddCity] = React.useState(cities[103]);
	const [Addquery, setAddQuery] = React.useState("");
	const [query, setQuery] = React.useState("");
	const [country, setSelectedCountry] = React.useState([]);

	const [spinner, setSpinner] = useState(false);
	const [message, setMessage] = useState(false);

	React.useEffect(() => {
		const initial = async () => {
			let country = await getCountryList();
			if (country?.data?.countries?.[0]?.country) {
				setSelectedCountry(country.data.countries[0].country);
			}
		};
		initial();
	}, []);

	useEffect(() => {
		const initial = async () => {
			let countryCode = await countryCodeList();
			setcountryCode(countryCode.data);
		};
		initial();
	}, []);

	const filteredCity =
		query === ""
			? cities.slice(0, 5)
			: cities
					.filter((city) => {
						return (
							city.country.toLowerCase().includes(query.toLowerCase()) ||
							city.name
								.toLowerCase()
								.replace("ā", "a")
								.replace("ò", "o")
								.replace("à", "a")
								.includes(query.toLowerCase())
						);
					})
					.slice(0, 5);
	const filteredAddCity =
		Addquery === ""
			? cities.slice(0, 5)
			: cities
					.filter((Addcity) => {
						return (
							Addcity.country.toLowerCase().includes(Addquery.toLowerCase()) ||
							Addcity.name
								.toLowerCase()
								.replace("ā", "a")
								.replace("ò", "o")
								.replace("à", "a")
								.includes(Addquery.toLowerCase())
						);
					})
					.slice(0, 5);

	const navigate = useNavigate();

	React.useEffect(() => {
		const tokenFetch = async () => {
			let res = await getDialerToken();
			setToken(res.data.token);
		};
		tokenFetch();
	}, []);

	React.useEffect(() => {
		const initial = async () => {
			let token = await getStorage("access_token");
			let user = JSON.parse(await getStorage("user"));
			let response = await getXIList({ user_id: user?._id }, token);
			if (response && response.status === 200) {
				setUserList(response.data);
			}
		};
		initial();
	}, []);

	const paginate = (p) => {
		setPage(p);
		for (var i = 1; i <= userList.length; i++) {
			document.getElementById("AdminUserCrd" + i).classList.add("hidden");
		}
		for (var j = 1; j <= 5; j++) {
			document
				.getElementById("AdminUserCrd" + ((p - 1) * 5 + j))
				.classList.remove("hidden");
		}
	};
	const handleToggleMute = () => {
		var m = !muted;
		setMuted(m);
		call.mute(m);
	};
	const handleToggleCall = async (contact) => {
		let d = new Device(token);
		setDevice(d);
		const call = await d.connect({
			params: { To: `+91${contact}` },
		});
		setCurrentNumber(contact);
		setOnPhone(true);
		setCall(call);
	};

	const handleDisconnect = () => {
		device.disconnectAll();
		setOnPhone(false);
		setModal(true);
		setCall(null);
	};

	const handleUserStatusChange = async (_id,action) => {
		let user = JSON.parse(await getStorage("user"));
		let result = await handleXIStatusChange({ id: _id, status: action });
		if (result && result.status === 200) {
			swal({
				title: "Success",
				text: "XI Onboarding Status Changed",
				icon: "success",
				button: "Ok",
			}).then(()=>{
				window.location.reload();
			});
			
		}else {
			swal({
				title: "Oops",
				text: "Something went wrong",
				icon: "success",
				button: "Ok",
			});
		}
	};

	const signup = async (values) => {
		if(!values?.firstName || values?.firstName === "" || !values?.lastname 
		|| values?.lastname === "" || !values?.email 
		|| values?.email === "" || !values?.contact || values?.contact === "" 
		|| !values?.countryCode || values?.countryCode === "" || !values?.linkedInUrl 
		|| values?.linkedInUrl === ""   
		|| !values?.city || values?.city === "" 
		|| !values?.state || values?.state === "" || !values?.zip || values?.zip === ""){
			return
		}
		setSpinner(true);
		let res = await createUserByAdmin({values}, userToken);
		setLoading(true);
		if (res && res.status == 200 && res.data.user) {
			setSpinner(false);
			setUid(res?.data?.user?._id);
			setUserAccessToken(res.data.user.access_token);
			setLoading(false);
			swal({
				title: "User created",
				text: "Successfully added User",
				icon: "success",
				button: "Continue",
			}).then(() => {
				setShowResumeBtn(true);
			});
		} else if (res && res?.status == 409) {
			if (res.data.conflitedValue == "phone") {
				swal({
					icon: "error",
					title: "Add User",
					text: "User already exists with this Phone number",
					button: "Continue",
				}).then(async () => {
					setSpinner(false);
				});
				setLoading(false);
			} else if (res.data.conflitedValue == "email") {
				swal({
					icon: "error",
					title: "Add User",
					text: "User already exists with this Email ID",
					button: "Continue",
				}).then(async () => {
					setSpinner(false);
				});
			}
		} else {
			swal({
				icon: "error",
				title: "Add User",
				text: "Something went Wrong",
				button: "Continue",
			}).then(async () => {
				window.location.href = "/admin/XIOnboarding";
			});
		}
	};

	const handleChange = async (e) => {
		setLoading(true);
		setError(null);

		let fd = new FormData();
		fd.append("user_id", uid);
		fd.append("file", e.target.files[0]);

		let response = await uploadCandidateResume(fd, userAccessToken);
		if (response && response.status === 200) {
			await setFile(e.target.files[0]);
			setFileName(e.target.files[0].name);
			setLoading(false);
			swal({
				title: "Resume Uploaded",
				text: "Resume Uploaded",
				icon: "success",
				button: "Continue",
			}).then(async () => {
				window.location.href = "/admin/XIOnboarding";
			});
		} else {
			setMessage(true);
			setLoading(false);
		}
	};

	return (
		<div className="p-5">
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
													<h3 className="my-5">
														What action would you like to take for the user?
													</h3>
													<form>
														<select
															value={selected}
															onChange={(e) => setSelected(e.target.value)}
														>
															{options.map((value) => (
																<option value={value} key={value}>
																	{value}
																</option>
															))}
														</select>
													</form>
													<div className="" style={{ display: "flex" }}>
														<button
															className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
															style={{ backgroundColor: "#034488" }}
														>
															Cancel
														</button>
														<button
															className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
															style={{ backgroundColor: "#034488" }}
															onClick={() => {
																setModal(false);
																handleUserStatusChange();
															}}
														>
															OK
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

			{onPhone ? (
				<div className="modal_parent_div">
					<div className="caller_name_div">
						<p>{callUser && callUser.firstName}</p>
						<p>{callUser && callUser.contact}</p>
					</div>
					<div className="buttons_parent_div">
						<button
							className=" hover:bg-danger-700 flex text-white justify-center font-bold p-4 text-sm text-center rounded-md mx-2"
							style={{ backgroundColor: "#808080", borderRadius: "50%" }}
							onClick={handleToggleMute}
						>
							<p>
								<BsFillMicFill />
							</p>
						</button>

						<button
							className=" hover:bg-danger-700 flex text-white justify-center font-bold p-4 text-sm text-center rounded-md mx-2"
							style={{ backgroundColor: "#F22F46", borderRadius: "50%" }}
							onClick={handleDisconnect}
						>
							<p>
								<MdCallEnd />
							</p>
						</button>
					</div>
				</div>
			) : null}

			<p className="text-2xl font-semibold mx-10">XI Pending Users List</p>
			<div className="mt-3">
				<div className="flex flex-col mx-10">
					<div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
						<div className="py-2 inline-block w-full sm:px-6 lg:px-8">
							<div className="overflow-hidden">
								<button
									className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
									style={{ float: "right" }}
									data-toggle="modal"
									data-target="#exampleModalCenter"
									onClick={() => {
										setAddUserModal(true);
									}}
								>
									Add User
								</button>
								<div
									class="modal fade"
									id="exampleModalCenter"
									tabindex="-1"
									role="dialog"
									aria-labelledby="exampleModalCenterTitle myLargeModalLabel"
									aria-hidden="true"
								>
									<div
										class="modal-dialog modal-dialog-centered  modal-lg"
										role="document"
									>
										<div class="modal-content container">
											<ImCross
												style={{
													color: "#111",
													float: "right",
													marginTop: "10px",
													fontSize: "15px",
												}}
												class="close ml-auto"
												data-dismiss="modal"
												aria-label="Close"
											/>
											<p
												className="text-xl font-semibold mb-4 text-center mt-4"
												style={{ fontWeight: 700 }}
											>
												Create New User{" "}
											</p>

											<div className="container">
												<Formik
													initialValues={{
														firstName: "",
														email: "",
														lastname: "",
														user_type: "XI",
														contact: "",
														agree: false,
														countryCode: `${countryCode[0]}`,
														houseNo: "",
														street: "",
														state: "",
														country: "Angola",
														zip: "",
														city: "",
														linkedInUrl : ""
													}}
													validate={(values) => {
														const errors = {};
														if (!values.firstName || values?.firstName === "" || values?.firstName === undefined || values?.firstName === null) {
															errors.firstName = "First Name Required";
														}
														else if(!/^[a-zA-Z]+$/.test(values?.firstName)){
															errors.firstName = "must be alphabets"
														}
														if(!values?.lastname || values?.lastname === "" || values?.lastname === undefined || values?.lastname === null){
															errors.lastname = "Last Name Required"
														} 
														else if (values?.lastname?.length > 20) {
															errors.lastname = "Must be 20 characters or less";
														} 
														else if (!/^[a-zA-Z]+$/.test(values?.lastname)) {
															errors.lastname = "must be alphabets";
														}

														if (!values.email || values?.email === "" || values?.email === undefined || values?.email === null) {
															errors.email = "Email Required";
														} else if (
															!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
																values.email
															)
														) {
															errors.email = "Invalid Email Address";
														}
														if (!values.contact || values?.contact === "" || values?.contact === undefined || values?.contact === null) {
															errors.contact = "Contact Required";
														} else if (
															!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
																values.contact
															)
														) {
															errors.contact = "Invalid Contact Number";
														}

														if (
															!values.countryCode ||
															values.countryCode === ""
														) {
															errors.countryCode = "Country Code Required";
														}

														if (!values.linkedInUrl || values?.linkedInUrl === "") {
															errors.linkedInUrl = "Linkedin url required";
														}
														else if(!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{1,100}\/?$/.test(values?.linkedInUrl)){
															errors.linkedInUrl = "Invalid LinkedIn Url"
														}
														if (!values.houseNo || values?.houseNo === "") {
															errors.houseNo = "";
														} else if (/^\s/.test(values.houseNo)) {
															errors.houseNo =
																"First alphabets must not be space";
														}
														if (!values.street || values?.street === "") {
															errors.street = "";
														} else if (/^\s/.test(values.street)) {
															errors.street =
																"First alphabets must not be space";
														} else if (!/^[a-zA-Z0-9][a-zA-Z0-9]*$/.test(values.street)) {
															errors.street = 'Only alphanumeric characters are allowed';
														}
														if (!selectedAddCity || selectedAddCity === "" || values?.city === "" || !values?.city) {
															errors.city = "Required";
														} else if (/^\s/.test(values?.city)) {
															errors.city = "First alphabets must not be space";
														} else if (!/^[a-zA-Z, ][(\w+\s?)]*$/.test(values?.city)) {
															errors.city = "must be alphabets";
														  }
														if (!values.state || values?.state === "") {
															errors.state = "Required";
														} else if (/^\s/.test(values.state)) {
															errors.state =
																"First alphabets must not be space";
														} else if (!/^[a-zA-Z][(\w+\s?)]*$/.test(values.state)) {
															errors.state = "must be alphabets";
														}
														if (!values.zip || values?.zip === "") {
															errors.zip = "Required";
														} else if (/^\s/.test(values.zip)) {
															errors.zip = "First alphabets must not be space";
														} else if (!/^[1-9][0-9]{0,8}$/.test(values.zip)) {
															errors.zip =
																"Only numbers are allowed  or limit exeeds";
														}
														if(!values?.country || values?.country === ""){
															errors.country = "Required"
														}
														else if(!/^[a-zA-Z][(\w+\s?)]+$/.test(values?.country)){
															errors.country = "must be alphabets"
														}
														return errors;
													}}
													onSubmit={(values) => {
														signup(values);
													}}
												>
													{({ values, isSubmitting }) => (
														<Form className="space-y-3 py-1">
															<div class="form-row">
																<div class="form-group col-md-6">
																	<div className="my-2">
																		<Field
																			type="text"
																			name="firstName"
																			placeholder="First Name"
																			className="w-full"
																			style={{ borderRadius: "12px" }}
																		/>
																		<ErrorMessage
																			name="firstName"
																			component="div"
																			className="text-sm text-red-600"
																		/>
																	</div>
																</div>
																<div class="form-group col-md-6">
																	<div className="my-2">
																		<Field
																			type="text"
																			name="lastname"
																			placeholder="Last Name"
																			className="w-full"
																			style={{ borderRadius: "12px" }}
																		/>
																		<ErrorMessage
																			name="lastname"
																			component="div"
																			className="text-sm text-red-600"
																		/>
																	</div>
																</div>
															</div>

															<div className="my-1">
																<Field
																	type="text"
																	name="email"
																	placeholder="Email"
																	className="w-full"
																	style={{ borderRadius: "12px" }}
																/>

																<ErrorMessage
																	name="email"
																	component="div"
																	className="text-sm text-red-600"
																/>
															</div>
															<div className="my-1 w-full">
																<div className=" md:w-full flex py-2">
																	<Field
																		component="select"
																		id="countryCode"
																		name="countryCode"
																		className="block py-1 w-2/6"
																		style={{
																			borderRadius: "12px 0 0 12px",
																		}}
																		multiple={false}
																	>
																		{countryCode && countryCode.length > 0 ? 
																			countryCode.map((item) => {
																				return (
																					<option value={  item.country + "-" + item.code}>
																						{item.country}<span> </span>{'  '} {item.code}
																					</option>
																				);
																			}) : (
																				data.countryCode.map((item)=>{
																					return (
																						<option value={  item.country + "-" + item.code}>
																							{item.country}<span> </span>{'  '} {item.code}
																						</option>
																					);
																				})
																			)}
																	</Field>
																	<Field
																		type="text"
																		name="contact"
																		placeholder="Contact Number"
																		className="rounded-lg"
																		style={{
																			borderRadius: " 0 12px 12px 0",
																			width: "100%",
																		}}
																	/>
																</div>
																<ErrorMessage
																	name="countryCode"
																	component="div"
																	className="text-sm text-red-600"
																/>
																<ErrorMessage
																	name="contact"
																	component="div"
																	className="text-sm text-red-600"
																/>
															</div>
															<Field
																type="text"
																name="linkedInUrl"
																placeholder="Linkedin Url"
																className="w-full"
																style={{ borderRadius: "12px" }}
															/>
															<ErrorMessage
																name="linkedInUrl"
																component="div"
																className="text-sm text-red-600"
															/>
															<div className="my-1 sm:mx-0  md:flex w-full  space-y-1">
																<label className="font-semibold text-lg md:w-2/5 mx-2">
																	Address
																</label>
																<div className="w-full">
																	<div
																		className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 mr-2 md:mr-0 md:w-full"
																		style={{ justifyContent: "space-between" }}
																	>
																		<div className=" grid grid-cols-1 lg:grid-cols-2 align-middle">
																			<label className="font-semibold text-md py-2">
																				House/ Flat No.
																			</label>
																			<div className="">
																				<Field
																					name="houseNo"
																					type="text"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.houseNo}
																				/>
																				<ErrorMessage
																					name="houseNo"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>

																		<div className="grid grid-cols-1 lg:grid-cols-2  md:mx-0 align-middle">
																			<label className="font-semibold text-md ml-0 lg:ml-5 py-2">
																				Street
																			</label>
																			<div className="">
																				<Field
																					name="street"
																					type="text"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.street}
																				/>

																				<ErrorMessage
																					name="street"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>
																	</div>
																	<div
																		className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 md:w-full"
																		style={{ justifyContent: "space-between" }}
																	>
																		<div className=" grid grid-cols-1 lg:grid-cols-2  align-middle">
																			<label className="font-semibold text-md py-2">
																				City
																			</label>
																			<div className="">
																				<p>
																					Current Location :{" "}
																					{values.city ? `${values.city}` : ""}
																				</p>

																				{/* <Combobox
																					value={selectedAddCity}
																					name="city"
																					onChange={setSelectedAddCity}
																				>
																					<Combobox.Input
																						onChange={(event) =>
																							setAddQuery(event.target.value)
																						}
																						className="border-[0.5px] rounded-lg w-full  border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
																						style={{ borderRadius: "5px" }}
																					/>
																					<Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
																						{Addquery.length > 0 && (
																							<Combobox.Option
																								className="p-2"
																								value={`${Addquery}`}
																							>
																								Create "{Addquery}"
																							</Combobox.Option>
																						)}
																						{filteredAddCity.map((city) => (
																							<Combobox.Option
																								key={city.name}
																								value={`${city.name
																									.replace("ā", "a")
																									.replace("ò", "o")
																									.replace("à", "a")},`}
																							>
																								{({ active, selected }) => (
																									<li
																										className={`${
																											active
																												? "bg-blue-500 text-white p-2"
																												: "bg-white text-black p-2"
																										}`}
																									>
																										{city.name
																											.replace("ā", "a")
																											.replace("ò", "o")
																											.replace("à", "a")}
																									</li>
																								)}
																							</Combobox.Option>
																						))}
																					</Combobox.Options>
																				</Combobox> */}
																				<Field
																					name="city"
																					type="text"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.city}
																				/>
																				<ErrorMessage
																					name="city"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>

																		<div className="grid grid-cols-1 lg:grid-cols-2  md:mx-0 align-middle">
																			<label className="font-semibold text-md py-2 ml-0 lg:ml-5">
																				State/Region
																			</label>
																			<div className="">
																				<Field
																					name="state"
																					type="text"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.state}
																				/>

																				<ErrorMessage
																					name="state"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>
																	</div>
																	<div
																		className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 md:w-full"
																		style={{ justifyContent: "space-between" }}
																	>
																		<div className=" grid grid-cols-1 lg:grid-cols-2  ml-3 md:mx-0  align-middle">
																			<label className="font-semibold text-md py-2">
																				Country
																			</label>
																			<div className="">
																				<Field
																					component="select"
																					id="country"
																					name="country"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.country}
																					multiple={false}
																				>
																					{country &&
																						country.map((item) => {
																							return (
																								<option value={item.name}>
																									{item.name}
																								</option>
																							);
																						})}
																				</Field>
																				<ErrorMessage
																					name="country"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>

																		<div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0  align-middle">
																			<label className="font-semibold text-md py-2 ml-0 lg:ml-5">
																				Zip Code
																			</label>
																			<div className="">
																				<Field
																					name="zip"
																					type="text"
																					style={{
																						boxShadow:
																							"rgba(0, 0, 0, 0.1) 0px 4px 12px",
																						borderRadius: "5px",
																					}}
																					className="block border-gray-200 py-1 w-full"
																					value={values.zip}
																				/>

																				<ErrorMessage
																					name="zip"
																					component="div"
																					className="text-sm text-red-600"
																				/>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<div>
																{showResumeBtn == true ? (
																	<div>
																		<div className="my-5">
																			{loading ? (
																				<button className="py-1 px-3 bg-blue-500 rounded-md">
																					<img
																						src={Loader}
																						className="h-7"
																						alt="loader"
																					/>
																				</button>
																			) : (
																				<label
																					for="resume"
																					className="py-2 px-3 cursor-pointer bg-blue-500 rounded-md text-white"
																					style={{ backgroundColor: "#034488" }}
																				>
																					{" "}
																					Upload Resume{" "}
																				</label>
																			)}
																			<input
																				type="file"
																				name="resume"
																				className="hidden"
																				id="resume"
																				accept="application/pdf, application/msword"
																				onChange={handleChange}
																			/>
																			{message && (
																				<p style={{ color: "red" }}>
																					Please choose a valid resume*
																				</p>
																			)}
																		</div>
																	</div>
																) : (
																	<div>
																		{!spinner && (
																			<button
																				className="bg-blue-600 px-8 py-2 text-white rounded-lg mx-auto block mt-4 hover:bg-blue-700 text-center w-1/2 cursor-pointer"
																				type="submit"
																				style={{ backgroundColor: "#01458C" }}
																				onClick={()=>signup(values)}
																			>
																				Create User
																			</button>
																		)}
																		{spinner && (
																			<button className="h-8 bg-blue-600 rounded-lg block mx-auto cursor-pointer w-1/2 px-8 align-middle">
																				<img
																					src={Loader}
																					alt="loader"
																					className="h-9 mx-auto"
																				/>
																			</button>
																		)}
																	</div>
																)}
															</div>
														</Form>
													)}
												</Formik>
											</div>
										</div>
									</div>
								</div>
								<table className="w-full mt-5">
									<thead className="bg-white border-b">
										<tr>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												#
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												Username
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												First Name
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												Email
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												Status
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												Action
											</th>
											<th
												scope="col"
												className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
											>
												View Details
											</th>
										</tr>
									</thead>
									<tbody>
										{userList.map((user, index) => {
											return (
												<>
													<tr
														id={"AdminUserCrd" + (index + 1)}
														className={
															index < 5 ? "bg-gray-100" : "bg-gray-100 hidden"
														}
													>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
															{index + 1}
														</td>
														<td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
															{user.username}
														</td>
														<td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
															{user.firstName}
														</td>
														<td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
															{console.log("user.email: ",user)}
															{user.email}
														</td>
														<td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
															{user.status}
														</td>
														<td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
															<button
																className=" hover:bg-blue-700 flex text-white justify-center font-bold py-2 w-full text-sm mt-4 text-center rounded-lg"
																style={{ backgroundColor: "#034488" }}
																onClick={() => {
																	handleUserStatusChange(user?._id,1);
																}}
															>
																Approve
															</button>
															<button
																className=" hover:bg-red-700 flex text-white justify-center font-bold py-2 w-full text-sm mt-4 text-center rounded-lg"
																style={{ backgroundColor: "#034488" }}
																onClick={() => {
																	handleUserStatusChange(user?._id,2);
																}}
															>
																Reject
															</button>
														</td>
														<td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
															<Link to={`/admin/AdminUserProfile/${user?._id}`}>
																<p>View Detail</p>
															</Link>
														</td>
													</tr>
												</>
											);
										})}
									</tbody>
								</table>
								<div className={userList.length > 5 ? "w-full" : "hidden"}>
									<div className="flex justify-between my-2 mx-1">
										<div>
											Page {page} of {Math.ceil(userList.length / 5)}
										</div>
										<div>
											{" "}
											{userList &&
												userList.map((user, index) => {
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default XIOnboarding;
