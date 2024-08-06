import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook instead of useHistory

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/events/${id}`) // Corrected fetch URL to include `/`
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date);
        setLocation(data.location);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5555/events/${id}`, { // Corrected fetch URL to include `/`
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, location }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Event updated successfully');
        navigate('/events'); // Navigate to '/events' after successful event update
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Event update failed:', error);
      setMessage('Event update failed. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Edit Event</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;