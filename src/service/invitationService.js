import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;

const securedAxiosInstance = createSecureAxiosClient(url);

// Send calendar ics files to XI and Candidate
export const resendInvite = async (jobID, cid) => {
    try {
      return await securedAxiosInstance.post(`/resendinvite/${jobID}/${cid}`);
    } catch (err) {
      return err?.response;
    }
  };			
  