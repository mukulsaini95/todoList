/*
 *
 * HomePage actions
 *
 */

import * as CONSTANTS from './constants'


export function getTodoList() {
  return {
    type: CONSTANTS.GET_TODO_LIST,
  }
}


export function onSubmitHandler(payload) {
  return {
    type: CONSTANTS.ON_SUBMIT,
    payload
  }
}

export function deleteTask(id) {
  return {
    type: CONSTANTS.DELETE_TASK,
    id
  }
}

