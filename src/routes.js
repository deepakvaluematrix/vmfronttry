import { ImHome } from "react-icons/im";
import { MdGroups, MdOutlineWorkOutline } from "react-icons/md";
import { RiFileUserFill, RiFolderUserFill } from "react-icons/ri";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUserAdd,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import {
  BsFillChatLeftTextFill,
  BsFillBellFill,
  BsChatRightDots,
} from "react-icons/bs";
import { FaBuilding, FaUserFriends, FaToolbox } from "react-icons/fa";
import { FiGrid, FiMail } from "react-icons/fi";
import { CgWorkAlt } from "react-icons/cg";
import { FaVideo } from "react-icons/fa";
import { BsQuestionCircleFill, BsCameraVideo } from "react-icons/bs";

// User Pages
import Panel from "./Pages/UserDashboard/panel.jsx";
import UserProfile from "./Pages/UserDashboard/UserProfile.jsx";
import EditProfile from "./Pages/UserDashboard/EditProfile.jsx";
import JobList from "./Pages/UserDashboard/jobList.jsx";
import JobDetails from "./Pages/UserDashboard/JobDetail.jsx";
import JobInvitations from "./Pages/UserDashboard/JobInvitations.jsx";
import InterviewApplication from "./Pages/UserDashboard/InterviewApplication.jsx";
import Interviews from "./Pages/UserDashboard/Interviews.jsx";
import InterviewsDetails from "./Pages/UserDashboard/InterviewDetails.jsx";
import Submitfeedback from "./Pages/UserDashboard/Submitfeedback.jsx";
import VmLiteReport from "./Pages/UserDashboard/VmLiteReport.jsx";
import VmLiteProReport from "./Pages/UserDashboard/VmLiteProReport.jsx";

// import AllSlots from "./Pages/UserDashboard/AllSlots.jsx";
import PrintAble from "./Pages/CompanyDashboard/PrintAble.jsx";
import PrintAbleUi from "./Pages/UserDashboard/PrintAbleUi.jsx";

// Admin Pages
import NotificationPanel from "./Pages/AdminDashboard/Notification.jsx";
import EmailNotification from "./Pages/AdminDashboard/EmailNotification.jsx";
import PushNotification from "./Pages/AdminDashboard/PushNotifications.jsx";
import APanel from "./Pages/AdminDashboard/panel.jsx";
import WhatsappNotification from "./Pages/AdminDashboard/WhatsappNotification.jsx";
import ChannelNotificationPanel from "./Pages/AdminDashboard/ChannelNotification.jsx";
import XIPerformance from "./Pages/AdminDashboard/XIPerformance.jsx";
import XILevel from "./Pages/AdminDashboard/XILevel.jsx";
import XIPanel from "./Pages/AdminDashboard/XIPanel.jsx";
import AllJobs from "./Pages/AdminDashboard/AllJobs.jsx";
import InterviewList from "./Pages/AdminDashboard/Interviews.jsx";
import CPrintableAdmin from "./Pages/AdminDashboard/Cprintable.jsx";
// Company Pages
import CJobList from "./Pages/CompanyDashboard/jobList.jsx";
import CPendingJobList from "./Pages/CompanyDashboard/pendingJobs.jsx";
import CPanel from "./Pages/CompanyDashboard/panel.jsx";
import CEvalDetails from "./Pages/CompanyDashboard/evaluationDetails.jsx";

import AddJob from "./Pages/CompanyDashboard/AddJob.jsx";
// import AddJob from "./Pages/CompanyDashboard/PostJob.jsx";
import UpdateJob from "./Pages/CompanyDashboard/UpdateJob1.jsx";
// import UpdateJob from "./Pages/CompanyDashboard/UpdateJob.jsx";
import EditCompanyProfile from "./Pages/CompanyDashboard/EditProfile.jsx";
import CompanyProfile from "./Pages/CompanyDashboard/Profile.jsx";
import CJobDetails from "./Pages/CompanyDashboard/JobDetails.jsx";
import CJobBinDetails from "./Pages/CompanyDashboard/pendingJobDetails.jsx";
import CompanyList from "./Pages/AdminDashboard/CompanyList.jsx";
import CompanyDetails from "./Pages/AdminDashboard/CompanyDetails.jsx";
import CandiadateList from "./Pages/AdminDashboard/CandidatesList.jsx";
import CandiadateDetail from "./Pages/AdminDashboard/CandidateDetail.jsx";

import AddCompanyUser from "./Pages/CompanyDashboard/AddCompanyUser.jsx";
import CandidateList from "./Pages/CompanyDashboard/CandidateList.jsx";
import CandidateDetails from "./Pages/CompanyDashboard/CandidateDetails.jsx";
import CandidateReport from "./Pages/CompanyDashboard/CandidateReport.jsx";
import Masking from "./Pages/CompanyDashboard/Masking.jsx";
import CompanyUserList from "./Pages/CompanyDashboard/CompanyUsersList.jsx";

import Jobvalidate from "./Pages/AdminDashboard/jobValidate.jsx";
import CompanyValidate from "./Pages/AdminDashboard/companyValidate.jsx";
import TitleValidate from "./Pages/AdminDashboard/TitleValidate.jsx";

import CityValidate from "./Pages/AdminDashboard/companyValidate copy.jsx";

// Admin Pages
import AddSkills from "./Components/AdminDashboard/AddSkills.jsx";
import AddAdminUser from "./Pages/AdminDashboard/AddAdminUser.jsx";
import AddTaxId from "./Pages/AdminDashboard/AddTaxId.jsx";
// import Twilio from "./Pages/AdminDashboard/TwilioVoice";
import XIUsersList from "./Pages/AdminDashboard/XIUsersList.jsx";
import SuperXIUsersList from "./Pages/AdminDashboard/SuperXIUsersList.jsx";
import XICategory from "./Pages/AdminDashboard/XICategory.jsx";
import CreditCategory from "./Pages/AdminDashboard/creditCategory.jsx";
import CreditConverter from "./Pages/AdminDashboard/creditConverter.jsx";

// XI Pages
import XIDashboard from "./Pages/XIDashboard/Dashboard.jsx";
import XIEvaluationList from "./Pages/XIDashboard/EvaluationList.jsx";
import XIInterviewList from "./Pages/XIDashboard/Interviews.jsx";
import XIJobDetails from "./Pages/XIDashboard/JobDetails.jsx";
import XIEvaluatedList from "./Pages/XIDashboard/EvaluatedList.jsx";
import XISlots from "./Pages/XIDashboard/Slots.jsx";
import XIJobInvitations from "./Pages/XIDashboard/JobInvitations.jsx";
import XIJobInterviews from "./Pages/XIDashboard/XIJobInterviews.jsx";
import EvaluatedReport from "./Pages/XIDashboard/EvaluationReports.jsx";

// SuperXIDashboard
import SXIPanel from "./Pages/SuperXIDashboard/panel.jsx";
import SXIUserProfile from "./Pages/SuperXIDashboard/UserProfile.jsx";
import SXIEditProfile from "./Pages/SuperXIDashboard/EditProfile.jsx";
import SXIJobList from "./Pages/SuperXIDashboard/jobList.jsx";
import SXIJobDetails from "./Pages/SuperXIDashboard/JobDetails.jsx";
import AddQuestions from "./Pages/AdminDashboard/AddQuestions.jsx";
import AddInterviewQuestions from "./Pages/AdminDashboard/AddInterviewQuestions.jsx";
import UpdateInterviewApplication from "./Pages/XIDashboard/UpdateInterviewApplication.jsx";

import { FiSettings } from "react-icons/fi";
import CPrintable from "./Pages/CompanyDashboard/CPrintable.jsx";
import InterviewReport from "./Pages/UserDashboard/InterviewReport.jsx";
import XIOnboarding from "./Pages/AdminDashboard/XIList.jsx";
import AdminUserProfile from "./Pages/AdminDashboard/AdminUserProfile.jsx";
import AllTranscation from "./Pages/UserDashboard/AllTranscation.jsx";
import AdminAllTranscation from "./Pages/AdminDashboard/AdminAllTranscation.jsx";
import CompanyAllTranscation from "./Pages/CompanyDashboard/CompanyAllTranscation.jsx";
import XIAllTranscation from "./Pages/XIDashboard/XIAllTranscation.jsx";
import React, { useContext } from "react";
import HorizontalNav from "./Components/Dashbaord/Navbar.js";
import CPrintableXI from "./Pages/XIDashboard/Cprintable.jsx";

const DashboardRoute = () => {
  const { progress } = React.useContext(HorizontalNav.ProgressContext);
  return progress;
};

// User Dashboard Routes
export const dashboardRoutes = [
  {
    name: "CPrintAble",
    path: "/CPrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintable />,
  },
  {
    name: "InterviewReport",
    path: "/InterviewReport",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <InterviewReport />,
  },

  {
    name: "printAble",
    path: "PrintAbleUi",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAbleUi />,
  },
  {
    name: "printAblee",
    path: "PrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAble />,
  },

  {
    name: "Home",
    icon: <AiOutlineHome className="text-xl" />,
    path: "",
    component: <Panel />,
    hide: true,
  },
  {
    name: "Group",
    icon: <RiFolderUserFill className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "profile",
    component: <UserProfile />,
    hide: false,
  },
  {
    name: "VmLiteReport",
    icon: <AiOutlineUser className="text-xl" />,
    path: "vmlitereport",
    component: <VmLiteReport />,
    hide: true,
  },
  {
    name: "VmLiteProReport",
    icon: <AiOutlineUser className="text-xl" />,
    path: "vmliteproreport",
    component: <VmLiteProReport />,
    hide: true,
  },
  {
    name: "Jobs",
    icon: <CgWorkAlt className="text-xl" />,
    path: "jobs",
    component: <JobList />,
    hide: true,
  },
  {
    name: "Chat",
    icon: <BsChatRightDots className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Edit Profile",
    path: "editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    name: "getJobById",
    path: "jobDetails",
    hide: true,
    component: <JobDetails />,
  },

  {
    name: "Invitations",
    path: "interviewInvitations",
    hide: false,
    icon: <FiMail className="text-xl" />,
    component: <JobInvitations />,
  },

  {
    name: "Interviews",
    path: "interviews",
    hide: false,
    icon: <BsCameraVideo className="text-xl" />,
    component: <Interviews />,
    permission: "default",
  },

  {
    name: "Interview Applications",
    path: "interviewApplications",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <InterviewApplication />,
  },
  {
    /*
    name: "Transactions",
    icon: <AiOutlineUser className="text-xl" />,
    path: "AllTranscation",
    component: <AllTranscation />,
    hide: false,*/
  },
  {
    name: "InterviewDetails",
    path: "interviewsDetails",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <InterviewsDetails />,
  },
  {
    name: "submitfeedback",
    path: "submitfeedback",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <Submitfeedback />,
  },
];

// Admin Dashboard Routes
export const adminDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <APanel />,
    hide: true,
    permission: "default",
  },

  // {
  //   name: "UserProfile",
  //   path: "/AdminUserProfile",
  //   hide: true,
  //   component: <AdminUserProfile />,
  //   permission: "default",
  // },

  // {
  //   name: "Profile",
  //   icon: <RiFileUserFill className="text-xl" />,
  //   path: "/profile",
  //   component: <UserProfile />,
  //   hide: false,
  //   permission: "default",
  // },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditProfile />,
    permission: "default",
  },
  // {
  //   name: "Notification",
  //   path: "/notification",
  //   hide: false,
  //   icon: <BsFillBellFill className="text-xl" />,
  //   component: <ChannelNotificationPanel />,
  //   permission: "add_notifications",
  // },
  {
    name: "Notification",
    path: "/dashboardNotification",
    hide: true,
    icon: <BsFillBellFill className="text-xl" />,
    component: <NotificationPanel />,
    permission: "add_notifications",
  },
  {
    name: "Email Notifications",
    path: "/emailNotification",
    hide: true,
    component: <EmailNotification />,
    permission: "add_notifications",
  },
  {
    name: "Whatsapp Notifications",
    path: "/whatsappNotification",
    hide: true,
    component: <WhatsappNotification />,
  },
  {
    name: "One Signal Notification",
    path: "/pushNotification",
    hide: true,
    component: <PushNotification />,
    permission: "add_notifications",
  },
  {
    name: "Company List",
    path: "/companies",
    hide: false,
    component: <CompanyList />,
    icon: <FaBuilding className="text-xl" />,
    permission: "list_companies",
  },

  // {
  //   name: "Transactions",
  //   path: "/AdminAllTranscation",
  //   hide: false,
  //   component: <AdminAllTranscation />,
  //   icon: <FaBuilding className="text-xl" />,
  // },
  {
    name: "Company Details",
    path: "/company",
    hide: true,
    component: <CompanyDetails />,
    permission: "list_companies",
  },
  {
    name: "Candidates List",
    path: "/candidates",
    hide: false,
    component: <CandiadateList />,
    icon: <FaUserFriends className="text-xl" />,
    permission: "list_candidates",
  },
  {
    name: "Candidate Details",
    path: "/candidate",
    hide: true,
    component: <CandiadateDetail />,
    permission: "list_candidates",
  },
  {
    name: "Candidate Details",
    path: "/candidate",
    hide: true,
    component: <CandiadateDetail />,
    permission: "list_candidates",
  },
  {
    name: "Job Details",
    path: "/jobvalidate",
    hide: true,
    component: <Jobvalidate />,
    permission: "default",
  },
  {
    name: "All Jobs",
    path: "/alljobs",
    hide: false,
    icon: <FaBuilding className="text-xl" />,
    component: <AllJobs />,
    permission: "default",
  },
  {
    name: "Interviews",
    path: "/interviews",
    hide: false,
    icon: <FaVideo className="text-xl" />,
    component: <InterviewList />,
    permission: "default",
  },
  {
    name: "Xi Users List",
    path: "/xiuserslist",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <XIUsersList />,
    permission: "default",
  },
  // {
  //   name: "Xi Performance",
  //   path: "/XIPerformance",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <XIPerformance />,
  //   permission: "default",
  // },
  // {
  //   name: "Xi Level",
  //   path: "/XILevel",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <XILevel />,
  //   permission: "default",
  // },
  {
    name: "Xi Panel",
    path: "/XIPanel",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <XIPanel />,
    permission: "default",
  },
  // {
  //   name: "Credit Category",
  //   path: "/creditCategory",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <CreditCategory />,
  //   permission: "default",
  // },
  // {
  //   name: "Credit Converter",
  //   path: "/creditConverter",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <CreditConverter />,
  //   permission: "default",
  // },
  // {
  //   name: "SuperXi List",
  //   path: "/superxiuserslist",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <SuperXIUsersList />,
  //   permission: "default",
  // },

  // {
  //   name: "Credit Category",
  //   path: "/creditCategory",
  //   hide: false,
  //   icon: <FaUserFriends className="text-xl" />,
  //   component: <CreditCategory />,
  //   permission: "default",
  // },
  {
    name: "Company Validation",
    path: "/companyValidate",
    hide: true,
    component: <CompanyValidate />,
    permission: "default",
  },
  {
    name: "Company Validation",
    path: "/cityValidate",
    hide: true,
    component: <CityValidate />,
    permission: "default",
  },
  {
    name: "Company Validation",
    path: "/titleValidate",
    hide: true,
    component: <TitleValidate />,
    permission: "default",
  },
  {
    name: "Add Skills",
    path: "/addSkills",
    hide: false,
    component: <AddSkills />,
    icon: <FaToolbox className="text-xl" />,
    permission: "add_skills",
  },
  {
    name: "Add Admin User",
    path: "/addAdminUser",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <AddAdminUser />,
    permission: "add_users",
  },
  {
    name: "XIOnboarding",
    path: "/XIOnboarding",
    hide: false,
    icon: <FaUserFriends className="text-xl" />,
    component: <XIOnboarding />,
    permission: "list_XI",
  },
  // {
  //   name: "Add Job Questions",
  //   path: "/addQuestions",
  //   hide: false,
  //   icon: <BsQuestionCircleFill className="text-xl" />,
  //   permission: "default",
  //   component: <AddQuestions />,
  // },
  {
    name: "Add Interview Questions",
    path: "/addinterviewQuestions",
    hide: false,
    icon: <BsQuestionCircleFill className="text-xl" />,
    permission: "default",
    component: <AddInterviewQuestions />,
  },
  // {
  //   name: "Add Tax Id",
  //   path: "/addtaxid",
  //   hide: false,
  //   icon: <BsQuestionCircleFill className="text-xl" />,
  //   permission: "default",
  //   component: <AddTaxId />,
  // },
  {
    name: "CPrintAble",
    path: "/CPrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintable />,
  },
  {
    name: "InterviewReport",
    path: "/user/InterviewReport/:id",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <InterviewReport />,
  },
  {
    name: "CPrintAble",
    path: "/CPrintAbleAdmin",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintableAdmin />,
  },
  // {
  //   name:"call",
  //   path: "/twilio",
  //   hide:false,
  //   icon : <BsQuestionCircleFill className="text-xl" />,
  //   permission:"default",
  //   component : <Twilio/>
  // },
];

// Company Dashboard Routes
export const companyDashboardRoutes = [
  {
    name: "Home",
    icon: <AiOutlineHome className="text-xl" />,
    path: "/",
    component: <CPanel />,
    hide: true,
    permission: "default",
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "/profile",
    component: <CompanyProfile />,
    hide: false,
    permission: "default",
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditCompanyProfile />,
    permission: "default",
  },
  {
    name: "Add Job",
    path: "/jobsAdd",
    icon: <AiOutlineUserAdd className="text-xl" />,
    hide: true,
    component: <AddJob />,
    permission: "add_jobs",
  },
  {
    name: "Active Jobs",
    path: "/jobs",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <CJobList />,
    permission: "default",
  },
  {
    name: "Pending Job",
    path: "/pendingjobs",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <CPendingJobList />,
    permission: "default",
  },

  {
    name: "Update Job",
    path: "/jobUpdate",
    hide: true,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <UpdateJob />,
    permission: "default",
  },
  {
    name: "getJobById",
    path: "/jobDetails/",
    hide: true,
    component: <CJobDetails />,
    permission: "default",
  },
  {
    name: "getJobBinById",
    path: "/jobBinDetails/",
    hide: true,
    component: <CJobBinDetails />,
    permission: "default",
  },
  {
    name: "candidateEvaluation",
    path: "/evaluationDetails/",
    hide: true,
    component: <CEvalDetails />,
    permission: "default",
  },
  {
    /*name: "Transactions",
    path: "/CompanyAllTranscation",
    hide: false,
    component: <CompanyAllTranscation />,
    icon: <FaBuilding className="text-xl" />,*/
  },
  {
    name: "Reports Details",
    path: "/reportDetails",
    hide: true,
    component: <EvaluatedReport />,
  },
  {
    name: "CPrintAble",
    path: "/CPrintAble",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintable />,
  },
  {
    name: "Add User",
    path: "/addCompanyUser",
    hide: true,
    component: <AddCompanyUser />,
    icon: <AiOutlineFolderAdd className="text-xl" />,
    permission: "add_users",
  },
  {
    name: "Users List",
    path: "/CompanyUserList",
    hide: true,
    component: <CompanyUserList />,
    icon: <AiOutlineFolderAdd className="text-xl" />,
    permission: "add_users",
  },
  // {
  //   name: "Candidates",
  //   path: "/candidateList",
  //   hide: false,
  //   component: <CandidateList />,
  //   icon: <AiOutlineUnorderedList className="text-xl" />,
  //   permission: "default",
  // },
  {
    name: "Setting",
    path: "/masking",
    hide: true,
    component: <Masking />,
    icon: <FiSettings className="text-xl" />,
    permission: "default",
  },
  {
    name: "Candidate Report",
    path: "/candidateReport",
    hide: true,
    component: <CandidateReport />,
    permission: "default",
  },
  {
    name: "VmLiteReport",
    path: "/vmlitereport",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <VmLiteReport />,
  },
];

// XI Routes
export const XIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <XIDashboard />,
    hide: true,
  },
  {
    name: "Profile",
    icon: <AiOutlineUser className="text-xl" />,
    path: "/profile",
    component: <UserProfile />,
    hide: false,
    permission: "default",
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <EditProfile />,
  },
  {
    /*
    name: "Transactions",
    path: "/AllTranscation",
    hide: false,
    component: <XIAllTranscation />,
    icon: <AiOutlineUser className="text-xl" />,*/
  },
  {
    name: "Invitations",
    path: "/interviewInvitations",
    hide: false,
    icon: <FiMail className="text-xl" />,
    component: <XIJobInvitations />,
  },
  {
    name: "Scheduled Interviews",
    path: "/jobinterviews",
    hide: false,
    icon: <CgWorkAlt className="text-xl" />,
    component: <XIJobInterviews />,
  },
  {
    name: "Matched Interviews",
    path: "/evaluationlist",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XIEvaluationList />,
    permission: "default",
  },
  {
    name: "XI Onboarding",
    path: "/xiOnboarding",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XIInterviewList />,
    permission: "default",
  },
  {
    name: "Evaluated Reports",
    path: "/evaluatedlist",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XIEvaluatedList />,
    permission: "default",
  },
  {
    name: "Slots",
    path: "/slots",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XISlots />,
    permission: "default",
  },

  {
    name: "getJobById",
    path: "/jobDetails/",
    hide: true,
    component: <XIJobDetails />,
  },
  {
    name: "Evaluation Details",
    path: "/updateEvaluationDetails",
    hide: true,
    component: <UpdateInterviewApplication />,
  },
  {
    name: "Reports Details",
    path: "/reportDetails",
    hide: true,
    component: <EvaluatedReport />,
  },
  {
    name: "printAbleUi",
    path: "/evaluationreport",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <PrintAbleUi />,
  },
  {
    name: "InterviewDetails",
    path: "/interviewsDetails/",
    hide: true,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <InterviewsDetails />,
  },
  {
    name: "CPrintAble",
    path: "/CPrintAbleXI",
    hide: true,
    icon: <CgWorkAlt className="text-xl" />,
    component: <CPrintableXI />,
  },
];

// SuperXI Routes
export const superXIDashboardRoutes = [
  {
    name: "Home",
    icon: <ImHome className="text-xl" />,
    path: "/",
    component: <SXIPanel />,
    hide: true,
  },
  {
    name: "Group",
    icon: <MdGroups className="text-xl" />,
    path: "/",
    hide: false,
  },
  {
    name: "Profile",
    icon: <RiFileUserFill className="text-xl" />,
    path: "/profile",
    component: <SXIUserProfile />,
    hide: false,
  },
  {
    name: "Chat",
    icon: <BsFillChatLeftTextFill className="text-xl" />,
    path: "/",
    hide: true,
  },
  {
    name: "Edit Profile",
    path: "/editProfile",
    hide: true,
    component: <SXIEditProfile />,
  },
  {
    name: "Jobs",
    path: "jobs",
    hide: false,
    icon: <RiFolderUserFill className="text-xl" />,
    component: <SXIJobList />,
  },
  {
    name: "getJobById",
    path: "/jobDetails",
    hide: true,
    component: <SXIJobDetails />,
  },
  {
    name: "Slots",
    path: "/slots",
    hide: false,
    icon: <MdOutlineWorkOutline className="text-xl" />,
    component: <XISlots />,
  },
];
