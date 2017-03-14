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
import MenuItem from 'material-ui/MenuItem';

var utility = require ('./utility.js');

//-------------------------------------------------.
// Configutaion Modal Component.
//-------------------------------------------------.
export default class ConfigModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAcive: false,
            willClose: false,
        };
        // bind function.
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive) this.setState({isActive: true, willClose: false});
        else this.setState({willClose: true, isActive: false});
    }

    onChange(e) {
        this.state.onChange(e);
    }

    onSubmit() {
        this.state.onSubmit();
    }

    onClose() {
        this.props.onClose();
    }

    render() {
        if (this.state.isActive) {
            const actions = [
                <FlatButton label="Update"
                            primary={true}
                            onTouchTap={this.props.onSubmit} />,
                <FlatButton label="Cancel"
                            onTouchTap={this.props.onClose} />,
            ];
            const style = {
                text_field: { width: "100%", },
                menu_field: { width: "100%", padding: "0", },
                menuline_field: { width: "100%", margin: "0", },
                menu_button: { right: "0", },
                focuslineStyle: { borderColor: "#3f51b5", },
                dialog: { width: "400px" },
            };

            return (
                <div>
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <div>
                            <Dialog title={this.props.title}
                                    actions={actions}
                                    autoScrollBodyContent={true}
                                    contentStyle={style.dialog}
                                    open={this.state.isActive}>
                               <TextField name="firstname"
                                          style={style.text_field}
                                          underlineFocusStyle={style.focuslineStyle}
                                          defaultValue={this.props.firstname}
                                          hintText="firstname"
                                          onChange={this.props.onChange} />
                               <br/>
                               <TextField name="lastname"
                                          style={style.text_field}
                                          underlineFocusStyle={style.focuslineStyle}
                                          defaultValue={this.props.lastname}
                                          hintText="lastname"
                                          onChange={this.props.onChange} />
                               <TextField name="email"
                                          style={style.text_field}
                                          underlineFocusStyle={style.focuslineStyle}
                                          defaultValue={this.props.email}
                                          hintText="email"
                                          type="email"
                                          onChange={this.props.onChange} />
                               <TextField name="password"
                                          style={style.text_field}
                                          underlineFocusStyle={style.focuslineStyle}
                                          defaultValue={this.props.password}
                                          hintText="password"
                                          type="password"
                                          onChange={this.props.onChange} />
                               <br/>
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
