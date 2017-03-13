import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import Calendar from './calendar.js';
import ScheduleCardArea from './schedule.js';
import LinearProgress from 'material-ui/LinearProgress';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var variables = require('./variable.js');

//----------------------------------------.
// Main Content Cpomnent.
//----------------------------------------.
var MainContent = React.createClass({
    getInitialState: function() {
        return {
            memberId: null,
            schedules: [],
            list: []
        };
    },

    componentDidMount: function() {
        // to get schedule data.
        var self = this;
        var req = require('superagent');
        const now = new Date();
        req.get('/v1/schedules')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .end(function(err, res) {
               if(res.body) {
                   self.setState({list: res.body.list || []});
                   self.setState({schedules: res.body.schedule || []});
                   self.setState({memberId: res.body.memberid || null});
               }
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
                                      calendarlist={this.state.list}
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
        if(a['startdatetime'] > b['startdatetime']) return 1;
        if(a['startdatetime'] === b['startdatetime']) return 0;
        return -1;
    },
});

//---------------------------------------------------------.
// Loading Icon Component.
//---------------------------------------------------------.
var Loading = React.createClass({
    render: function() {
        var style = {
            width: '90%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
        };
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
                    <div style={style}>
                        <LinearProgress style={style} color="#3f51b5" />
                    </div>
        </MuiThemeProvider>);
    }
});

//----------------------------------------.
// Rendering Main Content.
//----------------------------------------.
ReactDOM.render(
    <MainContent />,
    document.getElementById('page-content')
);
