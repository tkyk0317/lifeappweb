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
// Header Component.
//----------------------------------------.
class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(e);
    }

    render() {
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">LifeApp</span>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                        <label className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
                               htmlFor="fixed-header-drawer-exp">
                            <i className="material-icons">search</i>
                        </label>
                        <div className="mdl-textfield__expandable-holder">
                            <input className="mdl-textfield__input"
                                   type="text"
                                   name="search_schedule"
                                   onChange={this.onChange}
                                   id="fixed-header-drawer-exp" />
                        </div>
                    </div>
                    <button id="schedule_regist"
                            className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </header>
        );
    }
}

//----------------------------------------.
// Navigation Component.
//----------------------------------------.
class NaviComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">{this.props.title}</span>
                <nav className="mdl-navigation">
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Config</a>
                    <a className="mdl-navigation__link" href="/signout">Signout</a>
                </nav>
            </div>
        );
    }
}

//----------------------------------------.
// Main Content Component.
//----------------------------------------.
var MainContent = React.createClass({
    getInitialState: function() {
        return {
            memberId: null,
            schedules: [],
            list: [],
            profile: {},
        };
    },

    getSchedule: function() {
        console.log("getSchedule")
        var self = this;
        return new Promise((resolve, reject) => {
            var req = require('superagent');
            req.get('/v1/schedules')
               .set('Accept', 'application/json')
               .set('Content-Type', 'application/json')
               .end(function(err, res) {
                   if(res.body) {
                       self.setState({list: res.body.list || []});
                       self.setState({schedules: res.body.schedule || []});
                       self.setState({baseSchedules: res.body.schedule || []});
                       self.setState({memberId: res.body.memberid || null});
                       resolve(res);
                   }
               });
        });
    },

    componentDidMount: function() {
        // get profile.
        const getProfile = (res) => {
            return new Promise((resolve, reject) => {
                var req = require('superagent');
                req.get('/v1/profile/' + res.body.memberid)
                   .set('Accept', 'application/json')
                   .set('Content-Type', 'application/json')
                   .end(function(err, res) {
                       if(res.body) {
                           resolve(res.body);
                       }
                   });
            });
        };

        // get schedule and profile.
        var self = this;
        this.getSchedule()
            .then(getProfile)
            .then((d) => {
                if(d) {
                    self.setState(
                        {profile:
                                 {
                                     id: d.id,
                                     email: d.email,
                                     firstname: d.firstname,
                                     lastname: d.lastname,
                                     avator: d.avator,
                                 }
                        });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    },

    onChange: function(e) {
        // search at realtime.
        let reg_exp = new RegExp(e.target.value);
        this.setState({
            schedules: this.state.baseSchedules.filter((e) => {
                // select schedule at search-text.
                if(e.summary.match(reg_exp)) return true;
                if(e.memo.match(reg_exp)) return true;
                if(e.startdatetime.match(reg_exp)) return true;
                if(e.enddatetime.match(reg_exp)) return true;
                let guests_result = e.guest ? e.guest.filter((g) => { return g.match(reg_exp); }) : null;
                return guests_result !== null;
            })
        });
    },

    render: function() {
        if(this.state.schedules) {
            return (
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <HeaderComponent onChange={this.onChange} />
                    <NaviComponent title="LifeApp" />
                    <main id="page_top" className="mdl-layout__content">
                        <div className="mdl-grid">
                            <Calendar memberId={this.state.memberId}
                                      schedules={this.state.schedules}
                                      selected={moment().startOf("day")} />
                            <ScheduleCardArea memberId={this.state.memberId}
                                              schedules={this.state.schedules}
                                              calendarlist={this.state.list}
                                              onComplete={this.onComplete}/>
                        </div>
                    </main>
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
