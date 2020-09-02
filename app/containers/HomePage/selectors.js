import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the homePage state domain
 */

const selectHomePageDomain = state => state.get('homePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () =>
createSelector(selectHomePageDomain, substate => substate.toJS());


export const toDoListSuccess = () =>
  createSelector(selectHomePageDomain, substate => substate.todoList);

export const toDoListFailure = () =>
  createSelector(selectHomePageDomain, substate => substate.todoListFailure);

export const submitSuccess = () =>
createSelector(selectHomePageDomain, substate => substate.submitSuccess);

export const submitFailure = () =>
createSelector(selectHomePageDomain, substate => substate.submitFailure);


export const deleteSuccess = () =>
createSelector(selectHomePageDomain, substate => substate.deleteSuccess);

export const deleteFailure = () =>
createSelector(selectHomePageDomain, substate => substate.deleteFailure);

