import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import './Sidenav.css';  // Importa el nuevo archivo CSS

function Sidenav({ tree, onClose }) {
  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>Nombre Científico: {tree.scientificName}</h5>
        <p>{tree.description}</p>
        <p><strong>Año estimado de vida:</strong> {tree.estimatedLife}</p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidenav;
