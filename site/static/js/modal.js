import React from "react";
import classNames from "classnames";

//-------------------------------------------------.
// Modal Component.
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
      title: this.props.title,
      startDateTime: this.props.startDateTime,
      endDateTime: this.props.endDateTime,
      summary: this.props.summary,
      memo: this.props.memo,
      people: this.props.people,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive) {
      this.setState({isActive: true, willClose: false})
    } else {
      this.setState({willClose: true, isActive: false});
    }
  }

  onChange(event) {
    this.state.onChange(event);
  }

  onSubmit() {
    this.state.onSubmit();
  }

  onClose() {
    this.state.onClose();
  }

  render() {
    if (this.state.isActive) {
      var summary_label = this.state.summary === "" ? "summary" : "";
      var memo_label = this.state.memo === "" ? "memo" : "";
      var people_label = this.state.people === "" ? "people" : "";
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
            className="mdl-dialog dialg_form"
            style={{
              display: "block", zIndex: "8888", width: "350px", position: "absolute",
              top: 5, bottom: 5, left: 5, right: 5,
              margin: "auto", background: "white"
            }}
          >
            <div className="mdl-dialog__title">{this.state.title}</div>
            <div className="mdl-dialog__content">
              <div className="mdl-textfield mdl-js-textfield">
                <input type="datetime-local"
                       name="startdatetime"
                       defaultValue={this.state.startDateTime}
                       onChange={this.state.onChange} />
                <label className="mdl-texfiedl__label" htmlFor="startDateTime"></label>
              </div>
              <div className="mdl-textfield mdl-js-textfield">
                <input type="datetime-local"
                       name="enddatetime"
                       defaultValue={this.state.endDateTime}
                       onChange={this.state.onChange} />
                <label className="mdl-texfiedl__label" htmlFor="endDateTime"></label>
              </div>
              <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input"
                       name="people"
                       type="text"
                       defaultValue={this.state.people}
                       onChange={this.state.onChange} />
                <label className="mdl-texfiedl__label" htmlFor="people">{people_label}</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield">
                <input className="mdl-textfield__input"
                       name="summary"
                       type="text"
                       defaultValue={this.state.summary}
                       onChange={this.state.onChange}/>
                <label className="mdl-textfield__label" htmlFor="summary">{summary_label}</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield">
                <textarea className="mdl-textfield__input"
                          style={{"resize": "none"}}
                          name="memo"
                          type="text"
                          rows="3"
                          defaultValue={this.props.memo}
                          onChange={this.state.onChange} />
                <label className="mdl-textfield__label" htmlFor="memo">{memo_label}</label>
              </div>
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
