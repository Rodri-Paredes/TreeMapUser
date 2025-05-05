import React, { useState } from 'react';
import '../TreeInfoModal/TreeInfoModal.css';

function SpeciesInfoModal({ tree, onClose }) {
  const [showImageModal, setShowImageModal] = useState(false);

  if (!tree) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>×</button>

          <h2 className="tree-title">{tree.commonName?.toUpperCase()}</h2>
          <h4 className="tree-subtitle">{tree.scientificName}</h4>

          {tree.imageUrl && (
            <>
              <div className="tree-image" onClick={() => setShowImageModal(true)}>
                <img src={tree.imageUrl} alt={tree.commonName} />
              </div>
              <hr className="image-divider" />
            </>
          )}

          <div className="tree-details">
            <p>{tree.description}</p>
            <div className="tree-extra-info">
              <p><strong>🌱 Crecimiento:</strong> {tree.growth}</p>
              <p><strong>💧 Riego:</strong> {tree.watering}</p>
              <p><strong>📝 Detalles adicionales:</strong> {tree.additional}</p>
            </div>


          </div>
        </div>
      </div>

      {/* Modal de imagen en grande */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowImageModal(false)}>×</button>
            <img src={tree.imageUrl} alt={`Imagen de ${tree.commonName}`} />
          </div>
        </div>
      )}
    </>
  );
}

export default SpeciesInfoModal;
