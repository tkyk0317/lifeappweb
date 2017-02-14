import React from "react";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

var utility = require ('./utility.js');

//---------------------------------------------------------.
// Calendar Component.
//---------------------------------------------------------.
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: this.props.selected.clone(),
      selected: this.props.selected,
      schedules: this.props.schedules,
    };
    // bind function.
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.select = this.select.bind(this);
    this.renderWeeks = this.renderWeeks.bind(this);
    this.renderMonthLabel = this.renderMonthLabel.bind(this);
  }

  previous() {
    var month = this.state.month;
    month.add(-1, "M");
    this.setState({month: month});
  }

  next() {
    var month = this.state.month;
    month.add(1, "M");
    this.setState({month: month});
  }

  select(d) {
    this.setState({selected: d.date});
    this.forceUpdate();
  }

  render() {
    return (
      <div id="calendar"
           className="mdl-cell mdl-cell--5-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
        <div className="header">
          <i className="fa fa-angle-left" onClick={this.previous}></i>
            {this.renderMonthLabel()}
          <i className="fa fa-angle-right" onClick={this.next}></i>
        </div>
        <DayNames />
        {this.renderWeeks()}
      </div>
    );
  }

  renderWeeks() {
    var weeks = [];
    var done = false;
    var date = this.state.month.clone().startOf("month").add("w", -1).day("Sunday");
    var startMonthIndex = date.month();
    var count = 0;

    while(!done) {

      weeks.push(<Week key={date.toString()} date={date.clone()}
                       month={this.state.month} select={this.select}
                       schedules={this.props.schedules}
                       selected={this.state.selected} />);
      date.add(1, "w");
      done = (startMonthIndex + 2) === date.month();
    }
    return weeks;
  }

  renderMonthLabel() {
    return <span>{this.state.month.format("MMMM, YYYY")}</span>;
  }
}

//---------------------------------------------------------.
// DayNames Component.
//---------------------------------------------------------.
class DayNames extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
}

//---------------------------------------------------------.
// Week Component.
//---------------------------------------------------------.
class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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

      // check exist schedule.
      var exist_schedule = "";
      var count = this.searchSchedule(utility.toDateString(date.toDate()));
      if(count > 0 && !utility.isSmartPhone()) {
        var style = {
          display: "table-cell",
          width: "14%",
          height: "10vh",
          textAlign:"center",
          verticalAlign:"bottom",
        };
        // insert schedules's icon.
        exist_schedule = <div>
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                              <FontIcon className="material-icons" style={style}>
                                event
                              </FontIcon>
                            </MuiThemeProvider>
                          </div>;
      }
      // change font-size and color, where access from smart-phone.
      var font_style = {};
      if(count > 0 && utility.isSmartPhone()) {
        font_style = {
          color: "#ff4081",
          fontWeight: "bold",
        };
      }

      // render day.
      days.push(<span key={day.date.toString()}
                      style={font_style}
                      className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.date.isSame(this.props.selected) ? " selected" : "")}
                      onClick={this.props.select.bind(null, day)}>
                  {day.number}
                  {exist_schedule}
                </span>);
      date = date.clone();
      date.add(1, "d");
    }
    return (<div className="week" key={days[0].toString()}>{days}</div>);
  }

  searchSchedule(date) {
    var count = 0;
    this.props.schedules.forEach(function(d) {
      if(date === d.startdatetime.substr(0, 10)) count++;
    });
    return count;
  }
}
