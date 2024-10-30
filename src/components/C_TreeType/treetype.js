import React, { useState, useEffect } from 'react';
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

  // Filtrar especies según el término de búsqueda
  const filteredSpecies = species.filter(tree =>
    tree.commonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Tipos de Árbol</h2>
        <p className="welcome-description">
          Explora una variedad de especies de árboles. Aprende sobre sus características y cómo contribuyen al ecosistema.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 search-bar-container">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar especies de árboles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredSpecies.map((tree, index) => (
          <div className="col-md-4 mb-4" key={tree.id}>
            <div className="card h-100" onClick={() => handleImageClick(index)}>
              <img
                src={tree.imageUrl}
                alt={tree.commonName}
                className="card-img-top tree-image"
              />
              <div className="card-body">
                <h5 className="card-title">{tree.commonName}</h5>
              </div>
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
