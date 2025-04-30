import React, { useState } from 'react';
import './treetypes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SidenavTreeTypes from './SidenavTreeTypes';
import useFetchSpecies from 'hooks/useFetchSpecies';
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

  return (
    <div className="tree-types-page">
      <div className="tree-types-header">
        <h2>🌳 Tipos de Árbol</h2>
        <p>
          Explora una variedad de especies de árboles. Aprende sobre sus características y cómo contribuyen al ecosistema.
        </p>
      </div>

      <div className="tree-search">
        <input
          type="text"
          placeholder="Buscar especies de árboles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tree-cards-container">
        {filteredSpecies.map((tree, index) => (
          <div className="tree-card" key={tree.id} onClick={() => handleImageClick(index)}>
            <img src={tree.imageUrl} alt={tree.commonName} className="tree-card-img" />
            <div className="tree-card-info">
              <h5>{tree.commonName}</h5>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <SidenavTreeTypes tree={filteredSpecies[selectedIndex]} onClose={handleCloseSidenav} />
      )}
    </div>
  );
};

export default TreeType;
