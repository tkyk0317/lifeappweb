import React from 'react';
import ReactDOM from 'react-dom';
import ScheduleModal from './modal.js';
import BasicModal from './basic_modal.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//---------------------------------------------------------.
// Category Enum.
//---------------------------------------------------------.
var ACTION_CATEGORY = {
    REGIST_SCHEDULE: 0,
    UPDATE_SCHEDULE: 1,
    DELETE_SCHEDULE: 2,
};

//---------------------------------------------------------.
// Schedule Card Component.
//---------------------------------------------------------.
var ScheduleCardArea = React.createClass({
  getInitialState: function() {
    return {
            schedules: null,
            canCompleteMessage: false,
            completeMessage: "",
           };
  },

  componentDidMount: function() {
    // get my schedule.
    var obj = this;
    var req = require('superagent');
    req.get('/regist_schedule')
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .end(function(err, res) {
         obj.setState({schedules: res.body.schedule});
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    // initialize state.
    if(this.state.canCompleteMessage) {
      this.setState({canCompleteMessage: false});
      this.setState({completeMessage: ""});
    }
  },

  render: function() {
    // display complete messages.
    var complete_message = "";
    if(this.state.canCompleteMessage) {
      var toast = document.querySelector('#complete_action_bar');
      toast.MaterialSnackbar.showSnackbar({message: this.state.completeMessage});
    }
    return (
      <div>
        <RegistSchedule onRegist={this.onRegist} />
        <ScheduleList schedules={this.state.schedules}  onRegist={this.onRegist}/>
        <div id="complete_action_bar" className="mdl-js-snackbar mdl-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button className="mdl-snackbar__action" type="button"></button>
        </div>
      </div>
    )
  },

  onRegist: function(msg, category, data) {
    // display complete messages.
    this.setState({completeMessage: msg});
    this.setState({canCompleteMessage: true});

    // state.schedule is updated.
    switch(category) {
    case ACTION_CATEGORY.REGIST_SCHEDULE:
      this.addSchedule(data);
      break;

    case ACTION_CATEGORY.UPDATE_SCHEDULE:
      this.updateSchedule(data);
      break;
    case ACTION_CATEGORY.DELETE_SCHEDULE:
      // delete data.
      this.deleteSchedule(data);
      break;
    default:
      console.log("[ScheduleCardArea.onRegist] Not found category: " + category);
      break;
    }
  },

  addSchedule: function(d) {
    var v = this.state.schedules;
    v.push(d);
    v.sort(this.compare);
    this.setState({schedules: v});
  },

  updateSchedule: function(d) {
    var u = this.state.schedules.map(function(v) {
      if(v['id'] === d['id']) return d;
      return v;
    });
    u.sort(this.compare);
    this.setState({schedules: u});
  },

  deleteSchedule: function(d) {
    var r = this.state.schedules.filter(function(v, i) {
      if(v['id'] !== d['id']) return true;
      return false;
    });
    this.setState({schedules: r});
  },

  compare: function(a, b) {
    if(a['startdatetime'] < b['startdatetime']) return 1;
    if(a['startdatetime'] === b['startdatetime']) return 0;
    return -1;
  }
});

//---------------------------------------------------------.
// Display ScheduleList Component.
//---------------------------------------------------------.
var ScheduleList = React.createClass({
  render: function() {
    if(this.props.schedules) {
      // display my schedules.
      var obj = this;
      var schedule_list =
       this.props.schedules.map(function(v) {
         return (<ReactCSSTransitionGroup key={v.id}
                                          transitionName="schedule_card"
                                          transitionAppear={true}
                                          transitionAppearTimeout={300}>
                  <ScheduleCard scheduleId={v.id}
                                startDateTime={v.startdatetime}
                                endDateTime={v.enddatetime}
                                summary={v.summary}
                                memo={v.memo}
                                onRegist={obj.props.onRegist} />
                </ReactCSSTransitionGroup>);
      });
      return (<div>{schedule_list}</div>);
    }
    // loading icon.
    return <Loading />;
  }
});

//---------------------------------------------------------.
// Loading Icon Component.
//---------------------------------------------------------.
var Loading = React.createClass({
  render: function() {
    return (<div id="schedule_list" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>);
  }
});

//---------------------------------------------------------.
// Display ScheduleCard Component.
//---------------------------------------------------------.
var ScheduleCard = React.createClass({
  getInitialState: function() {
    return {
      isActive: false,
      isDeleteModalActive: false,
      scheduleId: this.props.scheduleId,
      startdatetime: this.props.startDateTime,
      enddatetime: this.props.endDateTime,
      summary: this.props.summary,
      memo: this.props.memo,
    };
  },

  render: function() {
    return (
          <div>
            <div className="mdl-card mdl-shadow--2dp schedule_card">
              <div className="mdl-card__title" id="detail_sch">
                <h4 className="mdl-card__title-text">{this.props.summary}</h4>
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
              <div className="mdl-card__supporting-text">&nbsp;{this.props.startDateTime} - {this.props.endDateTime}</div>
              <div className="mdl-card__supporting-text">&nbsp;{this.props.memo}</div>
            </div>
            <ScheduleModal isActive={this.state.isActive}
                           onSubmit={this.onSubmit}
                           onChange={this.onChange}
                           onClose={this.closeModal}
                           title="Edit Schedule"
                           startDateTime={this.props.startDateTime}
                           endDateTime={this.props.endDateTime}
                           summary={this.props.summary}
                           memo={this.props.memo}
                           people=""
                           confirmButtonTitle="Update" />
            <BasicModal isActive={this.state.isDeleteModalActive}
                        onClickBtn1={this.onDeleteBtnOK}
                        onClickBtn2={this.onDeleteBtnCancel}
                        onClose={this.closeDeleteModal}
                        title="Delete Schedule"
                        message="Delete this Schedule ?"
                        btn1_title="OK"
                        btn2_title="Cancel" />
          </div>);
  },

  openModal: function() {
    this.setState({isActive: true});
  },

  closeModal: function() {
    this.setState({isActive: false});
  },

  onSubmit: function() {
    var obj = this;
    var req = require('superagent');
    req.put("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .send({
              "memberid": 1,
              "startdatetime": this.state.startdatetime,
              "enddatetime": this.state.enddatetime,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // disable dialog.
         obj.closeModal();
         // after update schedule data, start rendering.
         obj.props.onRegist("Complete Edit", ACTION_CATEGORY.UPDATE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": 1,
                             "startdatetime": obj.state.startdatetime,
                             "enddatetime": obj.state.enddatetime,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
      });
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  },

  onDeleteBtnOK: function() {
    var obj = this;
    var req = require('superagent');
    req.del("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .end(function(err, res) {
         obj.closeDeleteModal();
         obj.props.onRegist("Complete Delete", ACTION_CATEGORY.DELETE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": 1,
                             "startdatetime": obj.state.startdatetime,
                             "enddatetime": obj.state.enddatetime,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
        });
  },

  onDeleteBtnCancel: function() {
    this.closeDeleteModal();
  },

  openDeleteModal: function() {
    this.setState({isDeleteModalActive: true})
  },

  closeDeleteModal: function() {
    this.setState({isDeleteModalActive: false})
  },
});

//---------------------------------------------------------.
// Registe Schedule Component.
//---------------------------------------------------------.
var RegistSchedule = React.createClass({
  getInitialState: function() {
    return {
      isActive: false
    };
  },

  render: function() {
      var obj = this;
      var regist_button = document.getElementById('schedule_regist');
      regist_button.addEventListener('click', function() {
        obj.openModal();
      });

      return (<ScheduleModal isActive={this.state.isActive}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange}
                            onClose={this.closeModal}
                            title="Add Schedule"
                            startDateTime={new Date()}
                            endDateTime={new Date()}
                            summary=""
                            memo=""
                            people=""
                            confirmButtonTitle="Regist"
                            />);
  },

  openModal: function() {
    this.setState({isActive: true});
  },

  closeModal: function() {
    this.setState({isActive: false});
  },

  onSubmit: function(event) {
    // regist event to table.
    var obj = this;
    var req = require('superagent');
    req.post('/regist_schedule')
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .send({
              "memberid": 1,
              "startdatetime": this.state.startdatetime,
              "enddatetime": this.state.enddatetime,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // after update schedule data, start rendering.
         obj.closeModal();
         obj.props.onRegist("Complete Regist", ACTION_CATEGORY.REGIST_SCHEDULE,
                           {
                             "id": res.text,
                             "memberid": 1,
                             "startdatetime": obj.state.startdatetime,
                             "enddatetime": obj.state.enddatetime,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
      });
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
});

//---------------------------------------------------------.
// Render Component.
//---------------------------------------------------------.
ReactDOM.render(
  <ScheduleCardArea />,
  document.getElementById('card_area')
);
