import React from 'react';
import DefaultLayout from './layout';

//------------------------------------.
// Error Component.
//------------------------------------.
var Error = React.createClass({
  render: function() {
    return (
      <DefaultLayout title="Error">
        <h1>Not Found Page</h1>
      </DefaultLayout>
    );
  }
});

module.exports = Error;
