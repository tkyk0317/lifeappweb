import React from "react";
import classNames from "classnames";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// call for touch event.
injectTapEventPlugin();

var utility = require ('./utility.js');

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
      guest: this.props.guest,
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
    this.state.onChangeDateTime("startdate", utility.toDateString(v));
  }

  onChangeEndDate(e, v) {
    this.state.onChangeDateTime("enddate", utility.toDateString(v));
  }

  onChangeStartTime(e, v) {
    this.state.onChangeDateTime("starttime", utility.toTimeString(v));
  }

  onChangeEndTime(e, v) {
    this.state.onChangeDateTime("endtime", utility.toTimeString(v));
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
      var actions = [
          <FlatButton label={this.props.confirmButtonTitle}
                      primary={true}
                      onTouchTap={this.state.onSubmit} />,
          <FlatButton label="Cancel"
                      onTouchTap={this.state.onClose} />,
      ];
      var style = {
        text_field: { width: "100%", },
        focuslineStyle: { borderColor: "#3f51b5", },
        dialog: { width: "400px" },
      };
      return (
        <div>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
              <Dialog title={this.state.title}
                      actions={actions}
                      autoScrollBodyContent={true}
                      contentStyle={style.dialog}
                      open={this.state.isActive}>
                <DatePicker hintText="Start Date"
                            autoOk={true}
                            name="startdate"
                            textFieldStyle={style.text_field}
                            defaultDate={this.props.startdate}
                            onChange={this.onChangeStartDate} />
                <TimePicker hintText="Start Time"
                            format="24hr"
                            textFieldStyle={style.text_field}
                            autoOk={true}
                            name="starttime"
                            defaultTime={this.props.starttime}
                            value={this.props.starttime}
                            onChange={this.onChangeStartTime} />
                <DatePicker hintText="End Date"
                            autoOk={true}
                            textFieldStyle={style.text_field}
                            name="enddate"
                            defaultDate={this.props.enddate}
                            onChange={this.onChangeEndDate} />
                <TimePicker hintText="End Time"
                            format="24hr"
                            autoOk={true}
                            textFieldStyle={style.text_field}
                            name="endtime"
                            defaultTime={this.props.endtime}
                            value={this.props.endtime}
                            onChange={this.onChangeEndTime} />
                          <TextField name="guest"
                            hintText="guest"
                            style={style.text_field}
                            underlineFocusStyle={style.focuslineStyle}
                            defaultValue={this.props.guest}
                            onChange={this.props.onChange} />
                <br />
                <TextField name="summary"
                            hintText="summary"
                            style={style.text_field}
                            underlineFocusStyle={style.focuslineStyle}
                            defaultValue={this.props.summary}
                            onChange={this.props.onChange} />
                <br />
                <TextField name="memo"
                            hintText="memo"
                            style={style.text_field}
                            underlineFocusStyle={style.focuslineStyle}
                            multiLine={true}
                            rows={2}
                            rowsMax={4}
                            defaultValue={this.props.memo}
                            onChange={this.props.onChange} />
              </Dialog>
            </div>
          </MuiThemeProvider>

        </div>
      );
    } else {
      return false;
    }
  }
}
