import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import Calendar from './calendar.js';
import ScheduleCardArea from './schedule.js';

//----------------------------------------.
// Main Content Cpomnent.
//----------------------------------------.
var MainContent = React.createClass({
  render: function() {
    return (
        <div className="mdl-grid">
          <Calendar selected={moment().startOf("day")} />
          <ScheduleCardArea />
        </div>
    );
  },

});

//----------------------------------------.
// Rendering Main Content.
//----------------------------------------.
ReactDOM.render(
  <MainContent />,
  document.getElementById('page-content')
);
