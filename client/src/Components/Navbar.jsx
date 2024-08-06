import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import '../App.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleLogout = async () => {
    await fetch('/logout');
    setIsAuthenticated(false);
    navigate('/login'); // Use navigate instead of history.push
  };

  return (
    <nav>
      <ul>
        <li><Link to="/events">Events</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/create-event">Create Event</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;