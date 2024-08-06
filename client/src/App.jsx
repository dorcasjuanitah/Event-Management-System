import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update import

import Navbar from './Components/Navbar';
import Events from './Components/Events';
import Login from './Components/Login';
import CreateEvent from './Components/CreateEvent';
import EditEvent from './Components/EditEvent';
import Event from './Components/Event';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div>
        <h1>Events Management System</h1>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/events" element={<Event />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/" element={<Events />} exact />
        </Routes>
      </div>
    </Router>
  );
};

export default App;