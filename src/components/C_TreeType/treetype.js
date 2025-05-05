import React, { useState } from 'react';
import './treetypes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useFetchSpecies from 'hooks/useFetchSpecies';
import SpeciesInfoModal from './SpeciesInfoModal';
import config from 'config/firebaseConfig';

const TreeType = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [species, setSpecies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useFetchSpecies(setSpecies, config);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const handleCloseSidenav = () => {
    setSelectedIndex(null);
  };

  const filteredSpecies = species.filter(tree =>
    tree.commonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shortenText = (text, limit = 150) => {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };

  return (
    <div className="tree-types-page">
      <div className="tree-types-header">
        <h2>🌿 Especies de Árboles Urbanos</h2>
      </div>

      <div className="tree-search">
        <input
          type="text"
          placeholder="🔍 Buscar especie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tree-cards-container">
        {filteredSpecies.map((tree, index) => (
          <div className="tree-card" key={tree.id} onClick={() => handleImageClick(index)}>
            <img src={tree.imageUrl} alt={tree.commonName} className="tree-card-img" />
            <div className="tree-card-info">
              <h5>
                <strong>{tree.commonName}</strong>{' '}
                <span>({tree.scientificName})</span>
              </h5>
              <p>{shortenText(tree.description)}</p>
              <div className="tree-badges">
                <div className="tree-badge">Hoja: {tree.foliage}</div>
                <div className="tree-badge">Crecimiento: {tree.growth}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <SpeciesInfoModal tree={filteredSpecies[selectedIndex]} onClose={handleCloseSidenav} />
      )}
    </div>
  );
};

export default TreeType;
