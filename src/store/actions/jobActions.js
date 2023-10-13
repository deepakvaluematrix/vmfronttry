export const GET_JOB_BY_ID_REQUEST = "GET_JOB_BY_ID_REQUEST";
export const GET_JOB_BY_ID_REQUEST_SUCCESS = "GET_JOB_BY_ID_REQUEST_SUCCESS";
export const GET_JOB_BY_ID_REQUEST_FAILURE = "GET_JOB_BY_ID_REQUEST_FAILURE";

export const getJobById = (id) => {
  return {
    type: GET_JOB_BY_ID_REQUEST,
    payload: { id },
  };
};
