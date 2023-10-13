import React from "react";
import { addPanelToJob, approveJob, getAllCandidatesOfJob, getJobBinById, getPanelDetails, ListXIPanels, unapprovedJobsList } from "../../service/api";
import { ReactSession } from "react-client-session";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineCalendar } from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import { Popover, Transition, Menu, Dialog } from "@headlessui/react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { Oval } from "react-loader-spinner";
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
import { updateJobAPI, getSkills, archiveJob, approveCd } from "../../service/api";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import swal from "sweetalert";
import {
  postUpdateCandidateStatus
} from "../../service/api";
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
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

  const [user, setUser] = React.useState(null);
  const [toggle, setToggle] = React.useState(true);
  const [choosenStatus, setChoosenStatus] = React.useState("");
  const [choosenId, setChoosenId] = React.useState("");
  const [loading, setLoading] = React.useState(null);

  const [jobs, setJobs] = useState('')

  // Get xi panel details

  const [xiPanels, setXiPanels] = useState([])
  const [selectedPanel, setSelectedPanel] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = candidates.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => {
    console.log("Current page:", pageNumber);
    setCurrentPage(pageNumber);
  };
  const [panelLoading,setPanelLoading] = useState(false)
  React.useEffect(() => {
    const fetchPanels = async () => {
      setPanelLoading(true)
      let res = await ListXIPanels()
      if (res && res.status == 200 && res.data.panels.length > 0) {
        setXiPanels(res.data.panels)
        setSelectedPanel(res.data.panels[0]?._id)
        setPanelLoading(false)
      }
    }
    fetchPanels()
  }, [])
  
  const [currentPanel, setCurrentPanel] = useState(null)
  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      let user = JSON.parse(await getStorage("user"));
      await setUser(user);
      let res = await getJobBinById(job_id, access_token);
      if (res) {
        setJob(res.data.job[0]);
        let jobDetails = res.data.job[0];
        if (jobDetails?.panelId) {
          let currentPanelDetails = await getPanelDetails({ panelId: jobDetails.panelId })
          setCurrentPanel(currentPanelDetails?.data?.panelData)
        } else {
          setCurrentPanel('No panel ')
        }
        await ls.set("jobDetails", JSON.stringify(res.data.job[0]));
        // if (res.data.job[0].archived) {
        //   setToggle(res.data.job[0].archived);
        // }

        let candList = await getAllCandidatesOfJob(res?.data?.job[0]._id);
        let candListObject = [];
        candList?.data?.candidates.map((item) => {
          let obj = {
            FirstName: item?.firstName,
            LastName: item?.lastname,
            Contact: item?.phoneNo,
            Email: item?.email,
            Address: "",
            Status: "",
            Uid: item?.user[0]?._id ? item?.user[0]?._id : "",
          };
          candListObject.push(obj);
        });
         setCandidates(candListObject);

         // setCandidates(res?.data?.job[0]?.invitations);

         setDeclined(res.data.declined);
         setInvited(res.data.invited);
        let primarySkills = {};
        let roles = new Set([]);
        if (res && res.data && res.data.job.length > 0 && res.data.job[0].skills) {
          res.data.job[0].skills?.forEach((skill) => {
            roles.add(skill.role);
            if (primarySkills[skill.role]) {
              primarySkills[skill.role].add(skill.primarySkill);
            } else {
              primarySkills[skill.role] = new Set([skill.primarySkill]);
            }
          });
        }

        setRoles(Array.from(roles));
        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);
      } else {
      }
    };

    getData();
  }, []);

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

  const [chooseStatus, setchooseStatus] = React.useState(null);

  const handleCandidateStatusChange = (id, status) => {
    setChoosenStatus(status);
    setChoosenId(id);
  }

  const approveCandidate = async (index) => {
    let approve = await approveCd(index, job_id, candidates[index]);
    if (approve) {
      window.location.href = "/admin/alljobs";
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

  const [showPanelForm, setShowPanelForm] = useState(false)
  const handleAddPanel = () => {
    setShowPanelForm(true)
  }

  return (
    // <div className="p-5 mx-auto">
    //   <p className="text-2xl font-bold">Job Details</p>
    //   {job && (
    //     <div className="p-2 my-5 space-y-3 w-3/4 text-gray-800">
    //       <p>
    //         <span className="font-semibold">Job Title :</span>{" "}
    //         {/* <span className="capitalize">{job.jobTitle}</span> */}
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Description :</span>{" "}
    //         <span className="capitalize">{job.jobDesc}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Location :</span>{" "}
    //         <span className="capitalize">{job.location}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Type :</span>{" "}
    //         <span className="capitalize">{job.jobType}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Hiring Organization :</span>{" "}
    //         <span className="capitalize">{job.hiringOrganization}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Basic Pay Range :</span>{" "}
    //         <span className="capitalize">{job.basicSalary}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold my-2">Apply By :</span>{" "}
    //         <span className="capitalize">
    //           {new Date(job.validTill).getDate() +
    //             "-" +
    //             new Date(job.validTill).getMonth() +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}
    //         </span>
    //       </p>
    //     </div>
    //   )}
    // </div>
    <div
      className="min-h-screen w-full p-5  overflow-hidden"
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
              {"  "} {job.jobType} {"  "}Job
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
                  </div>
                </div>
                <div className="col-span-2">
                  {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
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
                {
                }
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
                  {roles
                    ? roles.map((item, index) => {
                      return (
                        <div>
                          <p className="font-semibold text-md my-3">{item}</p>
                          {skillsPrimary[item].map((el) => (
                            <div>
                              <p className="text-sm my-2">{el}</p>
                              <div className="flex flex-wrap">
                                {job.skills
                                  .filter(
                                    (tool) =>
                                      tool.role === item &&
                                      tool.primarySkill === el
                                  )
                                  .map((item1, index) => (
                                    <p className="bg-blue-100 text-blue-800 mr-3 text-xs my-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                      {item1.secondarySkill}(
                                      {item1.proficiency})
                                    </p>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })
                    : "No Skills Required"}
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
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Panel :
                </h5>
                <h6
                  className="px-4 mb-2 text-lg text-gray-500"
                >{currentPanel?.panelName}</h6>
                {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
                <button
                  className="py-2 text-white rounded-lg block cursor-pointer px-4 ml-4"
                  style={{ backgroundColor: "#034488" }}
                  onClick={handleAddPanel}
                >
                  Add Panel
                </button>
              </div>



              {showPanelForm && (
                <Transition
                  appear
                  show={showPanelForm}
                  as={Fragment}
                  className="relative z-10000"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10000"
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
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                            <div
                              className={`${!showPanelForm ? "hidden" : "block"}`}
                            >
                              <Formik
                                initialValues={{
                                  selectedPanel: ''
                                }}

                              >
                                {({ values }) => {
                                  return (
                                    <Form className="w-full py-4">
                                      <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                                        <label className="font-bold text-lg md:w-2/5 mx-5 mt-2">
                                          Select a Panel{" "}
                                        </label>
                                        {panelLoading ? (
                                          <>
                                            <Oval
                                              height={30}
                                              width={30}
                                              color="#3FD2C7"
                                              wrapperStyle={{}}
                                              wrapperClass=""
                                              visible={true}
                                              ariaLabel="oval-loading"
                                              secondaryColor="#9ddaf7"
                                              strokeWidth={6}
                                              strokeWidthSecondary={2}
                                            />
                                            <p className="mt-2">
                                              Please wait....
                                            </p>
                                          </>
                                        ) : (
                                          <select
                                            className="focus:outline-none  border-none focus:ring-[#EEEEEE] bg-[#FAFAFA] rounded-xl hover:bg-[#FAFAFA]"
                                            onChange={(e) =>
                                              setSelectedPanel(e.target.value)
                                            }
                                            defaultValue={selectedPanel}
                                          >
                                            {xiPanels &&
                                              xiPanels.length > 0 &&
                                              xiPanels.map((panel, index) => (
                                                <option
                                                  key={index}
                                                  value={panel?._id}
                                                >
                                                  {panel?.panel}
                                                </option>
                                              ))}
                                          </select>
                                        )}
                                      </div>

                                      <div className="flex px-5 w-full justify-center text-center mt-2">
                                        <button
                                          disabled={panelLoading}
                                          onClick={async () => {
                                            let panel = await addPanelToJob({
                                              jobId: job?._id,
                                              panelId: selectedPanel,
                                            });

                                            if (panel && panel.status == 200) {
                                              swal({
                                                icon: "success",
                                                title:
                                                  "Panel Added Successfully",
                                                button: "Continue",
                                              }).then(() => {
                                                setShowPanelForm(false);
                                                window.location.reload();
                                              });
                                            }
                                          }}
                                          className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                          style={{ backgroundColor: "#034488" }}
                                        >
                                          {/* {edit === null
                                                ? "Save Changes "
                                                : "Update"} */}
                                          Save Changes
                                        </button>
                                        <button
                                          type="button"
                                          className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                          // ref={resetBtn}
                                          onClick={async () => {
                                            // await setEdit(null);
                                            // await setShowError(false);
                                            await setShowPanelForm(false);
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
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
            </div>
            <div className="card-body md:px-7">
              {user._id === job.uploadBy || user.user_type == "Admin_User" ? (
                <div className="my-5 px-3 md:px-9">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-md">
                      Invitations{" "}
                      <span className="text-sm">({candidates.length})</span>
                    </p>
                    {/* {candidates.length > 0 && showCandidate ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(true)}
                    >
                      Show
                    </p>
                  )} */}
                  </div>
                  
                  {candidates.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full my-5 ">
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
                              First Name
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Email
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
                              Status
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRecords.map((user, index) => {
                            return (
                              <tr
                                key={index}
                                className={index < recordsPerPage ? "bg-gray-100" : "bg-gray-100 hidden"}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                  {(currentPage - 1) * recordsPerPage + index + 1}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  <a href="/">{user.FirstName ? user.FirstName : user.firstName} {user.LastName ? user.LastName : user.lastName}</a>
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Email ? user.Email : user.email}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Contact ? user.Contact : user.phoneNo}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Status ? user.Status : ""}
                                </td>


                                {/* <td className="text-sm text-gray-900 font-light px-3 py-4 whitespace-nowrap text-left">
                                <p className="text-sm font-semibold py-2">
                                  <Link
                                    to={`/company/evaluationDetails/${user._id}`}
                                    // to={`/user/printable`}
                                  >
                                    View Details{" "}
                                  </Link>
                                </p>{" "}
                              </td> */}
                                {/* <td className="text-sm text-blue-700 font-light px-3 py-4 whitespace-nowrap text-left">
                                <p className="text-sm font-semibold py-2">
                                  <Link
                                    to={`/company/CPrintAble/${user._id}`}
                                    // to={`/company/CPrintable`}
                                  >
                                    View Evaluation{" "}
                                  </Link>
                                </p>{" "}
                              </td> */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

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
                                    {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                    <div className="py-5 w-full bg-blue-900 flex">
                                      <p className="text-lg mx-5 text-center text-white font-semibold">
                                        Change Status
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start space-x-3 	">
                                    {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
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
                  <div className={candidates.length > 5 ? "w-full" : "hidden"}>
                    <div className="flex justify-between my-2 mx-1">
                      <div>
                        Page {page} of {Math.ceil(candidates.length / 5)}
                      </div>
                      <div>
                        {" "}
                        {candidates &&
                          candidates.map((job, index) => {
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
                  {/* <div className="flex items-center justify-between my-5">
                  <p className="font-bold text-md">
                    Invitations
                    <span className="text-sm"> ({invited.length})</span>
                  </p>
                  {/* {invited.length > 0 && showInvited ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(true)}
                    >
                      Show
                    </p>
                  )} 
                </div> */}








                </div>
              ) : null}
              {user.isAdmin === true && (
                <>

                  {job.status === "Pending" ? <>
                    <div className="flex my-5 px-3 w-full justify-center">
                      <button className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-2 px-4"
                        onClick={async () => {



                          let res1 = await approveJob({
                            _id: job._id,
                            timeCreated : new Date()
                          });


                          if (res1?.status == 204) {
                            swal({
                              icon: "error",
                              title: "No Panel found",
                              text: "Please add Panel",
                              button: "Continue",
                            });
                          }
                          if (res1.status == 200) {
                            let panel = await addPanelToJob({ jobId: res1.data?._id, panelId: selectedPanel })
                            swal({
                              icon: "success",
                              title: "Job Approved Successfully",
                              button: "Continue",
                            }).then(() => {
                              window.location.href = "/admin/jobvalidate";
                            });
                            //  let res = await unapprovedJobsList();

                            //  if (res && res.data) {
                            //    setJobs(res.data);
                            //    let arr = [...res.data];
                            //    const jsonObj = JSON.stringify(arr);

                            // }
                          }
                        }}
                      >Approve Job</button>
                    </div>
                  </> : <>
                    <div className="my-5 px-3 md:px-9">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-md">
                          Invitations{" "}
                          <span className="text-sm">({candidates.length})</span>
                        </p>
                        {/* {candidates.length > 0 && showCandidate ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(true)}
                    >
                      Show
                    </p>
                  )} */}
                      </div>

                      {candidates.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full my-5 ">
                            <thead className="bg-white border-b text-left">
                              <tr className="font-bold">
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  First Name11
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  Email
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  Contact
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  Status
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm text-gray-900 px-6 py-4 text-left"
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRecords.map((user, index) => {
                                return (

                                  <tr
                                    key={index}
                                    className={index < recordsPerPage ? "bg-gray-100" : "bg-gray-100 hidden"}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                      {index + 1}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Uid ? <><a href={"/admin/AdminUserProfile/" + user.Uid}>{user.FirstName} {user.LastName}</a></> : <>{user.FirstName} {user.LastName}</>}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Email}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {user.Contact}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {!user.Uid ? <>Pending Invitation</> : <>{user.Status}</>}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                      {!user.Uid ? <button className="text-white font-bold bg-sky-500 rounded-xl px-4 py-2" onClick={() => {
                                        approveCandidate(index);
                                      }} >Invite</button> : <button className="text-white font-bold bg-green-500 rounded-xl px-4 py-2" onClick={() => {
                                        approveCandidate(index);
                                      }}>Approve</button>}
                                    </td>


                                    {/* <td className="text-sm text-gray-900 font-light px-3 py-4 whitespace-nowrap text-left">
                                <p className="text-sm font-semibold py-2">
                                  <Link
                                    to={`/company/evaluationDetails/${user._id}`}
                                    // to={`/user/printable`}
                                  >
                                    View Details{" "}
                                  </Link>
                                </p>{" "}
                              </td> */}
                                    {/* <td className="text-sm text-blue-700 font-light px-3 py-4 whitespace-nowrap text-left">
                                <p className="text-sm font-semibold py-2">
                                  <Link
                                    to={`/company/CPrintAble/${user._id}`}
                                    // to={`/company/CPrintable`}
                                  >
                                    View Evaluation{" "}
                                  </Link>
                                </p>{" "}
                              </td> */}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

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
                                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                        <div className="py-5 w-full bg-blue-900 flex">
                                          <p className="text-lg mx-5 text-center text-white font-semibold">
                                            Change Status
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start space-x-3 	">
                                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
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
                      <div className={candidates.length > recordsPerPage ? "w-full" : "hidden"}>
                        <div className="flex justify-between my-2 mx-1">
                          <div>
                            Page {currentPage} of {Math.ceil(candidates.length / recordsPerPage)}
                          </div>
                          <div>
                            {Array.from({ length: Math.ceil(candidates.length / recordsPerPage) }, (_, i) => (
                              <span
                                key={i}
                                className="mx-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => paginate(i + 1)}
                              >
                                {i + 1}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center justify-between my-5">
                  <p className="font-bold text-md">
                    Invitations
                    <span className="text-sm"> ({invited.length})</span>
                  </p>
                  {/* {invited.length > 0 && showInvited ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(true)}
                    >
                      Show
                    </p>
                  )} 
                </div> */}








                    </div>
                  </>}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-40" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Oval/><Oval/><Oval/><Oval/><Oval/>
          </div>
      )}
    </div>
  );
}
export default JobDetails;
