import React from 'react';
import DefaultLayout from './layout';

//--------------------------------------.
// Login Compoment.
//--------------------------------------.
var Login = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div id="signin" />
        <input type="hidden" value={this.props.title} id="title" />
        <input type="hidden" value={this.props.error} id="error" />
        <input type="hidden" value={this.props.email} id="email" />
        <link type="text/css" rel="stylesheet" href="/stylesheets/signin.css" />
        <script src="/javascripts/build/signin.bundle.js" />
      </DefaultLayout>
    );
  },
});

module.exports = Login;
