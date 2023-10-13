import React from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ReactSession } from "react-client-session";
import { LogoutAPI, updatePassword } from "../../service/api";
import NotificationPopOver from "../Dashbaord/Notifications.jsx";
import { getProfileImage } from "../../service/api";
import "../../assets/stylesheet/layout.scss";
import { Link } from "react-router-dom";
// Assets
import logo from "../../assets/images/logo.png";
import Avatar from "../../assets/images/UserAvatar.png";
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
import { ImCross } from "react-icons/im";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
const Navbar = (props) => {
	let [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const Logout = async () => {
		let user = await getStorage("user");
		user = JSON.parse(user);
		let res = await LogoutAPI(user._id);
		await ls.set("user", null);
		await ls.set("access_token", null);
		window.location.href = "/login";
	};

	const Changepassword = async () => {};

	const [ProfilePic, setProfilePic] = React.useState(undefined);
	const [user, setUser] = React.useState(null);

	React.useEffect(() => {
		const initial = async () => {
			let access_token1 = await getStorage("access_token");
			let user = JSON.parse(await getStorage("user"));
			if (access_token1 === "null")
				await ls.set("access_token", user.access_token);
			if (user && user.profileImg) {
				let image = await getProfileImage({ id: user._id }, user.access_token);
					if (image?.status === 200) {
					await ls.set("profileImg", JSON.stringify(image));
					let base64string = btoa(
						String.fromCharCode(...new Uint8Array(image.data.Image.data))
					);
					let src = `data:image/png;base64,${base64string}`;
					await setProfilePic(src);
				}
			}
			setUser(user);
		};
		initial();
	}, []);

	return (
		<div
			className="flex items-center navbar w-full z-100 "
			style={{ zIndex: 9999 }}
		>
			<div className="text-slate-600 text-lg 2xl:block  ">
				<img className="h-10 mx-5" src={logo} />{" "}
			</div>

			<div
				className="space-x-8   ml-auto flex mr-8 items-center"
				style={{ zIndex: 9999 }}
			>
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
										{user && user.firstName && (
											<p className="text-md text-semibold">{user.firstName}</p>
										)}
									</div>
									<img
										src={
											user && user.profileImg && ProfilePic
												? ProfilePic
												: Avatar
										}
										// src={Avatar}
										className="h-7 w-7 rounded-full"
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
								<Popover.Panel className="absolute left-screen z-10 mt-3 w-[250px] w-max-content max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
									<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
										<div className="bg-gray-50 p-4">
											<span className="flex items-center mb-3">
												<div className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer">
													<Link
														to="/company/profile"
														className="flex space-x-2 items-center"
													>
														<AiOutlineUser /> <p>View Profile</p>
													</Link>
												</div>
											</span>
											<span className="flex items-center row">
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
					<Dialog as="div" className="relative z-10" onClose={closeModal}>
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
													<ImCross onClick={closeModal} />
											</div>
										</Dialog.Title>
										<div className="mt-2">
											<Formik
												initialValues={{
													currentPassword: "",
													newPassword: "",
													confirmpassword: "",
												}}
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
														<ErrorMessage name="password" component="div" />
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
	);
};

export default Navbar;
