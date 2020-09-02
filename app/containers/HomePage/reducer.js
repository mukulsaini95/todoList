/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import * as CONSTANTS from './constants'
export const initialState = fromJS({
  todoList: [],
  todoListFailure: null
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.GET_TODO_LIST_SUCCESS:
      console.log('action.response: ', action.response);
      return Object.assign({}, state, {
        todoList: action.response
      });
    case CONSTANTS.GET_TODO_LIST_FAILURE:
      return Object.assign({}, state, {
        todoListFailure: { error: action.error, timestamp: new Date() }
      })
    case CONSTANTS.ON_SUBMIT_SUCCESS:
      console.log('action.response: ', action.response);
      return Object.assign({}, state, {
        submitSuccess: action.response
      });
    case CONSTANTS.ON_SUBMIT_FAILURE:
      return Object.assign({}, state, {
        submitFailure: { error: action.error, timestamp: new Date() }
      })
    case CONSTANTS.DELETE_TASK_SUCCESS:
      console.log('action.response: ', action.response);
      return Object.assign({}, state, {
        deleteSuccess: action.response
      });
    case CONSTANTS.DELETE_TASK_FAILURE:
      return Object.assign({}, state, {
        deleteFailure: { error: action.error, timestamp: new Date() }
      })
    default:
      return state;
  }
}

export default homePageReducer;
