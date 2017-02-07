import React from 'react';
import ScheduleModal from './modal.js';
import BasicModal from './basic_modal.js';

var variables = require('./variable.js');

//-------------------------------------.
// Card Component.
//-------------------------------------.
export default class ScheduleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isDeleteModalActive: false,
      scheduleId: this.props.scheduleId,
      startDateTime: this.props.startDateTime,
      endDateTime: this.props.endDateTime,
      startdate: this.props.startDateTime.substr(0, 10),
      starttime: this.props.startDateTime.substr(10),
      enddate: this.props.endDateTime.substr(0, 10),
      endtime: this.props.endDateTime.substr(10),
      summary: this.props.summary,
      memo: this.props.memo,
    };

    //  bind function.
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDateTime = this.onChangeDateTime.bind(this);
    this.onDeleteBtnOk = this.onDeleteBtnOk.bind(this);
    this.onDeleteBtnCancel = this.onDeleteBtnCancel.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  openModal() {
    this.setState({isActive: true});
  }

  closeModal() {
    this.setState({isActive: false});
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeDateTime(n, v) {
    this.setState({ [n]: v });
  }

  onSubmit() {
    // generate datetime.
    var s_date = this.state.startdate + " " + this.state.starttime;
    var e_date = this.state.enddate + " " + this.state.endtime;

    var obj = this;
    var req = require('superagent');
    req.put("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .send({
              "memberid": 1,
              "startdatetime": s_date,
              "enddatetime": e_date,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // disable dialog.
         obj.closeModal();
         // after update schedule data, start rendering.
         obj.props.onRegist("Complete Edit", variables.ACTION_CATEGORY.UPDATE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": 1,
                             "startdatetime": s_date,
                             "enddatetime": e_date,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
      });
  }

  onDeleteBtnOk() {
    // generate datetime.
    var s_date = this.state.startdate + " " + this.state.starttime;
    var e_date = this.state.enddate + " " + this.state.endtime;

    var obj = this;
    var req = require('superagent');
    req.del("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .end(function(err, res) {
         obj.closeDeleteModal();
         obj.props.onRegist("Complete Delete", variables.ACTION_CATEGORY.DELETE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": 1,
                             "startdatetime": s_date,
                             "enddatetime": e_date,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
        });  }

  onDeleteBtnCancel() {
    this.closeDeleteModal();
  }

  openDeleteModal() {
    this.setState({isDeleteModalActive: true})
  }

  closeDeleteModal() {
    this.setState({isDeleteModalActive: false})
  }

  render() {
    return (
          <div>
            <div className="mdl-card mdl-shadow--2dp schedule_card">
              <div className="mdl-card__title" id="detail_sch">
                <h4 className="mdl-card__title-text">{this.state.summary}</h4>
                <button id={this.state.random}
                        className="mdl-button mdl-button--icons mdl-js-button mdl-js-ripple-effect"
                        onClick={this.openModal}>
                  <i className="material-icons">description</i>
                </button>
              </div>
              <div className="mdl-card__menu">
                <button onClick={this.openDeleteModal}
                        className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                  <i className="material-icons">delete_forever</i>
                </button>
              </div>
              <div className="mdl-card__supporting-text">&nbsp;{this.state.startDateTime} - {this.state.endDateTime}</div>
              <div className="mdl-card__supporting-text">&nbsp;{this.state.memo}</div>
            </div>
            <ScheduleModal isActive={this.state.isActive}
                           onSubmit={this.onSubmit}
                           onChange={this.onChange}
                           onChangeDateTime={this.onChangeDateTime}
                           onClose={this.closeModal}
                           title="Edit Schedule"
                           startdate={new Date(this.state.startDateTime)}
                           starttime={new Date(this.state.startDateTime)}
                           enddate={new Date(this.state.endDateTime)}
                           endtime={new Date(this.state.endDateTime)}
                           summary={this.state.summary}
                           memo={this.state.memo}
                           people=""
                           confirmButtonTitle="Update" />
            <BasicModal isActive={this.state.isDeleteModalActive}
                        onClickBtn1={this.onDeleteBtnOk}
                        onClickBtn2={this.onDeleteBtnCancel}
                        onClose={this.closeDeleteModal}
                        title="Delete Schedule"
                        message="Delete this Schedule ?"
                        btn1_title="OK"
                        btn2_title="Cancel" />
          </div>);
  }
}
