import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import './Sidenav.css';  // Importa el archivo CSS

function Sidenav({ tree, onClose }) {
  console.log(tree)
  const calculateAge = (dateBirth) => {
    if (!dateBirth) return 'No especificado';
  
    const birthDate = new Date(dateBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
  
    // Ajusta la edad si el mes o día aún no han pasado este año
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
  
    return `${age} años`;
  };

  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.species.commonName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>Nombre Científico: {tree.species.scientificName || 'No especificado'}</h5>
        <p>{tree.species.description || 'No disponible'}</p>
        <p>
          <strong>Edad estimada:</strong>
          {tree.dateBirth
            ? `${calculateAge(tree.dateBirth)}`
            : 'No especificado'}
        </p>
        <p><strong>Follaje:</strong> {tree.species.foliage || 'Desconocido'}</p>
        
        <hr />

        <p><strong>Sector:</strong> {tree.sector.name || 'No especificado'}</p>
        <p><strong>Polígono:</strong> {tree.sector.polygon || 'No especificado'}</p>
        <p><strong>Diámetro:</strong> {tree.diameter ? `${tree.diameter} cm` : 'No especificado'}</p>
        <p><strong>Fecha de censo:</strong> {tree.censusDate || 'No especificada'}</p>

        {/* Mostrar imagen del árbol si está disponible */}
        {tree.imageUrl && (
          <div style={{ marginTop: '15px' }}>
            <img src={tree.imageUrl} alt={tree.code} style={{ width: '100%', height: 'auto' }} />
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidenav;
