import React from 'react';
import ScheduleModal from './modal.js';
import BasicModal from './basic_modal.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

var variables = require('./variable.js');
var utility = require('./utility.js');

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
      starttime: this.props.startDateTime.substr(11),
      enddate: this.props.endDateTime.substr(0, 10),
      endtime: this.props.endDateTime.substr(11),
      summary: this.props.summary,
      memo: this.props.memo,
      guest: this.props.guest,
      avatar: this.props.avatar,
    };

    //  bind function.
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDateTime = this.onChangeDateTime.bind(this);
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

  onSubmit() {
    // generate datetime.
    var s_date = this.state.startdate + " " + this.state.starttime;
    var e_date = this.state.enddate + " " + this.state.endtime;

    var obj = this;
    var req = require('superagent');
    req.put("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .send({
              "memberid": this.props.memberId,
              "startdatetime": s_date,
              "enddatetime": e_date,
              "summary": this.state.summary,
              "memo": this.state.memo,
              "guest": this.state.guest,
            })
       .end(function(err, res) {
         // disable dialog.
         obj.closeModal();
         // after update schedule data, start rendering.
         obj.props.onRegist("Complete Edit", variables.ACTION_CATEGORY.UPDATE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": obj.props.memberId,
                             "startdatetime": s_date,
                             "enddatetime": e_date,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                             "guest": obj.state.guest,
                           });
      });
  }

  onDeleteBtnOk() {
    // generate datetime.
    var s_date = this.state.startdate + " " + this.state.starttime;
    var e_date = this.state.enddate + " " + this.state.endtime;

    var obj = this;
    var req = require('superagent');
    req.del("/filter_schedule/" + this.props.scheduleId)
       .set('Accept', 'application/json')
       .set('Content-Type', 'application/json')
       .end(function(err, res) {
         obj.closeDeleteModal();
         obj.props.onRegist("Complete Delete", variables.ACTION_CATEGORY.DELETE_SCHEDULE,
                           {
                             "id": obj.props.scheduleId,
                             "memberid": obj.props.memberId,
                             "startdatetime": s_date,
                             "enddatetime": e_date,
                             "summary": obj.state.summary,
                             "memo": obj.state.memo,
                             "guest": obj.state.guest,
                           });
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

    var avatar = this.props.avatar;
    if(!avatar) {
      // avatar is not uploaded, set default image.
      avatar = <Avatar icon={<FontIcon className="material-icons">account_circle</FontIcon>}/>;
    }
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div id="schedule_card">
            <Card>
              <CardHeader title={this.props.summary}
                          titleStyle={{fontSize: "large"}}
                          avatar={avatar}
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
                       title="Edit Schedule"
                       startdate={utility.fromDateTimeString(this.props.startDateTime)}
                       starttime={utility.fromDateTimeString(this.props.startDateTime)}
                       enddate={utility.fromDateTimeString(this.props.endDateTime)}
                       endtime={utility.fromDateTimeString(this.props.endDateTime)}
                       summary={this.props.summary}
                       memo={this.props.memo}
                       guest={this.props.guest}
                       confirmButtonTitle="Update" />
          <BasicModal isActive={this.state.isDeleteModalActive}
                      onClickBtn1={this.onDeleteBtnOk}
                      onClickBtn2={this.onDeleteBtnCancel}
                      onClose={this.closeDeleteModal}
                      title="Delete Schedule"
                      message="Delete this Schedule ?"
                      btn1_title="OK"
                      btn2_title="Cancel" />
        </div>);
  }
}
