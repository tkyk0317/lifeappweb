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

    componentDidMount() {
        // callback functions.
        let DIRECTION = {
            UNKNOWN: -1,
            LEFT: 0,
            RIGHT: 1,
        };
        let pos = 0;
        let direction = DIRECTION.UNKNOWN;
        const onTouchStart = ((e) => {
            direction = DIRECTION.UNKNOWN;
            pos = getPosition(e);
        });
        const onTouchMove = ((e) => {
            if(pos - getPosition(e) > 50) direction = DIRECTION.LEFT;
            else direction = DIRECTION.RIGHT;
        });
        const onTouchEnd = ((e) => {
            if(DIRECTION.LEFT === direction) this.next();
            else if(DIRECTION.RIGHT === direction) this.previous();
        });
        const getPosition = ((e) => { return e.touches[0].pageX; });

        // register event listener.
        document.getElementById('calendar').addEventListener('touchstart', onTouchStart);
        document.getElementById('calendar').addEventListener('touchmove', onTouchMove);
        document.getElementById('calendar').addEventListener('touchend', onTouchEnd);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({schedules: nextProps.schedules});
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

    returnToday() {
        this.setState({month: this.props.selected.clone()});
        this.setState({selected: this.props.selected});
        this.setState({schedules: this.props.schedules});
        this.props.onSelect(this.props.selected);
    }

    select(d) {
        this.setState({selected: d.date});
        this.props.onSelect(d.date);
    }

    render() {
        return (
            <div id="calendar"
                 className="mdl-cell mdl-cell--5-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
                <div className="header">
                    {(() => {
                        if(!utility.isSmartPhone()) {
                            return <i className="fa fa-angle-left" onClick={this.previous}></i>;
                        }
                    })()}
                    {this.renderMonthLabel()}
                    {(() => {
                        if(!utility.isSmartPhone()) {
                            return <i className="fa fa-angle-right" onClick={this.next}></i>;
                        }
                    })()}
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

            // consider overflow month(month is zero origin).
            const end_month = (startMonthIndex + 2 >= 12 ? startMonthIndex + 2 - 12 : startMonthIndex + 2);
            done = end_month === date.month();
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
            var s = this.searchSchedules(utility.toDateString(date.toDate()));
            if(0 !== s.length && !utility.isSmartPhone()) {
                // insert schedules's icon.
                exist_schedule = <ScheduleItem schedules={s}/>;
            }
            // change font-size and color, where access from smart-phone.
            var font_style = {};
            if(0 !== s.length && utility.isSmartPhone()) {
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

    searchSchedules(date) {
        var a = [];
        this.props.schedules.forEach(function(d) {
            if(date === d.startdatetime.substr(0, 10)) a.push(d);
        });
        return a;
    }
}

//---------------------------------------------------------.
// ScheduleIcon Component.
//---------------------------------------------------------.
class ScheduleItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var style = {
            textAlign:"left",
            paddingLeft: "2px",
            paddingRight: "2px",
            fontSize: "small",
            color: "#ff4081",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            margin: 0,
        };
        var schedules = this.props.schedules.map(s => {
            // max summary's length is five.
            return <p key={s.id} style={style}>{utility.substrTime(s.startdatetime) + " " + s.summary}</p>;
        });
        // insert schedules's icon.
        return (<div>{schedules}</div>);
    }
}
