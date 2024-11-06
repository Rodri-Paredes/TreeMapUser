import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import './Sidenav.css';  // Importa el archivo CSS
import messages from 'config/messages.json';

function Sidenav({ tree, onClose }) {
  const [streetName, setStreetName] = useState(messages.sideNav.loading);  // Estado para almacenar el nombre de la calle

  useEffect(() => {
    // Función para obtener el nombre de la calle a partir de las coordenadas
    const fetchStreetName = async () => {
      if (tree.latitude && tree.longitude) {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              lat: tree.latitude,
              lon: tree.longitude,
              format: 'json'
            }
          });
          const address = response.data.address;
          const street = address.road || address.neighbourhood || address.city || messages.sideNav.noSpecified;
          setStreetName(street);
        } catch (error) {
          console.error('Error fetching street name:', error);
          setStreetName(messages.sideNav.error);
        }
      } else {
        setStreetName(messages.sideNav.noSpecified);
      }
    };

    fetchStreetName();
  }, [tree.latitude, tree.longitude]);

  return (
    <Offcanvas className="sidenav-custom" show={true} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{tree.species.commonName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h5>{`${messages.sideNav.scientificName} ${tree.species.scientificName || messages.sideNav.noSpecified}`}</h5>
        {/* Eliminamos la línea que muestra la descripción */}
        {/* <p>{tree.species.description || messages.sideNav.noAvailable}</p> */}
        {/* Eliminamos la línea que muestra la edad */}
        {/* <p>
          {messages.sideNav.ageLabel}
          <strong>{tree.dateBirth
            ? calculateAge(tree.dateBirth)
            : messages.sideNav.noSpecified}</strong>
        </p> */}
        <p>{messages.sideNav.foliageLabel} <strong>{tree.species.foliage || messages.sideNav.unknown}</strong></p>
        
        <hr />

        <p>{messages.sideNav.sectorLabel} <strong>{tree.sector.name || messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.polygonLabel} <strong>{tree.sector.polygon || messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.diameterLabel} <strong>{tree.diameter ? `${tree.diameter} cm` : messages.sideNav.noSpecified}</strong></p>
        <p>{messages.sideNav.censusDateLabel} <strong>{tree.registerDate || messages.sideNav.noSpecified}</strong></p>

        {/* Nueva línea para mostrar el nombre de la calle */}
        <p>{messages.sideNav.locationLabel} <strong>{streetName}</strong></p>

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
