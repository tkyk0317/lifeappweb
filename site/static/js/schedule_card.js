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
    req.get('/regist_schedule/1')
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
                                 return (<ScheduleCard startDateTime={v.startdatetime}
                                                   endDateTime={v.enddatetime}
                                                   summary={v.summary}
                                                   memo={v.memo} />);}
      );
      return (<div>
                {schedule_list}
              </div>);
    }
    // loading icon.
    return (<div className="loading_icon">
              <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
              <span>Loading Schedule Data...</span>
            </div>);
  }
});

//---------------------------------------------------------.
// Display ScheduleCard Component.
//---------------------------------------------------------.
var ScheduleCard = React.createClass({
  render: function() {
    var modal_num = "modalEdit_" + Math.random();
    return (
          <div>
          <div className="mdl-card mdl-shadow--2dp schedule_card">
            <div className="mdl-card__title" id="detail_sch">
              <label htmlFor={modal_num}>
                <h3 className="mdl-card__title-text">{this.props.summary}</h3>
              </label>
              <label htmlFor={modal_num}
                     className="mdl-button mdl-button--icons mdl-js-button mdl-js-ripple-effect">
                <i className="material-icons">description</i>
              </label>
            </div>
            <div className="mdl-card__menu">
              <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                <i className="material-icons">delete_forever</i>
              </button>
            </div>
            <div className="mdl-card__supporting-text">&nbsp;{this.props.startDateTime} - {this.props.endDateTime}</div>
            <div className="mdl-card__supporting-text">&nbsp;{this.props.memo}</div>
          </div>
          <Modal title="Edit Schedule"
                 modalId={modal_num}
                 startDateTime={this.props.startDateTime}
                 endDateTime={this.props.endDateTime}
                 summary={this.props.summary}
                 memo={this.props.memo}
                 confirmButtonTitle="Update"
                 onSubmit={this.onSubmit}
                 onChange={this.onChange}
                 onCancel={this.onCancel}
                 />
          </div>
          );
  },

  onSubmit: function() {
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
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
    return (<div>
              <label htmlFor="modal_regist"
                     className="mdl-button mdl-button--icons mdl-js-button mdl-js-ripple-effect"
                     id="regist_sch_button">
                     <i className="material-icons">note_add</i>
              </label>
              <div style={clearStyle}></div>
              <Modal modalId="modal_regist"
                     startDateTime={new Date()}
                     endDateTime={new Date()}
                     confirmButtonTitle="Regist"
                     onSubmit={this.onSubmit}
                     onChange={this.onChange}
                     onCancel={this.onCancel}
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
         // disable modal.
         obj.onCancel();

         // after update schedule data, start rendering.
         obj.props.onRegist();
      });
  },

  onCancel: function() {
    var mods = document.querySelectorAll('.modal > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = false; });
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name);
  }
});

//---------------------------------------------------------.
// Registe Modal Component.
//---------------------------------------------------------.
var Modal= React.createClass({
  render: function() {
    return (<div className="modal">
              <input id={this.props.modalId} type="checkbox" />
                <label htmlFor={this.props.modalId} className="overlay"></label>
                  <ModalContent modalId={this.props.modalId}
                                title={this.props.title}
                                startDateTime={this.props.startDateTime}
                                endDateTime={this.props.endDateTime}
                                summary={this.props.summary}
                                memo={this.props.memo}
                                confirmButtonTitle={this.props.confirmButtonTitle}
                                onSubmit={this.props.onSubmit}
                                onCancel={this.props.onCancel}
                                onChange={this.props.onChange}
                  />
            </div>);
  }
});

//---------------------------------------------------------.
// ModalContent Component.
//---------------------------------------------------------.
var ModalContent = React.createClass({
  render: function() {
    return (
        <article>
          <header>
            <p>Add schedule</p>
            <label htmlFor={this.props.modalId} className="close">&times;</label>
          </header>
          <section className="content">
            <div id="_form" className="third">
              <input name="startdatetime"
                     type="datetime-local"
                     defaultValue={this.props.startDateTime}
                     className="stack"
                     onChange={this.props.onChange} />
              <input name="enddatetime"
                     type="datetime-local"
                     defaultValue={this.props.endDateTime}
                     className="stack"
                     onChange={this.props.onChange}/>
              <input name="summary" className="stack"
                     placeholder="subject"
                     defaultValue={this.props.summary}
                     onChange={this.props.onChange} />
              <textarea name="memo"
                        className="stack"
                        placeholder="memo"
                        rows="6"
                        defaultValue={this.props.memo}
                        onChange={this.props.onChange} />
              <button className="stack icon-paper-plane regist_button"
                      onClick={this.props.onSubmit}>{this.props.confirmButtonTitle}</button>
              <button className="stack icon-paper-plane regist_button error"
                      onClick={this.props.onCancel}>Cancel</button>
            </div>
          </section>
          <footer>
          </footer>
        </article>
    );
  }
});

//---------------------------------------------------------.
// Render Component.
//---------------------------------------------------------.
ReactDOM.render(
  <ScheduleCardArea />,
  document.getElementById('card_area')
);
