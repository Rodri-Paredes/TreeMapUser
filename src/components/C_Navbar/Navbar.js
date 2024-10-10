import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Importar el archivo CSS
import logo from './logoTreeMap.png';  // Importar el logo desde la carpeta actual
import messages from 'config/messages.json';


function NavigationBar() {
  const navBarMessages = messages.navBar;
  return (
    <Navbar className="navbar-custom" expand="lg"> {/* Clase personalizada */}
      <Navbar.Brand href="#home">
        <img
          src={logo}  // Usar el logo importado desde el archivo local
          alt="Logo"
          className="navbar-logo"  // Aplicar la clase personalizada para el logo
        />
        {navBarMessages.title}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">{navBarMessages.home}</Nav.Link>
          <Nav.Link as={Link} to="/about">{navBarMessages.about}</Nav.Link>
          <Nav.Link as={Link} to="/treetype">{navBarMessages.treeType}</Nav.Link> {/* Agregada la ruta para Tree Type */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
