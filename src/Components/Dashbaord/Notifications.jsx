import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getUserNotification, markNotiReadForUser , deleteNotification } from "../../service/api";
import { ReactSession } from "react-client-session";
import { timeDifferenceCalculator } from "time-difference-calculator";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
// Assets
import { BsBell } from "react-icons/bs";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import swal from "sweetalert"

const NotificationPopOver = (props) => {
	const [notification, setNotification] = React.useState(null);
	const [showNoti, setShowNoti] = React.useState(null);

	// To mark notification as read
   	const [read, setRead] = React.useState(true);
   	const [arr, setArr] = React.useState([]);

	// To get notification count
	const [notiCount, setNotiCount] = React.useState(0);

	const getNotification = async (user, token) => {
		let res = await getUserNotification(user, token);
		if (res) {
			// console.log("res ->" , res?.data)
			setNotification(res.data?.notifications);
			const allNotifications = res.data?.notifications.filter(notif => notif.isRead === false);
			const unreadNotificationLength = allNotifications.length;
			setNotiCount(unreadNotificationLength);

		}
	};

	function sortByTime(a, b) {
		return a.timeCreated < b.timeCreated ? 1 : -1;
	}

	const markAsReadNoti = async (noti) => {
		try {
			// console.log("arr" , arr)
			if(arr.includes(noti._id)){
				setArr(arr.filter((item) => console.log("item" , item)));
        		setRead(false);
			}
			else{
				setArr([...arr, noti._id]);
				setRead(true);
			}
			// console.log("Read" , read)
			setNotiCount(notiCount - 1)
			let user = JSON.parse(await getStorage("user"));
			let token = await getStorage("access_token");
			let res = await markNotiReadForUser(
				{ noti_id: noti._id, user_id: user._id , isRead : read },
				token
			);
			if (res) {
				// setNotification(notification.filter((item) => item._id !== noti._id));
				// console.log("res ->" , res)
			}
		} catch (error) {}
	};

	const markAllUtility = async (el, user_id, token) => {
		await markNotiReadForUser({ noti_id: el._id, user_id: user_id }, token);
	};

	const readAllNotification = async () => {
		try {
			let user = JSON.parse(await getStorage("user"));
			let token = await getStorage("token");
			await notification.forEach((el) => {
				// console.log("el" , el._id)
				// markAllUtility(el, user._id, token);
				markAsReadNoti(el);
				setArr([...arr, el._id]);
				// setArr(arr.push(el._id))
				// console.log("arr" , arr)
			});
			// setNotification([]);
		} catch (err) {}
	};

	// First Popup
	// Delete One Notification
	const handlePopup1 = async (noti)=>{
		swal({
			title : "Are you sure you want to delete notification ?",
			text : "Click Ok to continue",
			icon : "warning",
			buttons : true,
			dangerMode : true
		}).then((res)=>{
			if(res){
				handleDeleteNotification(noti)
				window.location.reload()
			}
			else{
				swal("Request cancelled");
			}
		})
	}

	// Delete All Notifications
	const handlePopup2 = async ()=>{
		swal({
			title : "Are you sure you want to delete all the notifications ?",
			text : "Click Ok to continue",
			icon : "warning",
			buttons : true,
			dangerMode : true
		}).then((res)=>{
			if(res){
				deleteAllNotification()
				// window.location.reload()
			}
			else{
				swal("Request cancelled");
			}
		})
	}
	// Delete one notification
	const handleDeleteNotification = async (noti) => {
		try {
			// console.log("noti", noti)
			let user = JSON.parse(await getStorage("user"));
			// console.log("user", user)
			let token = await getStorage("token");
		  let res = await deleteNotification(
			{ noti_id: noti._id, user_id: user._id },
			token
		  );
		//   console.log("res", res);
		  if (res?.data?.message === "Notification Deleted") {
			setNotification(notification.filter((item) => item._id !== noti._id));
		  }
		} catch (err) {}
	  };
	
	  // Delete Helper
	  const deleteUtility = async (el, user_id, token) => {
		await deleteNotification({ noti_id: el._id, user_id: user_id }, token);
	  };
	
	  //   Delete All Notification
	  const deleteAllNotification = async () => {
		try {
		  let user = JSON.parse(await localStorage.getItem("user"));
		  let token = await localStorage.getItem("token");
		  await notification.forEach((el) => {
			deleteUtility(el, user._id, token);
		  });
		  setNotification([]);
		//   window.location.reload()
		} catch (err) {}
	  };

	React.useEffect(() => {
		const initial = async () => {
			let user = JSON.parse(await getStorage("user"));
			let token = await getStorage("access_token");
			getNotification(user, token);
		};
		initial();
	}, [notiCount]);

	return (
		<Popover className="relative mt-1">
			{({ open }) => (
				<>
					<Popover.Button
						className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
					>
						{notification && notification.length > 0 && (
							<div
								className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10"
								style={{ backgroundColor: "#034488" }}
							></div>
						)}
						<BsBell className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
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
						<Popover.Panel className="absolute md:left-1/2 left-[30vw] z-10 mt-3 md:w-[40vw] w-[95vw] max-w-sm -translate-x-full transform px-4 sm:px-0 lg:max-w-3xl">
							<div  style={{height:"auto",overflow: "auto"}} className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
								<div className="relative gap-8 bg-white p-3 lg:grid-cols-2 flex justify-between">
									<div className="flex items-center text-gray-800 space-x-2">
										<BsBell className="text-md" />
										<p>Notifications</p>{" "}
										<p className="text-sm">
											{notification && notification.length > 0 && (
												<p>({notiCount} unread)</p>
											)}
										</p>{" "}
									</div>
									{notification && notification.length > 0 && (
										<>
										{/* <p
										  className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
										  onClick={readAllNotification}
										>
										  Mark all as read
										</p> */}
										<p
										  className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
										  onClick={handlePopup2}
										>
										  Delete all
										</p>
									  </>
									)}
								</div>
								<div className="bg-gray-50">
									{(notification === null ||
										notification === undefined ||
										notification.length == 0) && (
										<p className="p-3">
											No New Notification. You are all caught up.
										</p>
									)}

									{notification && (
										<div>
											{notification.map((item, index) => {
												// console.log("item" , item.isRead)
												return (
													<div>
														<Accordion>
															{item.isRead === true || arr.includes(item?._id) ? (<AccordionSummary
																expandIcon={<ExpandMoreIcon />}
																aria-controls="panel1a-content"
																id="panel1a-header"
																style = {{backgroundColor:"#DDDDDD"}}
																// className = {item.isRead === "true" ? ("bg-red-800") : ("")}
															>
																<Typography
																	id="hello"
																	className="font-semibold text-sm capitalize"
																	style={{ fontWeight: "bold" }}
																>
																	{item.title}
																</Typography>
																<div className="text-end ml-auto text-xs">
																	 {/* {arr.includes(item._id) ? (
                                    									<p
                                      										className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                      										// onClick={() => {
                                        									// markAsReadNoti(item);
                                      										// }}
                                    									>
                                      									Marked as read
                                    									</p>
                                  										) : (
                                    									<p
                                    									  className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									  onClick={() => {
                                    									    markAsReadNoti(item);
                                    									  }}
                                    									>
                                    									  Mark as read
                                    									</p>
                                  										)} */}
																		<p className="text-gray-400 hover:text-blue-600 cursor-pointer">
																			Marked As Read
																		</p>
																	<p
                                    									className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									onClick={() => {
                                      										handlePopup1(item);
                                    									}}
                                  									>
                                    								Delete Notification
                                  									</p>
																	<p>
																		{timeDifferenceCalculator(item.timeCreated)}
																	</p>
																</div>
															</AccordionSummary>) : (<AccordionSummary
																expandIcon={<ExpandMoreIcon />}
																aria-controls="panel1a-content"
																id="panel1a-header"
																style = {{backgroundColor:"#FFFFFF"}}
																// className = {item.isRead === "true" ? ("bg-red-800") : ("")}
															>
																<Typography
																	id="hello"
																	className="font-semibold text-sm capitalize"
																	style={{ fontWeight: "bold" }}
																>
																	{item.title}
																</Typography>
																<div className="text-end ml-auto text-xs">
																	 {/* {item.isRead === "true" ? (
                                    									<p
                                      										className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                      										// onClick={() => {
                                        									// markAsReadNoti(item);
                                      										// }}
                                    									>
                                      									Marked as read
                                    									</p>
                                  										) : (
                                    									<p
                                    									  className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									  onClick={() => {
                                    									    markAsReadNoti(item);
                                    									  }}
                                    									>
                                    									  Mark as read
                                    									</p>
                                  										)} */}
																		<p className="text-gray-400 hover:text-blue-600 cursor-pointer"
																			onClick={() => {
                                    									    markAsReadNoti(item);
                                    									  }}
																		>
																			Mark as Read
																		</p>
																	<p
                                    									className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									// onClick={() => {
                                      									// 	handleDeleteNotification(item);
                                    									// }}
																		onClick={()=>{
																			handlePopup1(item)
																		}}
                                  									>
                                    								Delete Notification
                                  									</p>
																	<p>
																		{timeDifferenceCalculator(item.timeCreated)}
																	</p>
																</div>
															</AccordionSummary>)}
															{
																item.isRead === true || arr.includes(item?._id) ? (<AccordionDetails style = {{backgroundColor:"#DDDDDD"}}>
																<Typography>
																	{item.message}
																</Typography>
															</AccordionDetails>) : (<AccordionDetails style = {{backgroundColor:"#FFFFFF"}}>
																<Typography>
																	{item.message}
																</Typography>
															</AccordionDetails>)
															}
														</Accordion>
													</div>
												);
											})}
										</div>
									)}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

export default NotificationPopOver;
