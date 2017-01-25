import React from 'react';
import ReactDOM from 'react-dom';

//---------------------------------------------------------.
// Schedule Card Component.
//---------------------------------------------------------.
var ScheduleCardArea = React.createClass({
  render: function() {
    return (
      <div>
        <article className="card schedule_card">
          <header>
            <h3>Test Card</h3>
            <p>Test Content</p>
          </header>
        </article>
        <article className="card schedule_card">
          <header>
            <h3>Test Card</h3>
            <button className="warning action_button">update</button>
            <button className="dangerous action_button">delete</button>
            <p>Test Content</p>
          </header>
        </article>
      </div>
    )
  }
});

ReactDOM.render(
  <ScheduleCardArea />,
  document.getElementById('card_area')
);
