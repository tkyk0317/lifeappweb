import React from 'react';
import ReactDOM from 'react-dom';
import ScheduleModal from './modal.js';
import ScheduleCard from './schedule_card.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var utility = require ('./utility.js');
var variables = require('./variable.js');

//---------------------------------------------------------.
// Schedule Card Component.
//---------------------------------------------------------.
var ScheduleCardArea = React.createClass({
  getInitialState: function() {
    return {
            memberid: 0,
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
         obj.setState({memberid: res.body.memberid});
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
        <RegistSchedule onRegist={this.onRegist} memberId={this.state.memberid} />
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
         return (<ScheduleCard key={v.id}
                               scheduleId={v.id}
                               memberId={v.memberid}
                               startDateTime={v.startdatetime}
                               endDateTime={v.enddatetime}
                               summary={v.summary}
                               memo={v.memo}
                               onRegist={obj.props.onRegist} />);
      });
      return (<ReactCSSTransitionGroup transitionName="schedule_card"
                                       transitionAppear={true}
                                       transitionAppearTimeout={500}
                                       transitionEnterTimeout={700}
                                       transitionLeaveTimeout={700}>
                                       {schedule_list}
              </ReactCSSTransitionGroup>);
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
// Registe Schedule Component.
//---------------------------------------------------------.
var RegistSchedule = React.createClass({
  getInitialState: function() {
    var start_date = new Date();
    var end_date = new Date();
    end_date.setMinutes(end_date.getMinutes() + 30);
    return {
      isActive: false,
      startdate: utility.toDateString(start_date),
      enddate: utility.toDateString(end_date),
      starttime: utility.toTimeString(start_date),
      endtime: utility.toTimeString(end_date),
   };
  },

  render: function() {
      var obj = this;
      var regist_button = document.getElementById('schedule_regist');
      regist_button.addEventListener('click', function() {
        obj.openModal();
      });

      var start_date = new Date();
      var end_date = new Date();
      end_date.setMinutes(end_date.getMinutes() + 30);
      return (<ScheduleModal isActive={this.state.isActive}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange}
                            onChangeDateTime={this.onChangeDateTime}
                            onClose={this.closeModal}
                            title="Add Schedule"
                            startdate={start_date}
                            starttime={start_date}
                            enddate={end_date}
                            endtime={end_date}
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
    // generate datetime.
    var s_date = this.state.startdate + " " + this.state.starttime;
    var e_date = this.state.enddate + " " + this.state.endtime;

    // regist event to table.
    var obj = this;
    var req = require('superagent');
    req.post('/regist_schedule')
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .send({
              "memberid": this.props.memberId,
              "startdatetime": s_date,
              "enddatetime": e_date,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // after update schedule data, start rendering.
         obj.closeModal();
         obj.props.onRegist("Complete Regist", variables.ACTION_CATEGORY.REGIST_SCHEDULE,
                           {
                             "id": res.text,
                             "memberid": obj.props.memberId,
                             "startdatetime": s_date,
                             "enddatetime": e_date,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                           });
      });
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  },

  onChangeDateTime: function(n, v) {
    this.setState({ [n]: v });
  },
});

//---------------------------------------------------------.
// Render Component.
//---------------------------------------------------------.
ReactDOM.render(
  <ScheduleCardArea />,
  document.getElementById('card_area')
);
