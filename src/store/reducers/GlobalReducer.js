import {
    SET_LOADING,
    CLEAR_LOADING
} from '../actions/GlobalActions';
const initialState = {
    loading: false,
    
  }

  // eslint-disable-next-line import/no-anonymous-default-export
  export default(state = initialState, {type, payload}) => {
    switch(type) {
      // Set loading
      case SET_LOADING:
        return {
          ...state,
      loading: true
        }
        case CLEAR_LOADING:
            return {
              ...state,
          loading: false
            }
      default:
        return state
    }
  }