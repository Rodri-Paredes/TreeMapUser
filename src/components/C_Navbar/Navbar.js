import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Importar el archivo CSS
import logo from './logoTreeMap.png';  // Importa el logo desde la carpeta actual

function NavigationBar() {
  return (
    <Navbar className="navbar-custom" expand="lg"> {/* Clase personalizada */}
      <Navbar.Brand href="#home">
        <img
          src={logo}  // Usar el logo importado desde el archivo local
          alt="Logo"
          className="navbar-logo"  // Aplicar la clase personalizada para el logo
        />
        {' TreeMap NYC'}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
