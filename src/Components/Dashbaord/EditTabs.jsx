import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url, getpsykey, setprofileauth, getOtherLI } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { IoPeople, IoSchoolOutline } from "react-icons/io5";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ls from 'localstorage-slim';
import { getStorage } from "../../service/storageService";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
  AiOutlineDelete,
  AiOutlineRead,
} from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Combobox } from "@headlessui/react";
import cities from "cities.json";

// Assets
import swal from "sweetalert";
import StarRating from "../../Components/StarRating";

import "react-multi-carousel/lib/styles.css";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  getDBCompanyList,
  getDBSchoolList,
  uploadCandidateResume,
  getCountryList,
  languagesList,
  checkCompany,
  getJobTitles,
  getUserFromId,
  updateUserLanguageDetails,
  updateUserSkillDetails
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop.jsx";
import Loader from "../../assets/images/loader.gif";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
import Skill from "./Skill"
const Tabs = (props)=> {
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);
  // File Upload
  const [loading, setLoading] = React.useState(false);
  // States for the Page
  const [user, setUser] = React.useState(null);
  const [lastname, setLastname] = React.useState(null);
  const [firstname, setFirstname] = React.useState(null);
  const [houseNo, sethouseNo] = React.useState(null);
  const [street, setstreet] = React.useState(null);
  const [region, setregion] = React.useState(null);
  const [city, setcity] = React.useState(null);
  const [Addcountry, setAddCountry] = React.useState(null);
  const [zip, setzip] = React.useState(null);
  const [resume, setresume] = React.useState(null);
  const [access_token, setToken] = React.useState(null);
  const [language, setLanguage] = React.useState([]);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState([]);

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [showRolesData, setShowRolesData] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [dbCopy, setDbCopy] = React.useState([]);

  const inputSkillRef = React.useRef(null);
  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);
  const [error, seterror] = React.useState(null);
  const [secEmail, setSecEmail] = React.useState([]);
  const [secContact, setSecContact] = React.useState([]);
  // City Autocomplete
  const [selectedCity, setSelectedCity] = React.useState(cities[103]);
  const [country, setSelectedCountry] = React.useState([]);
  const [selectedAddCity, setSelectedAddCity] = React.useState(cities[103]);
  const [query, setQuery] = React.useState("");
  const [Addquery, setAddQuery] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [inputField, setInputField] = React.useState({
    firstName : "",
    lastname : "",
    city : "",
    state : "",
    country : "",
    email : "",
    contact : "",
    linkedinurl : ""
  });

  const [fieldErrors , setFieldErrors] = React.useState(null)

  // Read write speak error
  const [rwpError , setrwpError] = React.useState(null)

  // Language message
  const [langMessage , setLangMessage] = React.useState(null)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (term = '') => {
    setSearchResults(
      showRoles?.filter(role => role?.toLowerCase().includes(term.toLowerCase()))
    );
  };

  React.useEffect(() => {
    handleSearch(searchTerm);
  }, [showRoles, searchTerm]);


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

  const [excompanyList, setExCompanyList] = React.useState([]);

  const [companyList, setCompanyList] = React.useState([]);
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  React.useEffect(() => {
    const initial = async () => {
      let res = await getDBCompanyList();
      if (res?.data) {
        setCompanyList(res.data);
        setExCompanyList(res.data);
      }

      let languages = await languagesList();
      if (languages?.data) {
        setLanguage(languages.data);
      }
      let title = await getJobTitles();
      if (title?.data) {
        setJobTitle(title.data);
      }
      let country = await getCountryList();
      if (country?.data?.countries?.[0]?.country) {
        setSelectedCountry(country.data.countries[0].country);
      }
    };
    initial();
    // handleSearch();
  }, [searchTerm]);

  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [companyQuery, setCompanyQuery] = React.useState("");

  const filteredCompany =
    companyQuery === ""
      ? companyList.slice(0, 10)
      : companyList
        .filter((company) =>
          company?.name?.toLowerCase().includes(companyQuery?.toLowerCase())
        )
        .slice(0, 10);

  const [selectedExCompany, setSelectedExCompany] = React.useState(null);
  const [companyExQuery, setExCompanyQuery] = React.useState("");
  const filteredExCompany =
    companyExQuery === ""
      ? excompanyList.slice(0, 10)
      : excompanyList
        .filter((company) =>
          company?.name?.toLowerCase().includes(companyExQuery?.toLowerCase())
        )
        .slice(0, 10);


  React.useEffect(() => {
    const initial = async () => {
      let res = await getDBSchoolList();
      if (res?.data) {
        setSchoolList(res.data);
      }
    };
    initial();
  }, []);

  const [schoolList, setSchoolList] = React.useState([]);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schoolQuery, setSchoolQuery] = React.useState("");
  const filteredSchool =
    schoolQuery === ""
      ? schoolList.slice(0, 10)
      : schoolList
        .filter((school) =>
          school.name.toLowerCase().includes(schoolQuery.toLowerCase())
        )
        .slice(0, 10);

  const [JobTitle, setJobTitle] = React.useState([]);
  const [selectedTitle, setSelectedTitle] = React.useState(null);
  const [TitleQuery, setTitleQuery] = React.useState("");
  const filteredTitle =
    TitleQuery === ""
      ? JobTitle.slice(0, 10)
      : JobTitle.filter((title) =>
        title.name.toLowerCase().includes(TitleQuery.toLowerCase())
      ).slice(0, 10);

  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);

  const [upImg, setUpImg] = React.useState(null);

  const [index, setIndex] = React.useState(0);
  const [profileImg, setProfileImg] = React.useState(null);

  //education
  const [educationalDetail, setEducationalDetail] = React.useState([]);

  const [showEduForm, setShowEduForm] = React.useState(false);

  const [edit, setEdit] = React.useState(null);
  const [showError, setShowError] = React.useState(true);
  const [present, setPresent] = React.useState(false);
  const [exPresent, setExPresent] = React.useState(false);
  const [asPresent, setAsPresent] = React.useState(false);

  const [validationError, setValidationError] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)

  const resetBtn = React.useRef(null);
  const [initialValues, setInitialValues] = React.useState({
    //education
    contact: null,
    email: null,
    houseNo: null,
    street: null,
    city: null,
    country: null,
    state: null,
    zip: null,
    //experience
  });
  const [eduinitialValues, setEduInitialValues] = React.useState({
    //education
    school: null,
    degree: null,
    field_of_study: null,
    start_date: null,
    end_date: null,
    grade: null,
    description: null,

    //experience
  });
  const [exinitialValues, setExInitialValues] = React.useState({
    title: null,
    employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

   // Experience fresher 
   const [fresher , setFresher] = React.useState(false)

  // Experience
  const [experienceDetail, setExperienceDetail] = React.useState([]);
  const [showExForm, setShowExForm] = React.useState(false);

  //Association
  const [associateDetail, setAssociateDetail] = React.useState([]);
  const [showAsForm, setShowAsForm] = React.useState(false);

  const [asinitialValues, setAsInitialValues] = React.useState({
    title: null,
    // employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

  //Tools
  const [tools, setTools] = React.useState([]);
  const [ederror, setFormError] = React.useState(false);
  const [aserror, setAsFormError] = React.useState(false);
  const [exerror, setExFormError] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);

  const [prevPath, setPrevPath] = useState(null)

  const inputRef = React.useRef(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  function handleClick(index, item, cities) {
    setEdit(index);
    setEduInitialValues(item);
    setSelectedCity(cities[0]);
    setShowEduForm(true);
    setPresent(item?.Ispresent);
  }
  const handleEdit = (index, item) => {
    setEdit(index);
    setExInitialValues(item);
    setShowExForm(true);
    setExPresent(item.Ispresent);
  };
  const handleEditCompany = (index, item) => {
    setEdit(index);
    setAsInitialValues(item);
    setShowAsForm(true);
    setAsPresent(item.Ispresent);
    setSelectedCompany(item.company_name);
  };
  const handleEditForm = (index, item) => {
    setEdit(index);
    setLsInitialValues(item);
    setShowLsForm(true);
  };
  const handleDeleteLanguage = async (index) => {
    setLangMessage("Please click on Save Language button to save language details")
    setLanguageSkills(
      languageSkills.filter(
        (item, i) => i !== index
      )
    );
    let res = JSON.parse(
      await getStorage("user")
    );
    res.experience = languageSkills.filter(
      (item, i) => i !== index
    );
    setUser(res);
    ls.set(
      "user",
      JSON.stringify(res)
    );
  };
  const handleAddLanguageSkills = async () => {
    await setShowError(true);
    await setEdit(null);
    await setLsInitialValues({
      name: "English",
      read: null,
      write: null,
      speak: null,
    });
    setShowLsForm(true);
  };

  //Langugage skills
  const [languageSkills, setLanguageSkills] = React.useState([]);
  const [showLsForm, setShowLsForm] = React.useState(false);
  const [lsinitialValues, setLsInitialValues] = React.useState({
    name: "English",
    read: null,
    write: null,
    speak: null,
  });
  const [lserror, setLsFormError] = React.useState(false);

  const handleChange = async (e) => {
    setLoading(true);
    setError(null);
    if (e.target && e.target.files) {
      let user = JSON.parse(await getStorage("user"));
      let access_token = await getStorage("access_token");
      let fd = new FormData();
      fd.append("user_id", user._id);
      fd.append("file", e.target.files[0]);

      let response = await uploadCandidateResume(fd, access_token);
      if (response && response.status === 200) {
        await setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        let res = await getStorage("candidateDetails");
        res = JSON.parse(res);
        res.resume = e.target.files[0].name;
        await ls.set("candidateDetails", JSON.stringify(res));
      } else {
        seterror("Error uploading file");
      }

      // Resume Parser
      var fileReader = new FileReader();
      var base64;
      // Onload of file read the file content
      let base64String = "";
      fileReader.onload = async function (fileLoadedEvent) {
        var modifiedDate = new Date(fileLoadedEvent.lastModified)
          .toISOString()
          .substring(0, 10);
        base64 = fileLoadedEvent.target.result;
        base64String = base64;
      };
      await fileReader.readAsDataURL(e.target.files[0]);
      setLoading(false);
      e.target.files = null;
    }
  };

  React.useEffect(() => {
    const initial = async () => {
      let e = JSON.parse(await getStorage("user"));
      let access_token = getStorage("access_token");
      let user1 = await getUserFromId({ id: e._id }, access_token);
      if (access_token === null) window.location.href = "/login";
      setSecContact(user1?.data?.user?.secondaryContacts);
      setSecEmail(user1?.data?.user?.secondaryEmails);
      let resume = JSON.parse(await getStorage("resumeInfo"));
      setUser(e);
      setPrevPath(`/${e.user_type}/profile`)
      if (resume) {

        setSecContact([]);
        setSecEmail([]);
        if (resume.data === null) return null;
        // setUsername(resume.data.userna)
        let ed = resume.data.education;
        if (ed !== "null" || ed !== null) {
          setEducationalDetail(ed);
        }
        if (ed === null) {
          setEducationalDetail([]);
        }
        let ex = resume.data.experience;
        if (ex !== "null" || ex !== null) {
          setExperienceDetail(ex);
          setFresher(false)
        }
        if (ex === null) {
          setExperienceDetail([]);
        }

        let as = resume.data.associate;
        if (as !== "null" || as !== null) {
          setAssociateDetail(as);
        }
        if (as === null) {
          setAssociateDetail([]);
        }
        let ls = resume.data.language;
        if (ls !== "null" || ls !== null) {
          setLanguageSkills(ls);
        }
        if (ls === null) {
          setLanguageSkills([]);
        }

        if (resume.data.firstName) {
          setFirstname(resume.data.firstName);
          e.firstName = resume.data.firstName;
        }
        if (resume.data.lastName) {
          setLastname(resume.data.lastName);
          e.lastName = resume.data.lastName;
        }
        if (resume.data.email) {
          e.email = resume.data.email;
        }
        if (resume.data.contact) {
          e.contact = resume.data.contact;
        }
        if (resume.data.houseNo) {
          sethouseNo(resume.data.houseNo);
          e.houseNo = resume.data.houseNo;
        }
        if (resume.data.street) {
          setstreet(resume.data.street);
          e.street = resume.data.street;
        }
        if (resume.data.city) {
          setSelectedAddCity(resume.data.city);
          e.city = resume.data.city;
        }
        if (resume.data.state) {
          setregion(resume.data.state);
          e.state = resume.data.state;
        }
        if (resume.data.country) {
          setAddCountry(resume.data.country);
          e.country = resume.data.country;
        }
        if (resume.data.zip) {
          setzip(resume.data.zip);
          e.zip = resume.data.zip;
        }
        if (resume.data.secondaryEmails) {
          setSecEmail([])
          // setSecEmail(resume.data.secondaryEmails);
          // e.secondaryEmails = resume.data.secondaryEmails;
        }
        if (resume.data.secondaryContacts) {
          setSecContact([])
          // setSecContact(resume.data.secondaryContacts);
          // e.secondaryContacts = resume.data.secondaryContacts;
        }
        if (resume.data.resume) {
          setresume(resume.data.resume);
          e.resume = resume.data.resume;
        }

        setUser(e);
      } else {

//         setSecContact(e.secondaryContacts)
        // setSecEmail(e.secondaryEmails);
        if (e === null) return null;
        let ed = e.education;
        if (ed !== "null" || ed !== null) {
          setEducationalDetail(ed);
        }
        if (ed === null) {
          setEducationalDetail([]);
        }
        let ex = e.experience;
        if (ex !== "null" || ex !== null) {
          setExperienceDetail(ex);
          setFresher(false)
        }
        if (ex === null) {
          setExperienceDetail([]);
        }

        let as = e.associate;
        if (as !== "null" || as !== null) {
          setAssociateDetail(as);
        }
        if (as === null) {
          setAssociateDetail([]);
        }
        // let ls = e.language;
        let ls = user1?.data?.user?.language
        if (ls.length > 0 && ls !== "null" && ls !== null) {
          const hasString = ls.some(element => typeof (element) == 'string');
          if (hasString === true) {
            ls = ls.filter(e => (typeof (e) !== 'string'));
          }
          setLanguageSkills(ls);
        }
        if (ls === null) {
          setLanguageSkills([]);
        }
        let et = e.tools;
        if (et !== "null" || et !== null) {
          setTools(et);
        }
        if (et === null) {
          setTools([]);
        }
        let primarySkills = {};
        let roles = new Set([]);
        e.tools.forEach((skill) => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
        setCRoles(Array.from(roles));

        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);
      }
    };

    initial();
  }, []);

  const updateEducation = async (values) => {
    if(!values?.school || values?.school === null || values?.school === undefined || values?.school === ""){
      return
    }
    if (!ederror) {
      let e = JSON.parse(await getStorage("user"));
      if (edit !== null) {
        const temp = [...educationalDetail];
        let school = selectedSchool ? selectedSchool : values?.school;
        temp[edit] = { ...values, school: school, Ispresent: present };
        await setEducationalDetail(temp);
        await setEdit(null);
        resetBtn.current.click();
        e.education = temp;
        setUser(e);
        await ls.set("user", JSON.stringify(e));

        return;
      }
      let temp = educationalDetail;
      let school = selectedSchool ? selectedSchool : values?.school;

      temp = [
        ...educationalDetail,
        { ...values, school: school, Ispresent: present },
      ];
      await setEducationalDetail(temp);
      e.education = temp;
      setUser(e);
      await ls.set("user", JSON.stringify(e));
      await setEduInitialValues({
        school: null,
        degree: null,
        field_of_study: null,
        start_date: null,
        end_date: null,
        grade: null,
        description: null,
        present: false,
      });
      setSelectedSchool(null);
      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }
  };

  const updateExperience = async (values) => {
    if (!exerror) {
      let e = JSON.parse(await getStorage("user"));
      if (edit !== null) {
        let city = selectedCity;
        if (selectedCity.name) {
          city = selectedCity.name + ", " + selectedCity.country;
        }
        let company = selectedCompany ? selectedCompany : values?.company_name;
        let title = selectedTitle ? selectedTitle : values?.title;
        const temp = [...experienceDetail];
        temp[edit] = {
          ...values,
          location: city,
          company_name: company,
          Ispresent: exPresent,
          title: title,
        };
        await setExperienceDetail(temp);
        setFresher(false)
        e.isFresher = false
        e.experience = temp;
        setUser(e);
        await ls.set("user", JSON.stringify(e));
        await setEdit(null);
        resetBtn.current.click();
        return;
      }
      let city = selectedCity;
      if (selectedCity.name) {
        city = selectedCity.name + ", " + selectedCity.country;
      }
      let company = selectedCompany;
      let title = selectedTitle;

      let temp = experienceDetail;
      temp = [
        ...experienceDetail,
        {
          ...values,
          location: city,
          company_name: company,
          Ispresent: exPresent,
          title: title,
        },
      ];
      await setExperienceDetail(temp);
      setFresher(false)
      e.isFresher = false
      e.experience = temp;
      setUser(e);
      await ls.set("user", JSON.stringify(e));
      await setExInitialValues({
        title: null,
        employment_type: "",
        company_name: null,
        location: null,
        start_date: null,
        end_date: null,
        industry: null,
        description: null,
      });
      setSelectedCompany(null);
      setSelectedTitle(null);
      setSelectedCity(null);
      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }
  };
  const updateLanguage = async (values) => {
    if (!lserror) {
      let e = JSON.parse(await getStorage("user"));
      if (edit !== null) {
        const temp = [...languageSkills];
        temp[edit] = { ...values };
        await setLanguageSkills(temp);
        e.language = temp;
        setUser(e);
        await ls.set("user", JSON.stringify(e));
        await setEdit(null);
        resetBtn?.current?.click();
        setLangMessage("Please click on Save Language button to save language details")
        return;
      }

      let temp = languageSkills;
      temp = languageSkills
        ? [...languageSkills, { ...values }]
        : [{ ...values }];
      await setLanguageSkills(temp);

      e.language = temp;
      setUser(e);
      await ls.set("user", JSON.stringify(e));
      await setLsInitialValues({
        name: null,
        read: null,
        write: null,
        speak: null,
      });
      resetBtn?.current?.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
      setLangMessage("Please click on Save Language button to save language details")
    }
  };

  const updateAssociation = async (values) => {
    if (!aserror) {
      let e = JSON.parse(await getStorage("user"));
      if (edit !== null) {
        const temp = [...associateDetail];
        let company = selectedCompany;
        let title = selectedTitle;

        temp[edit] = {
          ...values,
          location: selectedCity,
          company_name: company,
          Ispresent: asPresent,
          title: title,
        };
        await setAssociateDetail(temp);
        e.associate = temp;
        setUser(e);
        await ls.set("user", JSON.stringify(e));
        await setEdit(null);
        setSelectedTitle(null);

        resetBtn.current.click();
        return;
      }
      let company = selectedCompany;
      let title = selectedTitle;

      let temp = associateDetail;
      temp
        ? (temp = [
          ...associateDetail,
          {
            ...values,
            location: selectedCity,
            company_name: company,
            Ispresent: asPresent,
            title: title,
          },
        ])
        : (temp = [
          {
            ...values,
            location: selectedCity,
            company_name: company,
            Ispresent: asPresent,
            title: title,
          },
        ]);
      await setAssociateDetail(temp);
      e.associate = temp;
      setUser(e);
      await ls.set("user", JSON.stringify(e));
      await setAsInitialValues({
        title: null,

        company_name: null,
        location: null,
        start_date: null,
        end_date: null,
        industry: null,
        description: null,
      });
      setSelectedCompany(null);
      setSelectedTitle(null);

      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

  };

  const save = async (values) => {
    let wait = 0;
    if (values.firstName) {
      if (EmailOTP === null && ContactOTP === null)
        wait = await SendOTPFunction(values);
      if (wait !== 0) return;
      if (EmailOTP && ContactOTP) {
        if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
          setError("Invalid Email OTP and Contact OTP");
          return;
        }
      }

      if (EmailOTP && values.emailOTP !== EmailOTP) {
        setError("Invalid Email OTP");
        return;
      }

      if (ContactOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Contact OTP");
        return;
      }
      let city = selectedAddCity;
      let e = user;
      if (selectedAddCity.name) {
        city = selectedAddCity.name;
        e.city = city;
        setUser(e);
      }
      setFirstname(values.firstName);
      setLastname(values.lastName);
      if (values.country) {
        e.country = values.country;
        setUser(e);
      }
      // values.city = selectedAddCity;
      values.city = values.city;
      user.username = values.username;
      user.firstName = values.firstName;
      user.lastname = values.lastName;
      user.houseNo = values.houseNo;
      user.street = values.street;
      user.linkedinurl = values.linkedinurl;
      if (values.linkedinurl) {
        let getpsyky = await getpsykey(values.linkedinurl);
        user.linkedinurlkey = getpsyky.data;
        user.city =values.selectedAddCity;
        user.country = values.country;
        user.state = values.state;
        user.zip = values.zip;
        user.contact = values.contact;
        user.secondaryContacts = secContact;
        user.secondaryEmails = secEmail;
        user.resume = resume;
        setUser(user);
        ls.set("user", JSON.stringify(user));
        swal({
          icon: "success",
          title: "EditProfile",
          text: "Details Saved",
          button: "Continue",
        });
      } else {
        swal({
          icon: "error",
          title: "Enter Linkedin URL to Continue",
          button: "Ok",
        });
      }
    }
  };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({ email: values.email });
      if (emailValidate.data.email === true) {
        setError("Email Already Registered");
        return 1;
      }
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      let contactValidate = await validateSignupDetails({
        contact: values.contact,
      });
      if (contactValidate.data.contact === true) {
        setError("Contact Already Registered");
        return 1;
      }
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    return wait;
  };

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getStorage("user"));
      let p = JSON.parse(await getStorage("prof"));
      let pr = JSON.parse(await getStorage("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr) pr = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }

        await setRolesProf(pr);
        await setShowRoles(Array.from(roles));
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

  // Update User language Skills
  const updateUserLanguage = async (values) => {
    let data = {
      language: languageSkills,
    }

    let res = await updateUserLanguageDetails(
      { user_id: user._id, updates: { data } },
      { access_token: access_token }
    );
    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      await ls.set("user", JSON.stringify(res.data.user));
      await ls.remove("prof");
      await ls.remove("RolesProf");
      await ls.remove("resumeInfo");
    } else {
    }
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Updated Succesfully",
        button: "Continue",
      }).then(() => {
        // window.location.href = "/user/profile";
        window.location.href = `/${user.user_type}/profile`;
      });

  }

  // Update education
  const updateEduDetails = async (ed) =>{
    let data = {
      education : educationalDetail
    }
    let res = await updateUserDetails(
      { user_id: user._id, updates: { data } },
      { access_token: access_token }
    );
    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      await ls.set("user", JSON.stringify(res.data.user));
      await ls.remove("prof");
      await ls.remove("RolesProf");
      await ls.remove("resumeInfo");
    } else {
    }
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Updated Succesfully",
        button: "Continue",
      }).then(() => {
        // window.location.href = "/user/profile";
        window.location.href = `/${user.user_type}/profile`;
      });
  }
  // Update expereince
  const updateExDetails = async (ed) =>{
    let data = {
      experience : experienceDetail
    }
    let res = await updateUserDetails(
      { user_id: user._id, updates: { data } },
      { access_token: access_token }
    );
    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      await ls.set("user", JSON.stringify(res.data.user));
      await ls.remove("prof");
      await ls.remove("RolesProf");
      await ls.remove("resumeInfo");
    } else {
    }
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Updated Succesfully",
        button: "Continue",
      }).then(() => {
        // window.location.href = "/user/profile";
        window.location.href = `/${user.user_type}/profile`;
      });
  }
  const update = async (ed) => {

    console.log("123" , ed)

    let fieldErrors = {}



    // First Name
    if(!ed?.firstName || ed?.firstName === undefined){
      fieldErrors.firstName = "First name is required"
    }
    else if(!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(ed?.firstName)){
      
      fieldErrors.firstName = "Only alphabets and spaces are allowed or limit exeeds"
    }

    // Last Name
    if(!ed?.lastname || ed?.lastname === undefined){
      
      fieldErrors.lastName = "Last name is required"

    }
    else if(!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(ed?.lastname)){
      
      fieldErrors.lastName = "Only alphabets and spaces are allowed or limit exeeds"

    }

    // Linkedin Url
    if(!ed?.linkedinurl || ed?.linkedinurl === undefined){
      fieldErrors.linkedin = "Linkedin Url is required"
    }
    else if(!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{1,100}\/?$/.test(ed?.linkedinurl)){
      fieldErrors.linkedin = "Invalid Linkedin url"
    }

    // House Number
    if(!ed?.houseNo || ed?.houseNo === undefined){

    }
    else if(!/^[a-zA-Z0-9][a-zA-Z0-9 ]{0,10}$/.test(ed?.houseNo)){
      fieldErrors.houseNo = "Only alphanumeric characters and spaces are allowed  or limit exeeds"

    }

    // Street
    if(!ed?.street || ed?.street === undefined){

    }
    else if(!/^[a-zA-Z0-9][(\w+\s?)]{0,20}$/.test(ed?.street)){
      fieldErrors.street = "Only alphanumeric characters and spaces are allowed or limit exeeds"

    }

    // City
    if(!ed?.city || ed?.city === undefined){
      fieldErrors.city = "City is required"

    }
    else if(/^\s/.test(ed?.city)){
      fieldErrors.city = "City name cannot start with space"
    }
    // else if(!/^[a-zA-Z][(\w+\s?)]+$/.test(ed?.city)){
    //   setCityError("Only alphabets are allowed")
    //   return
    // }

    // We want regex such that symbols , numbers  are not allowed

    else if(!/^[a-zA-Z][(\w+\s?)][a-zA-Z ]{0,49}$/.test(ed?.city)){
      fieldErrors.city = "Only alphabets are allowed"
    }
    // State
    if(!ed?.state || ed?.state === undefined){

    }
    else if(!/^[a-zA-Z][(\w+\s?)]+$/.test(ed?.state)){
      fieldErrors.state = "Only alphabets are allowed"

    }

    // Country
    if(!ed?.country || ed?.country === undefined){
      fieldErrors.country = "Country is required"

    }
    else if(!/^[a-zA-Z][a-zA-Z (),.'"-]{0,50}$/.test(ed?.country)){
      fieldErrors.country = "Only alphabets are allowed  or limit exeeds"

    }
    else if(ed?.country === "select"){
      fieldErrors.country = "Please select a valid country"
    }

    // Zip Code
    if(!ed?.zip || ed?.zip === undefined){

    }
    else if(!/^[1-9][0-9]{5,8}$/.test(ed?.zip)){
      fieldErrors.zip = "Only numbers are allowed or not a correct zip"

    }

    // Secondary Email
    if(!secEmail[0] || secEmail[0] === undefined || secEmail[0] === ""){

    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(secEmail[0])){
      fieldErrors.secondaryEmail = "Invalid Email Address"

    }

    // Secondary Contact
    if(!secContact[0] || secContact[0] === undefined || secContact[0] === ""){

    }
    else if(!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(secContact[0])){
      fieldErrors.secondaryContacts = "Invalid Contact Number"

    }

     if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(fieldErrors); // Set field-specific errors object
        return;
    }

    if (!ed.firstName || !ed.lastname || !ed.linkedinurl) {
      setInputField({...inputField,
        firstName: ed.firstName,
        lastname: ed.lastname,
        linkedinurl : ed.linkedinurl
//         city: ed.city,
//         state: ed.state,
//         country: ed.country,
//         email: ed.email,
//         contact: ed.contact
      })
      return;
    }
    let skills = [];
    // ed.city = selectedAddCity;
    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });
    let skillData;
    if (skills) {
      skillData = skills;
    } else {
      skillData = user.tools;
    }
    // let city = selectedAddCity;
      let e = user;
      if (selectedAddCity.name) {
        // city = selectedAddCity.name;
        // e.city = city;
        setUser(e);
      }
    let data = {
      firstName: ed.firstName,
      lastname: ed.lastname,
      houseNo: ed.houseNo,
      street: ed.street,
      city: ed.city,
      country: ed.country,
      state: ed.state,
      zip: ed.zip,
      linkedinurl: ed.linkedinurl,
      linkedinurlkey: ed.linkedinurlkey,
      // experience: experienceDetail,
      // isFresher : fresher,
      isFresher : experienceDetail.length > 0 ? false : true,
      username: ed.username,
      associate: associateDetail,
      // education: educationalDetail,
      // language: languageSkills,
      // tools: skillData,
      secondaryContacts: secContact,
      secondaryEmails: secEmail,
      resume: resume ? resume : user?.resume,
      // skills : skills
    };
    // console.log("data",data);
    if (EmailOTP) {
      data.email = ed.email;
    }
    if (ContactOTP) {
      data.contact = ed.contact;
    }
    if (ed.secondaryEmails) {
      data.secondaryEmails = secEmail;
    }
    if (ed.secondaryContacts) {
      data.secondaryContacts = secContact;
    }
    // if(firstNameError  || lastNameError  || secEmailError || secContactError || cityError  || stateError  || streetError || hNoError || countryError || zipError ){
    //   setErrors("Please fill all the fields correctly")
    //   return;
    // }
    
      let res = await updateUserDetails(
        { user_id: user._id, updates: { data } },
        { access_token: access_token }
      );


      if (res.data.Error) {
        if (res.data.contact) {
          setError(res.data.Error);
          return;
        }
        if (res.data.email) {
          setError(res.data.Error);
          return;
        }
      } else if (res) {
        await ls.set("user", JSON.stringify(res.data.user));
        await ls.remove("prof");
        await ls.remove("RolesProf");
        await ls.remove("resumeInfo");
      } else {
      }
        swal({
          icon: "success",
          title: "EditProfile",
          text: "Details Updated Succesfully",
          button: "Continue",
        }).then(() => {
          // window.location.href = "/user/profile";
          window.location.href = `/${user.user_type}/profile`;
        });

  };


  return (
    <div className="Tabs w-full mt-3">
      <div className="tabList flex w-full">
        <div
          className={`tabHead ${index === 0 && "active"}`}
          onClick={() => {
            setIndex(0);
          }}
        >
          <p className="lg:visible hidden content">Contact</p>
          <p className="icons hidden">
            <AiOutlineHome />
          </p>
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
          <p className="lg:visible hidden content">Education</p>
          <p className="icons hidden">
            <IoSchoolOutline />
          </p>
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
          <p className="lg:visible hidden content">Experience</p>
          <p className="icons hidden">
            <CgWorkAlt />
          </p>
        </div>

        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
          <p className="md:visible hidden content">Skills</p>
          <p className="icons hidden">
            <AiOutlineUnorderedList />
          </p>
        </div>
      </div>
      <div className="tabContent px-7 bg-white  w-full p-5" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: `${user.firstName} `,
              lastname: `${user.lastname}`,
              email: user.email ? user.email : " ",
              contact: user.contact
                ? [
                  user.googleId,
                  user.microsoftId,
                  user.linkedInId,
                  user.username,
                  user.githubId,
                ].includes(user.contact)
                  ? " "
                  : user.contact
                : " ",
              emailOTP: "",
              contactOTP: "",
              houseNo: user.houseNo,
              street: user.street,
              linkedinurl: user.linkedinurl,
              city: user.city,
              country: user.country,
              state: user.state,
              zip: user.zip,
              secondaryEmails: secEmail ? secEmail : "",
              secondaryContacts: secContact ? secContact : "",
            }}
            onSubmit={(values) => save(values)}
            validate={async (values) => {
              setInputField({...inputField,
                firstName: values.firstName,
                lastname: values.lastname,
                city: values.city,
                state: values.state,
                country: values.country,
                email: values.email,
                contact: values.contact,
                linkedinurl : values.linkedinurl
              })
              const errors = {};
              if (values.username !== user.username) {
                let check = await validateSignupDetails({
                  username: values.username,
                });
                if (check.data.username) {
                  errors.username = "Username already exists";
                }
              }
              if (!values.firstName) {
                errors.firstName = "Required";
              } else if (!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values.firstName)) {
                errors.firstName = 'Only alphabets and spaces are allowed or limit exeeds';
              }
              if(values.lastname != undefined) {
                if (!values.lastname) {
                  errors.lastname = "Required";
                } else if (!/^[a-zA-Z][a-zA-Z ]{0,19}$/.test(values.lastname)) {
                  errors.lastname = 'Only alphabets and spaces are allowed or limit exeeds';
                }
              }
              if (!values.lastname) {
                errors.lastname = "Required";
              } else if (!/^[a-zA-Z][a-zA-Z ]{0,49}$/.test(values.lastname)) {
                errors.lastname = 'Only alphabets and spaces are allowed or limit exeeds';
              }

              if (!values.houseNo) {
                errors.houseNo = "Required";
              } else if (!/^[a-zA-Z0-9][a-zA-Z0-9 ]{0,10}$/.test(values.houseNo)) {
                errors.houseNo = 'Only alphanumeric characters and spaces are allowed  or limit exeeds';
              }

              if (!values.street) {
                errors.street = "Required";
              } else if (!/^[a-zA-Z0-9][(\w+\s?)]{0,20}$/.test(values.street)) {
                errors.street = 'Only alphanumeric characters are allowed  or limit exeeds';
              }

              // if (!selectedAddCity) {
              //   errors.city = "Required";
              // } else if (/^\s/.test(selectedAddCity)) {
              //   errors.city =
              //     "First alphabets must not be space";
              // }
              if(values.city != undefined) {
                if (!values.city) {
                  errors.city = "Required";
                } else if (values.city == undefined) {
                  errors.city = "Required";
                } else if (/^\s/.test(values.city)) {
                  errors.city =
                    "First alphabets must not be space";
                }
              }
              if(values.state != undefined) {
                if (!values.state) {
                  errors.state = "Required";
                } else if (/^\s/.test(values.state)) {
                  errors.state =
                    "First alphabets must not be space";
                } else if (!/^[a-zA-Z][(\w+\s?)]+$/.test(values.state)) {
                  errors.state = "must be alphabets";
                }
              }
              if(values.country != country) {
                if (!values.country) {
                  errors.country = "Country Required";
                } else if (!/^[a-zA-Z][a-zA-Z (),.'"-]{0,50}$/.test(values.country)) {
                  errors.country = 'Only alphabets are allowed  or limit exeeds';
                }
              }
              if (!values.zip) {
                errors.zip = "Zip Required";
              } else if (!/^[1-9][0-9]{0,8}$/.test(values.zip)) {
                errors.zip = 'Only numbers are allowed  or limit exeeds';
              }

              if (!values.email) {
                errors.email = "Email Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid Email Address";
              }

              if(values.linkedinurl != undefined) {
                if (!values.linkedinurl) {
                  errors.linkedin = "***Required"
                }
              }

              if(values.contact != undefined) {
                if (!values.contact) {
                  errors.contact = "*Contact Required";
                } else if (
                  !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                    values.contact
                  )
                ) {
                  errors.contact = "Invalid Contact Number";
                }
              }
              return errors;
            }}
          >
            {({ values }) => (
              <Form>

                <div className="flex flex-wrap mt-2 w-full gap-y-5">

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold md:w-1/5 mx-2">
                      First Name
                      <span className = "text-red-600 text-sm w-full text-left mr-auto"> <b> * </b> </span>
                    </label>
                    <div className="w-full">
                      <Field
                        type="text"
                        name="firstName"
                        style={{
                          borderRadius: "5px",
                        }}
                        className={fieldErrors?.firstName ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                        required
                      />
                       {inputField.firstName === undefined ? (
                         <p className="text-red-600 text-sm w-full text-left mr-auto">
                           *Required
                         </p>
                       ) : (
                         fieldErrors?.firstName !== "" ? (
                            <div className="text-red-600 text-sm w-full text-left mr-auto">
                              {fieldErrors?.firstName}
                            </div>
                      ) : ("")
                      )}
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold md:w-1/5 mx-2">
                      Last Name
                      <span className = "text-red-600 text-sm w-full text-left mr-auto"> <b> * </b> </span>
                    </label>
                    <div className="w-full">
                      <Field
                        type="text"
                        name="lastname"
                        style={{
                          borderRadius: "5px",
                        }}
                        className={fieldErrors?.lastName ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                        required
                      />
                      {inputField.lastname == undefined ? (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          *Required
                        </p>
                      ) : (
                       fieldErrors?.lastName ? (
                          <div className="text-red-600 text-sm w-full text-left mr-auto">
                            {fieldErrors?.lastName}
                          </div>
                        ) : ("")
                      )}
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold  md:w-1/5 mx-2">
                      Linkedin Profile
                      <span className = "text-red-600 text-sm w-full text-left mr-auto"> <b> * </b> </span>
                    </label>
                    <div className="w-full">
                      <div className="flex">
                        <div className="w-full pr-2">
                          <Field
                            // disabled={user.linkedinurl}
                            type="text"
                            name="linkedinurl"
                            id="LIurl"
                            // required

                            placeholder="Example:- https://linkedin.com/in/vanity_name"
                            style={{
                              borderRadius: "5px",
                            }}
                            className={fieldErrors?.linkedin ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                          // validate={value => !value && "Required!!!!!!"}
                          />
                          {/* {validationMessage && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              {validationMessage}
                            </p>
                          )} */}
                          {
                            fieldErrors?.linkedin ? (
                              <p className="text-red-600 text-sm w-full text-left mr-auto">
                              {fieldErrors?.linkedin}
                            </p>
                            ) : ("")
                          }
                        </div>
                        {/* <div>
                          {user && !user.linkedInId ? (
                            <div className="w-full flex items-center ">
                              <a href="#" onClick={async () => {
                                let liurl = document.getElementById("LIurl").value;
                                if (liurl != "") {
                                  let getLI = await getOtherLI(liurl);
                                  if (getLI.data.message === "Profile Not Found") {
                                    let setpauth = await setprofileauth(user._id);
                                    if (setpauth.status === 200) {
                                      document.getElementById("authenticatelinkedin").click();
                                    }
                                  } else {
                                    swal({
                                      icon: "error",
                                      title: "This LinkedIn Profile is already connected to another User Account",
                                      button: "Ok"
                                    });
                                  }
                                } else {
                                  swal({
                                    icon: "error",
                                    title: "Please enter your linkedin URL to Authenticate",
                                    button: "Ok"
                                  });
                                }
                              }}>
                                <div
                                  className="flex rounded-lg shadow-md px-8 py-2"
                                  style={{ backgroundColor: "#034488" }}
                                >
                                  <p
                                    className="text-sm py-1"
                                    style={{ color: "#fff" }}
                                  >
                                    <BsLinkedin />
                                  </p>

                                  <p className="text-white font-semibold text-sm mx-2">
                                    Authenticate
                                  </p>
                                </div>
                              </a>
                              <a href={`${url}/auth/linkedin`} id="authenticatelinkedin" className="hidden">
                                <div
                                  className="flex rounded-lg shadow-md px-8 py-2"
                                  style={{ backgroundColor: "#034488" }}
                                >
                                  <p
                                    className="text-sm py-1"
                                    style={{ color: "#fff" }}
                                  >
                                    <BsLinkedin />
                                  </p>

                                  <p className="text-white font-semibold text-sm mx-2">
                                    Authenticate
                                  </p>
                                </div>
                              </a>
                            </div>
                          ) : (
                            <p className="w-full flex items-center text-green-600 font-semibold">
                              Connected
                            </p>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold  md:w-1/5 mx-2">
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
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.houseNo ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.houseNo}
                              required
                            />
                            {fieldErrors?.houseNo ? (
                              <div className="text-red-600 text-sm w-full text-left mr-auto">
                                {fieldErrors?.houseNo}
                                </div>
                            ) : ("")}
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
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.street ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.street}
                              required
                            />
                            {
                              fieldErrors?.street ? (
                                <div className="text-red-600 text-sm w-full text-left mr-auto">
                                  {fieldErrors?.street}
                                </div>
                              ) : ("")
                            }
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
                            <span className = "text-red-600 text-sm w-full text-left mr-auto"> <b> * </b></span>
                          </label>
                          <div className="">

                            {/* <p>Current Location: {values.city ? `${values.city}` : ""}</p>
                            <Combobox
                              value={selectedAddCity}
                              onChange={setSelectedAddCity}
                            >
                              <Combobox.Input
                                onChange={(event) => {
                                  setAddQuery(event.target.value);
                                }}
                                className="border-[0.5px] rounded-lg w-full  border-gray-200 focus:outline-0 focus:border-0 px-4 py-2"
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
                                      .replace("à", "a")}`}
                                  >
                                    {({ active, selected }) => (
                                      <li
                                        className={`${active
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
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.city ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.city}
                              required
                            />
                            {inputField.city == undefined ? (
                              // <p className="text-red-600 text-sm w-full text-left mr-auto">
                              //   Required
                              // </p>
                              ""
                            ) : (
                              fieldErrors?.city ? (
                                <div className="text-red-600 text-sm w-full text-left mr-auto">
                                  {fieldErrors?.city}
                                </div>
                              ) : ("")
                            )}



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
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.state ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.state}
                              required
                            />

                            {inputField.state == undefined ? (
                              // <p className="text-red-600 text-sm w-full text-left mr-auto">
                              //   Required
                              // </p>
                              ""
                            ) : (
                              fieldErrors?.state ? (
                                <div className="text-red-600 text-sm w-full text-left mr-auto">
                                  {fieldErrors?.state}
                                </div>
                              ) : ("")
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 md:mx-0  align-middle">
                          <label className="font-semibold text-md py-2">
                            Country
                            <span className = "text-red-600 text-sm w-full text-left mr-auto"> <b> * </b> </span>
                          </label>
                          <div className="">
                            <Field
                              component="select"
                              id="country"
                              name="country"
                              style={{
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.country ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.country}
                              multiple={false}
                              required
                            >
                              <option value="select">Select</option>

                              {country &&
                                country.map((item) => {
                                  return (
                                    <option value={item.name}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                            </Field>
                            {inputField.country == undefined 
                            // ||  inputField.country == 'select'
                             ? (
                              <p className="text-red-600 text-sm w-full text-left mr-auto">
                                *Required
                              </p>
                            ) : (
                              fieldErrors?.country ? (
                                <div className="text-red-600 text-sm w-full text-left mr-auto">
                                  {fieldErrors?.country}
                                </div>
                              ) : ("")
                            )}
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
                                borderRadius: "5px",
                              }}
                              className={fieldErrors?.zip ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}
                              value={values.zip}
                              required
                            />

                            {fieldErrors?.zip ? (
                              <div className="text-red-600 text-sm w-full text-left mr-auto">
                                {fieldErrors?.zip}
                                </div>) : ("")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold md:w-1/5 mx-2">
                      Email
                    </label>
                    <div className="w-full">
                      <Field
                        name="email"
                        type="text"
                        disabled
                        style={{
                          borderRadius: "5px",
                        }}
                        className="block border-gray-200 py-2 w-full"
                        required
                      />
                      {inputField.email == undefined ? (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          *Required
                        </p>
                      ) : (
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      )}
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold md:w-1/5 mx-2">
                      Contact
                    </label>
                    <div className="w-full">
                      <Field
                        name="contact"
                        type="text"
                        disabled
                        style={{
                          borderRadius: "5px",
                        }}
                        className="block border-gray-200 py-2 w-full"
                        required
                      />
                      {inputField.contact == undefined ? (
                        <p className="text-red-600 text-sm w-full text-left mr-auto">
                          *Required
                        </p>
                      ) : (
                        <ErrorMessage
                          name="contact"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      )}
                    </div>
                  </div>
                  {EmailOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}

                  <div
                    className={`md:mx-2 my-1 sm:mx-0  md:flex w-full space-y-1 ${secEmail?.length > 0 ? "visible" : "hidden"
                      }`}
                  >
                    <label className="font-semibold md:w-1/5 mx-2">
                      Secondary Emails
                    </label>
                    <div className="w-full flex flex-col">
                      <input
                        key={index}
                        value={secEmail}
                        type="text"
                        onChange={(e) => {
                          const newValues = [...secEmail];
                          newValues[index] = e.target.value;
                          setSecEmail([newValues[index]]);
                          // setSecEmail(newValues)
                        }}
                        style={{
                          borderRadius: "5px",
                        }}
                        className={fieldErrors?.secondaryEmail ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}

                      />
                      {secEmail &&
                        secEmail.map((item, index) => {
                          return (
                            <div
                              className="w-full flex items-center"
                              style={{ borderRadius: "12px" }}
                            >
                              {/* <input
                                key={index}
                                value={item}
                                type="text"
                                onChange={(e) => {
                                  const newValues = [...secEmail];
                                  newValues[index] = e.target.value;
                                  setSecEmail([newValues[index]])
                                  // setSecEmail(newValues)
                                }}
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                  borderRadius: "5px",
                                }}
                                className="block border-gray-200 py-2 w-full"

                              /> */}
                              <div className="relative flex items-center">
                                <p className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3">
                                  {/* <AiOutlineDelete
                                    onClick={async () => {
                                      setSecEmail(
                                        secEmail.filter(
                                          (item, i) => i !== index
                                        )
                                      );
                                      let res = JSON.parse(
                                        await getStorage("user")
                                      );
                                      res.secondaryEmails = secEmail.filter(
                                        (item, i) => i !== index
                                      );
                                      setUser(res);
                                      ls.set(
                                        "user",
                                        JSON.stringify(res)
                                      );
                                    }}
                                    className="text-xl"
                                  /> */}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {fieldErrors?.secondaryEmail ? (
                          <div className="text-red-600 text-sm w-full text-left mr-auto flex flex-col">
                          {fieldErrors?.secondaryEmail}
                          </div>
                        ) : ("")}
                    </div>
                  </div>
                  <div
                    className={`md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1 ${secContact?.length > 0 ? "visible" : "hidden"
                      }`}
                  >
                    <label className="font-semibold md:w-1/5 mx-2">
                      Secondary Contacts
                    </label>
                    <div className=" w-full flex flex-col">
                      <input
                        key={index}
                        value={secContact}
                        type="text"
                        onChange={(e) => {
                          const newValues = [...secEmail];
                          newValues[index] = e.target.value;
                          setSecContact(newValues)
                          // setSecEmail(newValues)
                        }}
                        style={{
                          borderRadius: "5px",
                        }}
                        className={fieldErrors?.secondaryContacts ? ("block border-red-600 py-2 w-full ") : ("block border-gray-300 py-2 w-full")}

                      />
                      {secContact &&
                        secContact.map((item, index) => {
                          return (
                            <div
                              className="w-full flex items-center"
                              style={{ borderRadius: "12px" }}
                            >
                              {/* <input
                                value={item}
                                type="text"
                                onChange={(e) => {
                                  const newValues = [...secContact];
                                  newValues[index] = e.target.value;
                                  setSecContact(newValues)
                                }}
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                  borderRadius: "5px",
                                }}
                                className="block border-gray-200 py-2 w-full"
                              /> */}
                              <div className="relative flex items-center">
                                <p className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3">
                                  {/* <AiOutlineDelete
                                    onClick={async () => {
                                      setSecContact(
                                        secContact.filter(
                                          (item, i) => i !== index
                                        )
                                      );
                                      let res = JSON.parse(
                                        await getStorage("user")
                                      );
                                      res.secondaryContacts = secContact.filter(
                                        (item, i) => i !== index
                                      );
                                      setUser(res);
                                      ls.set(
                                        "user",
                                        JSON.stringify(res)
                                      );
                                    }}
                                    className="text-xl"
                                  /> */}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      {
                        fieldErrors?.secondaryContacts ? (
                        <div className="text-red-600 text-sm w-full text-left mr-auto">
                          {fieldErrors?.secondaryContacts}
                        </div>
                        ) : ("")
                      }
                    </div>
                  </div>
                </div>
                <h2 className = "text-red-600 text-sm w-full text-left mr-auto flex justify-center">The field marked <b> * </b>  are mandatory fields.</h2>
                <div className="w-full text-center">

                  <a href={prevPath}>
                    <button
                      className="bg-gray-100 px-4 mx-2 py-2 text-black rounded-lg my-5"
                      type="button"
                    >
                      Back
                    </button>
                  </a>

                  {/* <button
                    type="button"
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#228276" }}
                    onClick={() => {

                      if (!values.linkedinurl) {
                        setValidationMessage("Required")
                      } else if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{1,100}\/?$/.test(values.linkedinurl)) {
                        setValidationMessage("Invalid linkedin url")
                      }
                      if (values.linkedinurl && /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{1,100}\/?$/.test(values.linkedinurl)) {
                        setValidationMessage(null)
                      }
                      if (validationMessage == null) {
                        update(values);
                      }
                    }}
                  >
                    Save Details
                  </button> */}
                  <button
                    type="button"
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#228276" }}
                    onClick={() => {
                      // if (!values.linkedinurl) {
                      //   setValidationMessage("Required");
                      // } else if (
                      //   !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]{1,100}\/?$/.test(
                      //     values.linkedinurl
                      //   )
                      // ) {
                      //   setValidationMessage("Invalid LinkedIn URL");
                      // } else {
                      //   setValidationMessage(null);
                      //   update(values);
                      // }
                      update(values)
                    }}
                  >
                    Submit Contact
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent px-7 bg-white p-5" hidden={index != 1}>
        {/* {console.log('education -------->',educationalDetail ? educationalDetail : 'no education')} */}
        {user !== null &&
          user !== undefined &&
          educationalDetail.map((item, index) => {
            return (
              <div
                className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 w-full "
                key={index}
              >
                <div className="flex justify-end space-x-3 items-center">

                </div>
                <p className="font-semibold text-md md:w-2/5 ">{item.school}</p>
                <div className="grid grid-cols-1 md:gap-2 gap-0 lg:grid-cols-4 align-items-right">
                  <div className="space-x-2 my-2 flex items-center ">
                    <FiInfo />
                    <p >{item.degree}</p> <p>|</p>
                    <p>{item.field_of_study}</p>

                  </div>

                  {item.grade != "" ? (
                    <div className="space-x-2 my-2 flex items-center ">
                      <GrScorecard /> <p>{item.grade}</p>
                    </div>
                  ) : (
                    <div className="space-x-2 my-2 flex items-center ">
                      <GrScorecard /> <p>0</p>
                    </div>
                  )}
                  <div className="space-x-2 my-2 flex items-center ">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} -{" "}
                      {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="space-x-2 my-2 flex items-center ">

                    <ModeEditOutlineOutlinedIcon
                      className="hover:text-blue-600 cursor-pointer"
                      onClick={() => handleClick(index, item, cities)} />

                    <div className="text-xl mx-5 px-7 py-2">
                      <AiOutlineDelete
                        className="text-red-600 cursor-pointer"
                        onClick={async () => {
                          setEducationalDetail(
                            educationalDetail.filter((item, i) => i !== index)
                          );
                          let res = JSON.parse(
                            await getStorage("user")
                          );
                          res.education = educationalDetail.filter(
                            (item, i) => i !== index
                          );
                          setUser(res);
                          ls.set("user", JSON.stringify(res));
                        }}
                      />
                    </div>
                  </div>

                  {item.description && (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-2/5 ">Description :</p>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        <div className="flex mx-auto justify-center text-center">
          <button
            className=" py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
            style={{ backgroundColor: "#228276" }}

            onClick={async () => {
              await setShowError(true);

              await setEduInitialValues({
                school: null,
                degree: null,
                field_of_study: null,
                start_date: null,
                end_date: null,
                grade: null,
                description: null,
                present: false,
              });
              await setShowEduForm(true);
            }}
          >
            Add Education
          </button>

          <button
            className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
            style={{ backgroundColor: "#228276" }}
            disabled={educationalDetail.length ==0}
            // onClick={() => update(user)}
            onClick={() => updateEduDetails(user)}
          >
            Submit Education
          </button>
          {educationalDetail.length == 0 && (
            <p style={{color:"red"}} className="py-2 px-8 my-5">*Education Required</p>
          )}
        </div>
        {showEduForm && (
          <Transition
            appear
            show={showEduForm}
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
                    <Dialog.Panel className="w-full  my-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                      <div className={`${!showEduForm ? "hidden" : "block"}`}>
                        <Formik
                          initialValues={eduinitialValues}
                          validate={(values) => {
                            if (showEduForm === false) return {};
                            const errors = {};
                            if (!values?.school || values?.school === null || values?.school === undefined || values?.school === "") {
                              errors.school = "*school Required";
                            } else if (values?.school.length > 50) {
                              errors.school = "*Must be 50 characters or less";
                            } else if (values?.school[0] === "") {
                              errors.school = "*Cannot start with a space";
                            } else {
                              errors.school = "";
                            }
                            if (
                              values.degree === null ||
                              values.degree.trim() === ""
                            ) {
                              errors.degree = "*Degree Required";
                            } else if (/^\s/.test(values.degree)) {
                              errors.degree =
                                "First alphabets must not be space";
                            } else if (values.degree.length > 50) {
                              errors.degree = "Must be 50 charcter or less"
                            }
                            if (
                              values.field_of_study === null ||
                              values.field_of_study.trim() === ""
                            ) {
                              errors.field_of_study = "*Field of study Required";
                            } else if (values.field_of_study.length > 50) {
                              errors.field_of_study = "*Must be 50 characters or less";
                            } else if (/^\s/.test(values.field_of_study)) {
                              errors.field_of_study =
                                "First alphabets must not be space";
                            } else if (!/^[a-zA-Z][a-zA-Z&\(\)\[\]\-_/\\ ]{1,20}(\s[a-zA-Z&\(\)\[\]\-_/\\ ]{1,20})?$/
                              .test(values.field_of_study)) {
                              errors.field_of_study = 'must be alphabets or limit exeed';
                            } else {
                              errors.field_of_study = "";
                            }
                            if (!present && !values.end_date) {
                              errors.end_date = "*End date Required";
                            }

                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "*Start date cannot be greater than today's date";
                            } else if (!values.start_date) {
                              errors.start_date = "*Start date Required";
                            }
                            if (
                              present &&
                              values.start_date > values.end_date
                            ) {
                              errors.end_date =
                                "*End date cannot be less than start date";
                            }
                            if (!values.grade) {
                              errors.grade = "*Grade Required";
                            } else if (values.grade.length > 5) {
                              errors.grade = "*Must be 5 characters or less";
                            } else if (values.grade[0] === " ") {
                              errors.grade = "*Cannot start with a space";
                            } else {
                              errors.grade = "";
                            }
                            if (values.start_date > values.end_date) {
                              errors.start_date = 'Start date must be less than end date'
                            }
                            if (!values.description) {
                              errors.description = "*Description Required";
                            } else if (values.description.length > 150) {
                              errors.description = "*Must be 150 characters or less";
                            } else if (values.description[0] === " ") {
                              errors.description = "*Cannot start with a space";
                            } else {
                              errors.description = "";
                            }
                            if (
                              errors.degree ||
                              errors.field_of_study ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.grade ||
                              errors.description ||
                              errors.school
                            ) {
                              setFormError(true);
                            } else {
                              setFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="px-7 p-6">
                                  <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      School{" "}
                                    </label>

                                    <div className="w-full md:w-4/5">

                                      {edit !== null && (
                                        <p>
                                          Current University : {values.school}
                                        </p>
                                      )}
                                      {/* <Combobox
                                        value={selectedSchool}
                                        onChange={setSelectedSchool}
                                      >
                                        <Combobox.Input
                                          onChange={(event) =>
                                            setSchoolQuery(event.target.value)
                                          }
                                          className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                          style={{ borderRadius: "5px" }}
                                        />
                                        <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                          {schoolQuery.length > 0 && (
                                            <Combobox.Option
                                              value={`${schoolQuery}`}
                                              className="cursor-pointer p-2"
                                            >
                                              Create "{schoolQuery}"
                                            </Combobox.Option>
                                          )}
                                          {filteredSchool.map((school) => (
                                            <Combobox.Option
                                              key={school.name}
                                              value={`${school.name}`}
                                              className="cursor-pointer"
                                            >
                                              {({ active, selected }) => (
                                                <li
                                                  className={`${active
                                                    ? "bg-blue-500 text-white p-2"
                                                    : "bg-white text-black p-2"
                                                    }`}
                                                >
                                                  {school.name}
                                                </li>
                                              )}
                                            </Combobox.Option>
                                          ))}
                                        </Combobox.Options>
                                      </Combobox> */}
                                      <Field 
                                        name="school"
                                        type="text"
                                        placeholder="Enter Your school or college"
                                        className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.school}
                                      />
                                      <ErrorMessage
                                        name="school"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Degree{" "}
                                    </label>

                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="degree"
                                        type="text"
                                        placeholder="Ex. Bachelor's"
                                        className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.degree}
                                      />
                                      <ErrorMessage
                                        name="degree"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Field{" "}
                                    </label>

                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="field_of_study"
                                        type="text"
                                        placeholder="Ex. Business"
                                        className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.field_of_study}
                                      />
                                      <ErrorMessage
                                        name="field_of_study"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">

                                    <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                      Study Period{" "}
                                    </label>

                                    <div
                                      className="md:w-4/5 md:flex flex-col w-full"
                                      style={{ justifyContent: "space-between" }}
                                    >
                                      <div className=" my-1  md:flex align-middle">
                                        <label className="font-semibold text-md md:ml-0 ml-2">
                                          Start From
                                        </label>

                                        <div className="">
                                          <Field
                                            name="start_date"
                                            type="month"
                                            maxDate={new Date().toString()}
                                            className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                            style={{
                                              borderRadius: "4px",
                                              border: "0.5px solid",
                                            }}
                                            value={values.start_date}
                                          />
                                          <ErrorMessage
                                            name="start_date"
                                            component="div"
                                            className="text-sm text-red-600"
                                          />
                                        </div>
                                      </div>

                                      <div className=" my-1  md:flex align-middle">
                                        <label className="font-semibold text-md ml-2">
                                          End At
                                        </label>
                                        <div>
                                          {!present && (
                                            <div className="">
                                              <Field
                                                name="end_date"
                                                type="month"
                                                className="block border-gray-400 py-2 border-[0.5px] w-full border-[#6b7280]"
                                                style={{
                                                  borderRadius: "4px",
                                                  border: "0.5px solid",
                                                }}
                                                value={values.end_date}
                                              />

                                              <ErrorMessage
                                                name="end_date"
                                                component="div"
                                                className="text-sm text-red-600"
                                              />
                                            </div>
                                          )}
                                          {values.Ispresent === true ? (
                                          <div className="mx-3">
                                            <input
                                              type="checkbox"
                                              checked
                                              id="myCheck"
                                              onChange={(e) => {
                                                if (e.target.checked == true) {
                                                  setPresent(true);
                                                } else {
                                                  setPresent(false);
                                                }
                                              }}
                                              value={present}
                                            />
                                            <label className="font-semibold text-md ml-2">
                                              Present
                                            </label>
                                          </div>
                                          ) : (
                                          <div className="mx-3">
                                            <input
                                              type="checkbox"
                                              id="myCheck"
                                              onChange={(e) => {
                                                if (e.target.checked == true) {
                                                  setPresent(true);
                                                } else {
                                                  setPresent(false);
                                                }
                                              }}
                                              value={present}
                                            />
                                            <label className="font-semibold text-md ml-2">
                                              Present
                                            </label>
                                          </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Grade
                                    </label>
                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="grade"
                                        type="text"
                                        className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.grade}
                                      />
                                      <ErrorMessage
                                        name="grade"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Description
                                    </label>

                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="description"
                                        as="textarea"
                                        className="block border-gray-400 py-2 w-full h-20 border-[0.5px] border-[#6b7280] p-2"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.description}
                                      />
                                      <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className=" flex justify-end pt-4 text-center" style={{borderTop: "0.5px solid #E3E3E3"}}>
                                  <div className="flex mr-6">
                                    <button
                                      type="button"
                                      className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                      ref={resetBtn}
                                      onClick={async () => {
                                        setPresent(false);
                                        setSelectedCompany(null);
                                        setSelectedSchool(null)
                                        setSelectedTitle(null);
                                        setSelectedCity(null);
                                        await setShowError(false);
                                        await setEdit(null);
                                        await setShowEduForm(false);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        //setPresent(false);
                                        updateEducation(values);
                                      }}
                                      className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                      style={{ backgroundColor: "#228276" }}
                                    >
                                      {edit === null ? "Save Changes " : "Update"}
                                    </button>
                                  </div>
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
      <div className="tabContent px-7 bg-white p-5" hidden={index != 2}>
        <div>
          {user &&
            experienceDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">
                      {item.employment_type}
                    </p>{" "}
                  </div>
                  <div className="grid grid-cols-1 md:gap-2 gap-0 lg:grid-cols-4 align-items-right">
                    <div className="space-x-2 my-2 flex items-center ">
                      <FaRegBuilding />
                      <p>{item.company_name}</p>
                    </div>
                    <div className="space-x-2 my-2 flex items-center">
                      <CgWorkAlt />
                      <p>{item.industry}</p>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.start_date} -{" "}
                        {item.Ispresent ? "Present" : item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ModeEditOutlineOutlinedIcon
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() => handleEdit(index, item)}
                      />
                      <div className="text-xl mx-5 px-7 py-2">
                        <AiOutlineDelete
                          className="text-red-600 cursor-pointer"
                          onClick={async () => {
                            setExperienceDetail(
                              experienceDetail.filter((item, i) => i !== index)
                            );
                            let res = JSON.parse(
                              await getStorage("user")
                            );
                            res.experience = experienceDetail.filter(
                              (item, i) => i !== index
                            );
                            setUser(res);
                            ls.set("user", JSON.stringify(res));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-2/5 ">Description :</p>
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}

          <div className=" flex justify-center text-center">
            <div className = "flex flex-self-center items-center mr-5">
          {
            experienceDetail?.length === 0 ? (
              user?.isFresher === true ? (
                <>
                  <input
                    type="checkbox"
                    id="myCheck"
                    checked 
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setFresher(true);
                      } else {
                        setFresher(false);
                      }
                    }}
                  value={fresher}
                />
              <label className="font-semibold text-md ml-2 flex justify-self-center items-center">
                I am an Entry Level Candidate
              </label>
              </>
              ) : (
              <>
                <input
                  type="checkbox"
                  id="myCheck"
                  onChange={(e) => {
                    if (e.target.checked === true) {
                    setFresher(true);
                  } else {
                    setFresher(false);
                  }
                }}
                value={fresher}
              />
              <label className="font-semibold text-md ml-2">
                I am an Entry Level Candidate
              </label>
            </>
              )
            ) : ("")
          }
            </div>
            <button
              className="  py-2 text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#228276" }}
              onClick={async () => {
                await setShowError(true);
                await setSelectedCity(null);
                await setEdit(null);
                await setExInitialValues({
                  title: null,
                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowExForm(true);
              }}
            >
              Add Experience
            </button>

            <button
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#228276" }}
              disabled={experienceDetail.length === 0 && fresher === false && user?.isFresher === false}
              // onClick={() => update(user)}
              onClick={() => updateExDetails(user)}
            >
              Submit Experience
            </button>
            {experienceDetail.length == 0 && (
              <p style={{color:"red"}} className="py-2 px-8 my-5">*Experience Required</p>
            )}
          </div>
        </div>

        {showExForm && (
          <Transition
            appear
            show={showExForm}
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
                className="fixed inset-0 bg-black/30 z-10000"
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
                <div className="fixed inset-0 bg-black bg-opacity-25 z-10000" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto z-10000">
                <div className="flex min-h-full items-center justify-center z-10000 p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full  my-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                      <div className={`${!showExForm ? "hidden" : "block"}`}>
                        <Formik
                          initialValues={exinitialValues}
                          validate={(values) => {
                            if (showExForm === false) return {};
                            const errors = {};

                            if (!values.employment_type) {
                              errors.employment_type = "*Employment type Required";
                            }
                            if (!values.industry) {
                              errors.industry = "*industry Required";
                            } else if (!/^[a-zA-Z ]{1,150}$/.test(values.industry)) {
                              errors.industry = "*Only letters and spaces allowed";
                            }
                            if (!selectedCompany || selectedCompany === " ") {
                              errors.company_name = "Required";
                            } else if (selectedCompany.length > 50) {
                              errors.company_name = "Company should be less than 50 characters"
                            }

                            if (!selectedTitle || selectedTitle === " ") {
                              errors.title = "Required";
                            } else if (selectedTitle.length > 0 && selectedTitle.length > 40) {
                              errors.title = "Title should be less than 40 characters"
                            }
                            if (!selectedCity || selectedCity === " ") {
                              errors.location = "*City Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "*Start date Required !";
                            }
                            if (!exPresent && values.end_date === null) {
                              errors.end_date = "*End date Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (
                              !exPresent &&
                              values.start_date > values.end_date
                            ) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }
                            if (exPresent && values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (!values.description) {
                              errors.description = "*Description Required";
                            } else if (values.description.length > 150) {
                              errors.description = "*Must be 150 characters or less";
                            } else if (values.description[0] === " ") {
                              errors.description = "*Cannot start with a space";
                            } else if (!/^[a-zA-Z0-9.,\s]{1,150}$/.test(values.description)) {
                              errors.description = "*Only letters, numbers, and spaces allowed";
                            } else {
                              errors.description = "";
                            }

                            if (!values.industry || values.industry == " ") {
                              errors.industry = "Required"
                            } else if (values.industry.length > 15) {
                              errors.industry = "Industry should be less than 15 characters"
                            }

                            if (!selectedCity || selectedCity == " ") {
                              errors.location = "Requried"
                            } else if (selectedCity.length > 40) {
                              errors.location = "Location should be lessthan 40 characters"
                            }

                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location ||
                              errors.industry ||
                              errors.description
                            ) {
                              setExFormError(true);
                            } else {
                              setExFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="px-7 p-6">
                                  <div className="md:w-4/5  md:flex w-full  space-y-1 mb-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Title{" "}
                                    </label>
                                    <div className="w-full md:w-4/5">

                                      {edit !== null && (
                                        <p>Current Job : {`${values.title}`}</p>
                                      )}

                                      <Combobox
                                        value={selectedTitle}
                                        onChange={setSelectedTitle}
                                      >
                                        <Combobox.Input
                                          onChange={(event) =>
                                            setTitleQuery(event.target.value)
                                          }
                                          className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                          style={{ borderRadius: "5px" }}
                                        />
                                        <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                          {TitleQuery.length > 0 && (
                                            <Combobox.Option
                                              className="p-2"
                                              value={`${TitleQuery}`}
                                            >
                                              Create "{TitleQuery}"
                                            </Combobox.Option>
                                          )}
                                          {filteredTitle.map((title) => (
                                            <Combobox.Option
                                              key={title.name}
                                              value={`${title.name}`}
                                            >
                                              {({ active, selected }) => (
                                                <li
                                                  className={`${active
                                                    ? "bg-blue-500 text-white p-2"
                                                    : "bg-white text-black p-2"
                                                    }`}
                                                >
                                                  {title.name}
                                                </li>
                                              )}
                                            </Combobox.Option>
                                          ))}
                                        </Combobox.Options>
                                      </Combobox>
                                      <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full md:w-4/5  md:flex   space-y-1 my-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Employment Type{" "}
                                    </label>

                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="employment_type"
                                        as="select"
                                        required
                                        className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{ borderRadius: "4px" }}
                                      >
                                        <option value="">Please Select</option>
                                        <option value="Full Time">
                                          Full Time
                                        </option>
                                        <option value="Part Time">
                                          Part Time
                                        </option>
                                        <option value="Self Employed">
                                          Self Employed
                                        </option>
                                        <option value="Internship">
                                          Internship
                                        </option>
                                        <option value="Free Lancer">
                                          Free Lancer
                                        </option>
                                      </Field>
                                      <ErrorMessage
                                        name="employment_type"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className=" md:w-4/5  md:flex w-full  space-y-1 my-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Company{" "}
                                    </label>

                                    <div className="w-full md:w-4/5">

                                      {edit !== null && (
                                        <p>
                                          Current Company : {values.company_name}
                                        </p>
                                      )}
                                      <Combobox

                                        value={selectedCompany}
                                        onChange={setSelectedCompany}
                                      >
                                        <Combobox.Input

                                          onChange={(event) =>
                                            setCompanyQuery(event.target.value)
                                          }
                                          className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                          style={{ borderRadius: "5px" }}
                                          name="company_name"
                                        />
                                        <Combobox.Options
                                          className="absolute z-100 bg-white rounded-lg shadow-md overflow-y-auto"
                                          style={{
                                            borderRadius: "5px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          {companyQuery.length > 0 && (
                                            <Combobox.Option
                                              value={`${companyQuery}`}
                                              className="cursor-pointer p-2"
                                              onClick={async () => {
                                                let res = await checkCompany({
                                                  name: companyQuery,
                                                });
                                              }}
                                            >
                                              Create "{companyQuery}"
                                            </Combobox.Option>
                                          )}
                                          {filteredCompany.map((company) => (
                                            <Combobox.Option
                                              key={company.name}
                                              value={`${company.name}`}
                                              className="cursor-pointer "
                                            >
                                              {({ active, selected }) => (
                                                <li
                                                  className={`${active
                                                    ? "bg-blue-500 text-white p-2"
                                                    : "bg-white text-black p-2"
                                                    }`}
                                                >
                                                  {company.name}
                                                </li>
                                              )}
                                            </Combobox.Option>
                                          ))}
                                        </Combobox.Options>
                                      </Combobox>
                                      <ErrorMessage
                                        name="company_name"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-4/5  md:flex w-full  space-y-1 my-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Location{" "}
                                    </label>
                                    <div className="w-full md:w-4/5">
                                      {edit !== null && (
                                        <p>
                                          Current Location :{" "}
                                          {`${values.location}`}
                                        </p>
                                      )}
                                      <Combobox
                                        value={selectedCity}
                                        onChange={setSelectedCity}
                                      >
                                        <Combobox.Input
                                          onChange={(event) =>
                                            setQuery(event.target.value)
                                          }
                                          className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                          style={{ borderRadius: "5px" }}
                                        />
                                        <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                          {query.length > 0 && (
                                            <Combobox.Option
                                              className="p-2"
                                              value={`${query}`}
                                            >
                                              Create "{query}"
                                            </Combobox.Option>
                                          )}
                                          {filteredCity.map((city) => (
                                            <Combobox.Option
                                              key={city.name}
                                              value={`${city.name
                                                .replace("ā", "a")
                                                .replace("ò", "o")
                                                .replace("à", "a")}, ${city.country
                                                }`}
                                            >
                                              {({ active, selected }) => (
                                                <li
                                                  className={`${active
                                                    ? "bg-blue-500 text-white p-2"
                                                    : "bg-white text-black p-2"
                                                    }`}
                                                >
                                                  {city.name
                                                    .replace("ā", "a")
                                                    .replace("ò", "o")
                                                    .replace("à", "a")}
                                                  , {city.country}
                                                </li>
                                              )}
                                            </Combobox.Option>
                                          ))}
                                        </Combobox.Options>
                                      </Combobox>
                                      <ErrorMessage
                                        name="location"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="md:w-4/5  md:flex w-full  space-y-1 my-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                      Work Period{" "}
                                    </label>

                                    <div
                                      className="md:w-4/5 md:flex flex-col w-full"
                                      style={{ justifyContent: "space-between" }}
                                    >
                                      <div className=" my-1  md:flex align-middle">
                                        <label className="font-semibold text-md md:ml-0 py-2 w-2/5">
                                          Start From
                                        </label>
                                        <div className="md:w-4/5">
                                          <Field
                                            name="start_date"
                                            type="month"
                                            className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                            style={{
                                              borderRadius: "4px",
                                              border: "0.5px solid",
                                            }}
                                            value={values.start_date}
                                          />
                                          <ErrorMessage
                                            name="start_date"
                                            component="div"
                                            className="text-sm text-red-600"
                                          />
                                        </div>
                                      </div>

                                      <div className=" my-1  md:flex align-middle">
                                        <label className="font-semibold text-md py-2 w-2/5">
                                          End At
                                        </label>
                                        <div className="md:w-4/5">
                                          {!exPresent && (
                                            <div className="">
                                              <Field
                                                name="end_date"
                                                type="month"
                                                className="block border-gray-400 py-2 border-[0.5px] w-full border-[#6b7280]"
                                                style={{
                                                  borderRadius: "4px",
                                                  border: "0.5px solid",
                                                }}
                                                value={values.end_date}
                                              />

                                              <ErrorMessage
                                                name="end_date"
                                                component="div"
                                                className="text-sm text-red-600"
                                              />
                                            </div>
                                          )}
                                          <div className="mx-3 my-2">
                                            {edit !== null && values.Ispresent ? (
                                              <>
                                                <input
                                                  type="checkbox"
                                                  checked
                                                  id="myCheck"
                                                  onChange={(e) => {

                                                    if (e.target.checked == true) {
                                                      setExPresent(true);
                                                    } else {
                                                      setExPresent(false);
                                                    }
                                                  }}
                                                  value={exPresent}
                                                />
                                                <label className="font-semibold text-md ml-2 py-2">
                                                  Present
                                                </label>
                                              </>
                                            ) : (
                                              <>
                                                <input
                                                  type="checkbox"
                                                  id="myCheck"
                                                  onChange={(e) => {

                                                    if (e.target.checked == true) {
                                                      setExPresent(true);
                                                    } else {
                                                      setExPresent(false);
                                                    }
                                                  }}
                                                  value={exPresent}
                                                />
                                                <label className="font-semibold text-md ml-2 py-2">
                                                  Present
                                                </label>
                                              </>
                                            )}

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="  md:flex w-full md:w-4/5  space-y-1 my-3">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Industry{" "}
                                    </label>
                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="industry"
                                        type="text"
                                        className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                        style={{ borderRadius: "4px" }}
                                        value={values.industry}
                                      />
                                      <ErrorMessage
                                        name="industry"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full md:w-4/5  md:flex   space-y-1 ">
                                    <label className="font-semibold text-lg w-2/5 mx-2">
                                      Description
                                    </label>
                                    <div className="w-full md:w-4/5">
                                      <Field
                                        name="description"
                                        as="textarea"
                                        className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                        style={{
                                          borderRadius: "4px",
                                          border: "0.5px solid",
                                        }}
                                        value={values.description}
                                      />
                                      <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                                  <div className=" flex justify-end text-center pt-4" style={{borderTop: "0.5px solid #E3E3E3"}}>
                                    <div className="flex mr-6">
                                      <button
                                        type="button"
                                        className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                        ref={resetBtn}
                                        onClick={async () => {
                                          setExPresent(false);
                                          setSelectedTitle(null)
                                          setSelectedCompany(null)
                                          await setShowError(false);
                                          await setEdit(null);
                                          await setSelectedCity(cities[0]);
                                          await setShowExForm(false);
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          // setExPresent(false);
                                          updateExperience(values);
                                        }}
                                        className="text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                        style={{ backgroundColor: "#228276" }}
                                      >
                                        {edit === null ? "Save Changes " : "Update"}
                                      </button>
                                     </div>
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
      <div className="tabContent px-7 bg-white p-5" hidden={index != 3}>
        <div>
          {user &&
            associateDetail &&
            associateDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">

                  </div>
                  <div className="font-semibold my-1 flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">{item.location}</p>{" "}
                  </div>
                  <div className="grid grid-cols-1 md:gap-2 gap-1 lg:grid-cols-4 align-items-right">
                    <div className="space-x-2 flex items-center">
                      <FaRegBuilding />
                      <p>{item.company_name}</p>
                    </div>

                    <div className="space-x-2 flex items-center">
                      <CgWorkAlt />
                      <p>{item.industry}</p>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.start_date} -{" "}
                        {item.Ispresent ? "Present" : item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">

                      <ModeEditOutlineOutlinedIcon
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() => handleEditCompany(index, item)}
                      />
                      <div className="text-xl mx-5 px-7 py-2">
                        <AiOutlineDelete
                          className="text-red-600 cursor-pointer"
                          onClick={async () => {
                            setAssociateDetail(
                              associateDetail.filter((item, i) => i !== index)
                            );
                            let res = JSON.parse(
                              await getStorage("user")
                            );
                            res.associate = associateDetail.filter(
                              (item, i) => i !== index
                            );
                            setUser(res);
                            ls.set("user", JSON.stringify(res));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <div className="py-2">{item.description}</div>
                  )}
                </div>
              );
            })}

          <div className="flex mx-auto justify-center text-center">
            <button
              className="py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={async () => {
                await setShowError(true);
                await setSelectedCity(null);
                await setEdit(null);
                await setAsInitialValues({
                  title: null,

                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowAsForm(true);
              }}
            >
              Add Association
            </button>

            <button
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={() => update(user)}
            >
              Submit
            </button>
          </div>
        </div>

        {showAsForm && (
          <Transition
            appear
            show={showAsForm}
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
                      <div className={`${!showAsForm ? "hidden" : "block"}`}>
                        <Formik
                          initialValues={asinitialValues}
                          validate={(values) => {
                            if (showAsForm === false) return {};
                            const errors = {};
                            if (!values.title) {
                              errors.title = "Title Required";
                            }
                            if (!selectedTitle || selectedTitle === " ") {
                              errors.title = "*Title Required";
                            }

                            if (!selectedCompany || selectedCompany === " ") {
                              errors.company_name = "*company Required";
                            }
                            if (!selectedCity || selectedCity === " ") {
                              errors.location = "*City Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "*Start Required !";
                            }
                            if (!asPresent && values.end_date === null) {
                              errors.end_date = "*End Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (
                              !asPresent &&
                              values.start_date > values.end_date
                            ) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }

                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location
                            ) {
                              setAsFormError(true);
                            } else {
                              setAsFormError(false);
                            }
                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Title{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">

                                    {edit !== null && (
                                      <p>Current Job : {`${values.title}`}</p>
                                    )}

                                    <Combobox
                                      value={selectedTitle}
                                      onChange={setSelectedTitle}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setTitleQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {TitleQuery.length > 0 && (
                                          <Combobox.Option
                                            className="p-2"
                                            value={`${TitleQuery}`}
                                          >
                                            Create "{TitleQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredTitle.map((title) => (
                                          <Combobox.Option
                                            key={title.name}
                                            value={`${title.name}`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active
                                                  ? "bg-blue-500 text-white p-2"
                                                  : "bg-white text-black p-2"
                                                  }`}
                                              >
                                                {title.name}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>

                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Company{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">

                                    {edit !== null && (
                                      <p>
                                        Current Company : {values.company_name}
                                      </p>
                                    )}
                                    <Combobox
                                      value={selectedCompany}
                                      onChange={setSelectedCompany}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setCompanyQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options
                                        className="absolute z-100 bg-white rounded-lg shadow-md overflow-y-auto"
                                        style={{
                                          borderRadius: "5px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        {companyQuery.length > 0 && (
                                          <Combobox.Option
                                            value={`${companyQuery}`}
                                            className="cursor-pointer p-2"
                                            onClick={async () => {
                                              let res = await checkCompany({
                                                name: companyQuery,
                                              });
                                            }}
                                          >
                                            Create "{companyQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCompany.map((company) => (
                                          <Combobox.Option
                                            key={company.name}
                                            value={`${company.name}`}
                                            className="cursor-pointer "
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active
                                                  ? "bg-blue-500 text-white p-2"
                                                  : "bg-white text-black p-2"
                                                  }`}
                                              >
                                                {company.name}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5 md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Location{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {edit !== null && (
                                      <p>
                                        Current Location :{" "}
                                        {`${values.location}`}
                                      </p>
                                    )}

                                    <Combobox
                                      value={selectedCity}
                                      onChange={setSelectedCity}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 w-full focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute bg-white rounded-lg shadow-md">
                                        {query.length > 0 && (
                                          <Combobox.Option
                                            className="p-2"
                                            value={`${query}`}
                                          >
                                            Create "{query}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCity.map((city) => (
                                          <Combobox.Option
                                            key={city.name}
                                            value={`${city.name
                                              .replace("ā", "a")
                                              .replace("ò", "o")
                                              .replace("à", "a")}, ${city.country
                                              }`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active
                                                  ? "bg-blue-500 text-white p-2"
                                                  : "bg-white text-black p-2"
                                                  }`}
                                              >
                                                {city.name
                                                  .replace("ā", "a")
                                                  .replace("ò", "o")
                                                  .replace("à", "a")}
                                                , {city.country}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="location"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>

                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div>
                                        {!asPresent && (
                                          <div className="">
                                            <Field
                                              name="end_date"
                                              type="month"
                                              className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                              style={{
                                                borderRadius: "4px",
                                                border: "0.5px solid",
                                              }}
                                              value={values.end_date}
                                            />

                                            <ErrorMessage
                                              name="end_date"
                                              component="div"
                                              className="text-sm text-red-600"
                                            />
                                          </div>
                                        )}

                                        <div className="mx-3 my-2">
                                          <input
                                            type="checkbox"
                                            id="myCheck"
                                            onChange={(e) => {
                                              if (e.target.checked == true) {
                                                setAsPresent(true);
                                              } else {
                                                setAsPresent(false);
                                              }
                                            }}
                                            value={asPresent}
                                          />
                                          <label className="font-semibold text-md ml-2 py-2">
                                            Present
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Industry{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="industry"
                                      type="text"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.industry}
                                    />
                                    <ErrorMessage
                                      name="industry"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      as="textarea"
                                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.description}
                                    />

                                    <ErrorMessage
                                      name="description"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="flex px-5 w-full justify-center text-center">
                                  <button
                                    onClick={() => {
                                      setAsPresent(false);

                                      updateAssociation(values);
                                    }}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      await setAsPresent(false);
                                      setSelectedCompany(null);
                                      setSelectedTitle(null);
                                      setSelectedCity(null);
                                      await setShowError(false);
                                      await setShowAsForm(false);
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

      <div className="tabContent px-7 bg-white p-5" hidden={index !== 4}>
        {user !== null && user !== undefined && (
          <Skill/>
        )}
        <div>
          {rolesC && rolesC.length == 0 && languageSkills.length == 0 && (
            <label className="font-semibold text-lg w-2/5 mx-2">
              No technical skills added
            </label>
          )}
        </div>

        {/* <button
            className="bg-blue-500 mx-auto py-3 px-7 flex justify-center text-white rounded-lg my-5"
            style={{ backgroundColor: "#034488" }}
            // onClick={() => update(user)}
            onClick={()=>updateUserSkill(user)}
          >
            Save Skill
          </button> */}
        
        {/* <div className="p-5">
              {rolesC
                ? rolesC.map((item, index) => {
                  return (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-1/2  md:flex w-full  space-y-2 my-5">
                        {item}
                      </p>
                      {skillsPrimary[item].map((el) => (
                        <div className="py-1">
                          <p className="text-sm my-2">{el}</p>
                          <div className="md:flex ">
                            {user.tools
                              .filter(
                                (tool) =>
                                  tool.role === item &&
                                  tool.primarySkill === el
                              )
                              .map((item1, index) => (
                                <p className="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800 ">
                                  {item1.secondarySkill}{" "}
                                  {item1.proficiency &&
                                    `(${item1.proficiency})`}
                                </p>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
                : "No Skills"}
            </div> */}
        <div>
          <label className="font-semibold text-lg w-3/4 mx-2">
            Language Skills
          </label>
          <div className="my-3 px-4 flex items-center flex-wrap">
            {showLsForm && (
              <Transition
                appear
                show={showLsForm}
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
                            className={`${!showLsForm ? "hidden" : "block"}`}
                          >
                            <Formik
                              initialValues={lsinitialValues}
                              validate={(values) => {
                                if (showLsForm === false) return {};
                                const errors = {};
                                if (!values.name) {
                                  errors.name = "*Name Required";
                                }

                                return errors;
                              }}
                            >
                              {({ values }) => {
                                return (
                                  <Form className="w-full py-4">
                                    <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                                      <label className="font-bold text-lg md:w-2/5 mx-5 mt-2">
                                        Name{" "}
                                      </label>
                                      <Field
                                        component="select"
                                        id="name"
                                        name="name"
                                        style={{
                                          boxShadow:
                                            "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                          borderRadius: "5px",
                                          height: "40px",
                                        }}
                                        className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
                                        value={values.name}
                                        multiple={false}
                                        defaultValue={language && language.length > 0 ? language[0].name : ''}
                                      >
                                        {language &&
                                          language.map((item) => {
                                            return (
                                              <option value={item.name}>
                                                {item.name}
                                              </option>
                                            );
                                          })}
                                      </Field>
                                      <div>
                                        <ErrorMessage
                                          name="name"
                                          component="div"
                                          className="text-sm my-2 text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        boxShadow:
                                          "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                        borderRadius: "5px",
                                        height: "60px",
                                      }}
                                      className="border-gray-200 flex my-5"
                                    >
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="read"
                                          className="my-1 "
                                          style={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                            borderRadius: "5px",
                                          }}
                                          onClick={() => {
                                            // let temp = permissions;
                                            // temp[index].value = !temp[index].value;
                                            // setPermissions(temp);
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Read
                                        </label>
                                      </div>
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="write"
                                          className="my-1 "
                                          style={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                            borderRadius: "5px",
                                          }}
                                          onClick={() => {
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Write
                                        </label>
                                      </div>
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="speak"
                                          className="my-1"
                                          style={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                            borderRadius: "5px",
                                          }}
                                          onClick={() => {
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Speak
                                        </label>
                                      </div>
                                    </div>
                                     {
                                        rwpError ? (
                                          <div className="text-red-600 text-sm w-full text-left mr-auto">
                                            {rwpError}
                                          </div>
                                        ) : ("")
                                      }
                                    <div className="flex px-5 w-full justify-center text-center">
                                      <button
                                        disabled = {values?.name === null && values?.speak === null && values?.read === null && values?.write === null}
                                        onClick={() => {
                                          if((values?.speak === null && values?.read === null && values?.write === null) || 
                                          (values?.speak === false && values?.read === false && values?.write === false)){
                                            setrwpError("Please choose atleast one")
                                          }
                                          else if((values?.read === false && values?.write === null && values?.speak === null) ||
                                          (values?.read === null && values?.write === false && values?.speak === null) || 
                                          (values?.read === null && values?.write === null && values?.speak === false)){
                                            setrwpError("Please choose atleast one")
                                          }
                                          else{
                                            setrwpError(null)
                                            updateLanguage(values);
                                            setShowLsForm(false);
                                          } 
                                        }}
                                        className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                        style={{ backgroundColor: "#034488" }}
                                      >
                                        {edit === null
                                          ? "Save Changes "
                                          : "Update"}
                                      </button>
                                      <button
                                        type="button"
                                        className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                        ref={resetBtn}
                                        onClick={async () => {
                                          await setrwpError(null)
                                          await setEdit(null);
                                          await setShowError(false);
                                          await setShowLsForm(false);
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
          <div className=" mx-auto justify-center text-center">
            <div className="lg:w-2/3 md:w-full sm:w-full">
              {user &&
                languageSkills &&
                languageSkills.map((item, index) => {
                  return (
                    <div
                      className=" rounded-md py-2 px-4 bg-white border  my-4 h-35"
                      key={index}
                    >
                      <div className="flex justify-end space-x-3 items-center">

                      </div>
                      <div className="font-semibold flex space-x-2 items-center">
                        <p>{item.name}</p>{" "}
                        <p className="font-normal text-sm"></p>{" "}
                      </div>
                      <div className="flex w-full md:gap-2 gap-0 justify-between">
                        <div className="w-auto flex">
                          {item.read ? (
                            <div className=" my-2 flex items-center">
                              <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex ">
                                <AiOutlineRead className="my-auto mx-2" /> Read
                              </p>
                            </div>
                          ) : null}
                          {item.write ? (
                            <div className=" my-2 flex items-center">
                              <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex">
                                <HiPencil className="my-auto mx-2" />
                                Write
                              </p>
                            </div>
                          ) : null}
                          {item.speak ? (
                            <div className="flex items-center my-2">
                              <p className="lg:text-lg md:text-sm sm:text-xs text-sm flex">
                                <IoPeople className="my-auto mx-2" />
                                Speak
                              </p>
                            </div>
                          ) : null}
                        </div>
                        <div className="col-start-5 col-end-7 col-span-2 flex items-center space-x-2 ">
                          <ModeEditOutlineOutlinedIcon
                            className="hover:text-blue-600 cursor-pointer"
                            onClick={() => handleEditForm(index, item)}
                          />
                          <div className="text-xl mx-5 px-7 py-2">
                            <AiOutlineDelete
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDeleteLanguage(index)}
                            />
                          </div>
                        </div>
                      </div>
                      {item.description && (
                        <div className="py-2 w-1/2">{item.description}</div>
                      )}
                    </div>
                  );
                })}
            </div>
            <button
              className="py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={handleAddLanguageSkills}
            >
              Add Language Skills
            </button>
          </div>
        </div>
        <div className="w-full text-center ">
          {
            langMessage ? (
              <div className="text-red-600 text-sm w-full text-left mr-auto">
                {langMessage}
              </div>
            ) : ("")
          }
          <button
            className="bg-blue-500 mx-auto py-3 px-7 text-white rounded-lg my-5"
            style={{ backgroundColor: "#034488" }}
            // onClick={() => update(user)}
            onClick={()=>updateUserLanguage(user)}

          >
            Save language
          </button>
        </div>
      </div>
    </div>
  );
}
export default Tabs;