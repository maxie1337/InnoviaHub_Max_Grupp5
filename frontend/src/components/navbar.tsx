import React, { useState } from "react";
import "./navbar.css";
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Innovia Hub</div>
      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggle-icon">&#9776;</span>
      </button>
      <div className={`navbar-links${open ? " open" : ""}`}>
        <a href="/" className="navbar-link">Home</a>
        <a href="/booking" className="navbar-link">Booking</a>
        <a href="/login" className="navbar-link navbar-login">Log In</a>
      </div>
    </nav>
  );
};

export default Navbar;