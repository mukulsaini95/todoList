/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import * as ACTIONS from "./actions";
import * as SELECTIONS from "./selectors";

/* eslint-disable react/prefer-stateless-function */
let FILTERS = {
  "All": "fa fa-list-ul",
  "Planned": "fa fa-calendar",
  "In-progress": "fa fa-spinner",
  "Completed": "fa fa-check"
}
export class HomePage extends React.Component {
  state = {
    todoList: [],
    isFetching: true,
    title: "",
    selectedFilter: "All"
  }
  componentWillMount() {
    this.props.getTodoList()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.todoList && nextProps.todoList !== this.props.todoList) {
      this.setState({
        todoList: nextProps.todoList,
        isFetching: false
      })
    }

    if (nextProps.submitSuccess && nextProps.submitSuccess !== this.props.submitSuccess) {
      let todoList = [...this.state.todoList]
      if (nextProps.submitSuccess.actionPerformed == "EDIT") {
        const index = todoList.findIndex(item => item.id == nextProps.submitSuccess.data.id);
        todoList[index] = nextProps.submitSuccess.data;
      } else {
        todoList.unshift(nextProps.submitSuccess.data)
      }
      this.setState({
        todoList
      })
    }

    if (nextProps.deleteTaskSuccess && nextProps.deleteTaskSuccess !== this.props.deleteTaskSuccess) {
      let todoList = [...this.state.todoList]
      const index = todoList.findIndex(item => item.id == nextProps.deleteTaskSuccess);
      todoList.splice(index, 1);
      this.setState({
        todoList
      })
    }

  }

  onChangeHandler = ({ currentTarget }) => {
    this.setState({
      title: currentTarget.value
    })
  }

  onSubmitHandler = (event) => {
    event.preventDefault()

    let payload = {
      title: this.state.title,
      status: "Planned",
      timestamp: new Date(),
    }
    this.setState({
      title: ""
    }, () => this.props.onSubmitHandler(payload))
  }

  filterChangeHandler = (selectedFilter) => {
    this.setState({
      selectedFilter
    })
  }

  statusChangeHandler = (status, item) => {
    if (item.status !== status) {
      let payload = { ...item };
      payload.status = status
      this.props.onSubmitHandler(payload)
    }
  }

  render() {
    let todoList = this.state.todoList.filter(item => item.status == this.state.selectedFilter || this.state.selectedFilter === "All");
    return (
      <div className="devContainer">
        <div className="content-container">
          <div className="inputBox">
            <form onSubmit={this.onSubmitHandler}>
              <input placeholder="task" value={this.state.title} onChange={this.onChangeHandler} />
              <button>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </form>
          </div>
          <div className="tab">
            <ul>
              {Object.entries(FILTERS).map(([key, value]) => (
                <li className={this.state.selectedFilter == key ? "active" : ""} key={key} onClick={() => this.filterChangeHandler(key)}>
                  <i class={value} aria-hidden="true"></i>
                  {key}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="list">
          {this.state.isFetching ?
            <div>Loading</div>
            : <ul className="todo">
              {todoList.length ? todoList.map(item => <li key={item.id}>
                <span className="deleteIcon">
                  <i class={FILTERS[item.status]} aria-hidden="true"></i>
                </span>

                {item.title}
                <span className="actions">
                  <span title="delete" onClick={() => this.props.deleteTask(item.id)}>
                    <i className='fa fa-trash text-darkRed' aria-hidden='true'></i>

                  </span>
                  <span title="In-progress" onClick={() => this.statusChangeHandler("In-progress", item)}>
                    <i class={(item.status == "In-progress" ? "text-gray notAllowedCursor" : "text-yellow") + " fa fa-spinner "} aria-hidden="true"></i>
                  </span>
                  <span title="complete " onClick={() => this.statusChangeHandler("Completed", item)}>
                    <i className={(item.status == "Completed" ? "text-gray notAllowedCursor" : "text-lightGreen") + " fa fa-check "} aria-hidden="true"></i>
                  </span>
                  <span title="edit">
                    <i class="fa fa-pencil text-darkBlue" aria-hidden="true"></i>
                  </span>
                </span>
              </li>)
                :
                <li>
                  <p>
                    No Data Found!
                </p>
                </li>
              }

            </ul>
          }

        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  todoList: SELECTIONS.toDoListSuccess(),
  toDoListFailure: SELECTIONS.toDoListFailure(),
  submitFailure: SELECTIONS.submitFailure(),
  submitSuccess: SELECTIONS.submitSuccess(),
  deleteTaskSuccess: SELECTIONS.deleteSuccess(),
  deleteTaskFailure: SELECTIONS.deleteFailure()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTodoList: () => dispatch(ACTIONS.getTodoList()),
    onSubmitHandler: (payload) => dispatch(ACTIONS.onSubmitHandler(payload)),
    deleteTask: (id) => dispatch(ACTIONS.deleteTask(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
