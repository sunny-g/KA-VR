/* global $, Materialize */
/* eslint-disable no-console, no-eval */
import {
  TOGGLE_RECORDING,
  ADD_TRANSCRIPTION,
  ADD_LABEL,
  REQUEST_ANALYSIS,
  RECEIVE_ANALYSIS,
  REQUEST_ACTION,
  RECEIVE_ACTION,
  REQUEST_NODE_LABEL,
  RECEIVE_NODE_LABEL,
  TOGGLE_ALL_LABELS,
} from './ActionTypes';
import fetch from 'isomorphic-fetch';

// Action Creators
const setRecording = status => ({
  type: TOGGLE_RECORDING,
  status,
});

const addTranscription = transcription => ({
  type: ADD_TRANSCRIPTION,
  transcription,
});

const createNode = data => ({
  type: ADD_LABEL,
  data,
});

const requestAnalysis = transcription => ({
  type: REQUEST_ANALYSIS,
  transcription,
});

const receiveAnalysis = (transcription, analysis) => ({
  type: RECEIVE_ANALYSIS,
  transcription,
  analysis,
  receivedAt: Date.now(),
});

const requestAction = data => ({
  type: REQUEST_ACTION,
  data,
});

const receiveAction = (data, response) => ({
  type: RECEIVE_ACTION,
  data,
  response,
});

const requestNodeLabel = data => ({
  type: REQUEST_NODE_LABEL,
  data,
});

const receiveNodeLabel = (data, response) => ({
  type: RECEIVE_NODE_LABEL,
  data,
  response,
});

const toggleAllLabels = status => ({
  type: TOGGLE_ALL_LABELS,
  status,
});

// *********************************************

const toggleRecording = recognizer => (
  (dispatch, getState) => {
    const isRecording = getState().isRecording;

    if (isRecording) {
      recognizer.stop();
    } else {
      recognizer.start();
    }
    dispatch(setRecording(!isRecording));
  }
);

const updateHistory = transcription => (
  dispatch => dispatch(addTranscription(transcription))
);

// const updateSurvey = survey => (
//   dispatch => {
//     dispatch(setSurvey(survey));
//     document.getElementById('stupid').play();
//     $('#survey').openModal();
//   }
// );

const callBrain = dataObj =>
  dispatch => {
    console.log('data going into brain', dataObj);
    dispatch(requestAction(dataObj));
    return fetch('http://localhost:7750/api/think', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataObj),
    })
    .then(response => response.json())
    .then(response => {
      console.log('Brains response!', response);
      if (!response.found) {
        // updateSurvey({
        //   text: dataObj.text,
        //   verb: dataObj.verb,
        //   object: dataObj.object,
        //   actions: response.actions,
        // });
      } else {
        dispatch(receiveAction(dataObj, response));
        document.getElementById('english').play();
        const thing = response.contexts.join(' ');
        console.log(thing);
        const action = response.funct.code;
        eval(action)($, thing);
      }
    })
    .catch(err => console.log('Error on Text Analyzer:', err));
  };

const callTextAnalyzer = transcript =>
  dispatch => {
    console.log('hi');
    dispatch(requestAnalysis(transcript));
    return fetch('http://localhost:8000/api/analyze', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: transcript }),
    })
    .then(data => data.json())
    .then(data => {
      if (data.error) {
        document.getElementById('moron').play();
        Materialize.toast('Sorry! Didn\'t understand that.', 3000);
      } else {
        dispatch(receiveAnalysis(data.text, data));
        dispatch(callBrain(data));
      }
    })
    .catch(err => console.log('Error on Text Analyzer', err));
  };

const addNodes = data => (
  dispatch => dispatch(createNode(data))
);

const toggleGetAllLabels = status => (
  dispatch => dispatch(toggleAllLabels(status))
);


const fetchNodes = type => (
  dispatch => {
    dispatch(requestNodeLabel(type));
    return fetch('http://localhost:7750/api/nodes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    })
    .then(data => data.json())
    .then(data => {
      dispatch(receiveNodeLabel(data.type, data));
      dispatch(addNodes({ name: data.type, values: data }));
    })
    .catch(err => console.log('GET error:', err));
  }
);

export { toggleRecording, updateHistory, callTextAnalyzer, fetchNodes, toggleGetAllLabels };
