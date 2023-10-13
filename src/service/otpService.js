import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;

const securedAxiosInstance = createSecureAxiosClient(url);

// User Method API
export const sendSMSOTP = async (contact,countryCode) => {
    try {
        return await securedAxiosInstance.post(`/sms/otp/send`,{contact:contact,countryCode:countryCode});
    } catch (error) {}
};

export const verifySMSOTP= async (contact,otp) => {
    try {
        return await securedAxiosInstance.post(`/sms/otp/verify`,{contact:contact,otp:otp});
    } catch (error) {}
}


  