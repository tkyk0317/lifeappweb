import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var utility = require ('./utility.js');

//-------------------------------------------------.
// Basic Modal Component.
//-------------------------------------------------.
export default class BasicModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            onClose: this.props.onClose,
            onClickBtn1: this.props.onClickBtn1,
            onClickBtn2: this.props.onClickBtn2,
            btn1_title: this.props.btn1_title,
            btn2_title: this.props.btn2_title,
            title: this.props.title,
            message: this.props.message
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive) {
            this.setState({isActive: true})
        } else {
            this.setState({isActive: false});
        }
    }

    onClose() {
        this.state.onClose();
    }

    onClickBtn1() {
        this.state.onClickBtn1();
    }

    onClickBtn2() {
        this.state.onClickBtn2();
    }

    render() {
        if(this.state.isActive) {
            var actions = [
                <FlatButton label={this.props.btn1_title} primary={true} onTouchTap={this.state.onClickBtn1} />,
                <FlatButton label={this.props.btn2_title} onTouchTap={this.state.onClickBtn2} />,
            ];
            var style = {
                dialog: { width: utility.isSmartPhone() ? "300px" : "400px", }
            };
            return (
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <div>
                        <Dialog title={this.state.title}
                                actions={actions}
                                contentStyle={style.dialog}
                                open={this.state.isActive}>
                            <p>{this.props.message}</p>
                        </Dialog>
                    </div>
                </MuiThemeProvider>
            );
        } else {
            return false;
        }
    }
}
