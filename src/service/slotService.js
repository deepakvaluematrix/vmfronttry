import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;


const securedAxiosInstance = createSecureAxiosClient(url);

// get slots for the memebers of the panel as per the selected date
export const getSlotByDate = async (panelID,selectedDate,currentDate,timeZone) => {
    try {
      return await securedAxiosInstance.post(`/getSlotByDate/${panelID}`,{selectedDate:selectedDate,currentDate:currentDate,timeZone:timeZone});
    } catch (err) {
      return err?.response;
    }
  };			


// book the slot fr the selected scehdule
export const acceptInvitation = async (userId,slotId,interviewer,jobId) => {
  try {
    return await securedAxiosInstance.post(`/acceptInvitation`,{userId:userId,slotId:slotId,interviewer:interviewer,jobId:jobId});
  } catch (err) {
    return err?.response;
  }
};
  