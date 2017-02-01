import React from 'react';
import ReactDOM from 'react-dom';
import ScheduleModal from './modal.js';
import BasicModal from './basic_modal.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var jsSHA = require('jssha');

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
    this.loadSchedule();
  },

  loadSchedule: function() {
    var obj = this;
    var req = require('superagent');
    req.get('/regist_schedule')
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .end(function(err, res) {
         obj.setState({schedules: res.body.schedule});
    });
  },

  render: function() {
    // display complete messages.
    var complete_message = "";
    if(this.state.canCompleteMessage) {
      var toast = document.querySelector('#complete_action_bar');
      toast.MaterialSnackbar.showSnackbar({message: this.state.completeMessage});

      // initialize state.
      this.setState({canCompleteMessage: false});
      this.setState({completeMessage: ""});
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

  onRegist: function(msg) {
    // display complete messages.
    this.setState({completeMessage: msg});
    this.setState({canCompleteMessage: true});
    // reload schedule data.
    this.loadSchedule();
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
         var sha = new jsSHA('SHA-1', 'TEXT');
         sha.update(v.id.toString());
         var hash = sha.getHash('HEX');
         return (<ReactCSSTransitionGroup transitionName="schedule_card"
                                          transitionAppear={true}
                                          transitionAppearTimeout={300}
                                          transitionEnterTimeout={300}
                                          transitionLeaveTimeout={300}>
                  <ScheduleCard key={hash}
                                scheduleId={v.id}
                                startDateTime={v.startdatetime}
                                endDateTime={v.enddatetime}
                                summary={v.summary}
                                memo={v.memo}
                                onRegist={obj.props.onRegist} />
                </ReactCSSTransitionGroup>);
      });
      return (<div id="schedule_list">{schedule_list}</div>);
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
                <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                  <i className="material-icons" onClick={this.openDeleteModal} >delete_forever</i>
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
         obj.props.onRegist("Complete Edit");
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
         obj.props.onRegist("Complete Delete");
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
         obj.props.onRegist("Complete Regist");
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
