import {
    put,
    call,
    takeLatest,
    takeEvery
  } from 'redux-saga/effects'

  import {SET_LOADING,CLEAR_LOADING} from '../actions/GlobalActions';

//   function* setLoading();