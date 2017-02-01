
import React from "react";
import classNames from "classnames";

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
        return (
          <div>
            <div
              style={{
                display: "block", zIndex: "8887", position: "absolute",
                top: "0", bottom: "0", left: "0", right: "0", background: "gray",
                opacity: "0.7"
              }}
              onClick={this.state.onClose}>
            </div>
            <div
              className="mdl-dialog dialg_form"
              style={{
                display: "block", zIndex: "8888", width: "350px", position: "absolute",
                top: 5, bottom: 5, left: 5, right: 5, height: "25vh",
                margin: "auto", background: "white"
              }}>
              <div className="mdl-dialog__title">{this.state.title}</div>
              <div className="mdl-dialog__content">
                <p>{this.props.message}</p>
              </div>
              <div className="mdl-dialog__actions mdl-dialog__actions--full-width">
                <button type="button" className="mdl-button"
                        onClick={this.state.onClickBtn1}>{this.props.btn1_title}</button>
                <button type="button" className="mdl-button"
                        onClick={this.state.onClickBtn2}>{this.props.btn2_title}</button>
              </div>
            </div>
          </div>
        );
    } else {
      return false;
    }
  }
}
