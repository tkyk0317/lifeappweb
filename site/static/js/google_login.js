import React from "react";
import ReactDOM from "react-dom";

//----------------------------------------.
// Google Login Component.
//----------------------------------------.
var GoogleLogin = React.createClass({
  getInitialState: function() {
    return {
      url: this.props.url,
    };
  },

  render: function() {
    return (
      <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
              onClick={this.onClick}>
        "Signin with Google"
      </button>
    );
  },

  onClick() {
    document.getElementById('login_form').action = this.state.url;
  },
});

//----------------------------------------.
// Render Google Login Component.
//----------------------------------------.
ReactDOM.render(
  <GoogleLogin />,
  document.getElementById('google_with_signin')
);
