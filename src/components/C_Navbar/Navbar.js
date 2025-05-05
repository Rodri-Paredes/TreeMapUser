import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from './logoTreeMap.png';
import messages from 'config/messages.json';

function NavigationBar() {
  const navBarMessages = messages.navBar;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-app">
        <div className="navbar-logo-section">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">{navBarMessages.title}</span>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? '✖' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>
            {navBarMessages.home}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
            {navBarMessages.about}
          </NavLink>
          <NavLink to="/treetype" className={({ isActive }) => isActive ? 'active-link' : ''}>
            {navBarMessages.treeType}
          </NavLink>
          <NavLink to="/estadisticas" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Estadísticas
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Historial
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
