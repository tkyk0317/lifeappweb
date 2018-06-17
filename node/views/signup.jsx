import React from 'react';
import DefaultLayout from './layout';

//----------------------------------.
// Signup Component.
//----------------------------------.
var Signup = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div id="center_form">
          <h1>{this.props.title}</h1>
          <p style={{color:"red"}}>{this.props.error}</p>
          <form method="POST" action="/signup" id="_form">
                      <div id="signup_form"></div>
          </form>
        </div>
        <link type="text/css" rel="stylesheet" href="/stylesheets/signup.css" />
        <script src="/javascripts/build/signup.bundle.js" />
      </DefaultLayout>
    );
  },
});

module.exports = Signup;
