import React from 'react';
import ReactDOM from 'react-dom';

//---------------------------------------------------------.
// Schedule Card Component.
//---------------------------------------------------------.
var ScheduleCardArea = React.createClass({
  getInitialState: function() {
    return { schedules: null };
  },

  componentDidMount: function() {
    // get my schedule.
    this.loadSchedule();
  },

  loadSchedule: function() {
    var obj = this;
    var req = require('superagent');
    req.get('/regist_schedule')
       .end(function(err, res) {
         obj.setState({schedules: res.body.schedule});
    });
  },

  render: function() {
    return (
      <div>
        <RegistSchedule onRegist={this.onRegist} />
        <ScheduleList schedules={this.state.schedules} />
      </div>
    )
  },

  onRegist: function() {
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
      var schedule_list =
       this.props.schedules.map(function(v) {
                                 return (<ScheduleCard
                                                   ket={v.id}
                                                   scheduleId={v.id}
                                                   startDateTime={v.startdatetime}
                                                   endDateTime={v.enddatetime}
                                                   summary={v.summary}
                                                   memo={v.memo} />);}
      );
      return (<div>
                {schedule_list}
              </div>);
    }
    // loading icon.
    return (<div className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>);
  }
});

//---------------------------------------------------------.
// Display ScheduleCard Component.
//---------------------------------------------------------.
var ScheduleCard = React.createClass({
  getInitialState: function() {
    return {
      key: this.props.key,
      scheduleId: this.props.scheduleId
    };
  },

  render: function() {
    var random = Math.random();
    var modal_id = "modalEdit_" + random;
    return (
          <div>
            <div className="mdl-card mdl-shadow--2dp schedule_card">
              <div className="mdl-card__title" id="detail_sch">
                <h3 className="mdl-card__title-text">{this.props.summary}</h3>
                <button className="mdl-button mdl-button--icons mdl-js-button mdl-js-ripple-effect">
                  <i className="material-icons" id={random}>description</i>
                </button>
              </div>
              <div className="mdl-card__menu">
                <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                  <i className="material-icons" onClick={this.onDelete} >delete_forever</i>
                </button>
              </div>
              <div className="mdl-card__supporting-text">&nbsp;{this.props.startDateTime} - {this.props.endDateTime}</div>
              <div className="mdl-card__supporting-text">&nbsp;{this.props.memo}</div>
            </div>
            <Modal title="Edit Schedule"
                   modalId={modal_id}
                   onShowId={random}
                   startDateTime={this.props.startDateTime}
                   endDateTime={this.props.endDateTime}
                   summary={this.props.summary}
                   memo={this.props.memo}
                   confirmButtonTitle="Update"
                   onSubmit={this.onSubmit}
                   onChange={this.onChange}
                   />
          </div>
          );
  },

  onSubmit: function() {
    var obj = this;
    var req = require('superagent');
    req.put("/regist_schedule/" + this.props.scheduleId)
       .send({
              "startdatetime": this.state.startdatetime,
              "enddatetime": this.state.enddatetime,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // disable dialog.
         document.getElementById('modal_regist').close();
         // after update schedule data, start rendering.
         obj.props.onRegist();
      });  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  },

  onDelete: function(event) {
    console.log(this.state.scheduleId);
  }
});

//---------------------------------------------------------.
// Registe Schedule Component.
//---------------------------------------------------------.
var RegistSchedule = React.createClass({
  render: function() {
    var clearStyle = {
      clear: "both"
    };
    var random=Math.random();
    return (<div>
              <i className="material-icons" id={random}>note_add</i>
              <div style={clearStyle}></div>
              <Modal modalId="modal_regist"
                     onShowId={random}
                     title="Add Schedule"
                     startDateTime={new Date()}
                     endDateTime={new Date()}
                     summary=""
                     memo=""
                     confirmButtonTitle="Regist"
                     onSubmit={this.onSubmit}
                     onChange={this.onChange}
              />
            </div>);
  },

  onSubmit: function(event) {
    // regist event to table.
    var obj = this;
    var req = require('superagent');
    req.post('/regist_schedule')
       .send({
              "memberid": 1,
              "startdatetime": this.state.startdatetime,
              "enddatetime": this.state.enddatetime,
              "summary": this.state.summary,
              "memo": this.state.memo
            })
       .end(function(err, res) {
         // disable dialog.
         document.getElementById('modal_regist').close();
         // after update schedule data, start rendering.
         obj.props.onRegist();
      });
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
});

//---------------------------------------------------------.
// ModalContent Component.
//---------------------------------------------------------.
var Modal = React.createClass({
  render: function() {
    var summary_label = this.props.summary === "" ? "summary" : "";
    var memo_label = this.props.memo === "" ? "memo" : "";

    return (
      <dialog className="mdl-dialog dialog_form" id={this.props.modalId}>
        <div className="mdl-dialog__title">{this.props.title}</div>
        <div className="mdl-dialog__content">
          <div className="mdl-textfield mdl-js-textfield">
            <input type="datetime-local"
                   value={this.props.startDateTime}
                   onChange={this.props.onChange} />
            <label className="mdl-texfiedl__label" htmlFor="startDateTime"></label>
          </div>
          <div className="mdl-textfield mdl-js-textfield">
            <input type="datetime-local"
                   value={this.props.endDateTime}
                   onChange={this.props.onChange} />
            <label className="mdl-texfiedl__label" htmlFor="endDateTime"></label>
          </div>
          <div className="mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input"
                   type="text"
                   value={this.props.summary}
                   onChange={this.props.onChange}/>
            <label className="mdl-textfield__label" htmlFor="summary">{summary_label}</label>
          </div>
          <div className="mdl-textfield mdl-js-textfield">
            <textarea className="mdl-textfield__input"
                      type="text" rows="6"
                      value={this.props.memo}
                      onChange={this.props.onChange} />
            <label className="mdl-textfield__label" htmlFor="memo">{memo_label}</label>
          </div>
        </div>
        <div className="mdl-dialog__actions mdl-dialog__actions--full-width">
          <button type="button" className="mdl-button" onClick={this.props.onSubmit}>{this.props.confirmButtonTitle}</button>
          <button type="button" className="mdl-button" onClick={this.onCancel}>Cancel</button>
        </div>
      </dialog>
    );
  },

  componentDidMount: function() {
    var obj = this;
    var action_button = document.getElementById(this.props.onShowId);
    if(action_button) {
      action_button.addEventListener('click', function() {
        obj.showModal();
      });
    }
  },

  showModal: function() {
    var dialog = document.getElementById(this.props.modalId);
    if(dialog) dialog.showModal();
  },

  onCancel: function() {
    var dialog = document.getElementById(this.props.modalId);
    if(dialog) dialog.close();
  }
});

//---------------------------------------------------------.
// Render Component.
//---------------------------------------------------------.
ReactDOM.render(
  <ScheduleCardArea />,
  document.getElementById('card_area')
);
