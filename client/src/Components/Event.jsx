import React, { useState, useEffect } from 'react';
import '../App.css';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5555/events')
      .then(response => response.json())
      .then(data => setEvents(data));
  }, []);

  const handleUpdate = async (eventId, newName) => {
    const response = await fetch(`http://127.0.0.1:5555/events${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    const data = await response.json();
    setMessage(data.message);
    fetch('http://127.0.0.1:5555/events')
      .then(response => response.json())
      .then(data => setEvents(data));
  };

  const handleDelete = async (eventId) => {
    const response = await fetch(`http://127.0.0.1:5555/events${eventId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    setMessage(data.message);
    fetch('http://127.0.0.1:5555/events')
      .then(response => response.json())
      .then(data => setEvents(data));
  };

  return (
    <div>
      <h1>Events</h1>
      {message && <p>{message}</p>}
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-item">
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
            <button onClick={() => handleUpdate(event.id, 'Updated Event Title')}>Edit</button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;