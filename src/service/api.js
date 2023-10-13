import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;
export const frontendUrl = process.env.REACT_APP_FRONTEND_URL;
export const flaskurl = process.env.REACT_APP_HEIMDALL_BASELINING_URL;
export const proctoringurl = process.env.REACT_APP_HEIMDALL_URL;
export const psyurl = process.env.REACT_APP_PSY_URL;
export const dyteOrgId = process.env.REACT_APP_DYTE_ORGID;
export const dyteAPIKey = process.env.REACT_APP_DYTE_APIKEY;
export const dyteBase64Auth = process.env.REACT_APP_DYTE_BASE64;

const securedAxiosInstance = createSecureAxiosClient(url);

// User Method API
export const authenticateLogin = async (user) => {
  try {
    return await securedAxiosInstance.post(`/userLogin`, user);
  } catch (error) {
    //console.log("error while calling login API: ", error);
  }
};

// create a user by admin
export const createUserByAdmin = async (user, token) => {
  try {
    return await securedAxiosInstance.post(`/createUserByAdmin`, user);
  } catch (error) {
    return error.response
  }
};

// Get Applicant Psychometrics
export const getPsychDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getPsychDetails`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// User Signup
export const authenticateSignUp = async (user) => {
  try {
    return await securedAxiosInstance.post(`/userSignup`, user);
  } catch (error) {
    //console.log(error.response.data);
    //console.log("Error while calling signup API: ", error);
  }
};

export const handleXIStatusChange = async (user) => {
  try {
    return await securedAxiosInstance.post(`/handleXIStatusChange`, user);
  } catch (error) {
    //console.log(error.response.data);
    //console.log("Error while calling signup API: ", error);
  }
};

// Validate Signup details
export const validateSignupDetails = async (user) => {
  try {
    return await securedAxiosInstance.post(`/validateSignup`, user);
  } catch (error) {
    //console.log("Error Calling Validate Signup API : ", error);
  }
};
// get Country Codes
export const countryCodeList = async () => {
  try {
    return await securedAxiosInstance.get(`/countryCodeList`);
  } catch (error) {
    //console.log("Error Calling Validate Signup API : ", error);
  }
};

// Logout
export const LogoutAPI = async (user_id) => {
  try {
    return securedAxiosInstance.post(`/logout`, { user_id: user_id });
  } catch (error) {
    //console.log("Error Calling Logout API : ", error);
  }
};

// Mail OTP to users
export const OTPMail = async (mail) => {
  try {
    let c = await securedAxiosInstance.post(`/OTPMail`, mail);
    return c.data.otp;
  } catch (error) {
    // console.log("Error while calling OTPMail API: ", error);
  }
};
export const sendForwardedMail = async (mail) => {
  try {
    return await securedAxiosInstance.post(`/sendForwardedMail`, mail);
  } catch (error) {
    //console.log("Error while calling sendForwardedMail API: ", error);
  }
};

// SMS OTP to Users
export const OTPSms = async (mail) => {
  try {
    let c = await securedAxiosInstance.post(`/OTPSms`, mail);
    return c.data.otp;
  } catch (error) {
    //console.log("Error while calling OTPSms API : ", error);
  }
};

// Get Users From Tokem
export const getUserIdFromToken = async (token) => {
  try {
    let c = await securedAxiosInstance.post(`/getUserIdFromToken`, token);
    return c;
  } catch (error) {
    //console.log("Error while calling Getting User From Token: ", error);
  }
};

// Search User From Id
export const getUserFromId = async (data, token) => {
  try {
    let c = await securedAxiosInstance.post(`/getUserFromId`, data);
    return c;
  } catch (error) {
    //console.log("Error while calling SearchUserFromId: ", error);
  }
};
export const getDialerToken = async () => {
  try {
    let c = await securedAxiosInstance.get(`/getDialerToken`);
    return c;
  } catch (error) {
    //console.log("Error while calling SearchUserFromId: ", error);
  }
};
export const getUser = async (data, token) => {
  try {
    let c = await securedAxiosInstance.post(`/getUser`, data);
    return c;
  } catch (error) {
    //console.log("Error while calling SearchUserFromId: ", error);
  }
};

export const getProfileImage = async (data, token) => {
  try {
    let c = await securedAxiosInstance.post(`/getProfileImage`, data);
    return c;
  } catch (error) {
    //console.log("Error while calling GetProfileImageFromId: ", error);
  }
};

// Update User Details
export const getBlockedDate = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getBlockedDate`, {
      id: id,
    });
  } catch (error) {
    //console.log("Error while calling UpdateUserDetails : ", error);
  }
};

// Update User Details
export const updateBlockedDate = async (id, blockeddates) => {
  try {
    return await securedAxiosInstance.post(`/updateBlockedDate`, {
      id: id,
      blockeddates: blockeddates,
    });
  } catch (error) {
    //console.log("Error while calling UpdateUserDetails : ", error);
  }
};

// Update User Details
export const updateUserDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateUserDetails`, data);
  } catch (error) {
    //console.log("Error while calling UpdateUserDetails : ", error);
  }
};

// Update User Language Details
export const updateUserLanguageDetails = async (data , token)=>{
  try{
    console.log("data" , data)
    return await securedAxiosInstance.post(`/updateUserLanguage`, data);
  }
  catch(error){
    //console.log("Error while calling UpdateUserLanguageDetails : ", error);
  }
}
// Update User Skill Details
export const updateUserSkillDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateUserSkills`, data);
  } catch (error) {
    //console.log("Error while calling UpdateUserSkillDetails : ", error);
  }
};

export const updateSkills = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateSkills`, data);
  } catch (error) {
    //console.log("Error while calling updateSkills : ", error);
  }
};

// Admin Login
export const adminLogin = async (user) => {
  try {
    return await securedAxiosInstance.post(`/adminLogin`, user);
  } catch (error) {
    //console.log("error while calling login API: ", error);
  }
};

// Update Email OTP
export const updateEmailOTP = async (mail, token) => {
  try {
    let c = await securedAxiosInstance.post(`/updateEmailOTP`, mail);
    return c.data;
  } catch (error) {
    //console.log("Error while calling OTPMail API: ", error);
  }
};


// Update Contact OTP
export const sendInterviewOTPEmail = async (userId) => {
  try {
    let c = await securedAxiosInstance.post(`/sendInterviewOTPEmail`, userId);
    return c.data;
  } catch (error) {
    //console.log("Error while calling OTPSms API : ", error);
  }
};

// Update Contact OTP
export const updateContactOTP = async (contact, token) => {
  try {
    let c = await securedAxiosInstance.post(`/updateContactOTP`, contact);
    return c.data;
  } catch (error) {
    //console.log("Error while calling OTPSms API : ", error);
  }
};

// Update Contact OTP
export const resendOTP = async (data, token) => {
  try {
    let c = await securedAxiosInstance.post(`/resendOTP`, data);
    return c.data;
  } catch (error) {
  }
};


// Notification API
export const pushNotification = async (noti, token) => {
  try {
    return await securedAxiosInstance.post(`/pushNotification`, noti);
  } catch (error) {
    //console.log("Error Calling Push Notification API : ", error);
  }
};

// Get User Notification
export const getUserNotification = async (user, token) => {
  try {
    return await securedAxiosInstance.post(`/getUserNotification`, {
      user_id: user._id,
      user: user,
    });
  } catch (error) {
    //console.log("Error Calling Get User Notification API : ", error);
  }
};

// Mark Notification As Read
export const markNotiReadForUser = async (data, token) => {
  // console.log("data" , data)
  try {
    return await securedAxiosInstance.post(`/markNotificationRead`, {
      noti_id: data.noti_id,
      user_id: data.user_id,
      isRead : data.isRead
    });
  } catch (error) {
    //console.log("Error Calling Mark Notification Read API : ", error);
  }
};

// Delete Notification
export const deleteNotification = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/deleteNotification`, {
      data: {
        noti_id: data.noti_id,
        user_id: data.user_id,
      },
    });
  } catch (error) {
    //console.log("Error Calling Delete Notification API : ", error);
  }
};

// Send Email Notifications
export const sendEmailNotification = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/sendEmailNotification`, data);
  } catch (error) {
    //console.log(error);
  }
};
// Send Whastapp Notification
export const sendWhatsappNotification = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/sendWhatsappNotification`, data);
  } catch (error) {
    //console.log(error);
  }
};

// send onesignal notification
export const sendOneSignalNotification = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/sendOneSignalNotification`, data);
  } catch (error) {
    //console.log("Error calling One Signal Notification : ", error);
  }
};

// Update Profile Image
export const updateProfileImage = async (data, user, token) => {
  try {
    //console.log(data);
    return await securedAxiosInstance.post(
      `/updateProfilePicture?user=${user}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    // return error;
    //console.log("Error calling Update  : ", error);
  }
};

// Update Profile Image
export const updateBaselining = async (data,token) => {
	try {
		return await securedAxiosInstance.post('/updateBaselining', data, {
			headers: { "Content-Type": "multipart/form-data"},
		});
	} catch (error) {
	}
};

// Post Job
export const postJobAPI = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(`/addJob`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

export const postUpdateJobStatus = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(`/jobStatusChange`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

export const postUpdateCandidateStatus = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(
      `/interviewApplicationstatusChange`,
      data
    );
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

export const postUpdateJobArchive = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(`/archiveJob`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

//update job

export const updateJobAPI = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateJobDetails`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

// List Jobs
export const listJobs = async (data) => {
  try {
    return await securedAxiosInstance.post(`/listJob/${data}`);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

// List Jobs count
export const getJobCount = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getJobCount/${data}`);
  }catch(error){
    console.log('Error : ', error)
  }
}
// List job with pagination
export const listJobwithPagination = async (data,currentPage) => {
  try {
    return await securedAxiosInstance.post(`/listJobwithPagination/${data}?page=${currentPage}`);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

// List jobBin with pagination
export const listBinjobwithPagination = async (data,currentPage) => {
  try {
    return await securedAxiosInstance.post(`/listBinjobwithPagination/${data}?page=${currentPage}`);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

export const listBinJobs = async (data) => {
  try {
    return await securedAxiosInstance.get(`/listBinJob/${data}`);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

export const listJobsUser = async () => {
  try {
    return await securedAxiosInstance.post(`/listJobCandidate`);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

// List Jobs
export const updateJobDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(` ${url}/updateJobDetails`, data);
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

// Sent invitations to the candidate

export const sendJobInvitation = async(jobData,token)=>{
	try {
		console.log('JOB DATA : ', jobData)
		console.log('TOKEN : ', token)
		return await axios.post(`${url}/sendJobInvitation`,jobData,{ headers: { authorization: token } })
	} catch (error) {
		console.log('Error : ', error)
	}
}

// Sent Feedback to the candidate

export const sendFeedbackInvitation = async(id, token) => {
  try {
		return await axios.post(`${url}/sendFeedbackInvitation`,id,{ headers: { authorization: token } })
  } catch (error) {
    console.log('Error :',error)
  }
}

// Get Candidate Feedback


export const getFeedBackInvitation = async(id, token) => {
  try {
    return await axios.post(`${url}/getFeedbackInvitation`,id,{ headers: { authorization: token } })
  } catch (error) {
    console.log('Error :', error)
  }
}
// Get Job Details

export const getJobById = async (id, token) => {
  // console.log("id",id);
  //console.log(token);
  try {
    return await securedAxiosInstance.post(`/getJobFromId`, {
      job_id: id,
    });
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};
export const getJobBinById = async (id, token) => {
  try {
    return await securedAxiosInstance.post(`/getJobBinById`, {
      job_id: id,
    });
  } catch (error) {
    //console.log("Error Calling List Jobs API :", error);
  }
};

// Reset Password Mail
export const sendResetPasswordMail = async (data) => {
  try {
    return await securedAxiosInstance.post(`/sendResetPasswordMail`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Reset Password By SMS
export const sendResetPasswordSMS = async (data) => {
  try {
    return await securedAxiosInstance.post(`/sendResetPasswordSMS`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Reset Password by Username
export const sendResetPasswordByUsername = async (data) => {
  try {
    return await securedAxiosInstance.post(`/sendResetPasswordUsername`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Reset Password
export const resetPassword = async (data) => {
  try {
    return await securedAxiosInstance.post(`/resetPassword`, data);
  } catch (error) {
    //console.log("Error :", error);
  }
};

export const updatePassword = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updatePassword`, data);
  } catch (error) {
    //console.log("Error :", error);
  }
}

// Upload Candidate Resume
export const uploadCandidateResume = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/uploadCandidateResume`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Submit Candidate Details
export const submitCandidateDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/submitCandidateDetails`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Submit Company Details
export const submitCompanyDetails = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/submitCompanyDetails`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get Company List
export const getCompanyList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getCompanyList`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};
// Get XI List
export const getXIList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getXIList`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get XI List
export const getXIUserList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getXIUserList`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};
export const getSuperXIUserList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getSuperXIUserList`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

export const postXIUserLevel = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/postXIUserLevel`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get User List
export const getUserList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getUserList`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get User List
export const getUserListFirstLetter = async (data, letter) => {
  try {
    return await securedAxiosInstance.post(`/getUserListFirstLetter/`+letter, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Download Resume
export const downloadResume = async (data, token) => {
  try {
    return await securedAxiosInstance.post(
      `/downloadResume`,
      data,

      // {
      //   responseType: "blob",
      // }
    );
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Add Company User
export const addCompanyUser = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addCompanyUser`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Add SKils
export const addSkills = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addSkills`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get Skills
export const getSkills = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getSkills`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get Skills
export const getRoles = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getRoles`);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

export const getcognitiveSkills = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getcognitiveSkills`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Add Admin User
export const addAdminUser = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addAdminUser`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Sovren Resume Parser
export const sovrenResumeParser = async (data) => {
  try {
    return await axios.post(
      `https://rest.resumeparsing.com/v10/parser/resume`,
      data,
      {
        headers: {
          "Sovren-AccountId": "58045629",
          "Sovren-ServiceKey": "N6x3TEi+ULpI57PrPkIK23P44F1tfDu6lum+iV3m",
          Accept: "application/json",
          "Content-Type": "application/json",
          // 'Content-Length': Buffer.byteLength(postData)
        },
      }
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Send job invitation to candidate
export const sendInvitation = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/sendInvitation`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Send Job Invitations
export const sendJobInvitations = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/sendJobInvitation`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Get User Invite From  Reset Pass Id
export const getUserInviteFromResetPassId = async (data) => {
  try {
    return await securedAxiosInstance.post(
      `/getUserInviteFromResetPassId`,
      data
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// export Set Profile
export const setProfile = async (data) => {
  try {
    return await securedAxiosInstance.post(`/setProfile`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Get Job Invitations
export const getJobInvitations = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getJobInvitations`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Handle Candidate Job Invitation
export const handleCandidateJobInvitation = async (data, token) => {
  try {
    return await securedAxiosInstance.post(
      `/handleCandidateJobInvitation`,
      data
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Company Filters
export const FilterCompany = async (data, values) => {
  try {
    return await securedAxiosInstance.post(
      `/filterCompany/${values.picked}/${values.toggle}/${data}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

//  Get User Interview Applications
export const getUserInterviewApplications = async (data, token) => {
  try {
    return await securedAxiosInstance.post(
      `/getUserInterviewApplications`,
      data
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Fetch Country
export const fetchCountry = async () => {
  try {
    return await securedAxiosInstance.post(`/fetchCountry`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const getCountryList = async () => {
  try {
    return await securedAxiosInstance.post(`/getCountryList`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Archive Job

export const archiveJob = async (data) => {
  try {
    return await securedAxiosInstance.post(`/archiveJob`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// List XI Interview Applications

export const listXIEvaluation = async (data, token) => {
  try {
    //console.log(data);
    //console.log(token);
    return await securedAxiosInstance.post(`/listXIEvaluation`, data);
  } catch (error) {
    //console.log("Error Calling List Evaluation API :", error);
  }
};
export const getXIInterviewList = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getXIInterviewList`, data);
  } catch (error) {
    //console.log("Error Calling List Evaluation API :", error);
  }
};
export const listXIEvaluatedReports = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/listXIEvaluatedReports`);
  } catch (error) {
    //console.log("Error Calling List Evaluation API :", error);
  }
};

// Add Evaulation Question
export const addEvaluationQuestion = async (data, token) => {
  try {
    //console.log("data", data);
    return await securedAxiosInstance.post(`/addEvaluationQuestions`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Add Interview Question
export const addInterviewQuestion = async (data, token) => {
  try {
    //console.log("data", data);
    return await securedAxiosInstance.post(`/addInterviewQuestions`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const fetchInterviewQuestion = async (token) => {
  try {
    return await securedAxiosInstance.get(`/fetchInterviewQuestions`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateInterviewQuestion = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updateInterviewQuestion`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Add Evaulation Question
export const addTaxId = async (data, token) => {
  try {
    //console.log("data", data);
    return await securedAxiosInstance.post(`/addTaxId`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const findAndUpdateTax = async (id, data, token) => {
  try {
    //console.log("data", data);
    return await securedAxiosInstance.post(`/updateTaxId/${id}`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const findAndDeleteTax = async (id, token) => {
  try {
    //console.log(id);

    return await securedAxiosInstance.post(`/deleteTaxId/${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Get Interview Application
export const getInterviewApplication = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getInterviewApplication`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// get Company List
export const getDBCompanyList = async (data, token) => {
  try {
    return await securedAxiosInstance.get(`/getCompanyList`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Get School List
export const getDBSchoolList = async (data, token) => {
  try {
    return await securedAxiosInstance.get(`/getSchoolList`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Update Evaluation Details
export const updateCandidateFeedback = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateCandidateFeedback`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Update Evaluation Details
export const updateEvaluation = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateEvaluation`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Update Evaluation Details
export const updateEvaluationSkills = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateEvaluationSkills`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};


export const getCandidateEvaluation = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getCandidateEvaluation`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

//Candidate ENdpoints

export const addCandidate = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addCandidate`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const getCandidateList = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getCandidateList?id=${data}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const eligibleCandidateList = async (data) => {
  try {
    return await securedAxiosInstance.post(`/eligibleCandidateList`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const deleteCandidate = async (id, company, isDeleted) => {
  try {
    //console.log(id, company, isDeleted);
    return await securedAxiosInstance.post(`/deleteCandidate?id=${id}`, {
      company: company,
      isDeleted: isDeleted,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const eligibleJobsForCandidate = async (email,companyId) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.get(
      `/eligibleJobsForCandidate?email=${email}&companyId=${companyId}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// unapproved jobs
export const unapprovedJobsList = async () => {
  try {
    return await securedAxiosInstance.get(`/unapprovedJobsList`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// List unapproved job with pagination
export const listOfUnapproveJobs = async (currentPage) => {
  try {
    return await securedAxiosInstance.post(`/pendingjobsofcompany?page=${currentPage}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const allJobswithPagination = async (currentPage) => {
  try {
    return await securedAxiosInstance.get(`/allJobswithPagination?page=${currentPage}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const getallJobs = async () => {
  try {
    return await securedAxiosInstance.get(`/allJobs`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const languagesList = async () => {
  try {
    return await securedAxiosInstance.get(`/languagesList`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const approveJob = async (data) => {
  try {
    return await securedAxiosInstance.post(`/approveJob`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const approveCd = async (index, job_id, candet) => {
  try {
    return await securedAxiosInstance.post(`/approveCandidate`, {
      index: index,
      _id: job_id,
      candet: candet,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const getuserbyEmail = async (email) => {
  try {
    return await securedAxiosInstance.post(`/getuserbyEmail`, {
      email: email,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const approveCompany = async (data) => {
  try {
    return await securedAxiosInstance.post(`/approveCompany`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const checkCompany = async (data) => {
  try {
    return await securedAxiosInstance.post(`/checkCompany`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const listUnapproveCompany = async () => {
  try {
    return await securedAxiosInstance.get(`/listUnapproveCompany`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const saveCandidateReport = async (data) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.get(
      `/saveCandidateReport?candidate_id=${data}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// get Company users

export const getCompanyUserList = async (id) => {
  try {
    return await securedAxiosInstance.get(`/getCompanyUserList?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// get titles
export const getJobTitles = async (id) => {
  try {
    return await securedAxiosInstance.get(`/getJobTitles`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const listUnapproveTitles = async (id) => {
  try {
    return await securedAxiosInstance.get(`/listUnapproveTitles`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const approveTitle = async (data) => {
  try {
    return await securedAxiosInstance.post(`/approveTitle`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const jobTitles = async (data) => {
  try {
    return await securedAxiosInstance.post(`/jobTitles`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const addcompany = async (data) => {
  try {
    return await securedAxiosInstance.post(`/addcompany`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// Slots

export const availableSlots = async (data, type) => {
  try {
    return await securedAxiosInstance.post(`/availableSlots`, {
      userId: data,
      type: type,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

// export const availableSlotsByJob = async (userId, data) => {
//   try {
//     return await securedAxiosInstance.post(`/availableSlotsFromMatchedXis`, {
//       userId,
//       ...data
//     });
//   } catch (err) {
//     console.log("Error : ", err);
//   }
// };
export const availableSlotsByJob = async (params) => {
  try {
    return await securedAxiosInstance.post(`/availableSlotsFromMatchedXis`, params);
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const slot_by_interviewId = async (interviewId) => {
  try {
    return await securedAxiosInstance.get(
      `/slot_by_interviewId?id=${interviewId}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const XISlots = async (id) => {
  try {
    return await securedAxiosInstance.get(`/XISlots?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const addSlot = async (data) => {
  try {
    return await securedAxiosInstance.post(`/addSlot`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const ValidateSlot = async (data) => {
  try {
    return await securedAxiosInstance.post(`/ValidateSlot`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const findCandidateByEmail = async (email) => {
  try {
    return await securedAxiosInstance.post(
      `/findCandidateByEmail?email=${email}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const bookSlot = async (data) => {
  try {
    return await securedAxiosInstance.post(`/bookSlot`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateSlot = async (id, data) => {
  try {
    return await securedAxiosInstance.put(`/updateSlot?slotId=${id}`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateCurrentSlot = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updatecurrentSlot`, data)
  } catch (err) {
    // console.log("Error : ", err);
  }
};
export const newslotupdater = async (id, data, date) => {
  try {
    //console.log(data);
    return await securedAxiosInstance.put(`/newslotupdater`, {
      id: id,
      data: data,
      date: date,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const deleteSlot = async (id) => {
  try {
    return await securedAxiosInstance.delete(`/deleteSlot?slotId=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const slotDetailsOfXI = async (id) => {
  try {
    return await securedAxiosInstance.get(`/slotDetailsOfXI?XI_id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const slotDetailsOfUser = async (id) => {
  try {
    //console.log(id);
    return await securedAxiosInstance.get(`/slotDetailsOfUser?userId=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const userInterviewsDetails = async (id) => {
  try {
    return await securedAxiosInstance.get(
      `/userInterviewsDetails?slotId=${id}`
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateInterviewApplication = async (id, data) => {
  try {
    return await securedAxiosInstance.put(
      `/updateInterviewApplication?id=${id}`,
      data
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateXIInterviewApplication = async (id, data) => {
  try {
    return await securedAxiosInstance.put(
      `/updateXIInterviewApplication?id=${id}`,
      data
    );
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const userUpgradePostRequest = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(
      `/insertUserInterviewApplications`,
      data
    );
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const handleXIInterview = async (data, token) => {
  //console.log(data);
  try {
    return await securedAxiosInstance.post(`/handleXIInterview`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

export const checkinterviewdetails = async (meetingid, participantdetails) => {
  try {
    return await securedAxiosInstance.post(`/checkinterviewdetails`, {
      meetingID: meetingid,
      participant: participantdetails,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const fetchinterviewdetails = async (meetingid, participantdetails) => {
  try {
    return await securedAxiosInstance.post(`/fetchinterviewdetails`, {
      meetingID: meetingid,
      participant: participantdetails,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const getlivestatus = async (meetingid) => {
  try {
    return await securedAxiosInstance.post(`/getlivestatus`, {
      meetingID: meetingid,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const processFlask = async (currentUser, imageSrc, type, id) => {
  try {
    return await securedAxiosInstance.post(`${flaskurl}/Interview`, {
      id: currentUser._id,
      data: imageSrc,
      type: type,
      interview: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const processFlasklive = async (currentUser, imageSrc, id) => {
  try {
    return await securedAxiosInstance.post(`${flaskurl}/Interview/Live`, {
      id: currentUser._id,
      data: imageSrc,
      type: "live",
      interview: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// XI Panels

export const ListXIPanels = async () => {
  try {
    return await securedAxiosInstance.get(`/ListXIPanels`);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const addXIPanels = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addXIPanels`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const updateXIPanels = async (data, token) => {
  try {
      return await securedAxiosInstance.post(`/updateXIPanels`, data);
  } catch (error) {
      //console.log("Error calling Update Job API : ", error);
  }
};

export const updateSkillPanel = async (data, token) => {
  console.log(data, 'printing updateSkill in api')
  try {
    return await securedAxiosInstance.post(`/updateSkillPanel`, data);
  } catch(error) {
    // console.log
  }
}

export const deleteXidFromPanel = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/deleteXIPanel`, data);
  } catch(error) {
    console.log('Error calling delete xi in XIPANEL',error);
  }
};

export const deleteSkillFromPanel = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/deleteSkillPanel`, data);
  } catch (error) {
    console.log('Error Deleting skill in panel',error)
  }
}


// XI Category

export const ListXICategory = async () => {
  try {
    return await securedAxiosInstance.get(`/ListXICategory`);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const addXICategory = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addXICategory`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const updateXICategory = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateXICategory`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
// CreditCategory

export const ListCreditCategory = async () => {
  try {
    return await securedAxiosInstance.get(`/ListCreditCategory`);
  } catch (error) {
    //console.log("Error calling Currency Category API : ", error);
  }
};
export const addCreditCategory = async (data) => {
  try {
    return await securedAxiosInstance.post(`/addCreditCategory`, data);
  } catch (error) {
    //console.log("Error calling Currency Category API : ", error);
  }
};
export const updateCreditCategory = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updateCreditCategory`, data);
  } catch (error) {
    //console.log("Error calling Currency Category API : ", error);
  }
};

// Currency Converter
export const ListCreditConverter = async () => {
  try {
    return await securedAxiosInstance.get(`/ListCreditConverter`);
  } catch (error) {
    //console.log("Error calling Converter API : ", error);
  }
};
export const addCreditConverter = async (data) => {
  try {
    return await securedAxiosInstance.post(`/addCreditConverter`, data);
  } catch (error) {
    //console.log("Error calling Converter API : ", error);
  }
};
export const updateCreditConverter = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updateCreditConverter`, data);
  } catch (error) {
    //console.log("Error calling Converter API : ", error);
  }
};
// XI Levels

export const ListXILevel = async () => {
  try {
    return await securedAxiosInstance.get(`/ListXILevel`);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const addXILevel = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addXILevel`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const updateXILevel = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateXILevel`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};

// XI Levels

export const ListXIMultiplier = async () => {
  try {
    return await securedAxiosInstance.get(`/ListXIMultiplier`);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const addXIMultiplier = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/addXIMultiplier`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const updateXIMultiplier = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/updateXIMultiplier`, data);
  } catch (error) {
    //console.log("Error calling Post Job API : ", error);
  }
};
export const updateXIInfo = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updateXIInfo`, data);
  } catch (error) {
    //console.log("Error calling  API : ", error);
  }
};
export const getXIInfo = async (data) => {
  try {
    return await securedAxiosInstance.get(`/getXIInfo?id=${data}`);
  } catch (error) {
    //console.log("Error calling  API : ", error);
  }
};
export const priorityEngine = async (data, type) => {
  try {
    return await securedAxiosInstance.post(`/priorityEngine?date=${data}`, {
      type: type,
    });
  } catch (error) {
    //console.log("Error calling  API : ", error);
  }
};
export const XIPerformance = async (data, type) => {
  try {
    return await securedAxiosInstance.post(`/XIPerformance?id=${data}`);
  } catch (error) {
    //console.log("Error calling  API : ", error);
  }
};

// razorpay
export const PaymentSuccess = async (data) => {
  try {
    return await securedAxiosInstance.post(`/payment/success`, data);
  } catch (error) {
    //console.log("Error calling  Razorpay API : ", error);
  }
};
export const newOrder = async (data) => {
  try {
    return await securedAxiosInstance.post(`/payment/orders`, data);
  } catch (error) {
    //console.log("Error calling  Razorpay API : ", error);
  }
};

// User Credit Info
export const getCreditInfoList = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getCreditInfoList`, data);
  } catch (error) {
    //console.log("Error calling  Razorpay API : ", error);
  }
};
export const updateUserCreditInfo = async (data) => {
  try {
    return await securedAxiosInstance.post(`/updateUserCreditInfo`, data);
  } catch (error) {
    //console.log("Error calling  Razorpay API : ", error);
  }
};

export const updateinterviewcheck = async (type, id) => {
  try {
    return await securedAxiosInstance.post(`/updateinterviewcheck`, {
      type: type,
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const updateCodeLanguage = async (id,language) => {
  try {
    return await securedAxiosInstance.post(`/updateCodeLanguage`, {
      language: language,
      id: id,
    });
  } catch (err) {}
};



export const updatelivestatus = async (stats, id) => {
  try {
    return await securedAxiosInstance.post(`/updatelivestatus`, {
      stats: stats,
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const getinterviewdetails = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getinterviewdetails`, {
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const getinterviewdetailsForBaseline = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getinterviewdetailsForBaseline`, {
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};



export const getInterviewStatus = async (data, token) => {
  try {
    return await securedAxiosInstance.post(`/getInterviewStatus`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const savecode = async (id, code, stdin, stdout) => {
  try {
    return await securedAxiosInstance.post(`/savecode`, {
      meetingID: id,
      code: code,
      stdin: stdin,
      stdout: stdout,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const updatewhiteboard = async (id, data) => {
  try {
    return await securedAxiosInstance.post(`/updatewhiteboard`, {
      meetingID: id,
      data: data,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const getwhiteboard = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getwhiteboard`, {
      meetingID: id,
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const startinterview = async (id) => {
  try {
    return await securedAxiosInstance.post(`/startinterview`, {
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const endinterview = async (id) => {
  try {
    return await securedAxiosInstance.post(`/endinterview`, {
      meetingID: id,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const setquestionresult = async (id, qn) => {
  try {
    return await securedAxiosInstance.post(`/setquestionresult`, {
      meetingID: id,
      qn: qn,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const compilecode = async (formdata) => {
  try {
    return await securedAxiosInstance.post(`/compilecode`, {
      data: formdata,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};
// Transactions

export const getTransactions = async (id) => {
  try {
    return await securedAxiosInstance.get(`/getTransactions?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const updateWallet = async (id) => {
  try {
    return await securedAxiosInstance.post(`/updateWallet?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const userRequestUpdate = async (id) => {
  try {
    return await securedAxiosInstance.get(`/userRequestUpdate?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};
export const userAcceptUpdate = async (id) => {
  try {
    return await securedAxiosInstance.get(`/userAcceptUpdate?id=${id}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const checkcompilestatus = async (token) => {
  try {
    return await securedAxiosInstance.post(`/checkcompilestatus`, {
      token: token,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
};

export const getUserCurrentCredit = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getUserCurrentCredit`, {
      userId: id,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};
export const getxiquestions = async (type, level, experience, category) => {
  try {
    return await securedAxiosInstance.post(`/getxiquestions`, {
      type: type,
      level: level,
      experience: experience,
      category: category,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const getinterviewjob = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getinterviewjob`, {
      jobid: id,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const createTaskScheduler = async (data) => {
  try {
    return await securedAxiosInstance.post(`/createTaskScheduler`, data);
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const getpsykey = async (data) => {
  try {
    return await securedAxiosInstance.post(
      `${psyurl}?linkedInProfileUrl=${data}`
    );
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const getUserStats = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getUserStats`, { id });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const getOtherLI = async (id) => {
  try {
    return await securedAxiosInstance.post(`/getOtherLI`, {
      li: id,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const setprofileauth = async (id) => {
  try {
    return await securedAxiosInstance.post(`/setprofileauth`, {
      id: id,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const startlivemeet = async (id, room) => {
  try {
    return await securedAxiosInstance.post(`/startlivemeet`, {
      meetingID: id,
      room: room,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

/***
 *  API call to handle join
 *
 */

export const handleJoin = async (token,interviewID, meetingID,meetingRoom)=>{
	try {
		return await axios.post(`${url}/handleJoin`, {
			interviewID:interviewID,
			meetingID:meetingID,
			meetingRoom:meetingRoom,
		},{headers: { authorization: token }});
	} catch (err) {
		//console.log("Error : " + err);
	}
}

/***
 *  API call to handle leave
 *
 */

export const handleLeave = async (token,meetingID,interviewID)=>{
	try {
		return await axios.post(`${url}/handleLeave`, {
			meetingID:meetingID,
			interviewID:interviewID,
		},{headers: { authorization: token }});
	} catch (err) {
		//console.log("Error : " + err);
	}
}


/***
 *  API call to handle no show
 *
 */
export const handleNoShow = async (token,meetingID,interviewID)=>{
  console.log("Inside no show");
	try {
		return await axios.post(`${url}/noshow`, {
			meetingID:meetingID,
			interviewID:interviewID,
		},{headers: { authorization: token }});
	} catch (err) {
		//console.log("Error : " + err);
	}
}

export const startproctoring = async (id, link) => {
  try {
    return await securedAxiosInstance.post(`${proctoringurl}/task/${id}`, {
      job_id: id,
      link: link,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const stopproctoring = async (id, link) => {
  try {
    return await securedAxiosInstance.post(`${proctoringurl}/stoptask/${id}`, {
      job_id: id,
      link: link,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const handleproctoring = async (id, data) => {
  try {
    return await securedAxiosInstance.post(`/handleproctoring`, {
      id: id,
      proctoring: data,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const handlerecording = async (id, meetingID, link) => {
  try {
    return await securedAxiosInstance.post(`/handlerecording`, {
      id: id,
      meetingID: meetingID,
      link: link,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

export const getcandidatesevaluations = async (id, data) => {
  try {
    return await securedAxiosInstance.post(`/getcandidatesevaluations`, {
      id: id,
      data: data,
    });
  } catch (err) {
    //console.log("Error : " + err);
  }
};

// delete Pending jobs by company
export const deletePendingJob = async(id)=>{
  try {
    return await securedAxiosInstance.post('deletePendingJob',id)
  } catch (error) {
    throw error
  }
}

//delete companyuser in companyprofile
export const deleteCompanyUser = async(id)=>{
  try {
    return await securedAxiosInstance.post('/deleteCompanyUser',id)
  } catch (error) {
    // throw error
    console.log("id  : ", id);
console.log("Error : ", error);
}

};

// Get interview List
export const getInterviewList = async () => {
  try {
    return await securedAxiosInstance.post(`/listCompanies`, {headers:{authorization:"test"}});
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get interviews table data
// export const getInterviewsTableData = async (data,currentPage) => {
//   try {
//     return await securedAxiosInstance.post(`/listInterviewsByCompanyName`, data,currentPage);
//   } catch (error) {
//     //console.log("Error : ", error);
//   }
// };
export const getInterviewsTableData = async (data, currentPage) => {
  try {
    return await securedAxiosInstance.post(`/listInterviewsByCompanyName?page=${currentPage}`, data);
  } catch (error) {
    // Handle error if needed
    console.log("Error:", error);
  }
};


// Get interview recording table data
export const getRecordingsURL = async (data, access_token) => {
  try {
    return await securedAxiosInstance.post(`/getRecordings`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Get live stream interview data
export const getLiveStreamURLData = async (data, access_token) => {
  try {
    return await securedAxiosInstance.post(`/getLiveStreamURL`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Send interview reminder email to candidate
export const sendReminderEmailtoCandidate = async (data, access_token) => {
  try {
    return await securedAxiosInstance.post(`/sendCandidateReminderEmail`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Send interview reminder email to XI
export const sendReminderEmailtoXI = async (data, access_token) => {
  try {
    return await securedAxiosInstance.post(`/sendXIReminderEmail `,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// get base lining images face
export const getBaseLiningImagesFace = async (data, access_token) => {
  try {
    return await securedAxiosInstance.post(`/getBaseliningImagesFace`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// get base lining images person
export const getBaseLiningImagesPerson = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getBaseliningImagesPerson`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// get base lining images ear
export const getBaseLiningImagesEar = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getBaseliningImagesEar`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// get base lining images ear
export const getBaseLiningImagesGaze = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getBaseliningImagesGaze`,data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

// Accept terms and conditions
export const acceptTermsAndConditions = async (data) => {
  try {
    return await securedAxiosInstance.post(`/termsAndConditions`, data);
  } catch (error) {
    //console.log("Error : ", error);
  }
};

export const sendInterviewAcceptNotification = async(data)=>{
  try {
    return await securedAxiosInstance.post('/sendInterviewAcceptNotification',data)
  } catch (error) {
    throw error
  }
}

export const selectXisBySlot = async(data)=>{
  try {
    return await securedAxiosInstance.post('/selectXisBySlot',data)
  } catch (error) {
    throw error
  }
}

export const approveNewCandidates = async(index, job_id, candet)=>{
  try {
    return await securedAxiosInstance.post(`/approveNewCandidates`, {
      index: index,
      _id: job_id,
      candet: candet,
    });
  } catch (err) {
    //console.log("Error : ", err);
  }
}

export const matchedXiUsername = async(jobId)=>{
  try {
    return await securedAxiosInstance.post(`/getMatchedxis`, {jobId : jobId});
  } catch (err) {
    //console.log("Error : ", err);
  }
}

export const rescheduleSlot = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/rescheduleSlot`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
}


export const addQuestion = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/add-question`, data);
  } catch (err) {
    //console.log("Error : ", err);
  }
}

export const showQuestion = async(type)=>{
  try {
    return await securedAxiosInstance.get(`/get-questions?type=${type}`);
  } catch (err) {
    //console.log("Error : ", err);
  }
}
export const getHighlightedDates = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/get-xis-slots`, data);
  } catch (error) {}
}

// Add panel id to job while job approval
export const addPanelToJob = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/add-panel-to-job`, data);
  } catch (error) {}
}

// get slots from panel
export const availableSlotsFromXIPanel = async (params) => {
  try {
    return await securedAxiosInstance.post(`/availableSlotsFromJobPanel`, params);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// get panel details from jobId
export const getPanelDetails = async (data) => {
  try {
    return await securedAxiosInstance.post(`/get-panel-details`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
};

// Update PanelId to job
export const updatePanelIdofJob = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/update-panelId`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
}

export const logIt = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/logIt`, data);
  } catch (err) {
    console.log("Error : ", err);
  }
}

// send notification to candidate if xi accepts the request
export const sendJobAcceptedNotification = async (data) => {
  try {
    return await securedAxiosInstance.post(
      `/sendJobAcceptedNotification`,
      data
    );
  } catch (err) {
    console.log("Error : ", err);
  }
};

// send notification to xi if a request receives
export const sendJobReceivedNotification = async (data) => {
  try {
    return await securedAxiosInstance.post(
      `/sendJobReceivedNotification`,
      data
    );
  } catch (err) {}
};

// send notification to xi if a request receives
export const updateLinkedInProfile = async (linkedinurl) => {
  try {
    return await securedAxiosInstance.post(
      `/updateLinkedInProfile`,
      {linkedinurl:linkedinurl}
    );
  } catch (err) {}
};
// updateLinkedin profile

// Get candidate details from candidateInfo collections
export const candidateDetailsByJobId = async (data) => {
  try {
    return await securedAxiosInstance.post(`/candidateDetailsByJobId`, data);
  } catch (err) {}
};

// Verify company exists using companyId
export const findCompanyById = async (data) => {
  try {
    return await securedAxiosInstance.post(`/findCompanyById`, data);
  } catch (err) {}
};


// // Add candidate data candidateInfo
// export const addCandidateInfo = async (data) => {
//   console.log("dataadd",data);
//   try {
//     return await securedAxiosInstance.post(`/addCandidateInfo`, data);
//   } catch (err) {
//     console.log("Error : ", err);
//   }
// };
export const addCandidateInfo = async (data) => {
  try {
    return await securedAxiosInstance.post(`/addCandidateInfo`, data);
  } catch (err) {}
};


// Get candidate info from jobId
export const getCandidateInfo = async(data)=>{
  try {
    return await securedAxiosInstance.post(`/getCandidateInfo`, data);
  } catch (err) {}
}

// Delete candidate info
export const deleteCandidateInfo = async (data) => {
  try {
    return await securedAxiosInstance.post(`/deleteCandidateInfo`, data);
  } catch (err) {}
};

// Get candiate details of a company
export const getCandidateListofCompany = async (data) => {
  try {
    return await securedAxiosInstance.post(`/getCandidateListofCompany`, data);
  } catch (err) {}
};

// Get all candidates of a job
export const getAllCandidatesOfJob = async (jobId) => {
  try {
    return await securedAxiosInstance.post(`/getAllCandidatesOfJob/${jobId}`);
  } catch (err) {}
};

// Add candidate to the meeting of dyte V2 
export const addCandidateParticipant = async (interviewID,userID) => {
  try {
    return await securedAxiosInstance.post(`/v2/participant/candidate/${interviewID}/${userID}`);
  } catch (err) {
    return err?.response;
  }
};

// Add xi to the meeting of dyte V2 
export const addXIParticipant = async (interviewID,userID) => {
  try {
    return await securedAxiosInstance.post(`/v2/participant/xi/${interviewID}/${userID}`);
  } catch (err) {
    return err?.response;
  }
};

// Start meeting of dyte V2 
export const startMeeting = async (interviewID) => {
  try {
    return await securedAxiosInstance.post(`/v2/startMeeting/${interviewID}`);
  } catch (err) {
    return err?.response;
  }
};			

// for push quwstion from xi interview panel to candidate
export const pushQuestion = async (data) => {
  try {
    return await securedAxiosInstance.post(`/push-question`,data);
  } catch (err) {
    return err?.response;
  }
};	

// Send calendar ics files to XI and Candidate
export const sendCalendarInvite = async (interviewID) => {
  try {
    return await securedAxiosInstance.post(`/sendCalendarInvite/${interviewID}`);
  } catch (err) {
    return err?.response;
  }
};			

export const addCandidateInfoBulk = async (candidateDataDup,jobId,companyId) =>{
  try {
    return await securedAxiosInstance.post(`/addCandidateInfoBulk`,{candidateDataDup:candidateDataDup,
      jobId:jobId,companyId:companyId});
  } catch (err) {
    return err?.response;
  }

}

