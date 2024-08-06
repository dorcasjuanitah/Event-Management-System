import React from 'react';
import Event from './Event';

const Homepage = ({ events }) => {
  return (
    <div>
      <h1>Homepage</h1>
      <div className="events-list">
        {events.map(event => (
          <Event key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;