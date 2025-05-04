import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import './Sidenav.css';  // Importa el archivo CSS
import messages from 'config/messages.json';
import useFetchSpecies from 'hooks/useFetchSpecies'; // Importa el hook personalizado
import firebaseConfig from 'config/firebaseConfig'; // Configuración de Firebase

function Sidenav({ tree, onClose }) {
  const [species, setSpecies] = useState([]);
  const [speciesData, setSpeciesData] = useState(null);

  // Usa el hook personalizado para obtener las especies
  useFetchSpecies(setSpecies, firebaseConfig);

  useEffect(() => {
    if (species.length > 0) {
      // Busca la especie correspondiente al árbol seleccionado
      const selectedSpecies = species.find((sp) => sp.id === tree.speciesId);
      setSpeciesData(selectedSpecies || null); // Establece la especie encontrada
    }
  }, [species, tree.speciesId]);

  const calculateAge = (dateBirth) => {
    if (!dateBirth) return messages.sideNav.noSpecified;
    const birthDate = new Date(dateBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return `${age} ${messages.sideNav.years}`;
  };

  const formatRegisterDate = (registerDate) => {
    const date = new Date(registerDate);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.species.commonName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>{`${messages.sideNav.scientificName} ${tree.species.scientificName || messages.sideNav.noSpecified}`}</h5>

        <div className='container-foliage'>
          <p>{messages.sideNav.foliageLabel} <strong>{tree.species.foliage || messages.sideNav.unknown}</strong></p>
          <img src="https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/foliage%2FPerenne.png?alt=media&token=a3b57f2e-2ba0-44d4-acbb-5c8375a48609" alt={tree.code} />
        </div>

        <p>{messages.sideNav.sectorLabel} <strong>{tree.sector.name || messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.diameterLabel} <strong>{tree.diameter ? `${tree.diameter} cm` : messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.censusDateLabel} <strong>{tree.registerDate ? formatRegisterDate(tree.registerDate) : messages.sideNav.noSpecified}</strong></p>

        {/* Mostrar imagen del árbol si está disponible */}
        {tree.imageUrl && (
          <div style={{ marginTop: '15px' }}>
            <img src={tree.imageUrl} alt={tree.code} style={{ width: '100%', height: 'auto' }} />
          </div>
        )}
                {speciesData && (
          <div className="species-statistics">
 <h4>Estadísticas Ambientales</h4>
    <p>CO2 Absorption: <strong>{speciesData.CO2Absorption} kg</strong></p>
    <p>Foliage Area: <strong>{speciesData.FoliageArea} m²</strong></p>
    <p>Oxygen Production: <strong>{speciesData.OxygenProduction} kg</strong></p>
    <p>Particle Capture: <strong>{speciesData.ParticleCapture} mg</strong></p>
    <p>Temperature Reduction: <strong>{speciesData.TemperatureReduction} °C</strong></p>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidenav;
