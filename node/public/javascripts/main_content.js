import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import Calendar from './calendar.js';
import ConfigModal from './config_modal.js';
import ScheduleCardArea from './schedule.js';
import LinearProgress from 'material-ui/LinearProgress';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var variables = require('./variable.js');
var utility = require('./utility.js');

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
        this.onSortAsc = this.onSortAsc.bind(this);
        this.onSortDes = this.onSortDes.bind(this);
    }

    onChange(e) {
        this.setState({searchText: e.target.value});
        this.props.onChange(e);
    }

    onSortAsc(e) {
        this.props.onSortAsc(e.target.value);
    }

    onSortDes(e) {
        this.props.onSortDes(e.target.value);
    }

    render() {
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                        <label className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" htmlFor="fixed-header-drawer-exp">
                            <i className="material-icons">search</i>
                        </label>
                        <div className="mdl-textfield__expandable-holder">
                            <input className="mdl-textfield__input"
                                   type="text"
                                   name="search_schedule"
                                   onChange={this.onChange}
                                   value={this.state.searchText}
                                   id="fixed-header-drawer-exp" />
                        </div>
                    </div>
                    <button id="schedule_regist" className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
                        <i className="material-icons">add</i>
                    </button>

                    <button id="sort-asc" className="mdl-button mdl-js-button mdl-button--icon">
                        <i className="material-icons">arrow_drop_up</i>
                    </button>
                    <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="sort-asc">
                        <li value="1" className="mdl-menu__item" onClick={this.onSortAsc}>Date</li>
                        <li value="2" className="mdl-menu__item" onClick={this.onSortAsc}>Guest</li>
                        <li value="3" className="mdl-menu__item" onClick={this.onSortAsc}>Summary</li>
                    </ul>

                    <button id="sort-des" className="mdl-button mdl-js-button mdl-button--icon">
                        <i className="material-icons">arrow_drop_down</i>
                    </button>
                    <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="sort-des">
                        <li value="1" className="mdl-menu__item" onClick={this.onSortDes}>Date</li>
                        <li value="2" className="mdl-menu__item" onClick={this.onSortDes}>Guest</li>
                        <li value="3" className="mdl-menu__item" onClick={this.onSortDes}>Summary</li>
                    </ul>
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
        this.state = {
            isActive: false,
            profile: this.props.profile,
        };

        // bind function.
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openConfig = this.openConfig.bind(this);
        this.closeConfig = this.closeConfig.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.profile) this.setState({profile: nextProps.profile});
    }

    onSubmit() {
        this.closeConfig();
    }

    openConfig() {
        this.setState({isActive: true});
    }

    closeConfig() {
        this.setState({isActive: false});
    }

    onChange(e) {
        this.setState({profile: { [e.target.name]: e.target.value}});
    }

    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">{this.props.title}</span>
                <nav className="mdl-navigation">
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" onClick={this.openConfig}>Config</a>
                    <a className="mdl-navigation__link" href="/signout">Signout</a>
                </nav>
                <ConfigModal title="Update profile"
                             isActive={this.state.isActive}
                             onSubmit={this.onSubmit}
                             onClose={this.closeConfig}
                             onChange={this.onChange}
                             email={this.state.profile.email}
                             password={this.state.profile.password}
                             firstname={this.state.profile.firstname}
                             lastname={this.state.profile.lastname} />
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
        var self = this;
        return new Promise((resolve, reject) => {
            var req = require('superagent');
            req.get('/v1/schedules')
               .set('Accept', 'application/json')
               .set('Content-Type', 'application/json')
               .end(function(err, res) {
                   if(res.body) {
                       self.setState({list: res.body.list || []});
                       self.setState({baseSchedules: res.body.schedule || []});
                       self.setState({memberId: res.body.memberid || null});
                       self.searchSelectedDay(moment(new Date()), res.body.schedule);
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
        if(e.target.value === 'all') {
            this.setState({schedules: this.state.baseSchedules});
            return;
        }

        // splited by space.
        let reg_exp = new RegExp(e.target.value.split(/\s+/).reduce((prev, cur) => {
            return '^(?=.*' + prev + ')' + '(?=.*' + cur +')'; // AND search.
        }));

        // search at realtime.
        let filter_schedules =
            this.state.baseSchedules.filter((s) => {
                let target = '';
                for(let k in s) target += s[k];
                return target.match(reg_exp);
        });
        this.setState({schedules: filter_schedules});
    },

    onSortAsc: function(v) {
        // sort schedules.
        let cb = null;
        if(1 === v) cb = this.compareDate; // sort by StartDate.
        else if(2 === v) cb = this.compareGuest; // sort by Guest.
        else if(3 === v) cb = this.compareSummary; // sort by Summary.

        // start sort.
        if(cb) {
            let schedules = this.state.schedules;
            schedules.sort(cb);
            this.setState({schedules: schedules});
        }
    },

    onSortDes: function(v) {
        // sort schedules.
        let cb = null;
        if(1 === v) cb = this.compareDateDes; // sort by StartDate.
        else if(2 === v) cb = this.compareGuestDes; // sort by guest.
        else if(3 === v) cb = this.compareSummaryDes; // sort by Summary.

        // start sort.
        if(cb) {
            let schedules = this.state.schedules;
            schedules.sort(cb);
            this.setState({schedules: schedules});
        }
    },

    onSelect: function(date) {
        if(!date) return;
        this.searchSelectedDay(date, this.state.baseSchedules);
    },

    // argment: moment instance.
    searchSelectedDay(date, schedules) {
        // search selected day.
        this.setState({schedules: schedules.filter((s) => {
            if(date.format('YYYYMMDD') ===
                moment(utility.fromDateTimeString(s.startdatetime)).format('YYYYMMDD')) return true;
            return false;
        })});
    },

    render: function() {
        if(this.state.schedules && this.state.baseSchedules) {
            return (
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <HeaderComponent onChange={this.onChange}
                                     onSortAsc={this.onSortAsc}
                                     onSortDes={this.onSortDes} />
                    <NaviComponent title="LifeApp" profile={this.state.profile} />
                    <main id="page_top" className="mdl-layout__content">
                        <div className="mdl-grid">
                            <Calendar memberId={this.state.memberId}
                                      schedules={this.state.baseSchedules}
                                      onSelect={this.onSelect}
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
        var v = this.state.baseSchedules;
        v.push(d);
        v.sort(this.compareDate);
        this.setState({baseSchedules: v});
    },

    updateSchedule: function(d) {
        var u = this.state.baseSchedules.map(function(v) {
            if(v['id'] === d['id']) return d;
            return v;
        });
        u.sort(this.compareDate);
        this.setState({baseSchedules: u});
    },

    deleteSchedule: function(d) {
        var r = this.state.baseSchedules.filter(function(v, i) {
            if(v['id'] !== d['id']) return true;
            return false;
        });
        this.setState({baseSchedules: r});
    },

    compareDate: function(a, b) {
        if(a['startdatetime'] > b['startdatetime']) return 1;
        if(a['startdatetime'] === b['startdatetime']) return 0;
        return -1;
    },

    compareGuest: function(a, b) {
        if(a['guest'] > b['guest']) return 1;
        if(a['guest'] === b['guest']) return 0;
        return -1;
    },

    compareDateDes: function(a, b) {
        if(a['startdatetime'] > b['startdatetime']) return -1;
        if(a['startdatetime'] === b['startdatetime']) return 0;
        return 1;
    },

    compareGuestDes: function(a, b) {
        if(a['guest'] > b['guest']) return -1;
        if(a['guest'] === b['guest']) return 0;
        return 1;
    },

    compareSummary: function(a, b) {
        if(a['summary'] > b['summary']) return 1;
        if(a['summary'] === b['summary']) return 0;
        return -1;
    },

    compareSummaryDes: function(a, b) {
        if(a['summary'] > b['summary']) return -1;
        if(a['summary'] === b['summary']) return 0;
        return 1;
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
