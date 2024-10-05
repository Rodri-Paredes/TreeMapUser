import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import './Sidenav.css';  // Importa el archivo CSS

function Sidenav({ tree, onClose }) {
  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>Nombre Científico: {tree.scientificName || 'No especificado'}</h5>
        <p>{tree.description || 'No disponible'}</p>
        <p><strong>Año estimado de vida:</strong> {tree.estimatedLife || 'No especificado'}</p>
        <p><strong>Follaje:</strong> {tree.foliage || 'Desconocido'}</p>
        
        <hr />

        <p><strong>Sector:</strong> {tree.sector || 'No especificado'}</p>
        <p><strong>Polígono:</strong> {tree.polygon || 'No especificado'}</p>
        <p><strong>Diámetro:</strong> {tree.diameter ? `${tree.diameter} cm` : 'No especificado'}</p>
        <p><strong>Fecha de censo:</strong> {tree.censusDate || 'No especificada'}</p>
        <p><strong>Latitud:</strong> {tree.position?.lat || 'No disponible'}</p>
        <p><strong>Longitud:</strong> {tree.position?.lng || 'No disponible'}</p>

        {/* Mostrar imagen del árbol si está disponible */}
        {tree.imageUrl && (
          <div style={{ marginTop: '15px' }}>
            <img src={tree.imageUrl} alt={tree.name} style={{ width: '100%', height: 'auto' }} />
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidenav;
