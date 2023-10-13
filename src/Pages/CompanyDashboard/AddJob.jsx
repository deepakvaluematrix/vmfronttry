import React, { Fragment, useState } from "react";
import { CSVLink } from "react-csv";
import { Formik, Form, ErrorMessage, Field } from "formik";
import {
  postJobAPI,
  sendJobInvitations,
  eligibleCandidateList,
  getuserbyEmail,
  getcognitiveSkills,
  addCandidateInfo,
} from "../../service/api";
import swal from "sweetalert";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromId, getSkills } from "../../service/api";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import * as xlsx from "xlsx/xlsx.mjs";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import currencies from "currencies.json";
import Loader from "../../assets/images/loader.gif";
import { Combobox } from "@headlessui/react";
import cities from "cities.json";
import "../../assets/stylesheet/editor.scss";
import "../../assets/stylesheet/custom.css";
import { Chip } from "@mui/material";
import StarRating from "../../Components/StarRating";
import ls from "localstorage-slim";
import { getStorage, removeStorage } from "../../service/storageService";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
export const maxLimitOfCandidate = process.env.CANDIDATE_MAX_LIMIT || 100;

const AddJobs = () => {
  // Page Index and the page refresh functionality in each case
  const [Submitstatus, setSubmitStatus] = React.useState(0);
  const [PageIndex, setPageIndex] = useState(1);
  React.useEffect(() => {
    ls.set("PageIndex", PageIndex);
  }, [PageIndex]);
  const handleRefresh = React.useCallback(() => {
    if (PageIndex === 6 || Submitstatus === 1) {
      ls.remove("PageIndex");
      setPageIndex(1);
    } else {
      ls.set("PageIndex", PageIndex);
    }
  }, [PageIndex, Submitstatus]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleRefresh);
    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [PageIndex]);


  const headerso = [
    { label: "FirstName", key: "firstname" },
    { label: "LastName", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Address", key: "address" },
  ];

  // Job Post Alert
  const [Alert, setAlert] = React.useState(null);

  // Skill Set Required For Job
  const [skills, setSkills] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [access, setAccess] = React.useState(null);
  const [mainValue, setMainValue] = React.useState(0);
  const [disabled, setDisabled] = React.useState(true);

  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);
  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(true);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [currency, setCurrency] = React.useState(currencies.currencies[0]);

  // Skills To Be Displayed
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [showRoles2, setShowRoles2] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const inputSkillRef = React.useRef(null);


  //slary to comma
  const [commasalary, setcsalary] = React.useState("");
  const [commamaxsalary, setcmaxsalary] = React.useState("");
  // Candidate Invitations Xl Sheet Input
  const candidateInputRef = React.useState(null);
  // Candidate Data
  const [candidateData, setCandidateData] = React.useState([]);
  const [rejectedData, setRejectedData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [showRejected, setShowRejected] = React.useState(false);
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [candidateInitial, setCandidateInitial] = React.useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Contact: "",
    Address: "",
    Status: "Pending",
    Uid: null,
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [eligibleButton, setEligibleButton] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [checkCsvLength, setCheckCsvLength] = React.useState(false);
  const [isTextboxSelected, setIsTextboxSelected] = useState(false);
  const [selected, setSelected] = useState(Array(showRoles.length).fill(false));
  const [max, setmax] = useState("");
  const [salary, setSalary] = useState("");
  const inputRef = React.useRef(null);
  const [submitError, setSubmitError] = React.useState(null);
  const [job, setJob] = React.useState({
    jobTitle: "",
    jobDesc: "",
    location: "",
    jobType: "",
    jobLocation: "",
    validTill: "",
    hiringOrganization: "",
    eligibility: "",
    skills: [],
    salary: null,
    perks: "",
    reqApp: "",
    showComLogo: "",
    showComName: "",
    showEmail: "",
    showContact: "",
    showEducation: "",
  });
  const salaryRef = React.useRef(null);
  const [user, setUser] = React.useState(null);
  const [logo, setLogo] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [contact, setContact] = React.useState(null);
  const [education, setEducation] = React.useState(null);
  const [touched, setTouched] = React.useState(false);

  const [invitedCandidates, setInvitedCandidates] = useState([])
  const [showEligible, setShowEligible] = React.useState(null);
  const [eligibleCanList, setEligibleCanList] = React.useState([]);
  const [List, setList] = React.useState([]);
  //skill error
  const [skillErr, setSkillErr] = useState(false);
  const [isCheckboxClicked, setIsCheckboxClicked] = useState(false);
  const handleCheckboxClick = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
    //   setIsTextboxSelected(!isTextboxSelected);
    // If the checkbox is checked, set isCheckboxClicked to true and setSkillErr to false
    if (newSelected[index]) {
      setIsCheckboxClicked(true);
      setSkillErr(false);
    } else { // If the checkbox is unchecked, set isCheckboxClicked to false and setSkillErr to true
      setIsCheckboxClicked(false);
      setSkillErr(true);
    }
  };


  const [selectedCandidateLimit, setSelectedCandidateLimit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // No of Records to be displayed on each page
  const [recordsPerPage] = useState(5);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = candidateData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const nPages = Math.ceil(candidateData.length / recordsPerPage);
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = (e) => {
    e.preventDefault();
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const [MasterChecked, setMasterChecked] = React.useState(false);
  const [SelectedList, setSelectedList] = React.useState([]);
  const onMasterCheck = (e) => {
    let tempList = List;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));
    //Update State
    setMasterChecked(e.target.checked);
    setList(tempList);
    setSelectedList(List.filter((e) => e.selected));
  };
  const onItemCheck = (e, item) => {
    let tempList = List;
    tempList.map((user) => {
      if (user.id === item.id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = List.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;
    // Update State
    setMasterChecked(totalItems === totalCheckedItems);
    setList(tempList);
    setSelectedList(List.filter((e) => e.selected));
  };
  const getSelectedRows = () => {
    setSelectedList(List.filter((e) => e.selected));
  };
  const getEligibleCandidate = async (eligibleSkills) => {
    var eligibleCan = await eligibleCandidateList(eligibleSkills);
    if (eligibleCan.data && eligibleCan.data.length > 0) {
      setEligibleCanList(eligibleCan.data);
      eligibleCan?.data?.forEach((ele, index) => {
        eligibleCan.data[index].selected = false;
        eligibleCan.data[index].id = index;
      });
      setList(eligibleCan.data);
      setShowEligible(true);
    } else {
      setList([]);
      setShowEligible(true);
    }
  };

  //no functions for this
  const handleFocus = () => {
    setTouched(true);
  };

  const [searchSkills, setSearchSkills] = useState([]);
  const handleClick = async () => { };
  const postJob = async (values, salary, maxSalary) => {
    try {
      let skills = [];
      dbSkills.forEach((el, index) => {
        if (prof[index] > 0) {
          el.proficiency = prof[index];
          skills.push(el);
        }
      });
      let access_token = getStorage("access_token");
      let user = JSON.parse(getStorage("user"));
      values.skills = skills;
      values.user_id = user._id;
      values.salary = [currency, salary, maxSalary];
      let c = salary;
      delete values.invitations;
      let jobData = {
        skills: skills,
        user_id: user._id,
        salary: [currency, salary, maxSalary],
        questions: questions,
        draft: false,
        invitations: invitedCandidates,
        ...values,
      };

      const hasNullUndefinedValue = Object.values(jobData).some(
        (value) => value === null || value === undefined
      );
      if (hasNullUndefinedValue) {
        swal({
          icon: "error",
          title: "Add job",
          text: "Please fill all the required data",
          button: "Continue",
        });
      } else {
        delete values.invitations;
        let res = await postJobAPI(
          {
            skills: skills,
            user_id: user._id,
            salary: [currency, salary, maxSalary],
            questions: questions,
            draft: false,
            invitations: invitedCandidates,
            ...values,
          },
          access_token
        );
        if (res) {
          swal({
            title: "Job Posted Successfully !",
            message: "Success",
            icon: "success",
            button: "Continue",
          }).then((result) => {
            setLoading(false);
            ls.remove("postjob");
            ls.remove("prof");
            window.location.href = "/company/pendingjobs";
          });
        } else {
          swal({
            title: " Error Posting Job !",
            message: "OOPS! Error Occured",
            icon: "Error",
            button: "Ok",
          });
        }
      }
    } catch (error) {
      setAlert(false);
    }
  };

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await getStorage("postjob"));
      if (e === null || e === "null") {
        await ls.set("postjob", JSON.stringify(job));
      }
      if (e !== "null" || e !== null) {
        setJob(e);
      }
      //
      let p = JSON.parse(await getStorage("prof"));
      let pr1 = JSON.parse(await getStorage("RolesProf"));
      let user = await JSON.parse(await getStorage("user"));
      await setUser(user);
      setAccess(user.access_token);
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let resc = await getcognitiveSkills(
        { user_id: user._id },
        user.access_token
      );
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200 && resc && resc.status === 200) {
        res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr1 = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);
        if (p && p.length === res.data.length) {
          setProf(p);
        } else {
          await setProf(new Array(res.data.length).fill(0));
        }
        await setRolesProf(pr1);
        await setShowRoles(Array.from(roles));
        await setShowRoles2(resc.data);
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const navigate = useNavigate();
  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      setLogo(user.showComLogo);
      setTitle(user.showComName);
      setEducation(user.showEducation);
      setContact(user.showEmail);
      setEmail(user.showContact);
      let res = await getUserFromId({ id: user._id }, user.access_token);
      if (
        res &&
        res.data &&
        res.data.user &&
        res.data.user.permissions &&
        res.data.user.permissions.length > 0 &&
        res.data.user.permissions[0].company_permissions
      ) {
        if (
          res.data.user.permissions[0].company_permissions.add_jobs === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);


  //
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
          console.log('D BEFORE-----------',d ? d : 'no d')
          const json = await xlsx.utils.sheet_to_json(worksheet);
          if (json.length > 0) {
            json.forEach(async (item) => {
              const EmailIndex = d.findIndex((el) => {
                return (
                  (el.Email !== null &&
                    el.Email !== undefined &&
                    el.Email !== "undefined" &&
                    item.Email !== undefined &&
                    el.Email.trim().toLowerCase() ===
                    item.Email.trim().toLowerCase()) ||
                  el.Contact === item.Contact
                );
              });
              const RejectIndex = r.findIndex(
                (el) =>
                  (el.Email !== null &&
                    item.Email !== undefined &&
                    (el.Email !== undefined &&
                      el.Email.trim().toLowerCase()) ===
                    item.Email.trim().toLowerCase()) ||
                  el.Contact === item.Contact
              );
              if (EmailIndex !== -1 || RejectIndex !== -1) {
                let vmuser = await getuserbyEmail(item.Email);
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Email/Contact Already Added",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                  Uid: vmuser.data.data._id,
                });
                return;
              }
              if (
                item.Email === null ||
                item.Email === undefined ||
                item.Email.trim() === "" ||
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  item.Email.trim()
                )
              ) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid Email",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (item.Contact === null || !/^[0-9]{10}$/i.test(item.Contact)) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid Contact",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (
                item.FirstName === null ||
                item.FirstName === undefined ||
                item.FirstName.trim() === ""
              ) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid First Name",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (EmailIndex === -1) {
                d.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
              }
            });
            await setShowCandidate(true);
            // test code

            if (d && d.length > 0) {
              let user = JSON.parse(getStorage("user"));
              let job = JSON.parse(getStorage("postjob"));
              for (let i = 0; i < d.length; i++) {
                const values = d[i]
                await addCandidateInfo({
                  candidateDataDup: values,
                  jobId: "",
                  companyId: user.company_id,
                  jobTitle: job.jobTitle,
                }).then(async (response) => {
                  if (response.status == 204) {
                    swal({
                      icon: "error",
                      title: "CompanyID Not Found",
                      text: "Please contact your Support !",
                      button: "Continue",
                    });
                  } else if (response.data) {
                    let vmuser = await getuserbyEmail(values.Email);
                    // if (vmuser.data.data != null) {
                    //   d.push({
                    //     FirstName: values.FirstName,
                    //     LastName: values.LastName,
                    //     Email: values.Email,
                    //     Contact: values.Contact,
                    //     Address: values.Address,
                    //     Status: values.Status,
                    //     Uid: vmuser.data.data._id,
                    //   });
                    // } else {
                    //   d.push(values);
                    // }
                    setInvitedCandidates((prevData) => [
                      ...prevData,
                      response["data"],
                    ]);
                    if (selectedData.length > maxLimitOfCandidate) {
                      swal({
                        icon: "error",
                        title: "Add Candidate",
                        text: "You have exceeded maximum Candidate Limit !",
                        button: "Continue",
                      });
                    }
                    await setSelectedData(d);
                    await setCandidateData(d);
                    await setRejectedData(r);
                    await setShowCandidate(true);
                    await setShowCandidateForm(false);
                  } else {
                    swal({
                      icon: "error",
                      title: "Add Candidate",
                      text: "This candidate is waiting for an approval of another job !",
                      button: "Continue",
                    });
                  }
                });
              }
            }
            // end test code
            await setCandidateData(d);
            await setRejectedData(r);
            await setSelectedData(d);
            if (candidateInputRef.current) candidateInputRef.current.value = "";
          } else {
            swal({
              title: "Error",
              message: "Data File Empty",
              icon: "error",
              button: "Ok",
            });
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) { }
  };

  // City Autocomplete

  const [selectedCity, setSelectedCity] = React.useState({
    country: "NULL",
    city: "NULL",
  });
  const [query, setQuery] = React.useState("");
  const filteredCity =
    query === ""
      ? cities.slice(0, 10)
      : cities
        .filter((city) => {
          return (
            city.country.toLowerCase().includes(query.toLowerCase()) ||
            city.name.toLowerCase().includes(query.toLowerCase())
          );
        })
        .slice(0, 10);



  // Perform your validation here

  // Scroll to the top of the page

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [PageIndex]);

  //validation for case 1
  const [joberror, setJobError] = React.useState("");
  const [JobTitleNumeralsError, setJobTitleNumeralsError] = React.useState(false)
  const [HiringOrganizationNumeralsError, setHiringOrganizationNumeralsError] = React.useState(false)
  const [jobtypeerror, setJobTypeerr] = React.useState("");
  const [joblocationerror, setJobLocationerr] = React.useState("");
  const [validTillerror, setValidTillerr] = React.useState("");
  const [reqApperror, setReqApperr] = React.useState("");
  const [hiringOrganizationerror, setHiringOrganizationerr] = React.useState("");
  const [ederror, setFormError] = React.useState(false);
  const [descError, setDescError] = React.useState(false);
  //Description
  const [desc, setDescState] = React.useState(EditorState.createEmpty());
  const [convertedDesc, setConvertedDesc] = React.useState(null);
  const MAX_ELIGIBILITY_LENGTH = 200; // Adjust the value as needed


  //description Editor

  const onDescEditorStateChange = (state) => {
    const descText = state.getCurrentContent().getPlainText("");
    if (descText) {
      setDescError(false);
    }
    setDescState(state);
    convertDescToHTML();
  };
  const convertDescToHTML = async () => {
    let currentContentAsHTML = convertToHTML(desc?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedDesc(currentContentAsHTML);
    }
    const job = JSON.parse(await getStorage("postjob"));
    job.jobDesc = currentContentAsHTML;
    setJob(job);
    ls.set("postjob", JSON.stringify(job));
  };
  //validation for case 2
  //eligibility
  const [eligible, setEligibleState] = React.useState(EditorState.createEmpty());
  const [convertedEl, setConvertedEl] = React.useState(null);
  const [eligibilityperksError, seteligibilityperksError] = useState(false);
  const [EligibilityPerksError, setEligibilityPerksError] = useState(false);
  const [isInvalidCountry, setIsInvalidCountry] = useState(false);

  // const oneligibiltyStateChange = (state) => {
  //   const eligible = state.getCurrentContent().getPlainText("");
  //   if (eligible) {
  //     seteligibilityperksError(false);
  //   }
  //   setEligibleState(state);
  //   convertElToHTML();
  // };
  const oneligibiltyStateChange = (state) => {
    const eligible = state.getCurrentContent().getPlainText("");
    if (eligible.length > MAX_ELIGIBILITY_LENGTH) {
      setEligibilityPerksError(true);
    } else {
      setEligibilityPerksError(false);
    }
    if (eligible) {
      seteligibilityperksError(false);
    }
    setEligibleState(state);
    convertElToHTML();
  };
  const convertElToHTML = async () => {
    let currentContentAsHTML = convertToHTML(eligible?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedEl(currentContentAsHTML);
    }
    const job = JSON.parse(await getStorage("postjob"));
    job.eligibility = currentContentAsHTML;
    setJob(job);
    ls.set("postjob", JSON.stringify(job));
  };
  //validation case 6
  //Perks
  const [perks, setPerksState] = React.useState(EditorState.createEmpty());
  const [convertedPerks, setConvertedPerks] = React.useState(null);
  const [perksError, setPerksError] = useState(false);
  const [maxvalueerror, setMaxValueError] = useState(false);
  const [alphavalueerror, setAlphaValueError] = useState(false);
  const [alphavalueerrors, setAlphaValueErrors] = useState(false);
  //  const [remuneration, setRemuneration] = React.useState("");
  const onPerksEditorStateChange = (state) => {
    const perks = state.getCurrentContent().getPlainText("");
    if (perks) {
      setPerksError(false);
    }
    setPerksState(state);
    convertPerksToHTML();
    //  setRemuneration(state);

  };
  const convertPerksToHTML = async () => {
    let currentContentAsHTML = convertToHTML(perks?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedPerks(currentContentAsHTML);
    }
    const job = JSON.parse(await getStorage("postjob"));
    job.perks = currentContentAsHTML;
    setJob(job);
    ls.set("postjob", JSON.stringify(job));
  };


  const renderFormPage = () => {
    switch (PageIndex) {
      case 1:
        return (
          <div>
            <div className="md:w-full bg-white lg:px-3">
              <Formik
                key={PageIndex}
                initialValues={{
                  jobTitle: job ? job.jobTitle : "",
                  location: selectedCity
                    ? `${selectedCity.name}, ${selectedCity.country}`
                    : "",
                  jobType: job ? job.jobType : "",
                  jobLocation: job ? job.jobLocation : "",
                  reqApp: job ? job.reqApp : "",
                  validTill: job && job.validTill ? job.validTill : null,
                  hiringOrganization: job
                    ? job.hiringOrganization
                    : user && user.firstName
                      ? user.firstName
                      : "",
                }}

                validate={(values) => {
                  const errors = {};
                  // if (values.jobTitle) {
                  //   setJobError("")
                  // }
                  if (values.jobTitle) {
                    setJobError("");

                    if (/\d/.test(values.jobTitle)) {
                      setJobTitleNumeralsError(true);
                    } else {
                      setJobTitleNumeralsError(false);
                    }
                  }else {
                    setJobTitleNumeralsError(false);
                  }
                  if (values.jobType) {
                    setJobTypeerr("")
                  }
                  if (values.jobLocation) {
                    setJobLocationerr("")
                  }
                  if (values.validTill) {
                    setValidTillerr("")
                  }
                  if (
                    values.validTill &&
                    values.validTill > new Date().toISOString().split("T")[0]
                  ) {
                    setValidTillerr("")
                  }
                  if (values.reqApp) {
                    setReqApperr("")
                  }
                  // if (
                  //   values.hiringOrganization
                  // ) {
                  //   setHiringOrganizationerr("")
                  // }
                  if (values.hiringOrganization) {
                    setHiringOrganizationerr("");

                    if (/\d/.test(values.hiringOrganization)) {
                      setHiringOrganizationNumeralsError(true);
                    } else {
                      setHiringOrganizationNumeralsError(false);
                    }
                  }else {
                    setHiringOrganizationNumeralsError(false);
                  }
                  // if (desc) {
                  //   setDescError(false);
                  // }
                  return errors;
                }}
              >
                {({ values }) => {
                  return (
                    <div className="w-full mt-9">
                      <Form className="w-fit mt-5">
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4  block font-semibold">
                            Job Title
                          </label>
                          <Field
                            name="jobTitle"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg  border-gray-400 md:w-3/4 w-full focus:outline-0 focus:border-0 py-2"
                            style={{ borderRadius: "12px" }}
                          />
                          <div className="mt-2">
                            {joberror && <p className="text-red-500">{joberror}</p>}
                            {JobTitleNumeralsError && <p className="text-red-500"> Job title cannot contain numerals</p>}
                          </div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mb-3 block font-semibold">
                            Job Description
                          </label>
                          <Editor
                            editorState={desc}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName z-0"
                            wrapperStyle={{
                              width: "100%",
                              maxWidth: "1000px",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "12px",
                              zIndex: 0,
                              overflowY: "auto",
                              whiteSpace: "normal", // Allow text to wrap
                              wordWrap: "break-word", // Break words to fit within the container
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              maxHeight: "500px",
                              paddingLeft: "1rem",
                              zIndex: 0,
                              overflowY: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                            onEditorStateChange={onDescEditorStateChange}
                          />
                          {descError && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Required !
                            </p>
                          )}
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Job Location
                          </label>
                          <Combobox
                            value={selectedCity}
                            onChange={setSelectedCity}
                          >
                            <Combobox.Input
                              onFocus={handleFocus}

                              onChange={(event) => {
                                const inputValue = event.target.value;
                                if (!/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(inputValue)) {
                                  setIsInvalidCountry(true);
                                } else {
                                  setIsInvalidCountry(false);
                                  setFormError(false);

                                }
                                if (!inputValue) {
                                  setIsInvalidCountry(false); // Clear the error message for empty input
                                  // setQuery(inputValue);
                                }
                                setQuery(inputValue);
                              }}
                              className="border-[0.5px] rounded-lg border-gray-400 md:w-1/2 w-full focus:outline-0 focus:border-0 px-4 py-2"
                              style={{ borderRadius: "12px" }}
                            />
                            <Combobox.Options className="w-1/2 shadow-lg p-3">
                              {query.length > 0 && !isInvalidCountry && (
                                <Combobox.Option
                                  className="p-2 text-gray-500"
                                  value={`${query}`}
                                >
                                  Add "{query}" as a new location
                                </Combobox.Option>
                              )}
                              {filteredCity.map((city) => (
                                <Combobox.Option
                                  key={city.name}
                                  value={`${city.name}, ${city.country}`}
                                >
                                  {({ active, selected }) => (
                                    <li
                                      className={`${active
                                        ? "bg-emerald-700	 text-white p-3 rounded-lg"
                                        : "bg-white text-black p-3 rounded-lg"
                                        }`}
                                    >
                                      {city.name}, {city.country}
                                    </li>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          </Combobox>
                          {ederror && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Required !
                            </p>

                          )}
                          {isInvalidCountry && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Please enter a valid location
                            </p>
                          )}
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 block font-semibold">
                            Location Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="md:space-x-5 space-x-2 md:flex  w-3/4 md:mr-auto "
                          >
                            <div className="ml-2">
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="Remote"
                                  className="mr-2"
                                />
                                Remote
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="Hybrid"
                                  className="mr-2"
                                />
                                Hybrid
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="On-Site"
                                  className="mr-2"
                                />
                                On-Site
                              </label>
                            </div>
                          </div>
                          <div className="mt-2"> {joblocationerror && <p className="text-red-500">{joblocationerror}</p>}</div>
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 block font-semibold">
                            Job Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="md:space-x-5 space-x-2 md:flex  my-3 w-3/4 md:mr-auto "
                          >
                            <div className="ml-2">
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Full-Time"
                                  className="mr-2"
                                />
                                Full-Time
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Part-Time"
                                  className="mr-2"
                                />
                                Part-Time
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Internship"
                                  className="mr-2"
                                />
                                Internship
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobType"
                                  value="Freelancing"
                                  className="mr-2"
                                />
                                Freelancing
                              </label>
                            </div>
                          </div>
                          <div className="mt-2">  {jobtypeerror && <p className="text-red-500">{jobtypeerror}</p>}</div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 font-semibold block">
                            Applications Open Till :{" "}
                          </label>
                          <Field
                            name="validTill"
                            type="date"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                            // min={Date.now()}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <div className="mt-2"> {validTillerror && <p className="text-red-500">{validTillerror}</p>}</div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Hiring Organization
                          </label>
                          <Field
                            name="hiringOrganization"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg border-gray-400 md:w-3/4  w-full focus:outline-0 focus:border-0 px-4 py-2"
                            style={{ borderRadius: "12px" }}
                          />
                          <div className="mt-2"> {hiringOrganizationerror && <p className="text-red-500">{hiringOrganizationerror}</p>}
                          {HiringOrganizationNumeralsError && <p className="text-red-500"> HiringOrganization cannot contain numerals</p>}
                          </div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Candidates Required
                          </label>
                          <Field
                            name="reqApp"
                            type="number"
                            placeholder=""
                            style={{ borderRadius: "12px" }}
                            className="border-[0.5px] rounded-lg  border-gray-400 md:w-3/4  w-full focus:outline-0 focus:border-0 px-4 py-2 "
                            min={1}
                            onKeyPress={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "+" ||
                                (e.target.value === "" && e.key === "0") ||
                                e.key === "e" ||
                                e.key === "." ||
                                e.key === "," ||
                                e.key === "E" ||
                                e.key === " " ||
                                e.key === "Enter" ||
                                e.key === "Backspace" ||
                                e.key === "Delete" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                                setSelectedCandidateLimit(e.target.value);
                              }
                            }}
                          />
                          <div className="mt-2"> {reqApperror && <p className="text-red-500">{reqApperror}</p>}</div>
                        </div>
                        <div className="flex space-x-3 mx-auto justify-center">
                          {values.jobTitle && (
                            <button
                              onClick={async () => {
                                values.location = selectedCity;
                                if (job === null) job = {};
                                job.jobTitle = values.jobTitle;
                                ls.set("postjob", JSON.stringify(job));
                                setJob(job);
                                let res = await postJobAPI(
                                  {
                                    user_id: user._id,
                                    draft: true,
                                    ...values,
                                  },
                                  access
                                );
                                if (res) {
                                  swal({
                                    title: "Job Saved to Draft !",
                                    message: "Success",
                                    icon: "success",
                                    button: "Continue",
                                  }).then((result) => {
                                    setLoading(false);
                                    ls.remove("postjob");
                                    ls.remove("prof");
                                    window.location.href = "/company/pendingjobs";
                                  });
                                } else {
                                  swal({
                                    title: " Error Saving Job !",
                                    message: "OOPS! Error Occured",
                                    icon: "Error",
                                    button: "Ok",
                                  });
                                }
                              }}
                              className="outline px-4 py-2 outline-gray-300 text-black my-6 rounded-lg "
                            >
                              Save As Draft
                            </button>
                          )}
                          {values.jobTitle &&
                            desc &&
                            selectedCity !== null &&
                            values.jobType &&
                            values.jobLocation &&
                            values.validTill &&
                            values.hiringOrganization &&
                            values.reqApp ? (
                            <>
                              <button
                                className="bg-[#228276] px-4 py-2 text-white my-6 rounded-lg"
                                onClick={async () => {
                                  if (selectedCity.country === "NULL") {
                                    setFormError(true);
                                    return;
                                  } else {
                                    setFormError(false);
                                  }
                                  let job = await JSON.parse(
                                    await getStorage("postjob")
                                  );
                                  if (job === null) job = {};
                                  job.jobTitle = values.jobTitle;
                                  job.location = selectedCity;
                                  job.jobType = values.jobType;
                                  job.jobLocation = values.jobLocation;
                                  job.validTill = values.validTill;
                                  job.hiringOrganization =
                                    values.hiringOrganization;
                                  job.reqApp = values.reqApp;
                                  const descText = desc
                                    .getCurrentContent()
                                    .getPlainText("");
                                  if (!descText) {
                                    setDescError(true);
                                    return;
                                  } else {
                                    setDescError(false);
                                  }
                                  if (!ederror) {
                                    if (
                                      selectedCity.country === "NULL" &&
                                      selectedCity.city === "NULL"
                                    ) {
                                      setFormError(true);
                                      return;
                                    } else {
                                      setFormError(false);
                                    }
                                  }
                                  if (JobTitleNumeralsError) {
                                    setJobTitleNumeralsError(true)
                                    return;
                                  } else if (HiringOrganizationNumeralsError) {
                                    setHiringOrganizationNumeralsError(true)
                                    return;
                                  } else {
                                    setJobTitleNumeralsError(false)
                                    setHiringOrganizationNumeralsError(false)
                                    
                                  }
                                  ls.set("postjob", JSON.stringify(job));
                                  await setJob(job);
                                  setPageIndex(2);
                                }}
                              >
                                Next
                              </button>
                            </>
                          ) : (
                            <button
                              className="bg-[#228276] px-4 py-2 text-white my-6 rounded-lg"
                              onClick={() => {
                                // Clear all previous error messages
                                setJobError("");
                                setJobTypeerr("");
                                setJobLocationerr("");
                                setValidTillerr("");
                                setReqApperr("");
                                setHiringOrganizationerr("");
                                setFormError(false);
                                setDescError(false);
                                let hasError = false;

                                // Validate the job title field
                                if (!values.jobTitle || values.jobTitle.trim() === "") {
                                  setJobError("Required!");
                                  hasError = true;
                                } else if (values.jobTitle.length > 100) {
                                  setJobError("Job Title should be less than 100 characters");
                                  hasError = true;
                                }

                                // Validate the job type field
                                if (!values.jobType || values.jobType.trim() === "") {
                                  setJobTypeerr("Required!");
                                  hasError = true;
                                }

                                // Validate the job location field
                                if (!values.jobLocation || values.jobLocation.trim() === "") {
                                  setJobLocationerr("Required!");
                                  hasError = true;
                                }

                                // Validate the validTill field
                                if (!values.validTill || values.validTill.trim() === "") {
                                  setValidTillerr("Required!");
                                  hasError = true;
                                } else {
                                  const validTillDate = new Date(values.validTill);
                                  if (isNaN(validTillDate.getTime())) {
                                    setValidTillerr("Invalid date format");
                                    hasError = true;
                                  } else if (validTillDate < new Date()) {
                                    setValidTillerr("Date should be greater than or equal to the current date");
                                    hasError = true;
                                  }
                                }

                                // Validate the reqApp field
                                if (!values.reqApp) {
                                  setReqApperr("Required!");
                                  hasError = true;
                                } else if (values.reqApp > maxLimitOfCandidate) {
                                  setReqApperr(`Must be less than ${maxLimitOfCandidate}`);
                                  hasError = true;
                                }

                                // Validate the hiring organization field
                                if (!values.hiringOrganization || values.hiringOrganization.trim() === "") {
                                  setHiringOrganizationerr("Required!");
                                  hasError = true;
                                }

                                if (!ederror) {
                                  if (selectedCity.country === "NULL" && selectedCity.city === "NULL") {
                                    setFormError(true);
                                    hasError = true;
                                  }
                                }
                                if (!desc) {
                                  setDescError(true);
                                  hasError = true;
                                }
                                if (!desc.getCurrentContent().hasText()) {
                                  // Set error states if either condition is true
                                  setDescError(!desc.getCurrentContent().hasText());

                                }

                                // If there are any errors, return early
                                if (hasError) {
                                  return;
                                }

                              }}
                            >
                              Next
                            </button>
                          )}
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="lg:w-full py-3  mr-3 bg-white">
              <Formik
              >
                {(values) => {
                  return (
                    <div className="w-fit mt-9">
                      <Form className="w-fit m-5">
                        <div className="my-7 space-y-3 w-full ">
                          <label className="text-left w-3/4 mb-3 block font-semibold">
                            Candidate Eligibility
                          </label>
                          <Editor
                            editorState={eligible}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            required
                            wrapperStyle={{
                              width: "100%",
                              maxWidth: "1000px",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                              zIndex: 0,
                              overflowY: "auto",
                              whiteSpace: "normal", // Allow text to wrap
                              wordWrap: "break-word", // Break words to fit within the container
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              paddingLeft: "1rem",
                              maxHeight: "500px",
                              zIndex: 0,
                              whiteSpace: "pre-wrap",
                            }}
                            onEditorStateChange={oneligibiltyStateChange}
                          />
                        </div>
                        <div className="mt-2">
                          {eligibilityperksError && <p className="text-red-500">Required !</p>}
                          {EligibilityPerksError && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Eligibility input exceeds the maximum allowed length
                            </p>
                          )}
                        </div>
                        <div className="my-7 space-y-3 w-full block">
                          <label className="text-left text-l w-3/4 font-semibold block py-3 rounded-lg w-full">
                            Select Technical Skills
                          </label>
                          <div
                            className="w-full rounded-[20px]"
                            style={{
                              border: "1px solid #bcbcbc",
                              outlineStyle: "outset",
                              outlineColor: "#E3E3E3",
                            }}
                          >
                            <div className="" style={{ overflowX: "auto", maxHeight: "32rem" }}>
                              <div className="">
                                <div className="w-full ">
                                  {showRoles &&
                                    showRoles
                                      .filter(
                                        (role) =>
                                          typeof role === "string" &&
                                          role.trim() !== ""
                                      )
                                      .map((el, index) => {
                                        return (
                                          <div key={index}>
                                            <Disclosure>
                                              {({ open }) => (
                                                <div
                                                  className={`${open ? "shadow-md" : ""
                                                    }`}
                                                >
                                                  <Disclosure.Button
                                                    className={`flex w-full border-b-2 justify-between px-4 py-3 text-left text-sm font-medium hover:bg-stone-50 focus:outline-none focus-visible:ring  ${open ? "shadow-lg " : ""
                                                      } ${rolesProf[index] != 0
                                                        ? ""
                                                        : ""
                                                      }`}
                                                  >
                                                    <div className="flex">
                                                      <input
                                                        type="checkbox"
                                                        id=""
                                                        className="rounded my-1"
                                                        checked={selected[index]}
                                                        onChange={() =>
                                                          handleCheckboxClick(
                                                            index
                                                          )
                                                        }
                                                      />
                                                      <span className="mx-3 flex items-center text-base">
                                                        {el}
                                                      </span>
                                                    </div>

                                                    {selected[index] && (
                                                      <div className="ml-auto mr-5 flex items-center space-x-2">
                                                        <p>0</p>
                                                        <input
                                                          type="range"
                                                          min="0"
                                                          max="5"
                                                          value={rolesProf[index]}
                                                          onChange={(e) => {
                                                            dbSkills.forEach(
                                                              (skill) => {
                                                                if (
                                                                  skill.role ===
                                                                  el
                                                                ) {
                                                                  skill.proficiency =
                                                                    e.target.value;
                                                                  let inde =
                                                                    dbSkills.findIndex(
                                                                      (el) => {
                                                                        return (
                                                                          el ===
                                                                          skill
                                                                        );
                                                                      }
                                                                    );
                                                                  let p = prof;
                                                                  p[inde] =
                                                                    e.target.value;
                                                                  setProf(p);
                                                                  skill.rating =
                                                                    e.target.value;
                                                                }
                                                              }
                                                            );
                                                            let rp = rolesProf;
                                                            rp[index] =
                                                              e.target.value;
                                                            setRolesProf(rp);
                                                            ls.set(
                                                              "RolesProf",
                                                              JSON.stringify(
                                                                rolesProf
                                                              )
                                                            );
                                                          }}
                                                        />
                                                        <p>5</p>
                                                      </div>
                                                    )}
                                                    <ChevronUpIcon
                                                      className={`${!open
                                                        ? "rotate-180 transform"
                                                        : ""
                                                        } h-5 w-5 text-blue-500`}
                                                    />
                                                  </Disclosure.Button>
                                                  <Disclosure.Panel className=" bg-stone-50">
                                                    {primarySkills[el].map(
                                                      (skill, index) => {
                                                        return (
                                                          <div>
                                                            <Disclosure>
                                                              {({ open }) => (
                                                                <div
                                                                  className={`${open
                                                                    ? "shadow-md"
                                                                    : ""
                                                                    }`}
                                                                >
                                                                  <Disclosure.Button
                                                                    className={`flex w-full justify-between rounded-lg  px-4 py-3 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 ${open
                                                                      ? ""
                                                                      : ""
                                                                      } `}
                                                                  >
                                                                    <span className="uppercase">
                                                                      {skill}
                                                                    </span>
                                                                    <div className="flex items-center space-x-2 primary-skill-slider ml-auto">
                                                                      <StarRating
                                                                        type="range"
                                                                        min="0"
                                                                        max="5"
                                                                        value={
                                                                          prof[
                                                                          index
                                                                          ]
                                                                        }
                                                                        onChange={async (
                                                                          e
                                                                        ) => {
                                                                          let d =
                                                                            dbSkills;
                                                                          d[
                                                                            index
                                                                          ] = {
                                                                            ...d[
                                                                            index
                                                                            ],
                                                                            proficiency:
                                                                              e
                                                                                .target
                                                                                .value,
                                                                          };
                                                                          let p =
                                                                            prof;
                                                                          p[
                                                                            index
                                                                          ] =
                                                                            e.target.value;
                                                                          setProf(
                                                                            p
                                                                          );
                                                                          await ls.set(
                                                                            "prof",
                                                                            JSON.stringify(
                                                                              p
                                                                            )
                                                                          );
                                                                          await setProf(
                                                                            [...p]
                                                                          );
                                                                          await setDbSkills(
                                                                            [...d]
                                                                          );
                                                                          if (
                                                                            e
                                                                              .target
                                                                              .value >
                                                                            0
                                                                          ) {
                                                                            let u =
                                                                              user;
                                                                            let to =
                                                                              u.tools;
                                                                            to.push(
                                                                              {
                                                                                proficiency:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                                ...skill,
                                                                              }
                                                                            );
                                                                            u.tools =
                                                                              to;
                                                                            await setUser(
                                                                              {
                                                                                ...u,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                      />
                                                                      {/* <p className="text-xs font-italics">
                                                                      {prof[
                                                                        index
                                                                      ] > 0
                                                                        ? "Self-assessed"
                                                                        : "Unassessed"}
                                                                    </p> */}
                                                                    </div>
                                                                    <ChevronUpIcon
                                                                      className={`${!open
                                                                        ? "rotate-180 transform"
                                                                        : ""
                                                                        } h-5 w-5 text-blue-500`}
                                                                    />
                                                                  </Disclosure.Button>
                                                                  {/* <Disclosure.Panel className="pb-3 px-4">
                                                                {dbSkills
                                                                  .filter((secSkill ) => {
                                                                      return (
                                                                        secSkill.primarySkill === skill &&
                                                                        secSkill.role ===el
                                                                      );
                                                                    }
                                                                  )
                                                                  .map((secSkill, index) => {
                                                                      let d = dbSkills;
                                                                      let index1 = d.findIndex((e ) => {
                                                                            return (
                                                                              el === secSkill
                                                                            );
                                                                          }
                                                                        );
                                                                      return (
                                                                        <div className="md:flex my-2 text-sm justify-between items-center py-1"  style={{ whiteSpace: 'nowrap' }}>
                                                                          <Chip label={secSkill.secondarySkill} variant="outlined" onClick={handleClick} />
                                                                        </div>                                                                      
                                                                      );
                                                                    }
                                                                  )}
                                                              </Disclosure.Panel> */}
                                                                  <Disclosure.Panel className="pb-3 px-4">
                                                                    {dbSkills
                                                                      .filter(
                                                                        (
                                                                          secSkill
                                                                        ) =>
                                                                          secSkill.primarySkill ===
                                                                          skill &&
                                                                          secSkill.role ===
                                                                          el
                                                                      )
                                                                      .reduce(
                                                                        (
                                                                          rows,
                                                                          secSkill,
                                                                          index
                                                                        ) => {
                                                                          if (
                                                                            index %
                                                                            2 ===
                                                                            0
                                                                          )
                                                                            rows.push(
                                                                              []
                                                                            );
                                                                          rows[
                                                                            rows.length -
                                                                            1
                                                                          ].push(
                                                                            secSkill
                                                                          );
                                                                          return rows;
                                                                        },
                                                                        []
                                                                      )
                                                                      .map(
                                                                        (row) => (
                                                                          <div
                                                                            className="md:flex my-2 text-sm justify-between items-center py-1"
                                                                            style={{
                                                                              whiteSpace:
                                                                                "nowrap",
                                                                            }}
                                                                          >
                                                                            {row.map(
                                                                              (
                                                                                secSkill
                                                                              ) => (
                                                                                <Chip
                                                                                  label={
                                                                                    secSkill.secondarySkill
                                                                                  }
                                                                                  variant="outlined"
                                                                                  onClick={
                                                                                    handleClick
                                                                                  }
                                                                                />
                                                                              )
                                                                            )}
                                                                          </div>
                                                                        )
                                                                      )}
                                                                  </Disclosure.Panel>
                                                                </div>
                                                              )}
                                                            </Disclosure>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </Disclosure.Panel>
                                                </div>
                                              )}
                                            </Disclosure>
                                          </div>
                                        );
                                      })}
                                </div>
                              </div>
                            </div>
                          </div>
                          {skillErr && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Required !
                            </p>
                          )}
                        </div>
                        <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
                          <button
                            className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2"
                            onClick={async () => {
                              if (!eligible.getCurrentContent().hasText() || !isCheckboxClicked || EligibilityPerksError) {
                                // Set error states if either condition is true
                                seteligibilityperksError(!eligible.getCurrentContent().hasText());
                                setSkillErr(!isCheckboxClicked);
                              } else {
                                // Both conditions are false, no errors
                                seteligibilityperksError(false);
                                setSkillErr(false);
                                setEligibilityPerksError(false)

                                var searchSkills = new Array();
                                dbSkills.forEach((el, index) => {
                                  if (prof[index] > 0) {
                                    searchSkills.push(el._id);
                                  }
                                });

                                var eligibleSkills = {};
                                const id = user._id;
                                eligibleSkills["skills"] = searchSkills;
                                eligibleSkills["companyid"] = id;
                                getEligibleCandidate(eligibleSkills);
                                setPageIndex(3);
                              }
                            }}
                          >
                            Next
                          </button>

                          <button
                            className=" px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                            onClick={() => {
                              setPageIndex(1);
                              ls.set("PageIndex", 1); // Update localStorage value
                            }}
                          >
                            Prev
                          </button>

                          <button
                            onClick={async () => {
                              let skills = [];
                              dbSkills.forEach((el, index) => {
                                if (prof[index] > 0) {
                                  el.proficiency = prof[index];
                                  skills.push(el);
                                }
                              });
                              let job = JSON.parse(getStorage("postjob"));
                              let res = await postJobAPI(
                                {
                                  skills: skills,
                                  user_id: user._id,
                                  draft: true,
                                  location: job.location,
                                  jobType: job.jobtype,
                                  jobTitle: job.jobTitle,
                                  jobLocation: job.jobLocation,
                                  jobDesc: job.jobDesc,
                                  hiringOrganization: job.hiringOrganization,
                                  eligibility: job.eligibility,
                                  validTill: job.validTill,
                                },
                                access
                              );
                              if (res) {
                                swal({
                                  title: "Job Saved to Draft !",
                                  message: "Success",
                                  icon: "success",
                                  button: "Continue",
                                }).then((result) => {
                                  setLoading(false);
                                  ls.remove("postjob");
                                  ls.remove("prof");
                                  window.location.href = "/company/pendingjobs";
                                });
                              } else {
                                swal({
                                  title: " Error Saving Job !",
                                  message: "OOPS! Error Occured",
                                  icon: "Error",
                                  button: "Ok",
                                });
                              }
                            }}
                            className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                          >
                            Save As Draft
                          </button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="w-full py-3 bg-white">
              <div className="w-full mt-9">
                <div className="mx-2 w-fit">
                  <div className="my-3 w-full text-left md:text-left sm:text-center md:w-full">
                    <p className="font-semibold text-lg">
                      Add Candidate Details Sheet
                    </p>
                    {/* <p className="text-sm mt-3 mb-1 break-words flex">
                      Download Sample Template{" "}
                      <CSVLink {...csvReport}>
                        <p className="text-blue-600 mx-1">Here</p>{" "}
                      </CSVLink>
                    </p> */}
                  </div>
                  <div className="flex space-x-5 my-3">
                    <button
                      className="bg-[#228276] text-white rounded-lg px-3 py-2"
                      onClick={() => {
                        setShowCandidateForm(true);
                      }}
                    >
                      Add Candidate
                    </button>
                    {showEligible && (
                      <button
                        className="bg-[#228276] text-white rounded-lg px-3 py-2"
                        onClick={() => {
                          setEligibleButton(true);
                        }}
                      >
                        Show Existing Candidates
                      </button>
                    )}
                    {candidateData.length === 0 &&
                      rejectedData.length === 0 && (
                        <button
                          for="candidatesInput"
                          className="cursor-pointer text-green-700 rounded-lg px-3 py-1 outline outline-offset-2 outline-green-700"
                          onClick={() => {
                            if (candidateInputRef.current)
                              candidateInputRef.current.click();
                          }}
                        >
                          {" "}
                          Bulk Upload Candidate{" "}
                        </button>
                      )}
                    <input
                      ref={candidateInputRef}
                      type="file"
                      className="hidden"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleCandidateFileUpload}
                    />
                    {(rejectedData.length > 0 || selectedData.length > 0) && (
                      <button
                        className="bg-[#ffffff] rounded-lg outline outline-gray-300 text-black rounded-lg px-4 py-1"
                        onClick={() => {
                          setCandidateData([]);
                          setSelectedData([]);
                          setRejectedData([]);
                          setShowCandidateForm(false);
                          // if (candidateInputRef.current)
                          //   candidateInputRef.current.value = " ";
                          if (
                            candidateInputRef.current &&
                            candidateInputRef.current.value
                          ) {
                            candidateInputRef.current.value = " ";
                          }
                        }}
                      >
                        Reset Data
                      </button>
                    )}
                  </div>
                </div>
                {eligibleButton && eligibleCanList.length > 0 && (
                  <div className="my-4 mx-4">
                    <table className="w-full">
                      <thead className="bg-white border-b text-left">
                        <tr>
                          <th scope="col">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={MasterChecked}
                              id="mastercheck"
                              onChange={(e) => onMasterCheck(e)}
                            />
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
                            Last Name
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
                        </tr>
                      </thead>
                      <tbody>
                        {List.length > 0 &&
                          List.map((user, index) => {
                            return (
                              <tr
                                key={user.id}
                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                  } border-b ${user && user.selected ? "selected" : ""
                                  }`}
                              >
                                <td scope="row">
                                  <input
                                    type="checkbox"
                                    checked={
                                      user && user.selected
                                        ? user.selected
                                        : false
                                    }
                                    className="form-check-input"
                                    id="rowcheck{user.id}"
                                    onChange={(e) => onItemCheck(e, user)}
                                  />
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
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    <div className="flex my-2">
                      <button
                        className="bg-[#034488] text-white rounded-sm px-4 py-1 mx-2"
                        onClick={() => {
                          let d = selectedData;
                          let r = rejectedData;
                          if (SelectedList) {
                            SelectedList.map((item) => {
                              let ac = d.find((x) => x.Email === item.email);
                              if (ac) {
                                r.push({
                                  FirstName: ac.FirstName ? ac.FirstName : "",
                                  LastName: ac.LastName ? ac.LastName : "",
                                  Email: ac.Email ? ac.Email : "",
                                  Contact: ac.Contact ? ac.Contact : "",
                                  Reason: "Email Already Exist",
                                });
                              } else {
                                d.push({
                                  FirstName: item.firstName
                                    ? item.firstName
                                    : "",
                                  LastName: item.lastName ? item.lastName : "",
                                  Email: item.email ? item.email : "",
                                  Contact: item.phoneNo ? item.phoneNo : "",
                                });
                              }
                            });
                            setRejectedData(r);
                            setSelectedData(d);
                            setCandidateData(d);
                            setShowRejected(true);
                            setShowCandidate(true);
                            setEligibleButton(false);
                          }
                        }}
                      >
                        Add Candidate
                      </button>
                      <button
                        className="bg-[#034488] text-white rounded-sm px-4 py-1 mx-2"
                        onClick={() => {
                          setEligibleCanList(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {showCandidateForm && (
                  <div className="my-4 mx-1 w-75  bg-slate-100 px-10 py-3 rounded-lg">
                    <Formik
                      initialValues={candidateInitial}
                      validate={(values) => {
                        const errors = {};
                        let d = selectedData;
                        const res = d.findIndex((el) => {
                          return el.Email === values.Email;
                        });
                        const res2 = d.findIndex((el) => {
                          return el.Contact == values.Contact;
                        });
                        if (
                          !values.Email ||
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            values.Email.trim()
                          )
                        ) {
                          errors.Email = "Invalid Email";
                        } else if (res !== -1) {
                          errors.Email = "Email already exists";
                        }
                        if (values.FirstName != undefined) {
                          if (!values.FirstName) {
                            errors.FirstName = "Required !";
                          } else if (!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values.FirstName)) {
                            errors.FirstName = 'Only alphabets and spaces are allowed or limit exeeds';
                          }
                        }
                        if (values.LastName != undefined) {
                          if (!values.LastName) {
                            errors.LastName = "Required !";
                          } else if (!/^[a-zA-Z][a-zA-Z ]{0,19}$/.test(values.LastName)) {
                            errors.LastName = 'Only alphabets and spaces are allowed or limit exeeds';
                          }
                        }
                        if (
                          !values.Contact ||
                          !/^[0-9]{10}$/i.test(values.Contact)
                        ) {
                          errors.Contact = "Invalid Contact";
                        } else if (res2 !== -1) {
                          errors.Contact = "Contact already exists";
                        }
                        return errors;
                      }}
                      onSubmit={async (values) => {
                        let d = selectedData;
                        let r = rejectedData;
                        if (editIndex !== null) r.splice(editIndex, 1);
                        setEditIndex(null);
                        let user = JSON.parse(getStorage("user"));
                        // setInvitedCandidates((prevData) => [...prevData, values]);
                        let job = JSON.parse(getStorage("postjob"));
                        if (!user.company_id || user.company_id.trim() == "") {
                          swal({
                            icon: "error",
                            title: "CompanyID Not Found",
                            text: "Please contact your Support !",
                            button: "Continue",
                          });
                        } else {
                          await addCandidateInfo({
                            candidateDataDup: values,
                            jobId: "",
                            companyId: user.company_id,
                            jobTitle: job.jobTitle,
                          }).then(async (response) => {
                            if (response.status == 204) {
                              swal({
                                icon: "error",
                                title: "CompanyID Not Found",
                                text: "Please contact your Support !",
                                button: "Continue",
                              });
                            } else if (response.data) {
                              let vmuser = await getuserbyEmail(values.Email);
                              if (vmuser.data.data != null) {
                                d.push({
                                  FirstName: values.FirstName,
                                  LastName: values.LastName,
                                  Email: values.Email,
                                  Contact: values.Contact,
                                  Address: values.Address,
                                  Status: values.Status,
                                  Uid: vmuser.data.data._id,
                                });
                              } else {
                                d.push(values);
                              }
                              setInvitedCandidates((prevData) => [
                                ...prevData,
                                response["data"],
                              ]);

                              if (selectedData.length > maxLimitOfCandidate) {
                                swal({
                                  icon: "error",
                                  title: "Add Candidate",
                                  text: "You have exceeded maximum Candidate Limit !",
                                  button: "Continue",
                                });
                              }
                              await setSelectedData(d);
                              await setCandidateData(d);
                              await setRejectedData(r);
                              await setShowCandidate(true);
                              await setShowCandidateForm(false);
                            } else {
                              swal({
                                icon: "error",
                                title: "Add Candidate",
                                text: "This candidate is waiting for an approval of another job !",
                                button: "Continue",
                              });
                            }
                          });
                        }
                      }}
                    >
                      {({ values }) => {
                        return (
                          <Form>
                            <p className="text-left font-semibold py-2">
                              Add Candidate
                            </p>
                            <div className="flex my-3 space-x-5 text-left">
                              <div className="w-1/2 text-sm">
                                <label text>First Name</label>
                                <Field
                                  name="FirstName"
                                  type="text"
                                  className="text-600 w-full rounded-lg block px-4 py-2 outline outline-offset-2 outline-slate-50"
                                />
                                <ErrorMessage
                                  name="FirstName"
                                  component="div"
                                  className="text-sm text-red-600"
                                />
                              </div>
                              <div className="w-1/2 text-sm">
                                <label>Last Name</label>
                                <Field
                                  name="LastName"
                                  type="text"
                                  className="text-600 w-full rounded-lg block px-4 py-2 outline outline-offset-2 outline-slate-50"
                                />
                                <ErrorMessage name="LastName"
                                  component="div"
                                  className="text-sm text-red-600"
                                />
                              </div>
                            </div>
                            <div className="flex my-3 space-x-5 text-left">
                              <div className="w-1/2 text-sm">
                                <label>Email</label>
                                <Field
                                  name="Email"
                                  type="text"
                                  className="text-600 w-full rounded-lg block px-4 py-2 outline outline-offset-2 outline-slate-50"
                                />
                                <ErrorMessage
                                  name="Email"
                                  component="div"
                                  className="text-sm text-red-500"
                                />
                              </div>
                              <div className="w-1/2 text-sm">
                                <label>Contact</label>
                                <Field
                                  name="Contact"
                                  type="text"
                                  className="text-600 w-full rounded-lg block px-4 py-2 outline outline-offset-2 outline-slate-50"
                                />
                                <ErrorMessage
                                  name="Contact"
                                  component="div"
                                  className="text-sm text-red-500"
                                />
                              </div>
                            </div>
                            <div className="my-3 text-left  text-sm">
                              <label>Address</label>
                              <Field
                                name="Address"
                                type="text"
                                className="text-600 w-full rounded-lg block px-4 py-2 outline outline-offset-2 outline-slate-50"
                              />
                            </div>
                            <div className="mt-5">
                              <button
                                className="bg-[#034488] text-teal-700 rounded-lg py-1 my-2 px-4 outline outline-offset-2 outline-teal-500  "
                                type="submit"
                                style={{ backgroundColor: "#dce6e5" }}
                              >
                                Add
                              </button>
                              <button
                                className="bg-[#ffe8e8] text-red-300 rounded-lg py-1 my-2 px-4 outline outline-offset-2 outline-red-300 ml-4"
                                onClick={() => {
                                  setCandidateInitial({
                                    FirstName: "",
                                    LastName: "",
                                    Email: "",
                                    Contact: "",
                                    Address: "",
                                    Status: "Pending",
                                    Uid: null,
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
                )}

                <div className="my-9 mx-2 w-full">
                  {showCandidate && candidateData.length > 0 && (
                    <div className="my-4">
                      <table className="w-full">
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
                              Last Name
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
                              Address
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRecords.map((user, index) => {
                            const actualIndex = indexOfFirstRecord + index + 1;
                            return (
                              <tr
                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                  } border-b`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                  {actualIndex}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.FirstName}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.LastName}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Email}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Contact}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Address}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  <AiOutlineDelete
                                    className="text-sm  text-red-500 cursor-pointer"
                                    onClick={() => {
                                      setCandidateData(
                                        candidateData.filter(
                                          (item) => item.Email !== user.Email
                                        )
                                      );
                                      setSelectedData(
                                        selectedData.filter(
                                          (item) => item.Email !== user.Email
                                        )
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {currentRecords.length > 0 && (
                        <div className="w-full my-3 mx-auto px-3 text-center">
                          <nav className="justify-center flex flex-row-reverse mx-auto">
                            <ul className="pagination flex">
                              <li className="page-item mx-2">
                                <a
                                  className="page-Link"
                                  onClick={(e) => prevPage(e)}
                                  href=" "
                                  style={{ fontWeight: "bold", textDecoration: "none" }}
                                >
                                  &lt; Previous
                                </a>
                              </li>
                              {pageNumbers.map((pgNumber) => (
                                <li
                                  key={pgNumber}
                                  className={`page-item ${currentPage === pgNumber ? "active" : ""} mx-2`}
                                >
                                  <a
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(pgNumber);
                                    }}
                                    className="page-Link"
                                    href=" "
                                    style={{
                                      backgroundColor: currentPage === pgNumber ? "#e2e8f0" : "",
                                      color: currentPage === pgNumber ? "#1a202c" : "",
                                      fontWeight: currentPage === pgNumber ? "bold" : "normal",
                                      borderRadius: "50%",
                                      padding: "0.5rem",
                                      boxShadow: currentPage === pgNumber ? "0 0 5px rgba(0, 0, 0, 0.3)" : "",
                                      transition: "box-shadow 0.3s ease-in-out",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {pgNumber}
                                  </a>
                                </li>
                              ))}
                              <li className="page-item mx-2">
                                <a
                                  className="page-Link"
                                  onClick={(e) => nextPage(e)}
                                  href=" "
                                  style={{ fontWeight: "bold", textDecoration: "none" }}
                                >
                                  Next &gt;
                                </a>
                              </li>
                            </ul>
                            <div className="pagination-info justify-end" style={{ marginRight: "auto", fontWeight: "bold" }}>
                              Page {currentPage} of {pageNumbers.length}
                            </div>
                          </nav>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="my-9 mx-10">
                  {rejectedData.length > 0 && (
                    <div className="flex items-center w-full justify-between">
                      <p>Rejected Data ({rejectedData.length})</p>
                      <p>
                        {showRejected ? (
                          <p
                            className="text-sm text-blue-500 cursor-pointer ml-auto"
                            onClick={() => {
                              setShowRejected(false);
                            }}
                          >
                            Hide
                          </p>
                        ) : (
                          <p
                            className="text-sm text-blue-500 cursor-pointer ml-auto"
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
                  {showRejected && rejectedData.length > 0 && (
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
                              Reason
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rejectedData.map((user, index) => {
                            return (
                              <tr
                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                  } border-b`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Email}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Contact}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  {user.Reason}
                                </td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                  <RiEditBoxLine
                                    className="text-sm text-blue-500 cursor-pointer"
                                    onClick={() => {
                                      setCandidateInitial(user);
                                      setEditIndex(index);
                                      setShowCandidateForm(true);
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
                  <button
                    className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2"
                    onClick={() => {
                      setPageIndex(4);
                    }}
                  >
                    Next
                  </button>
                  <button
                    className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                    onClick={() => {
                      setPageIndex(2);
                    }}
                  >
                    Prev
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="w-full mr-3 bg-white py-9 px-7">
              <p className="font-semibold">Add Screening Questions</p>
              <p className="text-gray-600">
                We recommend adding 3 or more questions.
              </p>
              <div className="my-5">
                {questions.map((question, index) => {
                  return (
                    <div className="my-5">
                      <div className="flex justify-between">
                        <p className="font-semibold">
                          Question {index + 1} :{" "}
                          <span className="font-normal">
                            {question.question}
                          </span>
                        </p>
                        <div className="flex space-x-3">
                          <RiEditBoxLine
                            className="cursor-pointer text-blue-500"
                            onClick={async () => {
                              await setShowQuestionForm(false);
                              await setInitialQuestion(question);
                              await setQuestionEditIndex(index);
                              setShowQuestionForm(true);
                            }}
                          />
                          <AiOutlineDelete
                            className="cursor-pointer text-red-600"
                            onClick={() => {
                              setQuestions(
                                questions.filter(
                                  (item) => item.question !== question.question
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 font-semibold">
                        Answer :{" "}
                        <span className="font-normal">{question.answer}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
              {showQuestionForm && (
                <Formik
                  initialValues={initialQuestion}
                  validate={(values) => {
                    const errors = {};
                    if (!values.question) {
                      errors.question = "Required !";
                    }
                    if (!values.answer) {
                      errors.answer = "Required !";
                    }
                    return errors;
                  }}
                  onSubmit={(values) => {
                    if (questionEditIndex !== null) {
                      let temp = [...questions];
                      temp[questionEditIndex] = values;
                      setQuestions(temp);
                      setQuestionEditIndex(null);
                      setShowQuestionForm(false);
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                    } else {
                      setQuestions([
                        ...questions,
                        { question: values.question, answer: values.answer },
                      ]);
                      setShowQuestionForm(false);
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                    }
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <div className="my-6">
                        <label className="font-semibold">Question</label>
                        <Field
                          name="question"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                          type="text"
                        />
                        <ErrorMessage
                          component="div"
                          name="question"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="my-6">
                        <label className="font-semibold">Ideal Answer</label>
                        <Field
                          name="answer"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                          type="text"
                        />
                        <ErrorMessage
                          component="div"
                          name="answer"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="flex space-x-4 my-2">
                        <button
                          type="submit"
                          className="bg-[#228276] text-white rounded-lg px-3 py-2"
                          style={{ backgroundColor: "#228276" }}
                        >
                          {questionEditIndex === null
                            ? "Add Question"
                            : " Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="rounded-sm px-4 py-1 text-black  rounded-sm "
                          onClick={() => {
                            setShowQuestionForm(false);
                            setInitialQuestion({
                              question: "",
                              answer: "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              {!showQuestionForm && (
                <div className="flex space-x-4 my-2">
                  <button
                    type="submit"
                    className="bg-[#228276] text-white rounded-lg px-3 py-2"
                    style={{ backgroundColor: "#228276" }}
                    onClick={() => {
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                      setShowQuestionForm(true);
                    }}
                  >
                    Add Question
                  </button>
                </div>
              )}
              <div></div>
              <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
                <button
                  className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2S ml-2"
                  onClick={() => {
                    if (showQuestionForm) {
                      swal({
                        title: "Are you sure?",
                        text: "You have unsaved changes!",
                        icon: "warning",
                        buttons: true,
                      }).then((ok) => {
                        if (ok) setPageIndex(5);
                      });
                    } else {
                      setPageIndex(5);
                    }
                  }}
                >
                  Next
                </button>

                <button
                  className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                  onClick={() => {
                    if (showQuestionForm && questions.length > 0) {
                      swal({
                        title: "Are you sure?",
                        text: "You have unsaved changes!",
                        icon: "warning",
                        buttons: true,
                      }).then((ok) => {
                        if (ok) setPageIndex(3);
                      });
                    } else setPageIndex(3);
                  }}
                >
                  Prev
                </button>

                <button
                  onClick={async () => {
                    let skills = [];
                    dbSkills.forEach((el, index) => {
                      if (prof[index] > 0) {
                        el.proficiency = prof[index];
                        skills.push(el);
                      }
                    });
                    let job = JSON.parse(getStorage("postjob"));
                    let res = await postJobAPI(
                      {
                        skills: skills,
                        user_id: user._id,
                        draft: true,
                        location: job.location,
                        jobType: job.jobtype,
                        jobTitle: job.jobTitle,
                        jobLocation: job.jobLocation,
                        jobDesc: job.jobDesc,
                        hiringOrganization: job.hiringOrganization,
                        eligibility: job.eligibility,
                        validTill: job.validTill,
                        questions: questions,
                      },
                      access
                    );
                    if (res) {
                      swal({
                        title: "Job Saved to Draft !",
                        message: "Success",
                        icon: "success",
                        button: "Continue",
                      }).then((result) => {
                        setLoading(false);
                        ls.remove("postjob");
                        ls.remove("prof");
                      });
                    } else {
                      swal({
                        title: " Error Saving Job !",
                        message: "OOPS! Error Occured",
                        icon: "Error",
                        button: "Ok",
                      });
                    }
                  }}
                  className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                >
                  Save As Draft
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <div className="w-full py-3  mr-3 bg-white">
              <div className="w-full mt-9">
                <div className="w-full m-5 mx-7">
                  <Formik
                    initialValues={{
                      logo: logo ? logo : false,
                      title: title ? title : false,
                      email: email ? email : false,
                      contact: contact ? contact : false,
                      education: education ? education : false,
                    }}
                    validate={(values) => {
                      const errors = {};
                      return errors;
                    }}
                  >
                    {(values) => {
                      return (
                        <div>
                          <Form className="w-full mt-9">
                            <div className="my-4 mt-9  w-3/4">
                              <label className="text-left w-3/4 font-semibold block">
                                Brand Masking
                              </label>

                              <label className="w-auto content-center px-4 flex p-1  text-md">
                                <label
                                  for="Logo-toggle"
                                  className="inline-flex relative items-center cursor-pointer"
                                >
                                  <Field
                                    name="logo"
                                    type="checkbox"
                                    id="Logo-toggle"
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  <span className="ml-3 text-sm font-medium text-gray-900 ">
                                    <p className="text-md font-bold mx-3 font-gray-600">
                                      Show Logo
                                    </p>
                                  </span>
                                </label>
                              </label>
                              <label className="w-auto content-center px-4 flex p-1  text-md">
                                <label
                                  for="Title-toggle"
                                  className="inline-flex relative items-center cursor-pointer"
                                >
                                  <Field
                                    type="checkbox"
                                    name="title"
                                    id="Title-toggle"
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                  <span className="ml-3 text-sm font-medium text-gray-900 ">
                                    <p className="text-md font-bold mx-3 font-gray-600">
                                      Show Title
                                    </p>
                                  </span>
                                </label>
                              </label>
                            </div>
                            <div className="my-4 space-y-3 w-3/4">
                              <label className="text-left w-3/4 font-semibold block">
                                Candidate Masking
                              </label>

                              <div className=" items-center space-x-2">
                                <label className="w-auto content-center mx-2  px-4 flex p-1  text-md">
                                  <label
                                    for="Email-toggle"
                                    className="inline-flex relative items-center cursor-pointer"
                                  >
                                    <Field
                                      type="checkbox"
                                      name="email"
                                      id="Email-toggle"
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 ">
                                      <p className="text-md font-bold mx-3 font-gray-600">
                                        Show Email
                                      </p>
                                    </span>
                                  </label>
                                </label>
                                <label className="w-auto content-center  px-4 flex p-1  text-md">
                                  <label
                                    for="Contact-toggle"
                                    className="inline-flex relative items-center cursor-pointer"
                                  >
                                    <Field
                                      type="checkbox"
                                      name="contact"
                                      id="Contact-toggle"
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 ">
                                      <p className="text-md font-bold mx-3 font-gray-600">
                                        Show Contact
                                      </p>
                                    </span>
                                  </label>
                                </label>
                                <label className="w-auto content-center  px-4 flex p-1  text-md">
                                  <label
                                    for="Education-toggle"
                                    className="inline-flex relative items-center cursor-pointer"
                                  >
                                    <Field
                                      type="checkbox"
                                      name="education"
                                      id="Education-toggle"
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 ">
                                      <p className="text-md font-bold mx-3 font-gray-600">
                                        Show Education Details
                                      </p>
                                    </span>
                                  </label>
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-row-reverse space-x-3 mr-20  my-6">
                              <button
                                className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2S ml-2"
                                onClick={async () => {
                                  let job = await JSON.parse(
                                    await getStorage("postjob")
                                  );
                                  if (job === null) job = {};
                                  job.showComLogo = values.values.logo;
                                  job.showComName = values.values.title;
                                  job.showEducation = values.values.education;
                                  job.showContact = values.values.contact;
                                  job.showEmail = values.values.email;
                                  setLogo(values.values.logo);
                                  setTitle(values.values.title);
                                  setEmail(values.values.email);
                                  setContact(values.values.contact);
                                  setEmail(values.values.email);
                                  ls.set("postjob", JSON.stringify(job));
                                  await setJob(job);
                                  setPageIndex(6);
                                }}
                              >
                                Next
                              </button>

                              <button
                                className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                                type="button"
                                onClick={() => {
                                  setPageIndex(4);
                                }}
                              >
                                Prev
                              </button>

                              <button
                                onClick={async () => {
                                  let skills = [];
                                  dbSkills.forEach((el, index) => {
                                    if (prof[index] > 0) {
                                      el.proficiency = prof[index];
                                      skills.push(el);
                                    }
                                  });
                                  let job = JSON.parse(getStorage("postjob"));
                                  let res = await postJobAPI(
                                    {
                                      skills: skills,
                                      user_id: user._id,
                                      draft: true,
                                      location: job.location,
                                      jobType: job.jobtype,
                                      jobTitle: job.jobTitle,
                                      jobLocation: job.jobLocation,
                                      jobDesc: job.jobDesc,
                                      hiringOrganization:
                                        job.hiringOrganization,
                                      eligibility: job.eligibility,
                                      validTill: job.validTill,
                                      questions: questions,
                                      showComLogo: values.values.logo,
                                      showComName: values.values.title,
                                      showEducation: values.values.education,
                                      showContact: values.values.contact,
                                      showEmail: values.values.email,
                                    },
                                    access
                                  );
                                  if (res) {
                                    swal({
                                      title: "Job Saved to Draft !",
                                      message: "Success",
                                      icon: "success",
                                      button: "Continue",
                                    }).then((result) => {
                                      setLoading(false);
                                      ls.remove("postjob");
                                      ls.remove("prof");
                                    });
                                  } else {
                                    swal({
                                      title: " Error Saving Job !",
                                      message: "OOPS! Error Occured",
                                      icon: "Error",
                                      button: "Ok",
                                    });
                                  }
                                }}
                                className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                              >
                                Save As Draft
                              </button>
                            </div>
                          </Form>
                        </div>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <div className="w-full py-3 shadow-md mr-3 bg-white">
              <div className="w-full mt-9">
                <div className="w-fit mt-5 mx-6">
                  <Formik
                    initialValues={{
                      salary: job.salary && job.salary[1] ? job.salary[1] : "",
                      maxSalary:
                        job.salary && job.salary[2] ? job.salary[2] : "",
                    }}
                    validate={(values) => {
                      const errors = {};

                      if (values.salary && values.maxSalary && Number(values.maxSalary) <= Number(values.salary)) {
                        setmax("Max Salary should be greater than min Salary");
                        setMaxValueError(true)
                      } else {
                        setmax(""); // Clear the error message if maxSalary is valid
                        setMaxValueError(false)
                      }
                      // if (values.salary && isNaN(Number(values.salary))) {
                      //   setSalary("Min Salary must be a number");
                      //   setAlphaValueError(true)
                      // } else {
                      //   setSalary(""); // Clear the error message if maxSalary is valid
                      //   setAlphaValueError(false)
                      // }
                      // if (values.maxSalary && isNaN(Number(values.maxSalary))) {
                      //   setmax("Max Salary must be a number");
                      //   setAlphaValueErrors(true)
                      // } else {
                      //   setmax(""); // Clear the error message if maxSalary is valid
                      //   setAlphaValueErrors(false)
                      // }
                      if (values.salary && values.maxSalary && values.maxSalary > values.salary) {
                        setSalary("");
                        setmax("");
                      }
                      if (values.salary) {
                        setSalary("");
                      }
                      return errors;
                    }}
                  >
                    {(values) => {
                      return (
                        <div>
                          <Form className="w-full mt-9">
                            <div className="my-5 space-y-3 w-full">
                              <label className="text-left w-3/4 mb-3 font-semibold block">
                                Remunerations
                              </label>

                              <Editor

                                editorState={perks}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                wrapperStyle={{
                                  width: "100%",
                                  border: "1px solid rgb(156 163 175 / 1)",
                                  borderRadius: "5px",
                                }}
                                editorStyle={{
                                  minHeight: "200px",
                                  paddingLeft: "1rem",
                                }}
                                onEditorStateChange={onPerksEditorStateChange}
                              />
                            </div>
                            <div className="mt-2">
                              {perksError && <p className="text-red-500">Required !</p>}</div>
                            <div className="my-7 mt-9 space-y-3 w-3/4">
                              <label className="text-left w-3/4 font-semibold block">
                                Pay Range
                              </label>
                              <div className="items-center space-x-0">
                                <label>Currency</label>
                                <Listbox
                                  onChange={setCurrency}
                                  value={currency}
                                >
                                  <div className="relative mt-1 w-fit mb-5 z-100">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border-1 border-">
                                      <span className="block truncate">
                                        {currency.symbol} - {currency.name}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronDownIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-100">
                                        {currencies.currencies.map(
                                          (currency, currencyIdx) => (
                                            <Listbox.Option
                                              key={currencyIdx}
                                              className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                                  ? "bg-blue-100 text-blue-900"
                                                  : "text-gray-900"
                                                }`
                                              }
                                              value={currency}
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span
                                                    className={`block truncatez-100 ${selected
                                                      ? "font-medium"
                                                      : "font-normal"
                                                      }`}
                                                  >
                                                    {currency.symbol} -{" "}
                                                    {currency.name}
                                                  </span>
                                                  {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 z-100">
                                                      <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          )
                                        )}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </Listbox>
                              </div>
                              <div className="w-fit lg:flex md:flex gap-5">
                                <div className="block w-1/2">
                                  <label className="block">Minimum</label>
                                  <Field
                                    name="salary"
                                    type="number"
                                    onBlur={(e) => {
                                      const value = e.target.value.replace(
                                        /,/g,
                                        ""
                                      );
                                      if (!isNaN(parseFloat(value))) {
                                        e.target.value =
                                          parseFloat(value).toLocaleString();
                                      } else {
                                        e.target.value = "";
                                      }
                                    }}

                                    placeholder=""
                                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 focus:outline-0 focus:border-0 px-4"
                                  />
                                  <div className="mt-3 ">
                                    <p className="text-red-500 text-sm">{salary}</p>
                                  </div>
                                </div>
                                <div className="block w-1/2">
                                  <label className="block">Maximum</label>
                                  <Field
                                    name="maxSalary"
                                    type="number"

                                    onBlur={(e) => {
                                      const value = e.target.value.replace(
                                        /,/g,
                                        ""
                                      );
                                      if (!isNaN(parseFloat(value))) {
                                        e.target.value =
                                          parseFloat(value).toLocaleString();
                                      } else {
                                        e.target.value = "";
                                      }
                                    }}
                                    placeholder=""
                                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 focus:outline-0 focus:border-0 px-4"
                                  />
                                  <div className="mt-3 ">
                                    <p className="text-red-500 text-sm">{max}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row space-x-3 mr-20  my-6">
                              <button
                                onClick={async () => {
                                  if (
                                    !values.values.salary ||
                                    !values.values.maxSalary ||
                                    !perks.getCurrentContent().hasText() ||
                                    maxvalueerror || alphavalueerror || alphavalueerrors
                                  ) {
                                    // Set individual error states
                                    if (maxvalueerror) {
                                      setmax(maxvalueerror ? "Max Salary should be greater than min Salary" : "");
                                      // }
                                      // else if (alphavalueerror) {
                                      //   setSalary(alphavalueerror ? "Min Salary must be a number" : "");
                                      //   setmax("");
                                      // }else if (alphavalueerrors) {
                                      //   setSalary("");
                                      //   setmax(alphavalueerrors ? "Max Salary must be a number" : "");
                                    } else {
                                      setPerksError(!perks.getCurrentContent().hasText());
                                      setSalary(!values.values.salary ? "Required!" : "");
                                      setmax(!values.values.maxSalary ? "Required!" : "");
                                    }

                                  } else {
                                    let skills = [];
                                    dbSkills.forEach((el, index) => {
                                      if (prof[index] > 0) {
                                        el.proficiency = prof[index];
                                        skills.push(el);
                                      }
                                    });
                                    ls.set("postjob", JSON.stringify(job));
                                    setJob(job);
                                    setSalary("");
                                    setmax("");
                                    setPerksError(false);
                                    let res = await postJobAPI(
                                      {
                                        skills: skills,
                                        user_id: user._id,
                                        draft: true,
                                        questions: questions,
                                        ...job,
                                      },
                                      access
                                    );
                                    if (res) {
                                      swal({
                                        title: "Job Saved to Draft !",
                                        message: "Success",
                                        icon: "success",
                                        button: "Continue",
                                      }).then((result) => {
                                        setLoading(false);
                                        ls.remove("postjob");
                                        ls.remove("prof");
                                        window.location.href = "/company/pendingjobs";
                                      });
                                    } else {
                                      swal({
                                        title: " Error Saving Job !",
                                        message: "OOPS! Error Occured",
                                        icon: "Error",
                                        button: "Ok",
                                      });
                                    }
                                  }
                                }}
                                className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                              >
                                Save As Draft
                              </button>
                              <button
                                className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                                onClick={() => {
                                  // if (
                                  //   values.values.salary >
                                  //   values.values.maxSalary
                                  // ) {
                                  //   return;
                                  // }
                                  setPageIndex(5);
                                }}
                              >
                                Prev
                              </button>


                              <button
                                type="button"
                                className="bg-[#228276] px-4 py-1 hover:bg-[#228276] text-white ml-2 font-bold rounded-lg"
                                onClick={async () => {

                                  if (
                                    !values.values.salary ||
                                    !values.values.maxSalary ||
                                    !perks.getCurrentContent().hasText() ||
                                    maxvalueerror
                                    //  || alphavalueerror ||alphavalueerrors
                                  ) {
                                    // Set individual error states
                                    if (maxvalueerror) {
                                      setmax(maxvalueerror ? "Max Salary should be greater than min Salary" : "");
                                      // }
                                      // else if (alphavalueerror) {
                                      //   setSalary(alphavalueerror ? "Min Salary must be a number" : "");
                                      //   setmax("");
                                      // }else if (alphavalueerrors) {
                                      //   setSalary("");
                                      //   setmax(alphavalueerrors ? "Max Salary must be a number" : "");
                                      // }else if (alphavalueerror && alphavalueerrors) {
                                      //   setmax("Max Salary must be a number");
                                      //   setSalary("Min Salary must be a number");
                                    }
                                    else {
                                      setPerksError(!perks.getCurrentContent().hasText());
                                      setSalary(!values.values.salary ? "Required!" : "");
                                      setmax(!values.values.maxSalary ? "Required!" : "");
                                    }
                                  } else {
                                    setSubmitStatus(1);
                                    job.invitations = candidateData;
                                    job.invitations = candidateData ? candidateData : selectedData;
                                    postJob(job, values.values.salary, values.values.maxSalary);
                                    setSalary("");
                                    setmax("");
                                    setPerksError(false);
                                  }
                                }}
                                style={{ backgroundColor: "#228276" }}
                              >
                                {loading ? <img src={Loader} alt="loader" className="h-9 mx-auto" /> : "Submit"}
                              </button>

                            </div>
                          </Form>
                        </div>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        setPageIndex(1);
        return null;
    }
  };
  return (
    <div className="flex bg-white rounded-xl w-100">
      <nav className="col pt-5 px-10 flex mb-3 w-1/4">
        <ol class="items-center w-full ">
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 1
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 1
                ? "bg-teal-800 text-white"
                : PageIndex <= 1
                  ? "bg-white text-dark shadow-xl"
                  : "bg-teal-800 text-white"
                }`}
            >
              1
            </span>
            <span>
              <h3 class="font-medium leading-tight">Job details</h3>
              <p class="text-sm">Enter the job details</p>
            </span>
          </li>
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 2
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 2
                ? "bg-gray-500 text-white"
                : PageIndex <= 2
                  ? "bg-white text-dark shadow-xl"
                  : "bg-teal-800 text-white"
                }`}
            >
              2
            </span>
            <span>
              <h3 class="font-medium leading-tight">Eligibility criteria</h3>
              <p class="text-sm">Define the eligibility criteria</p>
            </span>
          </li>
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 3
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 3
                ? "bg-gray-500 text-white"
                : PageIndex <= 3
                  ? "bg-white text-dark shadow-xl"
                  : "bg-teal-800 text-white"
                }`}
            >
              3
            </span>
            <span>
              <h3 class="font-medium leading-tight">Job Invitation</h3>
              <p class="text-sm">Send out the invitations</p>
            </span>
          </li>
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 4
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 4
                ? "bg-gray-500 text-white"
                : PageIndex <= 4
                  ? "bg-white text-dark shadow-xl "
                  : "bg-teal-800 text-white"
                }`}
            >
              4
            </span>
            <span>
              <h3 class="font-medium leading-tight">Screening question</h3>
              <p class="text-sm">Enter the screening questions</p>
            </span>
          </li>
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 5
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 5
                ? "bg-gray-500 text-white"
                : PageIndex <= 5
                  ? "bg-white text-dark shadow-xl "
                  : "bg-teal-800 text-white"
                }`}
            >
              5
            </span>
            <span>
              <h3 class="font-medium leading-tight">Data masking</h3>
              <p class="text-sm">Define data masking</p>
            </span>
          </li>
          <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 6
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 6
                ? "bg-gray-500 text-white"
                : PageIndex <= 6
                  ? "bg-white text-dark shadow-xl"
                  : "bg-teal-800 text-white"
                }`}
            >
              6
            </span>
            <span>
              <h3 class="font-medium leading-tight">
                Remuneration & pay range
              </h3>
              <p class="text-sm">Define remuneration & pay range</p>
            </span>
          </li>
        </ol>
      </nav>
      <div className="my-2">
        {Alert === true && (
          <div
            className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
            role="alert"
          >
            Job Posted Successfully ! Check Here
          </div>
        )}
        {Alert === false && (
          <div
            className="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
            role="alert"
          >
            Problem Uploading Job ! Try Again Later !
          </div>
        )}
      </div>
      <div class="h-full min-h-[80em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-50 dark:opacity-50"></div>
      <div className="mb-3 w-3/4">
        <div className=" w-full px-5">{renderFormPage()}</div>
      </div>
    </div>
  );
};

export default AddJobs;


// <div>
//             <div className="lg:w-full py-3  mr-3 bg-white">
//               <Formik
//               >
//                 {(values) => {
//                   return (
//                     <div className="w-fit mt-9">
//                       <Form className="w-fit m-5">
//                         <div className="my-7 space-y-3 w-full">
//                           <label className="text-left w-3/4 mb-3 block font-semibold">
//                             Candidate Eligibility
//                           </label>
//                           <Editor
//                             editorState={eligible}
//                             toolbarClassName="toolbarClassName"
//                             wrapperClassName="wrapperClassName"
//                             editorClassName="editorClassName"
//                             required
//                             wrapperStyle={{
//                               width: "100%",
//                               border: "1px solid rgb(156 163 175 / 1)",
//                               borderRadius: "5px",
//                             }}
//                             editorStyle={{
//                               minHeight: "200px",
//                               paddingLeft: "1rem",
//                             }}
//                             onEditorStateChange={oneligibiltyStateChange}
//                           />
//                         </div>

//                         <div className="mt-2">
//                           {eligibilityperksError && <p className="text-red-500">* new Required</p>}</div>
//                         <div className="my-7 space-y-3 w-full block">
//                           <label className="text-left text-l w-3/4 font-semibold block py-3 rounded-lg w-full">
//                             Select Technical Skills
//                           </label>
//                           <div
//                             className="w-full rounded-[20px]"
//                             style={{
//                               border: "1px solid #bcbcbc",
//                               outlineStyle: "outset",
//                               outlineColor: "#E3E3E3",
//                             }}
//                           >
//                             <div className="" style={{ overflowX: "auto", maxHeight: "32rem" }}>
//                               <div className="">
//                                 <div className="w-full ">
//                                   {showRoles &&
//                                     showRoles
//                                       .filter(
//                                         (role) =>
//                                           typeof role === "string" &&
//                                           role.trim() !== ""
//                                       )
//                                       .map((el, index) => {
//                                         return (
//                                           <div key={index}>
//                                             <Disclosure>
//                                               {({ open }) => (
//                                                 <div
//                                                   className={`${open ? "shadow-md" : ""
//                                                     }`}
//                                                 >
//                                                   <Disclosure.Button
//                                                     className={`flex w-full border-b-2 justify-between px-4 py-3 text-left text-sm font-medium hover:bg-stone-50 focus:outline-none focus-visible:ring  ${open ? "shadow-lg " : ""
//                                                       } ${rolesProf[index] != 0
//                                                         ? ""
//                                                         : ""
//                                                       }`}
//                                                   >
//                                                     <div className="flex">
//                                                       <input
//                                                         type="checkbox"
//                                                         id=""
//                                                         className="rounded my-1"
//                                                         checked={selected[index]}
//                                                         onChange={() =>
//                                                           handleCheckboxClick(
//                                                             index
//                                                           )
//                                                         }
//                                                       />
//                                                       <span className="mx-3 flex items-center text-base">
//                                                         {el}
//                                                       </span>
//                                                     </div>

//                                                     {selected[index] && (
//                                                       <div className="ml-auto mr-5 flex items-center space-x-2">
//                                                         <p>0</p>
//                                                         <input
//                                                           type="range"
//                                                           min="0"
//                                                           max="5"
//                                                           value={rolesProf[index]}
//                                                           onChange={(e) => {
//                                                             dbSkills.forEach(
//                                                               (skill) => {
//                                                                 if (
//                                                                   skill.role ===
//                                                                   el
//                                                                 ) {
//                                                                   skill.proficiency =
//                                                                     e.target.value;
//                                                                   let inde =
//                                                                     dbSkills.findIndex(
//                                                                       (el) => {
//                                                                         return (
//                                                                           el ===
//                                                                           skill
//                                                                         );
//                                                                       }
//                                                                     );
//                                                                   let p = prof;
//                                                                   p[inde] =
//                                                                     e.target.value;
//                                                                   setProf(p);
//                                                                   skill.rating =
//                                                                     e.target.value;
//                                                                 }
//                                                               }
//                                                             );
//                                                             let rp = rolesProf;
//                                                             rp[index] =
//                                                               e.target.value;
//                                                             setRolesProf(rp);
//                                                             ls.set(
//                                                               "RolesProf",
//                                                               JSON.stringify(
//                                                                 rolesProf
//                                                               )
//                                                             );
//                                                           }}
//                                                         />
//                                                         <p>5</p>
//                                                       </div>
//                                                     )}
//                                                     <ChevronUpIcon
//                                                       className={`${!open
//                                                         ? "rotate-180 transform"
//                                                         : ""
//                                                         } h-5 w-5 text-blue-500`}
//                                                     />
//                                                   </Disclosure.Button>
//                                                   <Disclosure.Panel className=" bg-stone-50">
//                                                     {primarySkills[el].map(
//                                                       (skill, index) => {
//                                                         return (
//                                                           <div>
//                                                             <Disclosure>
//                                                               {({ open }) => (
//                                                                 <div
//                                                                   className={`${open
//                                                                     ? "shadow-md"
//                                                                     : ""
//                                                                     }`}
//                                                                 >
//                                                                   <Disclosure.Button
//                                                                     className={`flex w-full justify-between rounded-lg  px-4 py-3 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 ${open
//                                                                       ? ""
//                                                                       : ""
//                                                                       } `}
//                                                                   >
//                                                                     <span className="uppercase">
//                                                                       {skill}
//                                                                     </span>
//                                                                     <div className="flex items-center space-x-2 primary-skill-slider ml-auto">
//                                                                       <StarRating
//                                                                         type="range"
//                                                                         min="0"
//                                                                         max="5"
//                                                                         value={
//                                                                           prof[
//                                                                           index
//                                                                           ]
//                                                                         }
//                                                                         onChange={async (
//                                                                           e
//                                                                         ) => {
//                                                                           let d =
//                                                                             dbSkills;
//                                                                           d[
//                                                                             index
//                                                                           ] = {
//                                                                             ...d[
//                                                                             index
//                                                                             ],
//                                                                             proficiency:
//                                                                               e
//                                                                                 .target
//                                                                                 .value,
//                                                                           };
//                                                                           let p =
//                                                                             prof;
//                                                                           p[
//                                                                             index
//                                                                           ] =
//                                                                             e.target.value;
//                                                                           setProf(
//                                                                             p
//                                                                           );
//                                                                           await ls.set(
//                                                                             "prof",
//                                                                             JSON.stringify(
//                                                                               p
//                                                                             )
//                                                                           );
//                                                                           await setProf(
//                                                                             [...p]
//                                                                           );
//                                                                           await setDbSkills(
//                                                                             [...d]
//                                                                           );
//                                                                           if (
//                                                                             e
//                                                                               .target
//                                                                               .value >
//                                                                             0
//                                                                           ) {
//                                                                             let u =
//                                                                               user;
//                                                                             let to =
//                                                                               u.tools;
//                                                                             to.push(
//                                                                               {
//                                                                                 proficiency:
//                                                                                   e
//                                                                                     .target
//                                                                                     .value,
//                                                                                 ...skill,
//                                                                               }
//                                                                             );
//                                                                             u.tools =
//                                                                               to;
//                                                                             await setUser(
//                                                                               {
//                                                                                 ...u,
//                                                                               }
//                                                                             );
//                                                                           }
//                                                                         }}
//                                                                       />
//                                                                     </div>
//                                                                     <ChevronUpIcon
//                                                                       className={`${!open
//                                                                         ? "rotate-180 transform"
//                                                                         : ""
//                                                                         } h-5 w-5 text-blue-500`}
//                                                                     />
//                                                                   </Disclosure.Button>
//                                                                   <Disclosure.Panel className="pb-3 px-4">
//                                                                     {dbSkills
//                                                                       .filter(
//                                                                         (
//                                                                           secSkill
//                                                                         ) =>
//                                                                           secSkill.primarySkill ===
//                                                                           skill &&
//                                                                           secSkill.role ===
//                                                                           el
//                                                                       )
//                                                                       .reduce(
//                                                                         (
//                                                                           rows,
//                                                                           secSkill,
//                                                                           index
//                                                                         ) => {
//                                                                           if (
//                                                                             index %
//                                                                             2 ===
//                                                                             0
//                                                                           )
//                                                                             rows.push(
//                                                                               []
//                                                                             );
//                                                                           rows[
//                                                                             rows.length -
//                                                                             1
//                                                                           ].push(
//                                                                             secSkill
//                                                                           );
//                                                                           return rows;
//                                                                         },
//                                                                         []
//                                                                       )
//                                                                       .map(
//                                                                         (row) => (
//                                                                           <div
//                                                                             className="md:flex my-2 text-sm justify-between items-center py-1"
//                                                                             style={{
//                                                                               whiteSpace:
//                                                                                 "nowrap",
//                                                                             }}
//                                                                           >
//                                                                             {row.map(
//                                                                               (
//                                                                                 secSkill
//                                                                               ) => (
//                                                                                 <Chip
//                                                                                   label={
//                                                                                     secSkill.secondarySkill
//                                                                                   }
//                                                                                   variant="outlined"
//                                                                                   onClick={
//                                                                                     handleClick
//                                                                                   }
//                                                                                 />
//                                                                               )
//                                                                             )}
//                                                                           </div>
//                                                                         )
//                                                                       )}
//                                                                   </Disclosure.Panel>
//                                                                 </div>
//                                                               )}
//                                                             </Disclosure>
//                                                           </div>
//                                                         );
//                                                       }
//                                                     )}
//                                                   </Disclosure.Panel>
//                                                 </div>
//                                               )}
//                                             </Disclosure>
//                                           </div>
//                                         );
//                                       })}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           {skillErr && console.log("skillErr", skillErr)}
//                           {!skillErr && (
//                             <p className="text-red-600 text-sm w-full text-left mr-auto">
//                               new Required
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
//                           <button
//                             className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2"

//                             onClick={async () => {
//                               if (!eligible.getCurrentContent().hasText()) {
//                                 seteligibilityperksError(true);
//                               } if (!skillclicked) {
//                                 setSkillErr(true)
//                               }
//                               else {
//                                 setSkillErr(false)
//                                 seteligibilityperksError(false);
//                                 var searchSkills = new Array();
//                                 dbSkills.forEach((el, index) => {
//                                   if (prof[index] > 0) {
//                                     searchSkills.push(el._id);

//                                   }
//                                 });
//                                 var eligibleSkills = {};
//                                 const id = user._id;
//                                 eligibleSkills["skills"] = searchSkills;
//                                 eligibleSkills["companyid"] = id;
//                                 getEligibleCandidate(eligibleSkills);
//                                 setPageIndex(3);
//                               }
//                             }}
//                           >
//                             Next
//                           </button>
//                         </div>
//                       </Form>
//                     </div>
//                   );
//                 }}
//               </Formik>
//             </div>
//           </div>
