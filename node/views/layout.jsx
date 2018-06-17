import React from 'react';

//-------------------------------------.
// Base Layout.
//-------------------------------------.
var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
            <title>{this.props.title}</title>
            <meta charset="UTF-8" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            <meta name="applie-mobile-web-app-status-bar-style" content="black" />

            <link type="text/css" rel="stylesheet" href="/stylesheets/animation.css" />
            <link type="text/css" rel="stylesheet" href="/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css" />
            <link type="text/css" rel="stylesheet" href="/stylesheets/base.css" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css" />

            <script src="https://apis.google.com/js/api.js" />
            <script src="https://code.getmdl.io/1.3.0/material.min.js" />
        </head>
        <body>{this.props.children}</body>
      </html>
    );
  },
});

module.exports = DefaultLayout;
