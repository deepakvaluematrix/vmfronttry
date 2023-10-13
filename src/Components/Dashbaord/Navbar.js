import React, { useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Avatar from "../../assets/images/UserAvatar.png";
import { LogoutAPI, getProfileImage, updatePassword } from "../../service/api";
import { ReactSession } from "react-client-session";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import "../../assets/stylesheet/layout.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
import { ImCross } from "react-icons/im";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import NotificationPopOver from "./Notifications.jsx";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";

const ProgressContext = React.createContext();
const HorizontalNav = (props) => {
	let [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const [progress, setProgress] = React.useState(0);
	const [user, setUser] = React.useState();
	const [profileImg, setProfileImg] = React.useState(null);
	const [fieldValue, setFieldValue] = React.useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const Logout = async () => {
		let user = await getStorage("user");
		user = JSON.parse(user);
		let res = await LogoutAPI(user._id);
		// //console.log(res);
		await ls.set("user", null);
		await ls.set("access_token", null);
		window.location.href = "/login";
	};
	const handleCloseModal = () => {
		
		setIsOpen(false);
	  };

	const Changepassword = async () => {};

	React.useEffect(() => {
		const initial = async () => {
			let user = JSON.parse(await getStorage("user"));
			await setUser(user);
			let step = 0;
			if (user && user.profileImg) {
				let image = await getProfileImage({ id: user._id }, user.access_token);
				if (image?.status === 200) {
					await ls.set("profileImg", JSON.stringify(image));

					let base64string = btoa(
						new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
							return data + String.fromCharCode(byte);
						}, "")
					);
					let src = `data:image/png;base64,${base64string}`;
					setProfileImg(src);
				}
			}
			if (user.resume) {
				step++;
			}
			if (user.tools.length > 0) {
				step++;
			}
			if (user.education.length > 0) {
				step++;
			}
			if (user.contact !== user.id && user.address && user.email) {
				step++;
			}
			if (user.experience.length > 0) {
			}
			let progress = (step / 5) * 100;
			await setProgress(progress);
		};
		initial();
	}, []);

	return (
		<>
			<ProgressContext.Provider value={progress}>
				<div className="flex items-center navbar  w-full">
					<div className="text-slate-600 text-lg 2xl:block ">
					<Link to="/user/">
						<img className="h-10" src={logo} alt="Logo"/>
						</Link>
						
					</div>
					
					<div className="space-x-8 ml-auto flex items-center">
						<NotificationPopOver />
						<Popover className="relative">
							{({ open }) => (
								<>
									<Popover.Button
										className={`
              ${open ? "" : "text-opacity-90"} focus:outline-0`}
									>
										<div className="flex space-x-3 items-center cursor-pointer">
											<div className="text-xs text-start md:block hidden">
												{props.user ? (
													<p className="text-md text-bold">
														{props.user.firstName} {props.user.lastname}
													</p>
												) : (
													<p className="text-md text-bold">User</p>
												)}
											</div>
											<img
												src={
													user && user.profileImg && profileImg
														? profileImg
														: Avatar
												}
												// src={Avatar}
												className="h-7 w-7 md:h-7 md:w-7 rounded-full"
												alt="userAvatar"
											/>
										</div>
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
										<Popover.Panel className="absolute left-screen z-10 mt-3 w-[250px] -translate-x-full transform px-2 sm:px-0  ">
											<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
												<div className="bg-gray-50 p-4">
													{progress < 100 && (
														<div>
															<Link className="text-xs" to="/user/editProfile">
																Complete Your Profile
															</Link>
															<div className="w-full bg-gray-200 h-1 mb-6">
																<div
																	className="bg-blue-400 text-xs h-1"
																	style={{ width: progress + "%" }}
																></div>
															</div>
														</div>
													)}
													<span className="flex items-center mb-3">
														<div className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer">
															<Link
																to="/user/profile"
																className="flex space-x-2 items-center"
															>
																<AiOutlineUser /> <p>View Profile</p>
															</Link>
														</div>
													</span>
													<span className="flex items-center  row">
														<div
															className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
															onClick={openModal}
														>
															<MdOutlinePassword /> <p>Change password</p>
														</div>
														<div
															className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
															onClick={Logout}
														>
															<MdOutlineLogout /> <p>Logout</p>
														</div>
													</span>
												</div>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
						<Transition appear show={isOpen} as={Fragment}>
							<Dialog
								as="div"
								open={isOpen}
								className="relative z-10"
								onClose={closeModal}
								
							>
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
									<div className="flex min-h-full items-center justify-center p-4 text-center">
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-300"
											enterFrom="opacity-0 scale-95"
											enterTo="opacity-100 scale-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100 scale-100"
											leaveTo="opacity-0 scale-95"
										>
											<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
												<Dialog.Title
													as="h3"
													className="text-lg font-medium leading-6 text-gray-900"
												>
													Change Password
													<div style={{ float: "right" }}>
													<ImCross onClick={handleCloseModal} />
													</div>
												</Dialog.Title>
												<div className="mt-2">
													<Formik
														initialValues={{
															currentPassword: "",
															newPassword: "",
															confirmpassword: "",
														}}
														validateOnBlur={false}
														validate={(values) => {
															const errors = {};
														
															if (!values.currentPassword) {
																errors.currentPassword = "Required";
															}
															if (!values.newPassword) {
																errors.newPassword = "Required";
															}
															if (!values.confirmpassword) {
																errors.confirmpassword = "Required";
															}
															if (
																values.newPassword !== "" &&
																values.confirmpassword !== "" &&
																values.newPassword !== values.confirmpassword
															) {
																errors.confirmpassword =
																	"Both password must be same";
															}
															return errors;
														}}
														onSubmit={(values, { resetForm }) => {
															let dataForUpdate = {
																...values,
																userId: user._id,
															};

															updatePassword(dataForUpdate).then((result) => {
																if (result && result.status == 200) {
																	swal({
																		title: "Success",
																		text: "Password Updated Successfully",
																		icon: "success",
																		button: "Ok",
																	}).then(() => {
																		window.location.reload();
																	});
																} else {
																	swal({
																		icon: "error",
																		title: "Update Password",
																		text: "Incorrect Details",
																		button: "Continue",
																	}).then(() => {
																		// window.location.reload();
																		resetForm();
																	});
																}
															});
														}}
													>
														{({ isSubmitting }) => (
															<Form>
																<Field
																	type="password"
																	name="currentPassword"
																	placeholder="Current Password"
																	className="w-full"
																	style={{
																		borderRadius: "12px",
																		marginTop: "10px",
																	}}
																/>
																<ErrorMessage
																	name="currentPassword"
																	component="div"
																	style={{ color: "red" }}
																/>
																<Field
																	type="password"
																	name="newPassword"
																	placeholder="Enter new password"
																	className="w-full"
																	style={{
																		borderRadius: "12px",
																		marginTop: "10px",
																	}}
																/>
																<ErrorMessage 
																name="newPassword" 
																component="div" 
																style={{ color: "red" }} />
																<Field
																	type="password"
																	name="confirmpassword"
																	placeholder="Confirm new password"
																	className="w-full"
																	style={{
																		borderRadius: "12px",
																		marginTop: "10px",
																	}}
																/>
																<ErrorMessage
																	name="confirmpassword"
																	component="div"
																	style={{ color: "red" }}
																/>
																<button
																	type="submit"
																	// disabled={isSubmitting}
																	className=" mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
																>
																	Submit
																</button>
															</Form>
														)}
													</Formik>
												</div>
											</Dialog.Panel>
										</Transition.Child>
									</div>
								</div>
							</Dialog>
						</Transition>
					</div>
				</div>
			</ProgressContext.Provider>
		</>
	);
};

export default HorizontalNav;
