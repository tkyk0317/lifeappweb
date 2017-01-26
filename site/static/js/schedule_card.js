import React from 'react';
import ReactDOM from 'react-dom';
import AlertContainer from 'react-alert';

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
    req.get('http://localhost:3000/regist_schedule/1')
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
                                 return (<Schedule startDateTime={v.startdatetime}
                                                   endDateTime={v.enddatetime}
                                                   summary={v.summary}
                                                   memo={v.memo} />);}
      );
      return (<div>{schedule_list}</div>);
    }
    // loading icon.
    return (<div className="loading_icon">
              <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
              <span>Loading Schedule Data...</span>
            </div>);
  }
});

//---------------------------------------------------------.
// Display Schedule Component.
//---------------------------------------------------------.
var Schedule = React.createClass({
  render: function() {
    return (
      <div>
          <article className="card schedule_card">
          <header>
            <h3>{this.props.summary}</h3>
            <p>&nbsp;{this.props.startDateTime} - {this.props.endDateTime}</p>
            <p>&nbsp;{this.props.memo}</p>
          </header>
        </article>
      </div>
    );
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
              <label htmlFor="modal_regist" className="button action_button">Add</label>
              <div style={clearStyle}></div>
              <Modal startDateTime={new Date()}
                     endDateTime={new Date()}
                     onRegist={this.props.onRegist}
              />
            </div>);
  }
});

//---------------------------------------------------------.
// Registe Modal Component.
//---------------------------------------------------------.
var Modal= React.createClass({
  getInitialState: function() {
    return {
      title: this.props.title,
      startDateTime: this.props.startDateTime,
      endDateTime: this.props.endDateTime,
      summary: this.props.summary,
      memo: this.props.memo
    };
  },

  render: function() {
    return (
      <div className="modal">
        <input id="modal_regist" type="checkbox" />
        <label htmlFor="modal_regist" className="overlay"></label>
        <ModalContent title={this.props.title}
                      startDateTime={this.props.startDateTime}
                      endDateTime={this.props.endDateTime}
                      summary={this.props.summary}
                      memo={this.props.memo}
                      onSubmit={this.onSubmit}
                      onCancel={this.onCancel}
                      onChange={this.onChange}
        />
      </div>);
  },

  onChange: function(event) {
    this.setState({ [event.target.name]: event.target.value });
  },

  onSubmit: function(event) {
    // regist event to table.
    var obj = this;
    var req = require('superagent');
    req.post('http://localhost:3000/regist_schedule')
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
            <label htmlFor="modal_regist" className="close">&times;</label>
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
                     className="stack" onChange={this.props.onChange}/>
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
                      onClick={this.props.onSubmit}>Regist</button>
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
