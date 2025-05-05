import React, { useState, useEffect } from 'react';
import './TreeInfoModal.css';
import useFetchSpecies from 'hooks/useFetchSpecies';
import firebaseConfig from 'config/firebaseConfig';

function TreeInfoModal({ tree, onClose }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [speciesData, setSpeciesData] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false); // NUEVO estado para imagen grande

  useFetchSpecies(setSpeciesList, firebaseConfig);

  useEffect(() => {
    if (speciesList.length > 0 && tree?.speciesId) {
      const foundSpecies = speciesList.find(sp => sp.id === tree.speciesId);
      setSpeciesData(foundSpecies || null);
    }
  }, [speciesList, tree?.speciesId]);

  if (!tree) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>×</button>

          <h2 className="tree-title">{tree.species?.commonName || "Árbol"}</h2>
          <h4 className="tree-subtitle">{tree.species?.scientificName || "Sin nombre científico"}</h4>

          <div className="tree-details">
            <p><strong>🌳 Sector:</strong> {tree?.sector?.name || "No disponible"}</p>
            <p><strong>📅 Fecha de censo:</strong> {tree?.registerDate ? new Date(tree.registerDate).toLocaleDateString() : "No disponible"}</p>
            <p><strong>🌿 Follaje:</strong> {tree?.species?.foliage || "No disponible"}</p>
            <p><strong>📏 Diámetro:</strong> {tree?.diameter ? `${tree.diameter} cm` : "No disponible"}</p>
          </div>

          {tree.imageUrl && (
            <div className="tree-image" onClick={() => setShowImageModal(true)}>
              <img src={tree.imageUrl} alt={tree.species?.commonName} />
            </div>
          )}

          {speciesData && (
            <div className="tree-stats">
              <h4>🌿 Estadísticas Ambientales</h4>
              <p><strong>CO₂ Absorption:</strong> {speciesData.CO2Absorption} kg</p>
              <p><strong>Foliage Area:</strong> {speciesData.FoliageArea} m²</p>
              <p><strong>Oxygen Production:</strong> {speciesData.OxygenProduction} kg</p>
              <p><strong>Particle Capture:</strong> {speciesData.ParticleCapture} mg</p>
              <p><strong>Temperature Reduction:</strong> {speciesData.TemperatureReduction} °C</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen en grande */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowImageModal(false)}>×</button>
            <img src={tree.imageUrl} alt="Imagen del árbol" className="big-tree-image" />
          </div>
        </div>
      )}
    </>
  );
}

export default TreeInfoModal;
