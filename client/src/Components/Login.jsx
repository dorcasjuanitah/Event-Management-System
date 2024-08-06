import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5555/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setIsAuthenticated(true);

      // Fetch and store user-specific events (assuming you have an endpoint for this)
      const eventsResponse = await fetch(`http://127.0.0.1:5555/users/${data.user_id}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access_token}`, // Assuming token-based auth
        },
      });

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        // Assuming you have a function to store events in state or context for use in another component
        // storeUserEvents(eventsData);
        // Example navigate to events page after successful login
        navigate('/events');
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;