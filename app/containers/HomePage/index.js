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
let CLASS_FOR_FILTER = {
  "Planned": "text-yellow",
  "In-progress": "text-orange",
  "Completed": "text-lightGreen",
  "All":"text-blueviolet"
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
    $('#myModal').modal('toggle');
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
    let heightScreen = window.innerHeight -50 ;
    return (
      <div className="devContainer">
        <div className="container">
          <div className="content-container">
            <div className="tab">
              <ul>
                {Object.entries(FILTERS).map(([key, value]) => (
                  <li className={this.state.selectedFilter == key ? "active" : ""} key={key} onClick={() => this.filterChangeHandler(key)}>
                    <i className={value +" " +CLASS_FOR_FILTER[key]} aria-hidden="true"></i>
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="list">
            {this.state.isFetching ?
              <div>Loading</div>
              : <ul className="todo" style={{height:heightScreen}}>
                {todoList.length ? todoList.map(item => <li key={item.id}>
                  <span className="deleteIcon">
                    <i className={FILTERS[item.status]+" " +CLASS_FOR_FILTER[item.status]} aria-hidden="true"></i>
                  </span>

                  {item.title}
                  <span className="actions">
                    <span title="delete" onClick={() => this.props.deleteTask(item.id)}>
                      <i className='fa fa-trash text-darkRed' aria-hidden='true'></i>

                    </span>
                    <span title="Planned" onClick={() => this.statusChangeHandler("Planned", item)}>
                      <i class={(item.status == "Planned" ? "text-gray notAllowedCursor" : CLASS_FOR_FILTER["Planned"]) + " fa fa-calendar "} aria-hidden="true"></i>
                    </span>
                    <span title="In-progress" onClick={() => this.statusChangeHandler("In-progress", item)}>
                      <i class={(item.status == "In-progress" ? "text-gray notAllowedCursor" :CLASS_FOR_FILTER["In-progress"]) + " fa fa-spinner "} aria-hidden="true"></i>
                    </span>
                    <span title="complete " onClick={() => this.statusChangeHandler("Completed", item)}>
                      <i className={(item.status == "Completed" ? "text-gray notAllowedCursor" : CLASS_FOR_FILTER["Completed"]) + " fa fa-check "} aria-hidden="true"></i>
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
        <button data-target="#myModal" data-toggle="modal" className="kc_fab_main_btn" onClick={() => this.setState({ title: "" })}>+</button>
        <div id="myModal" class="modal fade" role="dialog">
          <div class="modal-dialog">

            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Add Task</h4>
              </div>
              <div class="modal-body">
                <div className="inputBox">
                  <form onSubmit={this.onSubmitHandler}>
                    <input placeholder="Task" value={this.state.title} onChange={this.onChangeHandler} />
                    <button>
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
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
