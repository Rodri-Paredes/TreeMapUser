import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './SidenavTreeTypes.css';

function SidenavTreeTypes({ tree, onClose }) {
  return (
    <Modal show={true} onHide={onClose} centered size="lg" className="tree-modal">
      <Modal.Header className="tree-modal-header">
        <h4 className="tree-title">{tree.commonName}</h4>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
      </Modal.Header>

      <Modal.Body className="tree-modal-body">
        <img
          src={tree.imageUrl}
          alt={`Imagen de ${tree.commonName}`}
          className="tree-image"
        />

        <h5 className="scientific-name">
          Nombre científico: <span>{tree.scientificName}</span>
        </h5>

        <hr />

        <p className="tree-description">{tree.description}</p>
      </Modal.Body>
    </Modal>
  );
}

export default SidenavTreeTypes;
