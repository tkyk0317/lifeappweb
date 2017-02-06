import React from "react";
import classNames from "classnames";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// call for touch event.
injectTapEventPlugin();

//-------------------------------------------------.
// Schedule Modal Component.
//-------------------------------------------------.
export default class ScheduleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAcive: false,
      willClose: false,
      onSubmit: this.props.onSubmit,
      onChange: this.props.onChange,
      onClose: this.props.onClose,
      onChangeDateTime: this.props.onChangeDateTime,
      startdate: this.props.startdate,
      starttime: this.props.starttime,
      enddate: this.props.enddate,
      endtime: this.props.endtime,
      title: this.props.title,
      summary: this.props.summary,
      memo: this.props.memo,
      people: this.props.people,
    };

    // bind function.
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive) {
      this.setState({isActive: true, willClose: false})
    } else {
      this.setState({willClose: true, isActive: false});
    }
  }

  onChangeStartDate(e, v) {
    var date = v.getFullYear() +
              "-" + ("0" + (v.getMonth() + 1)).slice(-2) +
              "-" + ("0" + (v.getDate())).slice(-2);
    this.state.onChangeDateTime("startdate", date);
  }

  onChangeEndDate(e, v) {
    var date = v.getFullYear() +
              "-" + ("0" + (v.getMonth() + 1)).slice(-2) +
              "-" + ("0" + (v.getDate())).slice(-2);
    this.state.onChangeDateTime("enddate", date);
  }

  onChangeStartTime(e, v) {
    var time = ("0" + (v.getHours())).slice(-2) + ":" + ("0" + (v.getMinutes())).slice(-2);
    this.state.onChangeDateTime("starttime", time);
  }

  onChangeEndTime(e, v) {
    var time = ("0" + (v.getHours())).slice(-2) + ":" + ("0" + (v.getMinutes())).slice(-2);
    this.state.onChangeDateTime("endtime", time);
  }

  onChange(e) {
    this.state.onChange(e);
  }

  onSubmit() {
    this.state.onSubmit();
  }

  onClose() {
    this.state.onClose();
  }

  render() {
    if (this.state.isActive) {
      return (
        <div>
          <div
            style={{
              display: "block", zIndex: "8887", position: "absolute",
              top: "0", bottom: "0", left: "0", right: "0", background: "gray",
              opacity: "0.7"
            }}
            onClick={this.state.onClose}
          >
          </div>
          <div
            className="mdl-dialog dialog_form"
            style={{
              display: "block", zIndex: "8888", width: "350px", position: "absolute",
              top: 5, bottom: 5, left: 5, right: 5, height: "60vh",
              margin: "auto", background: "white"
            }}
          >
            <div className="mdl-dialog__title">{this.state.title}</div>
            <div className="mdl-dialog__content">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                  <DatePicker hintText="Start Date"
                              autoOk={true}
                              name="startdate"
                              defaultDate={this.state.startdate}
                              onChange={this.onChangeStartDate} />
                  <TimePicker hintText="Start Time"
                              format="24hr"
                              autoOk={true}
                              name="starttime"
                              defaultTime={this.state.starttime}
                              value={this.state.starttime}
                              onChange={this.onChangeStartTime}/>
                  <DatePicker hintText="End Date"
                              autoOk={true}
                              name="enddate"
                              defaultDate={this.state.enddate}
                              onChange={this.onChangeEndDate} />
                  <TimePicker hintText="End Time"
                              format="24hr"
                              autoOk={true}
                              name="endtime"
                              defaultTime={this.state.endtime}
                              value={this.state.endtime}
                              onChange={this.onChangeEndTime}/>
                  <TextField name="people"
                              hintText="people"
                              defaultValue={this.state.people}
                              onChange={this.state.onChange} />
                  <TextField name="summary"
                              hintText="summary"
                              defaultValue={this.state.summary}
                              onChange={this.state.onChange}/>
                  <TextField name="memo"
                              hintText="memo"
                              multiLine={true}
                              rows={2}
                              rowsMax={4}
                              defaultValue={this.props.memo}
                              onChange={this.state.onChange} />
                </div>
              </MuiThemeProvider>
            </div>
            <div className="mdl-dialog__actions mdl-dialog__actions--full-width">
              <button type="button" className="mdl-button" onClick={this.state.onSubmit}>{this.props.confirmButtonTitle}</button>
              <button type="button" className="mdl-button" onClick={this.state.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      );
    } else {
      return false;
    }
  }
}
