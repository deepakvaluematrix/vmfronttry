import React from "react";
import { approveJob, candidateDetailsByJobId, getAllCandidatesOfJob, getJobById, sendJobInvitation } from "../../service/api";
import { ReactSession } from "react-client-session";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineCalendar, AiOutlinePlus } from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import { Popover, Transition, Menu, Dialog } from "@headlessui/react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import logo from "../../assets/images/logo.png";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { updateJobAPI, getSkills, archiveJob, approveCd, getcandidatesevaluations } from "../../service/api";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import swal from "sweetalert";
import {
  postUpdateCandidateStatus, sendFeedbackInvitation,getFeedBackInvitation
} from "../../service/api";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import { resendInvite } from "../../service/invitationService";
//import { Token } from "monaco-editor";
function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);

  const [candidates, setCandidates] = React.useState([]);
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [declined, setDeclined] = React.useState([]);
  const [showDeclined, setShowDeclined] = React.useState(false);
  const [invited, setInvited] = React.useState([]);
  const [showInvited, setShowInvited] = React.useState(false);
  const [index, setIndex] = React.useState(props.index);
  const [page, setPage] = useState(1);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [token,setToken] = useState('')

  const [user, setUser] = React.useState(null);
  const [toggle, setToggle] = React.useState(true);
  const [choosenStatus, setChoosenStatus] = React.useState("");
  const [choosenId, setChoosenId] = React.useState("");
  const [loading, setLoading] = React.useState(null);
  const [gcaneval, setcaneval] = React.useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  let [searchQuery, setSearchQuery] = useState('');
  let [loader,setLoader] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  React.useEffect(() => {
    
    const getData = async () => {
      setLoader(true);
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      setToken(access_token)
      let user = JSON.parse(await getStorage("user"));
      await setUser(user);
      let res = await getJobById(job_id, access_token); 
      if (res) {
        setJob(res.data.job);
        let jobDetails = res.data.job;
        ls.set("jobDetails", JSON.stringify(res.data.job[0]));
        // if (res.data.job[0].archived) {
        //   setToggle(res.data.job[0].archived);
        // }
        let caneval = await getcandidatesevaluations(
          job_id,
          res?.data?.job?.invitations
        );
        if (caneval) {
          setcaneval(caneval?.data?.data);
        }

        let candList = await getAllCandidatesOfJob(res?.data?.job._id);
        let candListObject = [];
        let currentDate = new Date();
        candList?.data?.candidates.map((item) => {
          let value;
          if(caneval?.data?.data && item?.user[0]?._id){
            value = caneval?.data?.data.filter(cItem => cItem.applicant === item?.user[0]?._id);
          }

          let originalDate = new Date(item?.inviteDetails?.invitedDate);
          // Calculate the difference in milliseconds
          let differenceInMilliseconds = currentDate - originalDate;
          //Calculate the difference in days
          let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
          let obj = {
            cid:item?._id,
            FirstName: item?.firstName,
            LastName: item?.lastName,
            Contact: item?.phoneNo,
            Email: item?.email,
            Address: "",
            Status: "",
            invitedDate:originalDate?.toLocaleString(),
            age:differenceInDays,
            Uid: item?.user[0]?._id ? item?.user[0]?._id : "",
            interviewId: (value && value[0]) ? value[0]._id : "",
            interviewState: (value && value[0]) ? value[0].interviewState : -1,
          };
          candListObject.push(obj);
        });
        setCandidates(candListObject);
        

        // setDeclined(res.data.declined);
        // setInvited(res.data.invited);
        let primarySkills = {};
        let roles = new Set([]);
        res.data.job.skills?.forEach((skill) => {
          roles.add(skill?.role);
          if (primarySkills[skill?.role]) {
            primarySkills[skill?.role].add(skill?.primarySkill);
          } else {
            primarySkills[skill?.role] = new Set([skill?.primarySkill]);
          }
        });
        setRoles(Array.from(roles));
        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);
      } else {

      }
      setLoader(false);
    };
    getData();
   
  }, [loader]);
  
  const handleReinviteClick = (cid) => {
    swal({
      title: "This will resend the invite to the candidate.",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (resend) => {
      if (resend) {
        let resp = await resendInvite(job_id,cid);
        if(resp && resp.status===200){
          swal("The candidate has been reinvited", {
            icon: "success",
          });
        }else{
          swal("Something went wrong", {
            icon: "error",
          });
        }
      }
    });
    
  };

  const archive = async () => {
    let access_token = getStorage("access_token");
    let user = JSON.parse(await getStorage("jobDetails"));
    user.archived = !toggle;
    await ls.set("jobDetails", JSON.stringify(user));

    let res = await archiveJob(user);

    if (res) {
      setToggle(!toggle);
      // ls.remove("jobDetails");
    }
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= candidates.length; i++) {
      const element = document.getElementById("jobcrd" + i);
      if (element) {
        element.classList.add("hidden");
      }
    }
    for (var j = 1; j <= 5; j++) {
      const element = document.getElementById("jobcrd" + ((p - 1) * 5 + j));
      if (element) {
        element.classList.remove("hidden");
      }
    }
  };
  const [chooseStatus, setchooseStatus] = React.useState(null);

  const handleCandidateStatusChange = (id, status) => {
    setChoosenStatus(status);
    setChoosenId(id);
  }
  const handleShareClick = (id) => {
    let token = getStorage("access_token");
    swal({
      title: "This action will share evaluation & feedback report with candidate?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((share) => {
      if (share) {
        shareJob(id, token);
        swal("The report has been shared!", {
          icon: "success",
        });
      }
    });
  };

  const approveCandidate = async (index) => {
    let approve = await approveCd(index, job_id, candidates[index]);
    if (approve) {
      window.location.reload();
    }
  }

  const handleCandidateStatusPost = async () => {
    let access_token = getStorage("access_token");
    let user = JSON.parse(getStorage("user"));
    let res = await postUpdateCandidateStatus(
      {
        _id: choosenId,
        status: choosenStatus,
        isCompany: true
      },
      access_token
    );
    if (res) {
      swal({
        title: "Candidate Job Status Updated Successfully !",
        message: "Success",
        icon: "success",
        button: "Continue",
      }).then((result) => {
        setLoading(false);
        window.location.reload();
      });
    } else {
      swal({
        title: "Error Updating Candidate Job Status !",
        message: "OOPS! Error Occured",
        icon: "Error",
        button: "Ok",
      });
    }
  }


  const shareJob = async (id, token) => {
    try {
      let sendFeedbackResponse = await sendFeedbackInvitation({id}, token);
      if (sendFeedbackResponse.status === 200) {
        swal({
          icon: "success",
          title: "Invitation Send",
          button: "Continue",
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error(`Unexpected response: ${sendFeedbackResponse.status}`);
      }
    } catch (error) {
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to send the invitation. Please try again later.",
        button: "OK",
      });
    }
  };

  return (
    <>
    {!loader? 
    <div
      className="w-full p-5  overflow-hidden"
      style={{ backgroundColor: "#F2F3F5" }}
    >
      {job ? (
        <>
          <div
            className="card my-5 w-full md:p-5 p-2 bg-white "
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <p className="text-center text-3xl font-black py-2 mb-3">
              {job.jobTitle}
              {"  "}  ({job.jobType} {"  "}job )
            </p>

            <div className="w-full  bg-white border border-b">
              <div
                className="grid md:px-9 px-3 grid-cols-1 gap-4 lg:grid-cols-7 sm:grid-cols-4 py-6"
                style={{ backgroundColor: "#F2F3F5" }}
              >
                <div className="col-span-2 flex align-middle justify-between">
                  <div className="">
                    <img
                      src={""}
                      className="h-16 w-16 md:h-20 md:w-20 text-center rounded-full my-3 bg-white border border-gray-700"
                    />
                  </div>
                  <div className="pt-3 ">
                    <h5 className="text-black-900 text-lg font-bold mb-1 ">
                      {job.jobTitle}
                    </h5>
                    <p className="text-sm font-bold  text-gray-400 font-semibold">
                      {job.hiringOrganization}
                    </p>
                    <div className="pt-3 ">
                      <p className="text-sm font-bold  text-gray-500 font-bold">
                        <strong>Status</strong> : {job.status}
                      </p>
                    </div>
                  </div>

                </div>
                <div className="col-span-2">
                  {/* <p className="px-4 text-g ray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <CgWorkAlt />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.jobType}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineLocationMarker />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineCalendar />
                    </div>

                    <p className="px-2 text-md text-gray-400 font-semibold">
                      {new Date(job.validTill).getDate() +
                        "-" +
                        (new Date(job.validTill).getMonth() + 1) +
                        "-" +
                        new Date(job.validTill).getFullYear()}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <BsCashStack />
                    </div>
                    {job.salary && job.salary.length >= 2 && (
                      <p className="px-4 text-md text-gray-400 font-semibold">
                        {job.salary[0].symbol} {job.salary[1]}{" "}
                        {job.salary.length === 3 && (
                          <span>- {job.salary[2]}</span>
                        )}
                      </p>
                    )}
                  </div>

                </div>
                {job.uploadBy === user._id && (
                  (job.status === "Active" || job.status === "Archived") &&
                  <Popover className="relative mt-1">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                               ${open ? "" : "text-opacity-90"
                            } focus:outline-0`}
                        >
                          {/* <div className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10" style={{backgroundColor:"#034488"}}></div> */}

                          <BsThreeDots className="text-gray-700 text-lg mt-5 cursor-pointer hover:text-gray-800" />
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

                          <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl">
                            <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="relative gap-8 bg-white p-2 lg:grid-cols-2 flex justify-between">
                                <div className="w-[8vw]  text-gray-800 ">
                                  {/* <BsThreeDots className="text-md" /> */}
                                  {job.status === "Active" &&
                                    <p
                                      className="text-sm font-semibold py-1 border-b cursor-pointer"
                                      onClick={() => {
                                        window.location.href = `/company/jobUpdate/${job._id}`;
                                      }}
                                    >
                                      Edit
                                    </p>
                                  }
                                  {job.status === "Archived" ?
                                    <p
                                      className="text-sm font-semibold py-1 cursor-pointer"
                                      onClick={() => {
                                        archive();
                                      }}
                                    >
                                      {toggle ? "Unarchive" : "Archive"} Job
                                    </p>
                                    : null}
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                )}
              </div>
            </div>
            <div className="card-body md:px-7 md:w-4/5">
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  {" "}
                  Job Description :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.jobDesc)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Eligibility :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.eligibility)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Skills Required :
                </h5>
                {/* {job &&
                  job.skills &&
                  job.skills.map((item) => {
                    return (
                      <span className="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">
                        {item.primarySkill}
                      </span>
                    );
                  })} */}
                      <div className="px-4 ml-5">
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                          <table className="w-full">
                            <thead className="text-white" style={{ backgroundColor: "#228276" }}>
                              <tr>
                                <th className="py-3 px-6 text-left">Role</th>
                                <th className="py-3 px-6 text-left">Primary Skill</th>
                                <th className="py-3 px-6 text-left">Proficiency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roles
                                ? roles.map((item, index) => {
                                    const roleSkills = skillsPrimary[item];
                                    const roleColorClass = index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"; // Change the color class based on your preference

                                    return roleSkills.map((el, elIndex) => {
                                      const filteredSkills = job.skills.filter(
                                        (tool) => tool.role === item && tool.primarySkill === el
                                      );
                                      const proficiency = filteredSkills.length > 0 ? filteredSkills[0].proficiency : "N/A";

                                      return (
                                        <tr
                                          key={`role-${index}-skill-${elIndex}`}
                                          className={roleColorClass}
                                        >
                                          {elIndex === 0 ? (
                                            <td rowSpan={roleSkills.length} className="py-2 px-6 text-md font-semibold">
                                              {item}
                                            </td>
                                          ) : null}
                                          <td className="py-2 px-6 text-sm">
                                            <b>{el}</b>
                                          </td>
                                          <td className="py-2 px-6 text-sm">{proficiency}</td>
                                        </tr>
                                      );
                                    });
                                  })
                                : (
                                  <tr>
                                    <td colSpan="3" className="py-2 px-6 text-sm text-center">
                                      No skills mapped to this job.
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                <div className=""></div>
              </div>
              {job.perks && (
                <div className="my-7">
                  <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                    Remunerations :
                  </h5>
                  <h6
                    className="px-4 mb-2 text-lg text-gray-500"
                    dangerouslySetInnerHTML={{ __html: job.perks }}
                  ></h6>
                  {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
                </div>
              )}
            </div>
            <div className="card-body md:px-7">

              {user._id === job.uploadBy && (
                <>
                  {
                    <div className="my-5 px-3 md:px-9">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-md">
                          Invitations{" "}
                          <span className="text-sm">({candidates.length})</span>
                        </p>
                      </div>
                      <div className="w-full">
                        {candidates.length > 0 && (
                            <div className="overflow-x-auto">
                              <div className="flex justify-between px-6 py-4 text-white text-sm" style={{ backgroundColor: "#228276" }}>
                              <div className="w-4/6">
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  className="block w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-black"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <div className="w-4/6 flex justify-end items-center">
                                <label className="mr-2 text-white-200"><b>Status:</b></label>
                                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="block w-32 mt-1 px-2 py-1 border border-gray-300 rounded-md text-black">
                                  <option value="All">All</option>
                                  <option value="Evaluated">Evaluated</option>
                                  <option value="No show">No show</option>
                                  <option value="Interview Completed">Interview Completed &nbsp;</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Invited">Invited</option>
                                  <option value="Scheduled">Scheduled</option>
                              </select>
                              </div>
                              <div className="w-4/6 flex justify-end items-center">
                                {searchQuery && (
                                  <button
                                    className="bg-white shadow-md px-2 py-1 rounded-md text-green-500 hover:text-green-700 focus:outline-none"
                                    onClick={() => setSearchQuery("")}
                                  >
                                    <b>Reset</b>
                                  </button>
                                )}
                              </div>
                            </div>
                              <table className="w-full">
                                <thead className="text-white" style={{ backgroundColor: "#228276" }}>
                                  <tr className="font-bold">
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      #
                                    </th>
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Full Name
                                    </th>
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Email
                                    </th>
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Contact
                                    </th>
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Invited on
                                    </th>
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Status
                                    </th>
                                    {/* <th scope="col" className="text-sm px-6 py-4 text-left"></th> */}
                                    <th scope="col" className="text-sm px-6 py-4 text-left">
                                      Action(s)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                {candidates?.filter(user =>
                                (user.FirstName && user.FirstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (user.LastName && user.LastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (user.Email && user.Email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (user.Contact && user.Contact.includes(searchQuery)))
                                .filter((user) => selectedStatus === 'All' || 
                                (selectedStatus === 'Evaluated' && user.interviewState === 4) ||
                                (selectedStatus === 'No show' && user.interviewState === 3) ||
                                (selectedStatus === 'Interview Completed' && user.interviewState === 2) ||
                                (selectedStatus === 'Ongoing' && user.interviewState === 1) ||
                                (selectedStatus === 'Scheduled' && user.interviewState === 0) ||
                                (selectedStatus === 'Invited' && user.interviewState === -1) )
                                .slice((page - 1) * 10, page * 10).map((user, index) => (
                                    <tr
                                    key={"jobcrd" + (index + 1)}
                                    className={
                                      index < 10 ? "bg-gray-100" : "bg-gray-100 hidden"
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                      {index + 1}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.FirstName} {user.LastName}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td className={`text-sm font-light px-6 py-4 whitespace-nowrap text-left ${user?.interviewState===-1 && user?.age > 3 ? 'font-bold text-red-500' : ''}`}>
                                     {user.invitedDate}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                            <>
                                            {true?<>
                                              {
                                                (() => {
                                                  if(user.interviewState===4){
                                                    return (
                                                      <span className="bg-green-300 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>Evaluated</strong>
                                                        </span>
                                                      )
                                                  }else if(user.interviewState===3){
                                                    return (
                                                      <span className="bg-red-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>No show</strong>
                                                      </span>
                                                    )
                                                  }else if(user.interviewState===2){
                                                    return (
                                                      <span className="bg-blue-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>Interview Completed</strong>
                                                      </span>
                                                    )
                                                  }else if(user.interviewState===1){
                                                    return (
                                                      <span className="bg-green-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>Ongoing</strong>
                                                      </span>
                                                    )
                                                  }else if(user.interviewState===0){
                                                    return (
                                                      <span className="bg-gray-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>Scheduled</strong>
                                                      </span>
                                                    )
                                                  }else if(user.interviewState===-1){
                                                    return (
                                                      <span className="bg-gray-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                                        <strong>Invited</strong>
                                                      </span>
                                                    )
                                                  }
                                                })()
                                              }
                                            </>: 
                                              // <span className="bg-gray-400 text-gray-800 text-xs font-medium px-3 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                              //   <strong>{user?.interviewState}</strong>
                                              // </span>
                                              null
                                            }
                                            </>
                                                                     
                                    </td>

                                    {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.age>3 ?
                                        <input type="checkbox" />
                                        : null
                                      }
                                    </td> */}
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left absolute">
                                      <>
                                          <>
                                            {gcaneval?<>
                                              { (() => {
                                                return (
                                                  <>
                                                    <Popover className="relative text-[#FFFFFF] text-sm self-center">
                                                      <Popover.Button className="focus:outline-0">
                                                        <div className="cursor-pointer text-gray-800 text-2xl font-medium">
                                                          ...
                                                        </div>
                                                      </Popover.Button>
                                                      <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                                        <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                                          <div className="relative gap-8 bg-white py-3 px-1 lg:grid-cols-4 justify-between">
                                                            {user.interviewState===4 ? (
                                                              <>
                                                                <div className="flex items-center border-b text-gray-800 space-x-2 w-full">
                                                                  <p className="text-sm font-semibold py-2 cursor-pointer w-full">
                                                                    <a className="font-bold rounded-xl py-2 flex w-full justify-center" href={`/company/CPrintAble/${user.interviewId}`}>View Feedback</a>
                                                                  </p>{" "}
                                                                </div>
                                                                {/* <div className="flex items-center border-b text-gray-800 space-x-2 w-full">
                                                                  <p className="text-sm font-semibold py-2 cursor-pointer w-full">
                                                                  {
                                                                    gcaneval[index].hasReport?
                                                                      <button className="focus:outline-none font-bold rounded-xl py-2 flex w-full justify-center"><strong>Feedback shared</strong></button>
                                                                    :
                                                                      <button className="focus:outline-none font-bold rounded-xl py-2 flex w-full justify-center" onClick={() => handleShareClick(gcaneval[index].applicant)}>Share feedback</button>
                                                                  }
                                                                  </p>{" "}
                                                                </div> */}
                                                              </>
                                                            ) : (
                                                              null
                                                            )}
                                                          {user?.interviewState===-1  && user?.age > 3?
                                                            <div className="flex items-center border-b text-gray-800 space-x-2 w-full">
                                                              <p className="text-sm font-semibold py-2 cursor-pointer w-full">
                                                                <a className="font-bold rounded-xl py-2 flex w-full justify-center" href={`#`}
                                                                onClick={ () =>{handleReinviteClick(user?.cid)}}
                                                                > Reinvite </a>
                                                              </p>{" "}
                                                          </div>
                                                          :null}
                                                            {user.Uid ?
                                                            <div className="flex items-center text-gray-800 space-x-2 w-full">
                                                              <p className="text-sm font-semibold py-2 cursor-pointer w-full">
                                                                <a className="font-bold rounded-xl py-2 flex w-full justify-center" href={`/company/vmlitereport/${user.Uid}`}>VMLite Report</a>
                                                              </p>{" "}
                                                            </div>
                                                            :null}
                                                          </div>
                                                        </div>
                                                      </Popover.Panel>
                                                    </Popover>
                                                  </>
                                                )
                                              })()
                                            }</>:null}
                                          </>                                  
                                        </>
                                    </td>
                                  </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                        )}
                      </div>


                      {chooseStatus && (
                        <Transition
                          appear
                          show={chooseStatus}
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
                              <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                                <Transition.Child
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95"
                                >
                                  <Dialog.Panel className="w-auto pb-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all">
                                    <div className="rounded-lg bg-white w-full">
                                      <div className="flex items-start space-x-3 	">
                                        <div className="py-5 w-full bg-blue-900 flex">
                                          <p className="text-lg mx-5 text-center text-white font-semibold">
                                            Change Status
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start space-x-3 	">
                                        <div className="py-5 w-full flex">
                                          <p className="text-lg mx-5 text-center text-black font-semibold">
                                            Do you want to change status
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-auto mx-auto flex justify-center">
                                        <button
                                          className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                          style={{ backgroundColor: "#034488" }}
                                          onClick={() => {
                                            handleCandidateStatusPost()
                                          }}
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                          onClick={() => {
                                            setchooseStatus(false);
                                          }}
                                        >
                                          Decline
                                        </button>
                                      </div>
                                    </div>
                                  </Dialog.Panel>
                                </Transition.Child>
                              </div>
                            </div>
                          </Dialog>
                        </Transition>
                      )}
                      <div className="w-full">
                        <div className="flex justify-between my-2 mx-1">
                          <div className="flex items-center">
                            {page > 1 && (
                              <span
                                className="mx-2 cursor-pointer hover:text-green-500"
                                onClick={() => {
                                  paginate(page - 1);
                                }}
                              >
                                <b> &lt; Previous </b>
                              </span>
                            )}
                            {Array.from({ length: Math.ceil(candidates.length / 10) }, (_, i) => i + 1).map((pageNumber) => {
                              if (Math.abs(pageNumber - page) <= 2 || pageNumber === 1 || pageNumber === Math.ceil(candidates.length / 10)) {
                                return (
                                  <span
                                    key={pageNumber}
                                    className={`mx-2 cursor-pointer ${
                                      pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                    }`}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: "4px",
                                      backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                    }}
                                    onClick={() => {
                                      paginate(pageNumber);
                                    }}
                                  >
                                    {pageNumber}
                                  </span>
                                );
                              } else if (Math.abs(pageNumber - page) === 3) {
                                return <span key={`ellipsis-${pageNumber}`} className="mx-2">...</span>;
                              }
                              return null;
                            })}
                            {page < Math.ceil(candidates.length / 10) && (
                              <span
                                className="mx-2 cursor-pointer hover:text-green-500"
                                onClick={() => {
                                  paginate(page + 1);
                                }}
                              >
                                <b> Next &gt;</b>
                              </span>
                            )}
                          </div>
                          <div>
                            Page {page} of {Math.ceil(candidates.length / 10)}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    :
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor:"#f1f1f1" }}>
          <div>
            <img src={logo} alt="Value Matrix" width="200px"/>
            <div className="flex justify-center items-center mt-4 mb-2">
              <div role="status">
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            </div>
            <h3 className="text-center">Loading details...</h3>
          </div>
        </div>
    }
    </>
  );
}
export default JobDetails;
