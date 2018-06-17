import React from 'react';
import DefaultLayout from './layout';

//-------------------------------.
// Signup Complete Component.
//-------------------------------.
var Complete = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div className="center_box">
          <div className="message_box">
            <p>Account create complete</p>
            <p>Please signin to this service</p>
          </div>
          <a href="/signin">
            <button style={{width: "200px"}}
                    className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">
              Signin
            </button>
          </a>
        </div>
        <link type="text/css" rel="stylesheet" href="/stylesheets/signup_complete.css" />
      </DefaultLayout>
    );
  },
});

module.exports = Complete;
