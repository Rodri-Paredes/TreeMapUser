import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import './Sidenav.css';  // Importa el archivo CSS
import messages from 'config/messages.json';

function Sidenav({ tree, onClose }) {
  
  const calculateAge = (dateBirth) => {
    if (!dateBirth) return messages.sideNav.noSpecified;

    const birthDate = new Date(dateBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Ajusta la edad si el mes o día aún no han pasado este año
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return `${age} ${messages.sideNav.years}`;
  };

  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.species.commonName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>{`${messages.sideNav.scientificName} ${tree.species.scientificName || messages.sideNav.noSpecified}`}</h5>
        <p>{tree.species.description || messages.sideNav.noAvailable}</p>
        <p>
          {messages.sideNav.ageLabel}
          <strong>{tree.dateBirth
            ? calculateAge(tree.dateBirth)
            : messages.sideNav.noSpecified}</strong>
        </p>
        <p>{messages.sideNav.foliageLabel} <strong>{tree.species.foliage || messages.sideNav.unknown}</strong></p>
        
        <hr />

        <p>{messages.sideNav.sectorLabel} <strong>{tree.sector.name || messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.polygonLabel} <strong>{tree.sector.polygon || messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.diameterLabel} <strong>{tree.diameter ? `${tree.diameter} cm` : messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.censusDateLabel} <strong>{tree.registerDate || messages.sideNav.noSpecified}</strong></p>

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
