import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import Calendar from './calendar.js';
import ScheduleCardArea from './schedule.js';

var variables = require('./variable.js');

//----------------------------------------.
// Main Content Cpomnent.
//----------------------------------------.
var MainContent = React.createClass({
  getInitialState: function() {
    return {
      memberId: null,
      schedules: null,
    };
  },

  componentDidMount: function() {
      // to get schedule data.
      var obj = this;
      var req = require('superagent');
      req.get('/regist_schedule')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .end(function(err, res) {
           obj.setState({schedules: res.body.schedule});
           obj.setState({memberId: res.body.memberid})
         });
  },

  render: function() {
    if(this.state.schedules) {
      return (
          <div className="mdl-grid">
            <Calendar memberId={this.state.memberId}
                      schedules={this.state.schedules}
                      selected={moment().startOf("day")} />
            <ScheduleCardArea memberId={this.state.memberId}
                              schedules={this.state.schedules}
                              onComplete={this.onComplete}/>
          </div>
      );
    }
    return <Loading />
  },

  onComplete: function(msg, category, data) {
    // state.schedule is updated.
    switch(category) {
    case variables.ACTION_CATEGORY.REGIST_SCHEDULE:
      this.addSchedule(data);
      break;

    case variables.ACTION_CATEGORY.UPDATE_SCHEDULE:
      this.updateSchedule(data);
      break;
    case variables.ACTION_CATEGORY.DELETE_SCHEDULE:
      // delete data.
      this.deleteSchedule(data);
      break;
    default:
      console.log("[MainContent.onComplete] Not found category: " + category);
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
  },
});

//---------------------------------------------------------.
// Loading Icon Component.
//---------------------------------------------------------.
var Loading = React.createClass({
  render: function() {
    return (<div id="schedule_list" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>);
  }
});

//----------------------------------------.
// Rendering Main Content.
//----------------------------------------.
ReactDOM.render(
  <MainContent />,
  document.getElementById('page-content')
);
