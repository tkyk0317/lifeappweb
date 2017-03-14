import React from 'react';
import ScheduleModal from './modal.js';
import ScheduleCard from './schedule_card.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var utility = require ('./utility.js');
var variables = require('./variable.js');
var ajax = require('./ajax_action.js');

//---------------------------------------------------------.
// Schedule Card Component.
//---------------------------------------------------------.
export default class ScheduleCardArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canCompleteMessage: false,
            completeMessage: "",
            schedules: this.props.schedules.filter((d) => {
                // only schedules after today.
                return d.startdatetime >= (utility.toDateString(new Date) + " 00:00");
            }),
        };
        // bind function.
        this.onRegist = this.onRegist.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.schedules) {
            this.setState({
                schedules: nextProps.schedules.filter((d) => {
                    return d.startdatetime >= (utility.toDateString(new Date) + " 00:00");
                })
            });
        }
    }

    render() {
        var obj = this;
        var onCloseToast = function() {
            obj.setState({canCompleteMessage: false});
            obj.setState({completeMessage: ""});
        };
        return (
            <div id="card_area"
                 className="mdl-cell mdl-cell--7-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
                <RegistSchedule onRegist={this.onRegist}
                                memberId={this.props.memberId}
                                calendarlist={this.props.calendarlist} />
                <ScheduleList schedules={this.state.schedules}
                              calendarlist={this.props.calendarlist}
                              onRegist={this.onRegist}/>
                <ToastBar open={this.state.canCompleteMessage}
                          message={this.state.completeMessage}
                          onClose={onCloseToast} />
            </div>
        );
    }

    onRegist(msg, category, data) {
        // display complete messages.
        this.setState({completeMessage: msg});
        this.setState({canCompleteMessage: true});

        // call parent callback function.
        this.props.onComplete(msg, category, data);
    }
}

//---------------------------------------------------------.
// Snackbar Component.
//---------------------------------------------------------.
class ToastBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <Snackbar
                    open={this.props.open}
                    message={this.props.message}
                    autoHideDuration={1000}
                    onRequestClose={this.props.onClose} />
            </MuiThemeProvider>
        );
    }
}

//---------------------------------------------------------.
// Display ScheduleList Component.
//---------------------------------------------------------.
class ScheduleList extends React.Component {
    render() {
        if(this.props.schedules) {
            // display my schedules.
            var self = this;
            var schedule_list =
                this.props.schedules.map(function(v) {
                    return (<ScheduleCard key={v.id}
                                          scheduleId={v.id}
                                          calendarid={v.calendarid}
                                          calendartitle={v.calendartitle}
                                          calendarlist={self.props.calendarlist}
                                          memberId={v.memberid}
                                          startDateTime={v.startdatetime}
                                          endDateTime={v.enddatetime}
                                          summary={v.summary}
                                          memo={v.memo}
                                          guest={v.guest}
                                          onRegist={self.props.onRegist} />);
                });
            return (<ReactCSSTransitionGroup transitionName="schedule_card"
                                             transitionAppear={true}
                                             transitionAppearTimeout={500}
                                             transitionEnterTimeout={700}
                                             transitionLeaveTimeout={700}>
                {schedule_list}
            </ReactCSSTransitionGroup>);
        }
        return <span />;
    }
}

//---------------------------------------------------------.
// Registe Schedule Component.
//---------------------------------------------------------.
class RegistSchedule extends React.Component {
    constructor(props) {
        super(props);

        var start_date = new Date();
        var end_date = new Date();
        end_date.setMinutes(end_date.getMinutes() + 30);
        this.state = {
            isActive: false,
            startdate: utility.toDateString(start_date),
            enddate: utility.toDateString(end_date),
            starttime: utility.toTimeString(start_date),
            endtime: utility.toTimeString(end_date),
            calendarlist: this.props.calendarlist,
            targetcalid: this.searchCalId(this.props.calendarlist),
        };
        // bind function.
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeDateTime = this.onChangeDateTime.bind(this);
        this.onChangeCalList = this.onChangeCalList.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({calendarlist: nextProps.calendarlist});
        this.setState({targetcalid: this.searchCalId(nextProps.calendarlist)});
    }

    searchCalId(lists) {
        if(lists && 0 < lists.length) return lists[0].id;
        return null;
    }

    componentDidMount() {
        var self = this;
        var regist_button = document.getElementById('schedule_regist');
        regist_button.addEventListener('click', function() {
            self.openModal();
        });
    }

    render() {
        return (<ScheduleModal isActive={this.state.isActive}
                               onSubmit={this.onSubmit}
                               onChange={this.onChange}
                               onChangeDateTime={this.onChangeDateTime}
                               onChangeCalList={this.onChangeCalList}
                               onClose={this.closeModal}
                               title="Add Schedule"
                               calendarlist={this.props.calendarlist}
                               startdate={utility.fromDateTimeString(this.state.startdate + " " + this.state.starttime)}
                               starttime={utility.fromDateTimeString(this.state.startdate + " " + this.state.starttime)}
                               enddate={utility.fromDateTimeString(this.state.enddate + " " + this.state.endtime)}
                               endtime={utility.fromDateTimeString(this.state.enddate + " " + this.state.endtime)}
                               summary=""
                               memo=""
                               guest=""
                               targetcalid={this.state.targetcalid}
                               confirmButtonTitle="Regist"
                />);
    }

    openModal() {
        this.setState({isActive: true});
    }

    closeModal() {
        this.setState({isActive: false});
    }

    onSubmit(event) {
        // generate datetime.
        var s_date = this.state.startdate + " " + this.state.starttime;
        var e_date = this.state.enddate + " " + this.state.endtime;

        // regist event to table.
        var obj = this;
        var params = {
            "calendarid": this.state.targetcalid,
            "memberid": this.props.memberId,
            "startdatetime": s_date,
            "enddatetime": e_date,
            "summary": this.state.summary,
            "memo": this.state.memo,
            "guest": this.state.guest,
        };
        ajax.post('/v1/schedules', params,
                  function(err, res) {
                      // push schdule id.
                      params.id = res.body.id;

                      // after update schedule data, start rendering.
                      obj.closeModal();
                      obj.props.onRegist("Complete Regist", variables.ACTION_CATEGORY.REGIST_SCHEDULE, params);
                  });
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onChangeDateTime(n, v) {
        this.setState({ [n]: v });
    }

    onChangeCalList(e, i, v) {
        this.setState({targetcalid: v });
    }
}
