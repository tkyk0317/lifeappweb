import React from 'react';
import DefaultLayout from './layout';

//----------------------------------------.
// Index Component.
//----------------------------------------.
var Index = React.createClass({
    getInitialState: function() {
        return ({
            searchText: '',
        });
    },

    onChange: function(e) {
        console.log(e);
        this.setState({searchText: e.target.value});
    },

    render: function() {
      return (
        <DefaultLayout title={this.props.title}>
          <div style={{display:"none"}}>
            <h1>{this.props.title}</h1>
          </div>
          <div id="page-content"></div>
          <link type="text/css" rel="stylesheet" href="/stylesheets/index.css" />
          <script src="/javascripts/build/main.bundle.js" />
        </DefaultLayout>
      );
    },
});

module.exports = Index;
