import React from 'react';
import { Offcanvas, Carousel } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './Sidenav.css'; // Importar el archivo CSS

function Sidenav({ tree, onClose }) {
  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="end">
      <Offcanvas.Header>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <Offcanvas.Title className="title">{tree.commonName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={tree.imageUrl}
              alt={`Imagen de ${tree.commonName}`}
              style={{ borderRadius: '8px' }}
            />
          </Carousel.Item>
          {tree.leafTypeImageUrl && (
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={tree.leafTypeImageUrl}
                alt={`Tipo de hoja de ${tree.commonName}`}
                style={{ borderRadius: '8px' }}
              />
            </Carousel.Item>
          )}
        </Carousel>
        <h5 className="scientific-name">{`Nombre científico: ${tree.scientificName}`}</h5>
        <hr />
        <p>{tree.longDescription}</p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidenav;
