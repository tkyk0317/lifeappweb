import React from 'react';
import ScheduleModal from './modal.js';
import BasicModal from './basic_modal.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

var variables = require('./variable.js');
var utility = require('./utility.js');
var ajax = require('./ajax_action.js');

//-------------------------------------.
// Card Component.
//-------------------------------------.
export default class ScheduleCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            isModal: false,
            isDeleteModalActive: false,
            scheduleIi: this.props.scheduleId,
            startDateTime: this.props.startDateTime,
            endDateTime: this.props.endDateTime,
            startdate: this.props.startDateTime.substr(0, 10),
            starttime: this.props.startDateTime.substr(11, 5),
            enddate: this.props.endDateTime.substr(0, 10),
            endtime: this.props.endDateTime.substr(11, 5),
            summary: this.props.summary,
            memo: this.props.memo,
            guest: this.props.guest,
            location: this.props.location,
            orgcalendarid: this.props.calendarid,
            calendarid: this.props.calendarid,
        };

        //  bind function.
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeDateTime = this.onChangeDateTime.bind(this);
        this.onChangeCalList = this.onChangeCalList.bind(this);
        this.onDeleteBtnOk = this.onDeleteBtnOk.bind(this);
        this.onDeleteBtnCancel = this.onDeleteBtnCancel.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // when modal will close, must render.
        if(!nextState.isActive && this.state.isActive) return true;

        // when open the modal, not render(card content is not updated).
        if(this.state.isActive) return false;
        return true;
    }

    openModal() {
        this.setState({isActive: true});
    }

    closeModal() {
        this.setState({isActive: false});
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeDateTime(n, v) {
        this.setState({ [n]: v });
    }

    onChangeCalList(e, i, v) {
        this.setState({calendarid: v });
    }

    onSubmit() {
        // generate datetime.
        var s_date = this.state.startdate + " " + this.state.starttime;
        var e_date = this.state.enddate + " " + this.state.endtime;

        var self = this;
        var params = {
            "id": this.props.scheduleId,
            "orgcalendarid": this.state.orgcalendarid,
            "calendarid": this.state.calendarid,
            "memberid": this.props.memberId,
            "startdatetime": s_date,
            "enddatetime": e_date,
            "summary": this.state.summary,
            "memo": this.state.memo,
            "guest": this.state.guest,
            "location": this.state.location,
        };
        ajax.put('/v1/schedules/' + this.props.scheduleId, params,
                 function(err, res) {
                     // disable dialog.
                     self.closeModal();
                     // after update schedule data, start rendering.
                     if(params.orgcalendarid !== params.calendarid) {
                         // event move to other calendar.
                         self.setState({orgcalendarid: params.calendarid});
                         params.orgcalendarid = params.calendarid;
                     }
                     self.props.onRegist("Complete Edit", variables.ACTION_CATEGORY.UPDATE_SCHEDULE, params);
        });
    }

    onDeleteBtnOk() {
        // generate datetime.
        var s_date = this.state.startdate + " " + this.state.starttime;
        var e_date = this.state.enddate + " " + this.state.endtime;
        var params = {
            "id": this.props.scheduleId,
            "calendarid": this.state.calendarid,
            "memberid": this.props.memberId,
            "startdatetime": s_date,
            "enddatetime": e_date,
            "summary": this.state.summary,
            "memo": this.state.memo,
            "guest": this.state.guest,
            "location": this.state.location,
        };
        var self = this;
        ajax.del('/v1/schedules/' + this.props.scheduleId, params,
                 function(err, res) {
                     self.closeDeleteModal();
                     self.props.onRegist("Complete Delete", variables.ACTION_CATEGORY.DELETE_SCHEDULE, params);
                 });
    }

    onDeleteBtnCancel() {
        this.closeDeleteModal();
    }

    openDeleteModal() {
        this.setState({isDeleteModalActive: true})
    }

    closeDeleteModal() {
        this.setState({isDeleteModalActive: false})
    }

    render() {
        var s_date = this.state.startdate + " " + this.state.starttime;
        var e_date = this.state.enddate + " " + this.state.endtime;
        var date = s_date + "/" + e_date;

        const delete_title = this.props.calendartitle ? "Delete Schedule" + "\n(" + this.props.calendartitle + ")" : "Delete Schedule";
        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <div id="schedule_card">
                        <Card>
                            <CardHeader title={this.props.summary}
                                        titleStyle={{fontSize: "large"}}
                                        subtitle={date} />
                            <CardText>
                                {this.props.memo}
                            </CardText>
                            <CardActions style={{display: "inline-block", textAligh: "right"}}>
                                <RaisedButton icon={<FontIcon className="material-icons">description</FontIcon>} label="Detail" primary={true} onTouchTap={this.openModal} />
                                <RaisedButton icon={<FontIcon className="material-icons">delete_forever</FontIcon>} label="Delete" secondary={true} onTouchTap={this.openDeleteModal} />
                            </CardActions>
                        </Card>
                    </div>
                </MuiThemeProvider>
                <ScheduleModal isActive={this.state.isActive}
                               onSubmit={this.onSubmit}
                               onChange={this.onChange}
                               onChangeDateTime={this.onChangeDateTime}
                               onClose={this.closeModal}
                               onChangeCalList={this.onChangeCalList}
                               title="Edit Schedule"
                               targetcalid={this.state.calendarid}
                               calendarlist={this.props.calendarlist}
                               startdate={utility.fromDateTimeString(this.props.startDateTime)}
                               starttime={utility.fromDateTimeString(this.props.startDateTime)}
                               enddate={utility.fromDateTimeString(this.props.endDateTime)}
                               endtime={utility.fromDateTimeString(this.props.endDateTime)}
                               summary={this.props.summary}
                               memo={this.props.memo}
                               guest={this.props.guest}
                               location={this.props.location}
                               confirmButtonTitle="Update" />
                <BasicModal isActive={this.state.isDeleteModalActive}
                            onClickBtn1={this.onDeleteBtnOk}
                            onClickBtn2={this.onDeleteBtnCancel}
                            onClose={this.closeDeleteModal}
                            title={delete_title}
                            message="Delete this Schedule ?"
                            btn1_title="OK"
                            btn2_title="Cancel" />
            </div>);
    }
}
