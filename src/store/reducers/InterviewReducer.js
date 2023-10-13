import {
    GET_INTERVIEW_APPLICATION_REQUEST,
    GET_INTERVIEW_APPLICATION_REQUEST_SUCCESS,
    GET_INTERVIEW_APPLICATION_REQUEST_FAILURE,
    GET_INTERVIEW_JD
} from '../actions/InterviewActions';
const initialState = {
    error:{},
    loading:false,
    interviewData:{},
    applicantsData: [],
    
  }

  // eslint-disable-next-line import/no-anonymous-default-export
  export default(state = initialState, {type, payload}) => {
    switch(type) {
      // Set loading
      case GET_INTERVIEW_APPLICATION_REQUEST:
        return {
          ...state,
      loading: true
        }
        case GET_INTERVIEW_APPLICATION_REQUEST_SUCCESS:
            return {
              ...state,
          loading: false,
          interviewData:payload.data
            }
      default:
        return state
    }
  }