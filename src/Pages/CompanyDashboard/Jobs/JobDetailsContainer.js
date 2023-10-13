import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getJobById } from "../../../store/actions/jobActions";
import { getEvaluationOfCandidate } from "../../../store/actions/InterviewActions";

const JobDetailsContainer = ({ getJobById,getEvaluations,loading, job, candidateEvaluations, id }) => {

  useEffect(() => {
    if(id && id !== undefined && id !=='' ){
      getJobById(id);
    }
  }, [id]);

  useEffect(()=>{
    if(job && job !== null){
      let candidates = []
      job?.applicants?.forEach(applicant => {
        candidates.push({Uid: applicant?.Uid});
      });
      getEvaluationOfCandidate(id,candidates)
    }
  },[job]);

  
};

JobDetailsContainer.propTypes = {
  loading: PropTypes.bool,
  job: PropTypes.object,
  candidateEvaluations: PropTypes.object,
};
JobDetailsContainer.defaultProps = {
  loading: true,
  job: {},
  candidateEvaluations: {},
};

const mapStateToProps = (state) => ({
  todo: state.todo,
});
const mapDispatchToProps = (dispatch) => ({
  getJobById: (id) => dispatch(getJobById(id)),
  getEvaluations: (jobId, candidates) =>
    dispatch(getEvaluationOfCandidate(jobId, candidates)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDetailsContainer);
