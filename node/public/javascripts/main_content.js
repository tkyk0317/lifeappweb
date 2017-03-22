import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import Calendar from './calendar.js';
import ConfigModal from './config_modal.js';
import ScheduleCardArea from './schedule.js';
import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Perf from 'react-addons-perf';

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
        this.onClickSearch = this.onClickSearch.bind(this);
        this.onSortAsc = this.onSortAsc.bind(this);
        this.onSortDes = this.onSortDes.bind(this);

    }

    onClickSearch(e) {
        // search.
        this.props.onSearch(this.state.searchText);
    }

    onChange(e, n) {
        // save searched word,
        this.setState({searchText: e.target.value});
    }

    onSortAsc(e, v) {
        this.props.onSortAsc(v.props.value);
    }

    onSortDes(e, v) {
        this.props.onSortDes(v.props.value);
    }

    render() {
        let style = {
            appbar: { backgroundColor: "#3f51b5", height: "48px" },
            toolbar: { backgroundColor: "#3f51b5", height: "46px", margin: 0, padding: 0 },
            toolbar_button: { color: "white", fontSize: "18px" },
            toolbar_icon: { color: "white", fontSize: "18px" },
            searchfield: { color: "white" },
            focusline: { borderColor: "white" },
            searchbox: { width: "150px" },
        };

        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <AppBar style={style.appbar}
                    iconElementLeft={<NaviComponent profile={this.props.profile} />}>
                    <Toolbar style={style.toolbar}>
                        <ToolbarGroup>
                            <TextField id="searched_word"
                                       defaultValue=""
                                       style={style.searchbox}
                                       inputStyle={style.searchfield}
                                       underlineFocusStyle={style.focusline}
                                       onChange={this.onChange} />
                            <IconButton onTouchTap={this.onClickSearch}
                                        tooltip="search schedule"
                                        iconStyle={style.toolbar_button} >
                                <FontIcon className="material-icons">search</FontIcon>
                            </IconButton>
                            <IconMenu iconButtonElement={<FontIcon className='material-icons' style={style.toolbar_icon}>arrow_drop_up</FontIcon>}
                                      value='0'
                                      onItemTouchTap={this.onSortAsc}>
                                <MenuItem value={variable.SORT_CATEGORY.SORT_DATE} primaryText="Date" />
                                <MenuItem value={variable.SORT_CATEGORY.SORT_GUEST} primaryText="Guest" />
                                <MenuItem value={variable.SORT_CATEGORY.SORT_SUMMARY}" primaryText="Summary" />
                            </IconMenu>
                            <IconMenu iconButtonElement={<FontIcon className='material-icons' style={style.toolbar_icon}>arrow_drop_down</FontIcon>}
                                      value='0'
                                      style={{marginLeft: "10px"}}
                                      onItemTouchTap={this.onSortDes}>
                                <MenuItem value={variable.SORT_CATEGORY.SORT_DATE} primaryText="Date" />
                                <MenuItem value={variable.SORT_CATEGORY.SORT_GUEST} primaryText="Guest" />
                                <MenuItem value={variable.SORT_CATEGORY.SORT_SUMMARY}" primaryText="Summary" />
                            </IconMenu>
                            <IconButton id="schedule_regist"
                                        tooltip="add schedule"
                                        iconStyle={style.toolbar_button} >
                                <FontIcon className="material-icons">add</FontIcon>
                            </IconButton>
                         </ToolbarGroup>
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
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
        this.onChangeMenu = this.onChangeMenu.bind(this);
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

    onChangeMenu(e, v) {
        switch(v) {
            case "1": // configuration.
                this.setState({isActive: true});
                break;
            case "2": // signout.
                location.href="/signout";
                break;
            default:
                break;
        }
    }

    render() {
        let style = {
            root: { marginTop: "-8px", padding: 0, height: "48px"},
            icon: { color: "white", fontSize: "18px", margin: 0, padding: 0 },
        };
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <IconMenu iconButtonElement={<IconButton><MenuIcon /></IconButton>}
                              style={style.root}
                              iconStyle={style.icon}
                              value='0'
                              onChange={this.onChangeMenu}>
                        <MenuItem value="1" primaryText="Config" />
                        <MenuItem value="2" primaryText="Signout" />
                    </IconMenu>
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
        </MuiThemeProvider>
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

    onSearch: function(v) {
        if(v === '') return;
        if(v === 'all') {
            this.setState({schedules: this.state.baseSchedules});
            return;
        }

        let reg_exp = new RegExp(v.split(/\s+/).reduce((prev, cur) => {
            return '^(?=.*' + prev + ')' + '(?=.*' + cur +')'; // AND search.
        }));

        // search at realtime.
        let filter_schedules =
            this.state.baseSchedules.filter((s) => {
                let target = '';
                for(let k in s) target += s[k];
                return reg_exp.test(target);
        });
        this.setState({schedules: filter_schedules});
    },

    onSortAsc: function(v) {
        // sort schedules.
        let cb = null;
        if(variables.SORT_CATEGORY.SORT_CATEGORY === v) cb = this.compareDate; // sort by StartDate.
        else if(variables.SORT_CATEGORY.SORT_GUEST === v) cb = this.compareGuest; // sort by Guest.
        else if(variables.SORT_CATEGORY.SORT_SUMMARY === v) cb = this.compareSummary; // sort by Summary.

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
        if(variables.SORT_CATEGORY.SORT_CATEGORY === v) cb = this.compareDateDes; // sort by StartDate.
        else if(variables.SORT_CATEGORY.SORT_GUEST === v) cb = this.compareGuestDes; // sort by Guest.
        else if(variables.SORT_CATEGORY.SORT_SUMMARY === v) cb = this.compareSummaryDes; // sort by Summary.


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
                    <HeaderComponent profile={this.state.profile}
                                     onSearch={this.onSearch}
                                     onSortAsc={this.onSortAsc}
                                     onSortDes={this.onSortDes} />
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
