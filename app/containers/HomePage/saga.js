import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { push } from 'react-router-redux';
import * as CONSTANTS from './constants';
// import { getHeaders, errorHandler} from "../../utils/commonUtils";


let url = "http://localhost:4000/toDoList";

export function* getTodoListHandlerAsync() {


  try {
    const response = yield call(axios.get, url, {});
    yield put({ type: CONSTANTS.GET_TODO_LIST_SUCCESS, response: response.data });
  } catch (error) {
    yield put({ type: CONSTANTS.GET_TODO_LIST_FAILURE, error: error });
  }
}

export function* watcherGetTodoListRequests() {
  yield takeLatest(CONSTANTS.GET_TODO_LIST, getTodoListHandlerAsync);
}

export function* submitRequestHandlerAsync(action) {
  try {
    let url = "http://localhost:4000/toDoList";
    let method = axios.post;
    let actionPerformed = "ADD"
    if (action.payload.id) {
      method = axios.put;
      url = url + "/" + action.payload.id;
      actionPerformed = "EDIT";
    } else {
      let uIdGenerator = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      action.payload.id = uIdGenerator();
    }
    const response = yield call(method, url, action.payload);
    yield put({
      type: CONSTANTS.ON_SUBMIT_SUCCESS, response: {
        data: response.data,
        actionPerformed
      }
    });
  } catch (error) {
    yield put({ type: CONSTANTS.ON_SUBMIT_FAILURE, error: error });
  }
}

export function* deleteRequestHandlerAsync(action) {
  try {
    const response = yield call(axios.delete, url + "/" + action.id);
    yield put({ type: CONSTANTS.DELETE_TASK_SUCCESS, response: action.id });
  } catch (error) {
    yield put({ type: CONSTANTS.DELETE_TASK_FAILURE, error: error });
  }
}

export function* watcherSubmitRequests() {
  yield takeLatest(CONSTANTS.ON_SUBMIT, submitRequestHandlerAsync);
}

export function* watcherDeleteTask() {
  yield takeLatest(CONSTANTS.DELETE_TASK, deleteRequestHandlerAsync);
}

export default function* rootSaga() {
  yield [
    watcherGetTodoListRequests(),
    watcherSubmitRequests(),
    watcherDeleteTask()
  ];
}