import React, { useState, useEffect } from 'react';
import '../App.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationCounts, setRegistrationCounts] = useState({});

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = () => {
    fetch('http://127.0.0.1:5555/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        // Initialize registration counts for each event
        const initialCounts = data.reduce((acc, event) => {
          acc[event.id] = 0;
          return acc;
        }, {});
        setRegistrationCounts(initialCounts);
      })
      .catch(error => console.error('Error fetching events:', error));
  };

  const fetchRegistrations = () => {
    fetch('http://127.0.0.1:5555/registrations')
      .then(response => response.json())
      .then(data => {
        const counts = data.reduce((acc, registration) => {
          const eventId = registration.event_id;
          acc[eventId] = (acc[eventId] || 0) + 1;
          return acc;
        }, {});
        setRegistrationCounts(counts);
      })
      .catch(error => console.error('Error fetching registrations:', error));
  };

  const handleRegister = (eventId) => {
    const newRegistration = {
      event_id: eventId,
      review: '', // Optional: You can add a review field if needed
    };

    fetch('http://127.0.0.1:5555/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRegistration),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
      })
      .then(data => {
        setRegistrationCounts(prevCounts => ({
          ...prevCounts,
          [eventId]: (prevCounts[eventId] || 0) + 1,
        }));
        setRegistrationMessage('Registered successfully');
      })
      .catch(error => console.error('Error registering for event:', error));
  };

  return (
    <div>
      <h1>Events</h1>
      {registrationMessage && <p className="success-message">{registrationMessage}</p>}
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-item">
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
            <button onClick={() => handleRegister(event.id)}>Register</button>
            <p>Registrations: {registrationCounts[event.id] || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;