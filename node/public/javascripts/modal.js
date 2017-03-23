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
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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
            onChangeCalList: this.props.onChangeCalList,
            startdate: this.props.startdate,
            starttime: this.props.starttime,
            enddate: this.props.enddate,
            endtime: this.props.endtime,
            title: this.props.title,
            summary: this.props.summary,
            memo: this.props.memo,
            guest: this.props.guest,
            location: this.props.location,
            targetcalid: this.props.targetcalid, // not render DropDownMenu, unless save this.state.targetcalid and save when onChange Event.
        };

        // bind function.
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onChangeStartTime = this.onChangeStartTime.bind(this);
        this.onChangeEndTime = this.onChangeEndTime.bind(this);
        this.onChangeCalList = this.onChangeCalList.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive) {
            this.setState({isActive: true, willClose: false})
        } else {
            this.setState({willClose: true, isActive: false});
        }
        this.setState({targetcalid: nextProps.targetcalid});
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

    onChangeCalList(e, i, v) {
        this.setState({targetcalid: v});
        this.state.onChangeCalList(e, i, v);
   }

    onSubmit() {
        this.state.onSubmit();
    }

    onClose() {
        this.state.onClose();
    }

    render() {
        if (this.state.isActive) {
            const actions = [
                <FlatButton label={this.props.confirmButtonTitle}
                            primary={true}
                            onTouchTap={this.state.onSubmit} />,
                <FlatButton label="Cancel"
                            onTouchTap={this.state.onClose} />,
            ];
            const style = {
                text_field: { width: "100%", },
                menu_field: { width: "100%", padding: "0", },
                menuline_field: { width: "100%", margin: "0", },
                menu_button: { right: "0", },
                focuslineStyle: { borderColor: "#3f51b5", },
                dialog: { width: utility.isSmartPhone() ? "300px" : "400px" },
            };

            // generate calendarlist.
            var calendar_lists = '';
            if(this.state.targetcalid) {
                // create calendar lists.
                calendar_lists = this.props.calendarlist.map((v) => {
                    return <MenuItem key={v.id} value={v.id} primaryText={v.name} />;
                });
            }
            return (
                <div>
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <div>
                            <Dialog title={this.state.title}
                                    actions={actions}
                                    autoScrollBodyContent={true}
                                    contentStyle={style.dialog}
                                    open={this.state.isActive}>
                                {(() => {
                                     if(this.state.targetcalid) {
                                         return (
                                             <DropDownMenu value={this.state.targetcalid}
                                                           autoWidth={false}
                                                           style={style.menu_field}
                                                           listStyle={style.menu_field}
                                                           labelStyle={style.menu_field}
                                                           underlineStyle={style.menuline_field}
                                                           iconStyle={style.menu_button}
                                                           onChange={this.onChangeCalList} >
                                                 {calendar_lists}
                                             </DropDownMenu>
                                         );
                                     }
                                 })()}
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
                               hintText="guest(comma separated email addresse)"
                               style={style.text_field}
                               underlineFocusStyle={style.focuslineStyle}
                               defaultValue={this.props.guest}
                               onChange={this.props.onChange} />
                    <br/>
                    <TextField name="summary"
                               hintText="summary"
                               style={style.text_field}
                               underlineFocusStyle={style.focuslineStyle}
                               defaultValue={this.props.summary}
                               onChange={this.props.onChange} />
                    <br/>
                    <TextField name="location"
                               hintText="location"
                               style={style.text_field}
                               underlineFocusStyle={style.focuslineStyle}
                               defaultValue={this.props.location}
                               onChange={this.props.onChange} />
                    <br/>
                    <TextField name="memo"
                               hintText="memo"
                               style={style.text_field}
                               underlineFocusStyle={style.focuslineStyle}
                               multiLine={true}
                               rows={4}
                               rowsMax={8}
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
