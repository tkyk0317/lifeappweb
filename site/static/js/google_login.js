import React from "react";
import ReactDOM from "react-dom";

//----------------------------------------.
// Google Login Component.
//----------------------------------------.
var GoogleLogin = React.createClass({
  render: function() {
    var url = document.getElementById('google_with_signin').attributes['url'].nodeValue;
    return (
      <a href={url}>
            <button id="google_with_signin_button"
                    className="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-js-ripple-effect">Signin with Google</button>
      </a>
    );
  },
});

//----------------------------------------.
// Render Google Login Component.
//----------------------------------------.
ReactDOM.render(
  <GoogleLogin />,
  document.getElementById('google_with_signin')
);
