import React, { useState, Fragment, useEffect } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  getXIUserList,
  postXIUserLevel,
  ListXIMultiplier,
  ListXILevel,
  ListXICategory,
  ListXIPanels,
  updateXIInfo,
  XISlots,
  availableSlots,
} from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { Button } from "@mui/material";
import moment from "moment";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const XIOnboarding = () => {
  const [userList, setUserList] = React.useState([]);
  const [level, setLevel] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [panels, setPanels] = React.useState([]);
  const [multiplier, setMultiplier] = React.useState([]);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [otpModal, setotpModal] = React.useState(null);
  const [newLevel, setNewLevel] = React.useState(0);
  const [xiIdTemp, setXiIdTemp] = React.useState(null);
  const [modal1, setModal1] = React.useState(false);
  const [slotstructure, setslotstructure] = useState([]);
  const [availableSlot, setAvailableSlot] = React.useState(null);
  const [bookedSlot, setBookedSlot] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [allSlotsOfxi, setAllSlotsOfxi] = React.useState([]);
  const [hoveredSlot, setHoveredSlot] =useState(null);
  const [selectedUserData, setSelectedUserData] = React.useState({
    userName: null,
    level: null,
    category: null,
    panel: null,
    performance: null,
    _id: null
  })
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

  const navigate = useNavigate();

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      //console.log(res);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.list_XI === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);



  React.useEffect(() => {
    const initial = async () => {
      let token = getStorage("access_token");
      let user = JSON.parse(getStorage("user"));
      let response = await getXIUserList({ user_id: user._id }, token);
      //console.log(response);
      if (response && response.status === 200) {
        setUserList(response.data);
      }
      let response1 = await ListXILevel();
      if (response1 && response1.status === 200) {
        setLevel(response1.data.category);
      }

      let response2 = await ListXIMultiplier();
      if (response2 && response2.status === 200) {
        setMultiplier(response2.data.category);
      }
      let response3 = await ListXICategory();
      if (response3 && response3.status === 200) {
        setCategory(response3.data.category);
      }
      let response4 = await ListXIPanels();
      if (response4 && response4.status === 200) {
        setPanels(response4.data.panels);
      }
    };
    initial();
  }, []);

  const setSlotsdate = (data) => {
    let alldates = [];
    let allslots = [];
    let tempslot = [];
    let tempdate = null;
    let customdate = null;
    let tempstart = null;
    let tempend = null;
    for (let i = 0; i < data.length; i++) {
      tempdate = new Date(data[i].startDate.toLocaleString());
      customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth()) + 1) + "-" + tempdate.getFullYear();
      if (!alldates.includes(customdate)) {
        alldates.push(customdate);
        alldates.sort();
        alldates.reverse();
      }
    }
    // setallslotdates(alldates);
    for (let i = 0; i < alldates.length; i++) {
      tempslot = [];
      for (let j = 0; j < data.length; j++) {
        tempstart = "";
        tempend = "";
        tempdate = new Date(data[j].startDate.toLocaleString());
        customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth()) + 1) + "-" + tempdate.getFullYear();
        if (alldates[i] == customdate) {
          tempdate = new Date(data[j].startDate.toLocaleString());
          if (tempdate.getHours() < 9) {
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getHours();
          tempstart = tempstart + ":";
          if (tempdate.getMinutes() < 9) {
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getMinutes();
          tempdate = new Date(data[j].endDate.toLocaleString());
          if (tempdate.getHours() < 9) {
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getHours();
          tempend = tempend + ":";
          if (tempdate.getMinutes() < 9) {
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getMinutes();
          tempslot.push({
            startTime: tempstart,
            endTime: tempend,
            data: data[j]
          })
        }
      }
      allslots.push({
        slots: tempslot,
        date: alldates[i]
      });
    }
    setAllSlotsOfxi(allslots)
    setslotstructure(allslots);
    getSlotCount(allslots);
  }

  const getSlotCount = (allslots) => {
    let availableSlotCount = 0;
    let bookedSlotCount = 0;
    allslots.map((slotDetails, i) => {
      const availableSlots = slotDetails.slots.filter((slots, i) => {
        return ( slots.data.status === "Available");
      })
      const bookedSlots = slotDetails.slots.filter((slots, i) => {
        return ( slots.data.status === "Pending");
      })
      availableSlotCount = availableSlotCount + availableSlots.length;
      bookedSlotCount = bookedSlotCount + bookedSlots.length;
    });
    setAvailableSlot(availableSlotCount);
    setBookedSlot(bookedSlotCount);
  }

  const getSlotDetails = async (id) => {
    let res = await XISlots(id);
    if (res) {
      setSlotsdate(res.data);
    }
  };

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= userList.length; i++) {
      document?.getElementById("AdminUserCrd" + i)?.classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document?.getElementById("AdminUserCrd" + ((p - 1) * 5 + j))?.classList.remove("hidden");
    }
  };

  const handleLevelChange = (level, id) => {
    //console.log(level)
    setotpModal(true);
    setXiIdTemp(id);
  }

  const handlePostNewLevel = async () => {
    let data = parseInt(newLevel);
    let token = await getStorage("access_token");
    setotpModal(false);
    let response = await postXIUserLevel({ user_id: xiIdTemp, level: newLevel }, token);
    if (response) {
      swal({
        title: "Level Upgraded Successfully!",
        text: "XI Level is upgraded successfully!",
        icon: "success",
      }).then((respose) => {
        window.location.reload();
      });
    } else {
      swal({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
      }).then((respose) => {
        window.location.reload();
      });
    }
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const getWeekNumber = (day) => {
    const startDate = new Date(day.getFullYear(), 0, 1);
    var days = Math.floor((day - startDate) / (24 * 60 * 60 * 1000));          
    var weekNumberOfTheDay = Math.ceil(days / 7);
    return weekNumberOfTheDay;
  }

  const filterSlotStructure = (selectedMonth) => {
    let filteredSlotStructure
    if(selectedMonth == "This month") {
      const month = months[new Date().getMonth()]
      filteredSlotStructure = allSlotsOfxi.filter((slotdetails) => {
        return month == months[new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth()]
      })
      return(filteredSlotStructure)
    } 
    if(selectedMonth == "Next 6 months") {
      const month = new Date().getMonth();
      filteredSlotStructure = allSlotsOfxi.filter((slotdetails) => {
        return (month == months[new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth()] || 
          month+1 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth() ||
          month+2 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth() ||
          month+3 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth() ||
          month+4 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth() ||
          month+5 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth() ||
          month+6 == new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY')).getMonth()
        )
      })
      return(filteredSlotStructure)
    }

    if(selectedMonth == "This week") {
      const today = new Date();
      const weekNumberOfToday = getWeekNumber(today);
      filteredSlotStructure = allSlotsOfxi.filter((slotdetails) => {
        return (weekNumberOfToday == getWeekNumber(new Date(moment(slotdetails.date, "DD-MM-YYYY").format('MM-DD-YYYY'))))
      })
      return(filteredSlotStructure)
    }
  }

  useEffect(() => {
    if(selectedUserData._id) {
      if(selectedMonth != null && selectedMonth != "All time") {
        getSlotCount(filterSlotStructure(selectedMonth));
        setslotstructure(filterSlotStructure(selectedMonth));
      }
      if(selectedMonth == "All time"){
        setslotstructure(allSlotsOfxi);
        getSlotCount(allSlotsOfxi);
      }
    }
  }, [selectedMonth])

  const filterValues = ["This week", "This month", "Next 6 months",];
  
  return (
    <div className="p-5">
      {otpModal &&
        <Transition
          appear
          show={otpModal}
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
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-auto">
                    <div className='py-5 w-full bg-blue-900 flex'>
                      <p className="text-lg mx-5 text-center text-white font-semibold">
                        Enter New Level
                      </p>
                    </div>
                    <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-56"></div>
                    <div className="mx-56 my-5">
                      <h3>Enter New Level</h3>
                      <input
                        id="smsOTP"
                        type="number"
                        name="smsOTP"
                        onChange={(e) => {
                          setNewLevel(e.target.value);
                        }}
                        placeholder="Enter New Level"
                        className="w-full"
                        style={{ borderRadius: "12px", marginTop: "10px" }}
                      ></input>
                    </div>
                    <div className="w-full my-16 flex justify-center">
                      <button
                        className="border-2 text-black font-bold py-3 px-8 w-fit md:mx-4 text-xs rounded"
                        onClick={() => {
                          handlePostNewLevel()
                        }}>Submit</button>
                    </div>
                    <div className="flex my-16 justify-center">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }} onClick={() => { setotpModal(false) }}>Cancel</button></div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      }
      <p className="text-2xl font-semibold mx-10">XI Users List</p>
      <div className="mt-3">
        <div className="flex flex-col mx-10">
          <div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="w-full">
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
                            style={{cursor: "pointer"}}
                            className={
                              index < 5 ? "bg-gray-100 cursor-pointer" : "bg-gray-100 hidden"
                            }
                            onClick={() => {
                              setModal1(true);
                              setSelectedUserData({
                                userName: user.username,
                                level: user.xi_info.level,
                                category: user.xi_info.category,
                                panel: user.xi_info.panels,
                                performance: user.xi_info.multiplier,
                                _id: user._id
                              })
                              getSlotDetails(user._id);
                            }}
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
                              {user.email}
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                              <Link to={`/admin/AdminUserProfile/${user._id}`} >
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
      {modal1 && (
        <Transition
          appear
          show={modal1}
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
              className="fixed inset-0"
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
              <div className="fixed inset-0 bg-opacity-0" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
                <div className="flex min-h-full items-center justify-center p-4 text-center lg:max-w-xl lg:ml-auto xl:max-w-3xl xl:[920px]">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel style={{transform: "translate3d(25%, 0, 0)"}} className="w-full  overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl h-[95vh]">
                      <div className={`${!modal1 ? "hidden" : "block"} h-full`}>
                        <div className="w-full h-full">
                          <div className="w-full h-full bg-[#FFFFFF]">
                            <div className="border-b-2	bg-[#FAFAFA]">
                              <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                <div className="mt-auto mb-auto">
                                  <p className="font-semibold text-[#333333]">{`${selectedUserData.userName}'s details`}</p>
                                </div>
                                <div className="">
                                  <button type="button" class="close" data-dismiss="modal" className="focus:outline-none border-none text-[30px]"
                                    onClick={() => {
                                      setModal1(false);
                                      setslotstructure([]);
                                    }}
                                  >&times;<span class="sr-only">Close</span></button>
                                </div>
                              </div>
                            </div>
                            <div className="w-full px-4 py-8 flex flex-col gap-[40px] border-b">
                              <div className="flex flex-row gap-[20px] w-full">
                                <div className="flex flex-row justify-between w-2/4">
                                  <div className="text-[#333333] mt-auto mb-auto font-semibold lg:text-sm md:text-sm sm:text-[18px]">Level</div>
                                  {/* {user.level}
                                  <Button onClick={() => {
                                    handleLevelChange(user.level,user._id)
                                  }}>Edit</Button> */}
                                  <div>
                                    <select
                                      id="level"
                                      name="level"
                                      style={{boxShadow: "none", borderRadius: "5px", border: "0.1px solid #333333"}}
                                      className="block py-1 w-[200px] focus:outline-none text-[#888888] lg:text-sm md:text-sm sm:text-[18px]"
                                      value={selectedUserData.level}
                                      onChange={async(event) => {
                                        let update = await updateXIInfo({id:selectedUserData._id , updates:{levelId: event.target.value}});
                                        if(update && update.status==200){
                                        }
                                      }}
                                    >
                                      <option className="text-sm" value="" >Select</option>
                                      {level &&
                                        level.map((item) => {
                                          return (
                                            <option value={item._id}>{item.level}</option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </div> 
                                <div className="flex flex-row justify-between w-2/4">
                                  <div className="text-[#333333] mt-auto mb-auto font-semibold lg:text-sm md:text-sm sm:text-[18px]">Category</div>
                                  {/* {user.level}
                                  <Button onClick={() => {
                                    handleLevelChange(user.level,user._id)
                                  }}>Edit</Button> */}
                                  <div className="">
                                    <select
                                      id="category"
                                      name="category"
                                      style={{ boxShadow: "none", borderRadius: "5px", border: "0.1px solid #333333"}}
                                      className="block  py-1 w-[200px] focus:outline-none text-[#888888] lg:text-sm md:text-sm sm:text-[18px]"
                                      value={selectedUserData.category}
                                      onChange={async(event) => {
                                        let update = await updateXIInfo({id:selectedUserData._id , updates:{categoryId: event.target.value}});
                                        if(update.status==200){
                                        }
                                      }}
                                    >
                                      <option value="" >Select</option>
                                      {category &&
                                        category.map((item) => {
                                          return (
                                            <option value={item._id}>{item.category}</option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </div>  
                              </div>
                              <div className="flex flex-row justify-between gap-[20px]">
                                <div className="flex flex-row justify-between w-2/4">
                                  <div className="text-[#333333] mt-auto mb-auto font-semibold lg:text-sm md:text-sm sm:text-[18px]">Panel</div>
                                  {/* {user.level}
                                  <Button onClick={() => {
                                    handleLevelChange(user.level,user._id)
                                  }}>Edit</Button> */}
                                  <div className="">
                                    <select
                                      id="panel"
                                      name="panel"
                                      style={{ boxShadow: "none", borderRadius: "5px", border: "0.1px solid #333333"}}
                                      className="block py-1 w-[200px] focus:outline-none text-[#888888] lg:text-sm md:text-sm sm:text-[18px]"
                                      value={selectedUserData.panel}
                                      onChange={async(event) => {
                                        let update = await updateXIInfo({id:selectedUserData._id , updates:{panelId: event.target.value}});
                                        if(update.status==200){
                                        }
                                      }}
                                    >
                                      <option value="" selected disabled>Select</option>
                                      {panels &&
                                        panels.map((item) => {
                                          return (
                                            <option value={item._id}>{item.panel}</option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </div> 
                                <div className="flex flex-row justify-between w-2/4">
                                  <div className="text-[#333333] mt-auto mb-auto font-semibold lg:text-sm md:text-sm sm:text-[18px]">Performance</div>
                                  <div className="">
                                    <select
                                      id="multiplier"
                                      name="multiplier"
                                      style={{ boxShadow: "none", borderRadius: "5px", border: "0.1px solid #333333"}}
                                      className="block py-1 w-[200px] focus:outline-none text-[#888888] lg:text-sm md:text-sm sm:text-[18px]"
                                      value={selectedUserData.multiplier}
                                      onChange={async(event) => {
                                        let update = await updateXIInfo({id:selectedUserData._id , updates:{multiplierId: event.target.value}});
                                        if(update.status==200){
                                        }
                                      }}
                                    >
                                      <option value="" >Select</option>
                                      {multiplier &&
                                        multiplier.map((item) => {
                                          return (
                                            <option value={item._id}>{item.multiplier}</option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className="px-4 py-8 flex flex-row justify-between border-b bg-[#FAFAFA]">
                              <div className="flex flex-row gap-[30px]">
                                <div className="text-[#333333] mt-auto mb-auto font-semibold lg:text-sm md:text-sm sm:text-[18px]">Slots</div>
                                <div className="">
                                  <select
                                    style={{ boxShadow: "none", borderRadius: "5px", border: "0.1px solid #333333"}}
                                    className="block py-1 w-[200px] focus:outline-none text-[#888888] lg:text-sm md:text-sm sm:text-[18px]"
                                    onChange={(e) => { 
                                      setSelectedMonth(e.target.value);
                                      filterSlotStructure(e.target.value);
                                    }}
                                  >
                                    <option className="text-[#333333] font-light lg:text-sm">All time</option>
                                    {filterValues &&
                                      filterValues.map((item, index) => {
                                        return (
                                          <option value={item}>{item}</option>
                                        );
                                      })}
                                  </select>
                                </div>
                              </div>
                              <div className="flex flex-row gap-[30px]">
                                <div className="text-[#228276] mt-auto mb-auto lg:text-sm font-semibold md:text-sm sm:text-[18px] py-1.5 px-3 rounded" style={{backgroundColor: "rgba(34, 130, 118, 0.1)"}}>{`Available - ${availableSlot}`} </div>
                                <div className="text-[#BE6F3F] mt-auto mb-auto lg:text-sm font-semibold md:text-sm sm:text-[18px] py-1.5 px-3 bg-[#EAEAEA] rounded">{`Booked - ${bookedSlot}`}</div>
                              </div>
                            </div> 
                            <div className="py-2 inline-block w-full">
                              <div className="h-[45vh]" style={{overflowY: "scroll", overflowX: "hidden"}}>
                                <table className="w-full">
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
                                        Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                                      >
                                        Slots
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {slotstructure != null && slotstructure.length > 0 ? (
                                      <>
                                        {slotstructure.map((slotDetails, index) => {
                                          return (
                                            <>
                                              <tr id={"crd" + (index + 1)}
                                                className={`${"bg-white"} border-b py-4`}
                                              >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                  {index + 1}
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                  <span>{slotDetails.date}</span>
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                  {slotDetails.slots.map((slottime, index) => {
                                                    const slotElement = (
                                                      <>
                                                      <span style={{ width: '100px',
                                                        color: (slottime.data.status) === "Available" ? '#228276': '#BE6F3F', 
                                                        backgroundColor: (slottime.data.status) === "Available" ? 'rgba(34, 130, 118, 0.1)': '#EAEAEA' }} 
                                                        className="rounded px-3 py-1.5 text-xs mr-2 mb-1 cursor-pointer"
                                                        id={slottime.data._id}
                                                        onMouseEnter={() => {
                                                          if(slottime.data.interviewId) {
                                                            setHoveredSlot(slottime.data.interviewId)
                                                          }
                                                        }}   
                                                        onMouseLeave={() => setHoveredSlot('')}                                         
                                                      >
                                                        {slottime.startTime} - {slottime.endTime}
                                                      </span>
                                                      <ReactTooltip
                                                        anchorId={slottime.data._id}
                                                        place="top"
                                                        content={hoveredSlot}
                                                        className="tooltip"
                                                        style={{color: "#FAFAFA", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", backgroundColor: "#333333"}}
                                                      />
                                                      </>
                                                    );
                                                    return (index > 0 && index % 4 === 0) ? [<br key={`br1-${index}`} />, <br key={`br2-${index}`} />, slotElement] : slotElement;
                                                  })}
                                                  
                                                </td>                                                                        
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </> 
                                    ) : (
                                      <></>
                                    )}
                                  </tbody>
                                </table>
                              </div>
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

export default XIOnboarding;
