import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
var utility = require ('./utility.js');

//---------------------------------------------------------.
// Calendar Component.
//---------------------------------------------------------.
var Calendar = React.createClass({
  getInitialState: function() {
    return {
      month: this.props.selected.clone(),
      selected: this.props.selected
    };
  },

  previous: function() {
    var month = this.state.month;
    month.add(-1, "M");
    this.setState({month: month});
  },

  next: function() {
    var month = this.state.month;
    month.add(1, "M");
    this.setState({month: month});
  },

  select: function(d) {
    this.setState({selected: d.date});
    this.forceUpdate();
  },

  render: function() {
    return (
      <div>
        <div className="header">
          <i className="fa fa-angle-left" onClick={this.previous}></i>
          {this.renderMonthLabel()}
          <i className="fa fa-angle-right" onClick={this.next}></i>
        </div>
        <DayNames />
        {this.renderWeeks()}
      </div>
    );
  },

  renderWeeks: function() {
    var weeks = [];
    var done = false;
    var date = this.state.month.clone().startOf("month").add("w", -2).day("Sunday");
    if(utility.isSmartPhone()) {
      date = this.state.month.clone().startOf("month").add("w", -1).day("Sunday");
    }
    var startMonthIndex = date.month();
    var count = 0;

    while(!done) {
      weeks.push(<Week key={date.toString()} date={date.clone()}
                       month={this.state.month} select={this.select}
                       selected={this.state.selected} />);
      date.add(1, "w");
      if(utility.isSmartPhone()) {
        done = (startMonthIndex + 2) === date.month();
      }
      else {
        done = count++ > 6 && startMonthIndex !== date.month();
      }
    }
    return weeks;
  },

  renderMonthLabel: function() {
    return <span>{this.state.month.format("MMMM, YYYY")}</span>;
  }
});

//---------------------------------------------------------.
// DayNames Component.
//---------------------------------------------------------.
var DayNames = React.createClass({
  render: function() {
    return (
      <div className="week names">
        <span className="day">Sun</span>
        <span className="day">Mon</span>
        <span className="day">Tue</span>
        <span className="day">Wed</span>
        <span className="day">Thu</span>
        <span className="day">Fri</span>
        <span className="day">Sat</span>
      </div>
    );
  }
});

//---------------------------------------------------------.
// Week Component.
//---------------------------------------------------------.
var Week = React.createClass({
  render: function() {
    var days = [];
    var date = this.props.date;
    var month = this.props.month;

    for(var i = 0 ; i < 7; i++) {
      var day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };
      days.push(<span key={day.date.toString()}
                      className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.date.isSame(this.props.selected) ? " selected" : "")}
                      onClick={this.props.select.bind(null, day)}>
                  {day.number}
                </span>);
      date = date.clone();
      date.add(1, "d");
    }
    return (<div className="week" key={days[0].toString()}>{days}</div>);
  }
});

//---------------------------------------------------------.
// Render Component.
//---------------------------------------------------------.
ReactDOM.render(
  <Calendar selected={moment().startOf("day")} />,
  document.getElementById('calendar')
);
