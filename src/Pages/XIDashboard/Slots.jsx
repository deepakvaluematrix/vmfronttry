import React, { useState, Fragment, useEffect } from "react";
import {
  addSlot,
  XISlots,
  updateSlot,
  newslotupdater,
  deleteSlot,
  ValidateSlot,
  updateBlockedDate,
  getBlockedDate,
  updateCurrentSlot,
} from "../../service/api.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { BiBlock } from "react-icons/bi";
import { Dialog, Transition } from "@headlessui/react";
import DateTimePicker from "react-datetime-picker";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ImCross } from "react-icons/im";
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import swal from "sweetalert";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import "../../assets/stylesheet/layout.scss";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";

const JobList = () => {
  const [sid, setSid] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [slots, setSlots] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedSlots, setSelectedSlot] = useState([]);
  const [slotstructure, setslotstructure] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const [modal, setModal] = React.useState(false);
  const [bdmodal, setBDModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [modal3, setModal3] = React.useState(false);
  const [slotbookingscreen, setslotbookingscreen] = React.useState(0);
  const [slotdate, setslotdate] = React.useState(moment().format("YYYY-MM-DD"));
  const [blockdate, setblockdate] = React.useState(null);
  const [slotrange, setslotrange] = React.useState(null);
  const [slotmap, setslotmap] = React.useState(null);
  const [allslotdates, setallslotdates] = React.useState(null);
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [page, setPage] = React.useState(1);
  const [updatedslotDate, setupdatedslotDate] = React.useState(false);
  const [active, setActive] = useState(false);
  const [activeIcon, setActiveIcon] = useState({});
  const [editSlotValue, setEditSlotValue] = useState();
  const [slotDuration, setSlotDuration] = useState(1);
  const [editStatus,setEditStatus] = useState('');
  const [timeFrameSelected,setTimeFrameSelected] = useState(false);
  const [selectedBlockDate, setSelectedBlockDate] = useState(new Date());
  const [orderedBlockedDates, setOrderedBlockedDates] = useState([]);
  const [addSlotStatus, setAddSlotStatus] = useState(false);
  const [showTooltipOnTimeFrame, setShowTooltipOnTimeFrame] = useState(null);
  const [selectedSlotTiming, setSelectedSlotTiming] = useState(null);

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
    setallslotdates(alldates);
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
    setslotstructure(allslots);
  }

  const updateSlots = (slotval) => {
    let hour = null;
      let minutes = null;
      let endhour = null;
      let endminutes = null;
      let temp = [];
      for (let i = 0; i < 1440; i += slotval) {
        if (parseInt(i / 60) > 9) {
          hour = parseInt(i / 60).toString();
        } else {
          hour = "0" + parseInt(i / 60).toString()
        }
        if (parseInt(i % 60) > 9) {
          minutes = parseInt(i % 60).toString();
        } else {
          minutes = "0" + parseInt(i % 60).toString()
        }
        if (parseInt((i + slotval) / 60) > 9) {
          endhour = parseInt((i + slotval) / 60).toString();
        } else {
          endhour = "0" + parseInt((i + slotval) / 60).toString()
        }
        if (parseInt((i + slotval) % 60) > 9) {
          endminutes = parseInt((i + slotval) % 60).toString();
        } else {
          endminutes = "0" + parseInt((i + slotval) % 60).toString()
        }
        temp.push({
          value: hour + ":" + minutes,
          endtime: endhour + ":" + endminutes,
          status: false,
          selected: false
        });
        setslotmap(temp);
      }
      const slotStur = slotstructure.find(tempDate => moment(tempDate.date, "DD-MM-YYYY").format('YYYY-MM-DD') == slotdate)
      slotStur?.slots.forEach((items) => {
        if(items.startTime == "23:00" && items.endTime == "00:00") {
          items.endTime = "24:00";
        }
      })
      temp.forEach(ttt => {
        slotStur?.slots?.forEach(ppp => {
          if (ppp.startTime == ttt.value || ppp.endTime == ttt.endtime)
            ttt.selected = true
        })
      })
  }

  const refreshBlockedDates = async () => {
    let user = JSON.parse(getStorage("user"));
    setUser(user);
    let dts = await getBlockedDate(user._id);
    if (dts) {
      setBlockedDates(dts.data.dates);
      const sortedBlockedDates = dts.data.dates.sort((a, b) => new Date(a) - new Date(b))
      setOrderedBlockedDates(sortedBlockedDates);
    }
  }

  useEffect( ()=> {refreshBlockedDates()} ,[orderedBlockedDates]);

  useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(getStorage("user"));
      setUser(user);
      let res = await XISlots(user._id);
      if (res) {
        setSlots(res.data);
        setSlotsdate(res.data);
        setAddSlotStatus(false);
      }
    };
    getData();
  }, [addSlotStatus]);

  useEffect(() => {
    let start = new Date(startTime);
    if (startTime) {
      setEndTime(new Date(start.setHours(start.getHours() + 1)));
    }
  }, [startTime]);

  useEffect(()=>{
    let slotval = 60;
    updateSlots(slotval);

    const currentUrl = window.location.href;
    if(currentUrl.endsWith("slots?addslot=1")) {
      setModal(true)
    }
  }, [])

  useEffect(()=>updateSlots(slotDuration), [slotdate, slotDuration])

  const handleSubmit = async () => {
    let user = JSON.parse(getStorage("user"));
    let id = user._id;
    setLoading(true);
    if (editId !== null) {
      let check = await ValidateSlot({ id: id, startTime: startTime });
      if (check.data.check === true) {
        let res = await updateSlot(editId, {
          startDate: startTime,
          endDate: endTime,
        });
        if (res.status === 200) {
          let res1 = await XISlots(user._id);
          if (res1) {
            setSlots(res1.data);
            setSlotsdate(res1.data);
          }
          setLoading(false);
          Swal.fire({
            title: "Update Slots",
            html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot Updated Succesfully.</div></div>',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Continue",
            customClass: {
              popup: 'swal-wide',
              icon: 'icon-class'
            }
          })
          setEditId(null);
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        } else {
          // swal({
          //   icon: "error",
          //   title: "Update Slots",
          //   text: "Something went wrong",
          //   button: "Continue",
          Swal.fire({
            title: "Update Slots",
            html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Something went wrong</div></div>',
            showConfirmButton: true,
            showCancelButton: true,
            showCloseButton: true,
            customClass: {
              popup: 'swal-wide',
              icon: 'icon-class'
            }
          }).then(() => {
            setModal(false);
            setEndTime(null);
            setStartTime(null);
          });
        }
      } else {
        // swal({
        //   icon: "error",
        //   title: "Add Slots",
        //   text: "Slot Limit Exceeded",
        //   button: "Continue",
        Swal.fire({
          title: "Confirm slot removal",
          html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Are you sure you want to remove blocked date!</div></div>',
          showConfirmButton: true,
          showCloseButton: true,
          confirmButtonText: "Continue",
          customClass: {
            popup: 'swal-wide',
            icon: 'icon-class'
          }
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      }
      return;
    }

    let check = await ValidateSlot({ id: id, startTime: startTime });
    if (check.data.check === true) {
      let res = await addSlot([
        { createdBy: id, startDate: startTime, endDate: endTime },
      ]);
      if (res.status === 200) {
        let res2 = await XISlots(user._id);
        if (res2) {
          setSlots(res2.data);
          setSlotsdate(res2.data);
        }
        setLoading(false);
        Swal.fire({
          title: "Add Slots",
          html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot Added Succesfully.</div></div>',
          showConfirmButton: true,
          showCloseButton: true,
          confirmButtonText: "Continue",
          customClass: {
            popup: 'swal-wide',
            icon: 'icon-class'
          }
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      } else {
        Swal.fire({
          title: "Add Slots",
          html: '<div class="container"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Something went wrong</div></div>',
          showConfirmButton: true,
          showCloseButton: true,
          confirmButtonText: "Continue",
          customClass: {
            popup: 'swal-wide',
            icon: 'icon-class'
          }          
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      }
    } else {
      Swal.fire({
        title: "Add Slots",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Slot Limit Exceeded</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Continue",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }  
      }).then(() => {
        setModal(false);
        setEndTime(null);
        setStartTime(null);
      });
    }
  };

  const selectSlots = (slotval) => {
    setSlotDuration(slotval);
    if (slotdate === null) {
      Swal.fire({
        title: "Select Date",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Please Select Date</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Ok",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }  
      });
    } else {
      updateSlots(slotval);
      setslotbookingscreen(1);
      setslotrange(slotval);
    }
  }
  const updateCurrentslots = async (id, start, end) => {
    // let Sdate = moment(start, 'HH:mm').toDate();
    // let Edate = moment(end, 'HH:mm').toDate();
    let formattedStartTime = moment(slotdate + ' ' + start, 'YYYY-MM-DD HH:mm').toDate();
    let formattedEndTime = moment(slotdate + ' ' + end, 'YYYY-MM-DD HH:mm').toDate();
    let data = { slotId: id, startDate: formattedStartTime, endDate: formattedEndTime }
    let res = await updateCurrentSlot(data);
    if (res.status === 200) {
      let res2 = await XISlots(user._id);
      if (res2) {
        setSlots(res2.data);
        setSlotsdate(res2.data);
      }
      setLoading(false);
      Swal.fire({
        title: "Update Slots",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot Updated Succesfully.</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Continue",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(() => {
        setModal1(false);
        setEndTime(null);
        setStartTime(null);
        setSlotDuration(1);
        setslotdate(new Date());
      });
    } else {
      Swal.fire({
        title: "Update Slots",
        html: '<div class="container"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Something went wrong</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Continue",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(() => {
        setModal(false);
        setEndTime(null);
        setStartTime(null);
      });
    }

    // Update the slot data with the latest selection
    const newSlotData = slots.map(slot => {
      if (slot._id === id) {
        return {
          ...slot,
          startTime,
          endTime,
        };
      }
      return slot;
    });
    setSlots(newSlotData);
  }


  const updateslot = (index, slotId, startTime, endTime) => {
    let newslotmap = [...slotmap];

    // Unselect all currently selected slots
    newslotmap = newslotmap.map(slot => {
      if (slot.selected && slot.text ) {
        return {
          ...slot,
          status: false,
          selected: false,
          // text: "",
        };
      }
      return slot;
    });

    // Check if any already selected slots overlap with the current slot
    const overlappingSlots = newslotmap.filter((slot, i) => {
      return i !== index && slot.selected && (
        (slot.value >= startTime && slot.value < endTime) ||
        (slot.endtime > startTime && slot.endtime <= endTime) ||
        (slot.value <= startTime && slot.endtime >= endTime)
      );
    });

    if (overlappingSlots.length > 0) {
      Swal.fire({
        title: "Slots Already Selected",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">The selected slot overlaps with already selected slots. Please choose another slot.</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Ok",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }        
      });
      return;
    }

    // Select the clicked slot
    newslotmap[index].status = true;
    newslotmap[index].selected = true;
    newslotmap[index].text = "Booked";
    newslotmap[index].slotId = slotId;
    newslotmap[index].startTime = startTime;
    newslotmap[index].endTime = endTime;

    setslotmap(newslotmap);

  }


  const updateslotbox = (index) => {
    let newslotmap = [...slotmap];
    if (newslotmap[index].selected && newslotmap[index].status) {
      newslotmap[index].status = false;
      newslotmap[index].selected = false;
    } else if (!newslotmap[index].selected && !newslotmap[index].status) {
      // Check if any already selected slots overlap with the current slot
      const overlappingSlots = newslotmap.filter((slot, i) => {
        return i !== index && slot.selected && (
          (slot.value >= newslotmap[index].value && slot.value < newslotmap[index].endtime) ||
          (slot.endtime > newslotmap[index].value && slot.endtime <= newslotmap[index].endtime) ||
          (slot.value <= newslotmap[index].value && slot.endtime >= newslotmap[index].endtime)
        );
      });
      if (overlappingSlots.length > 0) {
        Swal.fire({
          title: "Slots Already Selected",
          html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">The selected slot overlaps with already selected slots. Please choose another slot.</div></div>',
          showConfirmButton: true,
          showCloseButton: true,
          confirmButtonText: "Ok",
          customClass: {
            popup: 'swal-wide',
            icon: 'icon-class'
          }        
        });
      } else {

        newslotmap[index].status = true;
        newslotmap[index].selected = true;
        newslotmap[index].text = "Booked";
      }
    }
    setslotmap(newslotmap);
    const hasSelected = newslotmap.some(slot => slot.selected === true && slot.text === "Booked");
    if (hasSelected) {
      setTimeFrameSelected(true);
    } else {
      setTimeFrameSelected(false);
    }
  }

  const addblockdate = async () => {
    let temp = [];
    temp = blockedDates;
    if (temp.includes(blockdate)) {
      Swal.fire({
        title: "Already added date",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Date Already Added !</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Ok",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }        
      }).then(async (ok) => {
        setblockdate(null)
      })
    }
    else if (blockdate === null || blockdate === undefined) {
      setblockdate(null)
      Swal.fire({
        title: "Date blocking error",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">This date cannot be blocked at this time !</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Ok",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }        
      }).then(async (ok) => {
        setblockdate(null)
      })
    } else {
      Swal.fire({
        title: "Confirm block a date",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">This would add the selected date to blocked dates. Do you want to continue?</div></div>',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(async (ok) => {
        if (ok.isConfirmed) {
          temp.push(blockdate);
          setBlockedDates(temp);
          setBDModal(false);
          let bddd = await updateBlockedDate(user._id, temp);
        }
        else if (ok.dismiss === Swal.DismissReason.cancel) {
          setblockdate(null)
        }
      })
    }
  }

  const removeblockdate = async (date) => {
    Swal.fire({
      title: "Confirm blocked date removal",
      html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Are you sure you want to remove blocked date!</div></div>',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide',
        icon: 'icon-class'
      }
    }).then(async (willDelete) => {
      if (willDelete.isConfirmed) {
        let temp = [];
        temp = blockedDates;
        const index = temp.indexOf(date);
        if (index > -1) {
          temp.splice(index, 1);
        }
        setBlockedDates(temp);
        let bddd = await updateBlockedDate(user._id, temp);
        if (bddd.status === 200) {
          refreshBlockedDates();
          Swal.fire({
            title: "Deleted!",
            html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">The blocked date has been deleted.</div></div>',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Ok",
            customClass: {
              popup: 'swal-wide',
              icon: 'icon-class'
            }
          }).then(() => {
            // window.location.reload()
            // setBlockedDates()
          })
        }
      }
    });
  }

  const updateSlotFncn = async () => {
    let selectedslots = [];
    let trueslots = [];
    let interviewslots = [];
    let interviewStartTimeList = [];
    for (let i = 0; i < slotmap.length; i++) {
      if (slotmap[i].status == true)
        selectedslots.push(slotmap[i]);
    }
    for (let i = 0; i < selectedslots.length; i++) {
      let startTime = new Date(`${slotdate}T${selectedslots[i].value}:00`);
      interviewStartTimeList.push(startTime);
    }
    const currentTime = new Date();
    const includesPassedTime = interviewStartTimeList.some(interviewStartTime => {
      const selectedTime = new Date(interviewStartTime);
      return selectedTime <= currentTime;
    });
    
    if (includesPassedTime) {
      Swal.fire({
        title: "Booking error",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">The selected time slot is in the past !</div></div>',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Ok",
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }        
      });
    } else {
      Swal.fire({
        title: "Confirm add slot",
        html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">This would add slots to your calendar. Do you want to continue?</div></div>',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        customClass: {
          popup: 'swal-wide',
          icon: 'icon-class'
        }
      }).then(async (ok) => {
        if (ok.isConfirmed) {
          for (let i = 0; i < slotmap.length; i++) {
            if (slotmap[i].status == true)
              trueslots.push(slotmap[i]);
          }
          for (let i = 0; i < trueslots.length; i++) {
            let offset = new Date().getTimezoneOffset();
            let startTime = new Date(`${slotdate}T${trueslots[i].value}:00`);
            let endTime = new Date(`${slotdate}T${trueslots[i].endtime}:00`);
            interviewslots.push({
              // startTime: trueslots[i].value,
              // endTime: trueslots[i].endtime,
              startTime: startTime.toUTCString(),
              endTime: endTime.toUTCString(),
              action: 'create'
            });
          }
          let newupdater = await newslotupdater(user._id, interviewslots, slotdate);
          if (newupdater.status === 200) {
            // window.location.reload();
            setAddSlotStatus(true);
            setStartTime(null);
            setEndTime(null);
            setModal(false);
            setslotdate(new Date())
            setupdatedslotDate(false)
            setSlotDuration(1);
            setTimeFrameSelected(false);
          }

          // if (globalslotval == 30) {
          //   for (let i = 0; i < trueslots.length; i++) {
          //     //if (trueslots[i].endtime == trueslots[i + 1].value) {
          //       interviewslots.push({
          //         starttime: trueslots[i].value,
          //         endtime: trueslots[i].endtime
          //       });
          //     //}
          //   }
          // } else if (globalslotval == 60) {
          //   let hour = null;
          //   let minutes = null;
          //   let endhour = null;
          //   let endminutes = null;
          //   let temp = [];
          //   let tempslotmap = [];
          //   for (let i = 0; i < 1440; i += 30) {
          //     if (parseInt(i / 60) > 9) {
          //       hour = parseInt(i / 60).toString();
          //     } else {
          //       hour = "0" + parseInt(i / 60).toString()
          //     }
          //     if (parseInt(i % 60) > 9) {
          //       minutes = parseInt(i % 60).toString();
          //     } else {
          //       minutes = "0" + parseInt(i % 60).toString()
          //     }
          //     if (parseInt((i + 30) / 60) > 9) {
          //       endhour = parseInt((i + 30) / 60).toString();
          //     } else {
          //       endhour = "0" + parseInt((i + 30) / 60).toString()
          //     }
          //     if (parseInt((i + 30) % 60) > 9) {
          //       endminutes = parseInt((i + 30) % 60).toString();
          //     } else {
          //       endminutes = "0" + parseInt((i + 30) % 60).toString()
          //     }
          //     temp.push({
          //       value: hour + ":" + minutes,
          //       endtime: endhour + ":" + endminutes,
          //       status: false
          //     });
          //   }
          //   for (let j = 0; j < temp.length; j += 2) {
          //     for (let k = 0; k < trueslots.length; k++) {
          //       if (temp[j].value == trueslots[k].value) {
          //         tempslotmap.push({
          //           value: temp[j].value,
          //           endtime: temp[j].endtime,
          //           status: true
          //         });
          //         tempslotmap.push({
          //           value: temp[j + 1].value,
          //           endtime: temp[j + 1].endtime,
          //           status: true
          //         });
          //       }
          //     }
          //   }
        
          //   for (let i = 0; i < tempslotmap.length - 1; i++) {
          //    // if (tempslotmap[i].endtime == tempslotmap[i + 1].value) {
          //       interviewslots.push({
          //         starttime: tempslotmap[i].value,
          //         endtime: tempslotmap[i].endtime
          //       });
          //     //}
          //   }
          // } else {
          //   swal({
          //     icon: "error",
          //     title: "Something Went Wrong",
          //     button: "Ok"
          //   });
          // }
          // let newinterviewslots = interviewslots;
          // let oldslots = [];
          // let checkedSlots = [];
          // let skipentry = 0;
          // let checkingdate = moment(slotdate).format('DD-MM-YYYY')
          // if (allslotdates.includes(checkingdate.toString())) {
          //   for (let i = 0; i < slotstructure.length; i++) {
          //     if (slotstructure[i].date == checkingdate) {
          //       oldslots = slotstructure[i].slots;
          //       for (let j = 0; j < oldslots.length; j++) {
          //         skipentry = 0;
          //         for (let k = 0; k < newinterviewslots.length; k++) {
          //           if (oldslots[j].endTime == newinterviewslots[k].endtime && oldslots[j].startTime == newinterviewslots[k].starttime) {
          //             skipentry = 1;
          //             checkedSlots.push({
          //               data: oldslots[j].data,
          //               startTime: oldslots[j].startTime,
          //               endTime: oldslots[j].endTime,
          //               action: "ignore",
          //             });
          //           }
          //         }
          //         if (skipentry == 0) {
          //           checkedSlots.push({
          //             data: oldslots[j].data,
          //             startTime: oldslots[j].startTime,
          //             endTime: oldslots[j].endTime,
          //             action: "delete",
          //           });
          //         }
          //       }
          //       let oldcheckedSlots = checkedSlots;
          //       for (let l = 0; l < newinterviewslots.length; l++) {
          //         skipentry = 0;
          //         for (let m = 0; m < oldcheckedSlots.length; m++) {
          //           if (newinterviewslots[l]?.starttime === oldcheckedSlots[m]?.startTime && newinterviewslots[l]?.endtime === oldcheckedSlots[m]?.endTime) {
          //             skipentry = 1;
          //           }
          //         }
          //         if (skipentry === 0) {
          //           checkedSlots.push({
          //             startTime: newinterviewslots[l]?.starttime,
          //             endTime: newinterviewslots[l]?.endtime,
          //             action: "create",
          //           });
          //         }
          //       }
          //     }
          //   }
          // } else {
          //   for (let l = 0; l < interviewslots.length; l++) {
          //     checkedSlots.push({
          //       startTime: interviewslots[l]?.starttime,
          //       endTime: interviewslots[l]?.endtime,
          //       action: "create",
          //     });
          //   }
          // }

          // let newupdater = await newslotupdater(user._id, checkedSlots, slotdate);
          // if (newupdater.status === 200) {
          //   window.location.reload();
          // }
        }
      });
    }
  }

  const handleUpdate = async (slots) => {
    setModal(true);
    let startDate = new Date(slots.startDate);
    let endDate = new Date(slots.endDate);
    setStartTime(startDate);
    setEndTime(endDate);
    setEditId(slots._id);
  };
  // const handleDelete = async (slots) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "you want to delete slot!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (willDelete) => {
  //     if (willDelete) {
  //       let res = await deleteSlot(slots._id);
  //       if (res.status === 200) {
  //         let res2 = await XISlots(user._id);
  //         if (res2) {
  //           setSlots(res2.data);
  //           setSlotsdate(res2.data);
  //         }
  //       }
  //       swal("Slot has been Deleted", {
  //         title: "Slot Removed",
  //         icon: "success",
  //       });
  //     }
  //   });
  // };
  // const handleDelete = async (slots, slotTime) => {
  //   swal({
  //     title: "Confirm",
  //     text: `Do you want to edit or delete slot ${slotTime.startTime}-${slotTime.endTime}?`,
  //     icon: "warning",
  //     buttons: ["Cancel", "Edit", "Delete"],
  //     dangerMode: true,
  //   }).then(async (choice) => {
  //     if (choice === "Delete") {
  //       // handle delete action here
  //       let res = await deleteSlot(slots._id);
  //       if (res.status === 200) {
  //         let res2 = await XISlots(user._id);
  //         if (res2) {
  //           setSlots(res2.data);
  //           setSlotsdate(res2.data);
  //         }
  //       }
  //       swal("Slot has been deleted.", {
  //         title: "Slot removed",
  //         icon: "success",
  //       });
  //     } else if (choice === "Edit") {
  //       // handle edit action here
  //       handleEdit(slots);
  //       setModal(true);
  //     }
  //   });
  // };

  const handleDeleteSlot = async (slots) => {
    let res = await deleteSlot(slots.data._id);
    if (res.status === 200) {
      let res2 = await XISlots(user._id);
      if (res2) {
        setSlots(res2.data);
        setSlotsdate(res2.data);
      }
    }
    Swal.fire({
      title: "Slot Removed",
      html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot has been deleted.</div></div>',
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonText: "Ok",
      customClass: {
        popup: 'swal-wide',
        icon: 'icon-class'
      }      
    }).then(() => {
      setModal1(false);
      setSlotDuration(1);
      setslotdate(new Date());
    });
  }

  const handleEditSlot = async (slots) => {
    setslotdate(moment(slots.data.startDate).format("YYYY-MM-DD"));
    var timeDiff = Math.abs(new Date(slots.data.endDate) - new Date(slots.data.startDate))
    var minutes = Math.floor((timeDiff/1000)/60);
    setSlotDuration(minutes <= 30 ? 30 : 60);
    handleEdit(slots);
  }

  const handleDelete = async (slots) => {
    swal({
      title: "Delete or Edit Slot?",
      text: `Do you want to delete or edit the slot ${slots.startTime}-${slots.endTime} on ${slots.data.startDate}?`,
      icon: "warning",
      buttons: {
        edit: {
          text: "Edit",
          value: "edit",
          className: "bg-indigo-500 text-white hover:bg-indigo-600",
        },
        delete: {
          text: "Delete",
          value: "delete",
          className: "bg-red-500 text-white hover:bg-red-600",
          dangerMode: true,
        },
        cancel: {
          text: "Cancel",
          value: null,
          className: "bg-gray-500 text-white hover:bg-gray-600",
        },
      },
    }).then(async (value) => {
      switch (value) {
        case "edit":
          if (slotdate) {
            handleEdit(slots);
          }
          break;
        case "delete":
          let res = await deleteSlot(slots.data._id);
          if (res.status === 200) {
            let res2 = await XISlots(user._id);
            if (res2) {
              setSlots(res2.data);
              setSlotsdate(res2.data);
            }
          }
          swal({
            title: "Slot Removed",
            text: "Slot has been deleted",
            icon: "success",
          });
          break;
        default:
          swal("Action cancelled");
      }
    });
  };

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= slotstructure.length; i++) {
      document.getElementById("crd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("crd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  const handleEdit = (slots) => {
    setModal1(true);


    let startTime = slots.startTime;
    let endTime = slots.endTime;
    let startDate = new Date('1970-01-01T' + startTime + ':00Z');
    let endDate = new Date('1970-01-01T' + endTime + ':00Z');

    let timeDiffInMs = endDate.getTime() - startDate.getTime();
    let timeDiffInMinutes = timeDiffInMs / (1000 * 60);
    if (slotdate) {
      if (timeDiffInMinutes === 30) {
        selectSlot30();

      } else if (timeDiffInMinutes === 60) {
        selectSlot60();
      }
    } else { }
    setStartTime(startTime);
    setEndTime(endTime);
    setEditId(slots.data.slotId);
    setSelectedSlot(slots);
  }

  const selectSlot30 = () => {
    selectSlots(30);
    setSlotDuration(30);
    setTimeFrameSelected(false);
  }

  const selectSlot60 = () => {
    setActive(!active)
    selectSlots(60);
    setSlotDuration(60);
    setTimeFrameSelected(false);
  }
  const handleDateChange = (e) => {
    setslotdate(moment(e).format('YYYY-MM-DD'));
    setupdatedslotDate(true);
    setTimeFrameSelected(false);
    setSlotDuration(1);
  }
  const handleSlotDate = (event) => {
    setslotdate(moment(event).format('YYYY-MM-DD'));
    if (slotdate) {
    }
  }

  const getTodayslot = (slotstructure, today) => {
    const todaySlotObj = slotstructure.filter((item) => (moment(item.date, "DD-MM-YYYY").format('YYYY-MM-DD')) == today);
    return todaySlotObj;
  }

  const formatSlotStructure = (slotstructure) => {
    let newslotstructure=slotstructure.map((slots) => ({
     ...slots,date : slots? moment(slots.date, "DD-MM-YYYY").format('YYYY-MM-DD'):''
    })).sort((a,b) => 
    new Date(a.date) - new Date(b.date)
    )
    return newslotstructure;
  }

  const handleGetSlotTiming = (selectedDate, startTime, duration) => {
    const newSlotStructure = formatSlotStructure(slotstructure)
    selectedDate = moment(selectedDate).format('YYYY-MM-DD');
    const filteredDataByDate = newSlotStructure.filter(item => item.date === selectedDate);
    filteredDataByDate.forEach((filteredData) => {
      filteredData.slots.forEach((data) => {
        let time = moment(data?.startTime, 'HH:mm')
        data.startTime = time.format("HH:mm");
      })
    })
    
    const filteredDataByTime = filteredDataByDate.map(item => {
      const slotsWithTargetStartTime = item?.slots?.filter(slot => slot.startTime === startTime);
      return slotsWithTargetStartTime;
    });

    if(filteredDataByTime[0].length === 0 && duration == 60) {
      startTime = startTime.replace("00", "30")
      const filteredDataByTime = filteredDataByDate.map(item => {
        const slotsWithTargetStartTime = item?.slots?.filter(slot => slot.startTime === startTime);
        return slotsWithTargetStartTime;
      });
      setSelectedSlotTiming(filteredDataByTime[0][0])
    } else if (filteredDataByTime[0].length === 0 && duration == 30) {
      startTime = startTime.replace("30", "00");
      const filteredDataByTime = filteredDataByDate.map(item => {
        const slotsWithTargetStartTime = item?.slots?.filter(slot => slot.startTime === startTime);
        return slotsWithTargetStartTime;
      }); 
      setSelectedSlotTiming(filteredDataByTime[0][0])
    } else {
      setSelectedSlotTiming(filteredDataByTime[0][0])
    }
  }

  return (
    <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-2 my-5 ">
      <div
        className="flex mx-5 mt-20"
        style={{ justifyContent: "space-between" }}
      >
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div>
      <div className="px-4 w-full md:flex mx-auto">
        <div className=" md:w-[60%] md:mx-5 w-full rounded-lg bg-white border border-[#E3E3E3]">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <>
              <div className="  w-full bg-white">
                <div
                  className="  py-4 px-4 border-b border-gray-200 flex flex-row w-full"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 font-bold w-[55%]  my-1">Booked slots</p>
                  <div className="flex flex-row justify-between w-[45%]">
                    <CircleIcon className="text-[#228276] text-sm my-1" />
                    <span className="text-[#888888] my-1">Available</span>
                    <CircleIcon className="text-[#BE6F3F] my-1" />
                    <span className="text-[#888888] my-1">Booked</span>
                    <div className={`cursor-pointer my-1 ${activeIcon.section === 'addslot' && activeIcon.value === "addslot"? "rounded-xl h-3xl w-3xl bg-[#E3E3E3] ": {}}`}
                      id="addslotbutton"
                      onClick={() => {
                        setModal(true);
                        setShowCandidateForm(true);
                      }} 
                      onMouseEnter={() => setActiveIcon({section: 'addslot', value: 'addslot'})}
                      onMouseLeave={() => setActiveIcon({section: 'addslot', value: ''})}
                    >
                      <AddIcon
                        className={`mx-1`}
                      />
                      <span className="text-[#888888] mr-2">Add slot</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-col" >
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8" >
                      <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
                        <div className="overflow-auto" style={{ maxHeight: '500px'}}>
                          <table className="w-full" >
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
                                  Dates
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Slots
                                </th>
                                {/* <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Actions
                                </th> */}
                              </tr>
                            </thead>
                            <tbody >
                              {slotstructure &&
                                formatSlotStructure(slotstructure).map((slotdetails, index) => {
                                  let today = new Date();
                                  today = moment(today, "DD-MM-YYYY").format('YYYY-MM-DD');
                                  return (
                                      <tr id={"crd" + (index + 1)}
                                        className={`${"bg-white"} border-b ${index < 5 ? "" : "hidden"} py-4`}
                                        onMouseEnter={() => setActiveIcon({section: 'edit', value: index})}
                                        onMouseLeave={() => setActiveIcon({section: 'edit', value: ''})}
                                      >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {index + 1}
                                        </td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                          <span>{slotdetails.date == today ? "Today" : moment(slotdetails.date).format('DD-MM-YYYY')}</span>
                                        </td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                          {slotdetails.slots.map((slottime, index) => {
                                            const slotElement = (
                                              <span style={{ width: '100px',
                                                color: (slottime.data.status) === "Available" ? '#228276': '#BE6F3F', 
                                                backgroundColor: (slottime.data.status) === "Available" ? 'rgba(34, 130, 118, 0.1)': '#EAEAEA' }} 
                                                className="border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1 cursor-pointer"
                                                onMouseOut={() => setEditStatus('notEdit')}
                                                onMouseOver={() => setEditStatus(slottime)}
                                                onClick={() => {
                                                  setslotdate(moment(slottime.data.startDate).format('YYYY-MM-DD'));
                                                  setEditSlotValue(slottime)
                                                  handleEditSlot(slottime);
                                                }}
                                              >
                                                {editStatus.startTime == slottime.startTime && editStatus.data.startDate == slottime.data.startDate ? "edit this time slot" : `${slottime.startTime} - ${slottime.endTime}`}
                                                {/* {slottime.startTime} - {slottime.endTime} */}
                                              </span>
                                            );
                                            return (index > 0 && index % 5 === 0) ? [<br key={`br1-${index}`} />, <br key={`br2-${index}`} />, slotElement] : slotElement;
                                          })}
                                        </td>                                    
                                        {/* <td>
                                          <button
                                            className="text-xs text-white font-light px-6 py-4 whitespace-nowrap rounded-md"
                                            style={{ backgroundColor: "#034488" }}
                                            id="editslot"
                                            onClick={() => {
                                              handleEdit(slotdetails);


                                            }}

                                          >
                                            Edit
                                          </button>


                                        </td> */}

                                      </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between my-2 mx-4">
                  <div>
                    Page {page} of {Math.ceil(slotstructure.length / 5)}
                  </div>
                  <div>
                    {" "}
                    {slotstructure &&
                      slotstructure.map((slot, index) => {
                        return index % 5 == 0 ? (
                          <span
                            className={`mx-2 ${page == index / 5 + 1 ? "page_active" : ""
                              }`}
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
              {modal && (
                <Transition appear show={modal} as={Fragment} className="relative z-10 w-full " style={{ zIndex: 1000 }}>
                  <Dialog as="div" className="relative z-10 w-5/6 " onClose={() => { }} static={true}>
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-[540px] ml-auto">
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
                                  <div className="border-b-2">
                                    <div className="my-0 px-6 py-3 w-3/4 md:w-full text-left flex justify-between">
                                        <div>
                                          <p className="font-semibold">Availability</p>
                                        </div>
                                      <button className="focus:outline-none" onClick={() => {
                                            if (window.location.search.slice(1) === "addslot=1") {
                                              window.history.back();
                                            } else {
                                              setStartTime(null);
                                              setEndTime(null);
                                              setModal(false);
                                              setslotbookingscreen(0);
                                              setslotdate(new Date())
                                              setupdatedslotDate(false)
                                              setSlotDuration(1);
                                              setTimeFrameSelected(false);
                                            }
                                          }}>
                                        <button
                                          className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"
                                          
                                          style={{
                                            color: "#034488",
                                            border: `none${`!important`}`
                                          }}
                                        >
                                          <ImCross />
                                        </button>
                                        <span className="text-[#D6615A]">Cancel</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="w-full px-4 py-3 flex flex-col gap-1 justify-between" style={{ height: "91%", backgroundColor: "#FFFFFF"}}>
                                    <>
                                      <div className="">
                                        <h2 className="font-bold">Select date</h2>
                                        <div className="flex w-full justify-center my-2">
                                          <DatePicker
                                            placeholderText={slotdate ? `${slotdate}` : 'Please select a date'}
                                            selected={new Date(slotdate)}
                                            defaultValue={new Date(slotdate)}
                                            minDate={new Date()}
                                            // onChange={(e) => setslotdate(moment(e).format('YYYY-MM-DD'))}
                                            onChange={handleDateChange}
                                            open={true}
                                            selectsDisabledDaysInRange
                                            excludeDates={blockedDates.map(bDate => new Date(bDate))}
                                          />
                                        </div>
                                        
                                      </div>
                                    </> <>
                                      <div className={`flex flex-col w-full`}
                                        style= {updatedslotDate? {}:{pointerEvents: "none", opacity: "0.4"}}
                                      >
                                      <h2 className={` font-bold pt-4xl`}
                                      >
                                        Select duration</h2>
                                        <div className="flex flew-row mt-3 w-2/4 justify-between">
                                          <div>  
                                            <input
                                              className={`text-gray-600  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                              ${slotdate === "" && 'opacity-50 cursor-not-allowed'}mr-2`}
                                              style = {{backgroundImage: "none", outlineColor: "#228276"}}
                                              type = "radio"
                                              disabled = {!setslotdate}
                                              onChange = {selectSlot60}
                                              checked = {slotDuration == 60 ? true : false}

                                            />
                                            <label for="1-hour">
                                              1 Hour
                                            </label>
                                          </div>
                                          <div>
                                            <label>
                                              <input
                                                className={`text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                                ${slotdate == "" && 'cursor-not-allowed opacity-50'} mr-2`}
                                                style = {{backgroundImage: "none", outlineColor: "#228276"}}
                                                onChange = {selectSlot30}
                                                type = "radio"
                                                checked = {slotDuration == 30 ? true : false}
                                              >
                                              </input>
                                              30 Minutes
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </> <>
                                      <div
                                        style= {slotDuration != 1 ? {}:{pointerEvents: "none", opacity: "0.4"}}
                                        className="flex flex-col justify-between overflow-hidden"
                                      >
                                        <h2 className="font-bold pt-4xl">Select time frame</h2>
                                        <div className="rounded-lg bg-white border border-[#E3E3E3] w-full mt-3 mb-2 overflow-y-scroll">
                                          <div className="my-2 mx-2">
                                            {slotmap ? <>
                                              {slotmap.map((usetime, index) => {
                                                return (
                                                  <div className="flex mb-1 gap-3">
                                                    <div className="w-1/12 flex"><span className="text-xs flex justify-center m-auto">{usetime.value}</span></div>
                                                    {
                                                      usetime?.selected ? 
                                                        <div onClick={() => { updateslotbox(index) }} style={(usetime?.selected && usetime?.status) ? {backgroundColor: "#228276"} : {backgroundColor: "rgba(34, 130, 118, 0.4)", position: "relative"}} className="h-8 w-11/12 rounded-md"
                                                          onMouseOver={() => {setShowTooltipOnTimeFrame(index); handleGetSlotTiming(slotdate, usetime.value, slotDuration)}}
                                                          onMouseOut={() => {setShowTooltipOnTimeFrame(null)}}
                                                        >
                                                          <span className={showTooltipOnTimeFrame == index ? "visible absolute w-full text-[#FFFFFF] text-center text-xs flex h-full" : "invisible"}>
                                                            <span className="flex m-auto cursor-pointer">Slot opened for {`{ ${selectedSlotTiming?.startTime}`} - {`${selectedSlotTiming?.endTime} }`}</span>
                                                          </span>
                                                        </div> 
                                                      : <div className="w-11/12">
                                                          <div onClick={() => { updateslotbox(index); }} className={usetime?.status === true ? "rounded-md cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold" : "rounded-md cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold"}
                                                            style={usetime?.status === true ? {backgroundColor: "#228276"}:{backgroundColor: "rgba(34, 130, 118, 0.1)"}}
                                                          >{usetime?.status === true ? <></> : null}</div>
                                                        </div>
                                                    }

                                                  </div>
                                                );
                                              })}
                                            </> : <>Loading...</>}
                                          </div>
                                        </div>
                                        <div className="w-full flex justify-end"
                                          style= {timeFrameSelected? {}:{pointerEvents: "none", opacity: "0.4"}}
                                        >
                                          <button className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-2xl rounded px-3 py-1 text-white font-bold" onClick={() => { updateSlotFncn() }}>Save
                                            <DoneIcon className="ml-3 mb-1" />
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  </div>
                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8 hidden">
                                    <Formik
                                      initialValues={{}}
                                      validate={(values) => {
                                        const errors = {};

                                        if (
                                          startTime === "" ||
                                          startTime === null
                                        ) {
                                          errors.startTime =
                                            "Start Time Cannot be Empty";
                                        }
                                        if (
                                          endTime === "" ||
                                          endTime === null
                                        ) {
                                          errors.endTime =
                                            "End Time Cannot be Empty";
                                        }
                                        if (startTime > endTime) {
                                          errors.endTime =
                                            "End Time Cannot be greater than Start Time";
                                        }
                                        return errors;
                                      }}
                                      onSubmit={handleSubmit}
                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            {/* <p className="text-left font-semibold py-2">
                                              Add User
                                            </p> */}
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                {/* <DateTimePicker
                                                  minDate={new Date()}
                                                  onChange={setStartTime}
                                                  value={startTime}
                                                /> */}

                                                {/* <Field
                                                  name="startTime"
                                                  type="text"
                                                  className="text-600 rounded-sm block px-4 py-1"
                                                  style={{ borderRadius: "5px" }}
                                                /> */}
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                {/* <DateTimePicker
                                                  onChange={setEndTime}
                                                  value={endTime}
                                                  disabled
                                                /> */}

                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4 focus:outline-none"
                                                type="submit"
                                                style={{
                                                  backgroundColor: "#034488",
                                                }}
                                              >
                                                {editId ? "Update" : "Add"}
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setStartTime(null);
                                                  setEndTime(null);
                                                  setModal(false);
                                                  setEditId(null);
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

              {/* Modal for Editing the Slot */}




              {editModal && (
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
                          <Dialog.Panel className="w-full px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[65vh]">
                            {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                            <div className={`${!editModal ? "hidden" : "block"} h-full`}>
                              <div className="w-full h-full">
                                <div className="w-full h-full">
                                  <div className="my-3 w-3/4 md:w-full text-left flex justify-between">
                                    <div>
                                      <p className="font-semibold">Add Slots</p>
                                      {/* <p className="text-sm mt-3 mb-1 break-words">
                                      ( Headers Conventions: firstName, lastName, email,
                                      phoneNo, Address)
                                    </p>
                                    <p className="text-sm break-words">
                                      (Data must contain candidate's email Address and phoneNo
                                      Number)
                                    </p> */}
                                    </div>
                                    <div>
                                      <button
                                        className="bg-[#034488] text-white rounded-sm px-4 my-2 pt--8"
                                        onClick={() => {
                                          if (window.location.search.slice(1) === "addslot=1") {
                                            window.history.back();
                                          } else {
                                            setStartTime(null);
                                            setEndTime(null);
                                            setEditModal(false);
                                            setslotbookingscreen(0);
                                            setslotdate(new Date())

                                          }
                                        }}
                                        style={{
                                          color: "#034488",
                                        }}
                                      >
                                        <ImCross />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="my-4 w-full p-3 bg-slate-100 px-8" style={{ height: "90%", overflowY: "scroll" }}>
                                    {slotbookingscreen == 0 ? <>
                                      <div className="text-center">
                                        <h2 className="text-center font-bold text-2xl">Select Date</h2>
                                        <div className="flex w-full justify-center my-4">
                                          <DatePicker
                                            placeholderText={slotdate ? `${slotdate}` : 'Please select a date'}
                                            defaultValue={new Date()}
                                            minDate={new Date()}
                                            // onChange={(e) => setslotdate(moment(e).format('YYYY-MM-DD'))}
                                            onChange={handleDateChange}
                                            selectsDisabledDaysInRange
                                            excludeDates={blockedDates.map(bDate => new Date(bDate))}
                                          />
                                        </div>
                                        <h2 className={`text-center font-bold text-2xl`}>
                                          Select Time Range </h2>
                                        <div className="flex w-full justify-center my-4">
                                          <button
                                            className={`bg-white text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                             ${slotdate === "" && 'opacity-50 cursor-not-allowed'}mr-2`}
                                            disabled={!setslotdate}
                                            onClick={selectSlot60}
                                          >
                                            1 Hour
                                          </button>

                                          <button
                                            className={`bg-white text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                             ${slotdate == "" && 'cursor-not-allowed opacity-50'} mr-2`}
                                            onClick={selectSlot30}
                                          >
                                            30 Minutes
                                          </button>
                                        </div>

                                      </div>
                                    </> : <>
                                      <div className="text-center">
                                        <h2 className="text-center font-bold text-2xl">Select Time Slots for <span className="text-xl text-gray-900">{slotdate}</span></h2>
                                        <div className="w-full my-4">
                                          {slotmap ? <>
                                            {slotmap.map((usetime, index) => {
                                              return (
                                                <div className="flex mb-1">
                                                  <div className="w-1/12 flex"><span className="text-xs">{usetime.value}</span></div>
                                                  {
                                                    usetime.selected ? <div>Selected</div> : <div className="w-11/12">
                                                      <div onClick={() => { updateslotbox(index) }} className={usetime.status === true ? "bg-blue-300 hover:bg-blue-200 cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold" : "bg-blue-100 hover:bg-blue-200 cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold"}>{usetime.status === true ? <>Selected</> : null}</div>
                                                    </div>
                                                  }

                                                </div>
                                              );
                                            })}
                                          </> : <>Loading...</>}
                                        </div>
                                        <div className="w-full my-4 flex justify-center">
                                          <button className="bg-blue-500 hover:bg-blue-500 rounded px-4 py-2 text-white font-bold" onClick={() => { updateSlotFncn() }}>Update Slot</button>
                                        </div>
                                      </div>
                                    </>}
                                  </div>
                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8 hidden">
                                    <Formik
                                      initialValues={{}}
                                      validate={(values) => {
                                        const errors = {};

                                        if (
                                          startTime === "" ||
                                          startTime === null
                                        ) {
                                          errors.startTime =
                                            "Start Time Cannot be Empty";
                                        }
                                        if (
                                          endTime === "" ||
                                          endTime === null
                                        ) {
                                          errors.endTime =
                                            "End Time Cannot be Empty";
                                        }
                                        if (startTime > endTime) {
                                          errors.endTime =
                                            "End Time Cannot be greater than Start Time";
                                        }
                                        return errors;
                                      }}
                                      onSubmit={handleSubmit}
                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                <DateTimePicker
                                                  minDate={new Date()}
                                                  onChange={setStartTime}
                                                  value={startTime}
                                                />
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                <DateTimePicker
                                                  onChange={setEndTime}
                                                  value={endTime}
                                                  disabled
                                                />

                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4 focus:outline-none"
                                                type="submit"
                                                style={{
                                                  backgroundColor: "#034488",
                                                }}
                                              >
                                                {editId ? "Update" : "Add"}
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setStartTime(null);
                                                  setEndTime(null);
                                                  setEditModal(false);
                                                  setEditId(null);
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


              {/* Modal for Edit slot */}
              {modal1 &&
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-[540px] ml-auto">
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
                            <div className={`${!modal1 ? "hidden" : "block"} h-full`}>
                              <div className="w-full h-full">
                                <div className="w-full h-full">
                                  <div className="border-b-2	">
                                    <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                        <div>
                                          <p className="font-semibold">Edit slot</p>
                                        </div>
                                      <button className="focus:outline-none" onClick={() => {
                                            if (window.location.search.slice(1) === "addslot=1") {
                                              window.history.back();
                                            } else {
                                              setStartTime(null);
                                              setEndTime(null);
                                              setModal1(false);
                                              setEditId(null);
                                              setslotdate(new Date());
                                              setSlotDuration(1);
                                            }
                                          }}>
                                        <button
                                          className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"
                                          
                                          style={{
                                            color: "#034488",
                                            border: `none${`!important`}`
                                          }}
                                        >
                                          <ImCross />
                                        </button>
                                        <span className="text-[#D6615A]">Cancel</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="w-full px-4 py-4" style={{height: "95%", backgroundColor: "rgb(255, 255, 255)"}}>
                                    <>                                  
                                      <div className={`flex flex-col w-full my-4 `}>
                                        <h2 className={` font-bold text-lg pt-4xl`}>
                                          Select duration
                                        </h2>
                                        <div className="flex flew-row mt-6 w-2/4 justify-between">
                                          <div>  
                                            <input
                                              className={`bg-[#228276] text-gray-600  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                              ${slotdate === "" && 'opacity-50 cursor-not-allowed'}mr-2`}
                                              style = {{backgroundImage: "none", outlineColor: "#228276"}}
                                              type="radio"
                                              disabled={!setslotdate}
                                              onClick={selectSlot60}
                                              checked={slotDuration==60?true:false}
                                            />
                                            <label for="1-hour">
                                              1 Hour
                                            </label>
                                          </div>
                                          <div>
                                            <label>
                                              <input
                                                className={`bg-[#228276] text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer 
                                                ${slotdate == "" && 'cursor-not-allowed opacity-50'} mr-2`}
                                                style = {{backgroundImage: "none", outlineColor: "#228276"}}
                                                onClick={selectSlot30}
                                                type="radio"
                                                checked={slotDuration==30?true:false}
                                              >
                                              </input>
                                              30 Minutes
                                            </label>
                                          </div>
                                        </div>
                                      </div>                                              
                                    </>
                                    <div style={{height: "65%"}}>
                                      <div className="my-4 w-full rounded-lg bg-white border border-[#E3E3E3]" style={{ height: "100%", overflowY: "scroll" }}>
                                        
                                        <div className="w-full">
                                        <div className="my-2 mx-2">
                                          {slotmap ? (
                                            <>
                                              {slotmap.map((usetime, index) => {
                                                // const isSelected = Object.values(selectedSlots).some(slot => slot.startTime === usetime.value);
                                                //const isSelected = Object.values(selectedSlots && {}).includes(usetime.value);

                                                return (                                            
                                                    <div className="flex mb-1 gap-3">
                                                      <div className="w-1/12 flex">
                                                        <span className="text-xs">{usetime.value}</span>
                                                      </div>
                                                      {usetime.selected ? (
                                                        <div style={usetime.selected && usetime.status ? {backgroundColor: "#228276"} : {backgroundColor: "rgba(34, 130, 118, 0.4)"}} className="h-8 w-11/12 rounded-md"></div>
                                                      ) : (
                                                        <div className="w-11/12">
                                                          <div
                                                            onClick={() => {
                                                              updateslot(index, usetime.id, usetime.value, usetime.endtime);
                                                              setSid(selectedSlots.data._id);
                                                              setStart(usetime.value);
                                                              setEnd(usetime.endtime);
                                                            }}
                                                            className={usetime.status === true ? "rounded-md cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold" : "rounded-md cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold"}
                                                            style={usetime.status === true ? {backgroundColor: "#228276"}:{backgroundColor: "rgba(34, 130, 118, 0.1)"}}
                                                          >
                                                            {usetime.status === true ? <></> : null}
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                );
                                              })}
                                            </>
                                          ) : (
                                            <>Loading...</>
                                          )}
                                          </div>
                                        </div>           
                                      </div>
                                    </div>
                                    <div className="w-full my-4 flex justify-end gap-6">
                                      <button className="hover:bg-[#D6615A] focus:outline-none bg-[#D6615A] rounded px-4 py-2 text-white hover:bg-[#D6615A] focus:outline-none rounded-2xl font-bold" 
                                        onClick={() => {
                                          handleDeleteSlot(editSlotValue);
                                        }}
                                      >
                                        Delete
                                      </button>
                                      <button
                                        className="bg-[#228276] text-white rounded px-4 py-2 hover:bg-[#228276] focus:outline-none rounded-2xl font-bold"
                                        onClick={() => {
                                          updateCurrentslots(sid, start, end);
                                        }}
                                      >
                                        Save
                                      </button>
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
              }

              {modal2 && (
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
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[65vh]">
                            <div className={`${!modal2 ? "hidden" : "block"}`}>
                              <div className="w-full mt-9">
                                <div className="w-full m-5 mx-7">
                                  <div className="my-3 w-3/4 md:w-full text-left flex justify-between">
                                    <div>
                                      <p className="font-semibold">Add Slots</p>
                                    </div>
                                    <div>
                                      <button
                                        className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                        onClick={() => {
                                          setStartTime(null);
                                          setEndTime(null);
                                          setModal(false);
                                        }}
                                        style={{
                                          backgroundColor: "#fff",
                                          color: "#034488",
                                        }}
                                      >
                                        <ImCross />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
                                    <Formik
                                      initialValues={{}}
                                      validate={(values) => {
                                        const errors = {};

                                        if (
                                          startTime === "" ||
                                          startTime === null
                                        ) {
                                          errors.startTime =
                                            "Start Time Cannot be Empty";
                                        }
                                        if (
                                          endTime === "" ||
                                          endTime === null
                                        ) {
                                          errors.endTime =
                                            "End Time Cannot be Empty";
                                        }
                                        if (startTime > endTime) {
                                          errors.endTime =
                                            "End Time Cannot be greater than Start Time";
                                        }
                                        return errors;
                                      }}
                                      onSubmit={handleSubmit}
                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                <DateTimePicker
                                                  minDate={new Date()}
                                                  onChange={setStartTime}
                                                  value={startTime}
                                                />
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                <DateTimePicker
                                                  onChange={setEndTime}
                                                  value={endTime}
                                                  disabled
                                                />

                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
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
                                                {editId ? "Update" : "Add"}
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setStartTime(null);
                                                  setEndTime(null);
                                                  setModal(false);
                                                  setEditId(null);
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
              {bdmodal && (
                <Transition
                  appear
                  show={bdmodal}
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-[540px] ml-auto">
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
                            <div className={`${!bdmodal ? "hidden" : "block"} h-full`}>
                              <div className="w-full h-full">
                                <div className="w-full h-full">
                                  <div className="border-b-2">
                                    <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                      <div>
                                        <p className="font-semibold">Block a date</p>
                                      </div>
                                      <button className="focus:outline-none" onClick={() => {
                                            setBDModal(false);
                                            setSelectedBlockDate(new Date());
                                          }}>
                                        <button
                                          className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"
                                          
                                        >
                                          <ImCross />
                                        </button>
                                        <span className="text-[#D6615A]">Cancel</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="py-4 px-4 w-full p-3" style={{ height: "92%", overflowY: "scroll" }}>
                                    <div className="flex flex-column h-full justify-between">
                                      <div>
                                        <h2 className="font-bold text-lg">Select Date</h2>
                                        <div className="flex w-full my-4">
                                          <DatePicker
                                            open = {true}
                                            minDate={new Date()}
                                            onChange={(e) => {
                                              setblockdate(moment(e).format('YYYY-MM-DD'));
                                              setSelectedBlockDate(e);
                                            }}
                                            selected={selectedBlockDate}
                                            excludeDates={slotstructure.map(slots => new Date(moment(slots.date, "DD-MM-YYYY").format('YYYY-MM-DD')))}
                                          ></DatePicker>
                                        </div>
                                      </div>
                                      <div className="flex w-full my-4 justify-end">
                                        <button
                                          className="bg-[#D6615A] text-white rounded-sm py-2 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
                                          type="button"
                                          onClick={() => { addblockdate(); setSelectedBlockDate(new Date())}}
                                          style={{
                                            backgroundColor: "#D6615A",
                                          }}
                                        >
                                          Block Date
                                        </button>
                                      </div>
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
              {/* modal/////////////////////////////edit///////////// */}

            </>
          )}
        </div>
        <div className="md:w-[40%]">
          <div className="bg-white  justify-around bg-white  w-full rounded-lg bg-white border border-[#E3E3E3]">
            <p className="px-4 py-4 text-xl mx-auto text-gray-700 font-bold border-b border-gray-200 flex">
              <p className="my-1 text-sm text-gray-900 w-full font-bold ">Blocked Dates</p>
              <div className={` ${activeIcon.section === "addblockeddate" && activeIcon.value === "addblockeddate"? "rounded-3xl h-3xl w-3xl bg-[#E3E3E3]": {}}`}>
                <AddIcon className={`my-auto border-[#333333] cursor-pointer mr-1 ml-1 mt-2 mb-2`}
                  onClick={() => {
                    setBDModal(true);
                    refreshBlockedDates();
                  }}
                  onMouseEnter={() => setActiveIcon({section: 'addblockeddate', value: 'addblockeddate'})}
                  onMouseLeave={() => setActiveIcon({section: 'addblockeddate', value: ''})}
                />   
              </div>
            </p>
            <div className="flex flex-row border-b border-gray-200 mt-3 py-2">
              <div
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #
              </div>
              <div
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Date
              </div>
            </div>
            <div className="mt-2">
              {orderedBlockedDates ? <>
                {orderedBlockedDates.length != 0 ? <>
                  {orderedBlockedDates.map((dates, index) => {
                    return (
                      <div className="border-b border-gray-200 blocked-date-remove-icon-container"
                        onMouseEnter={() => setActiveIcon({section: 'date', value: index})}
                        onMouseLeave={() => setActiveIcon({section: 'date', value: ''})}
                      >
                        <div className="text-xs flex flex flex-row justify-between w-full">
                          <div className="py-4 w-3/4">
                            <span className="px-6 py-4">{index+1}</span>
                            <span className="mt-auto mb-auto px-6 py-4">{moment(dates).format('DD-MM-YYYY')}</span>
                          </div>
                          <div className="px-6 py-2.5">
                            <span className={`blocked-date-remove-icon bg-[#D6615A] bg-opacity-10 rounded-3xl h-3xl w-3xl ${activeIcon.section === 'date' && activeIcon.value===index ? "inline-block": "hidden"}`} onClick={() => {
                               removeblockdate(dates);
                              }}>
                              <RemoveCircleOutlineIcon className="text-danger cursor-pointer ml-2 mr-2 mt-2 mb-2" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </> : <h5 className="mt-4 font-bold text-center">No Blocked Dates</h5>}
              </> : <h5 className="mt-4 font-bold text-center">No Blocked Dates</h5>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;