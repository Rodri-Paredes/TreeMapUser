import React from 'react';
import { Offcanvas } from 'react-bootstrap';

function Sidenav({ tree, onClose }) {
  return (
    <Offcanvas show={true} onHide={onClose} placement="start"> {}
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
