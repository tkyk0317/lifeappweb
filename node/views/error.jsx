import React from 'react';
import DefaultLayout from './layout';

//------------------------------------.
// Error Component.
//------------------------------------.
var Error = React.createClass({
  render: function() {
    return (
        <DefaultLayout title="Error">
            <div id="error">
                <div id="content">
                    <h1>404 page not found</h1>
                    <br />
                    <div id="recovery"><a href="/signin">Signin</a></div>
                    <div id="recovery"><a href="/signup">Signup</a></div>
                </div>
            </div>
            <link type="text/css" rel="stylesheet" href="/stylesheets/error.css" />
        </DefaultLayout>
    );
  }
});

module.exports = Error;
