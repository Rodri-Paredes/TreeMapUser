import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Navbar from './components/Navbar';
import Sidenav from './components/Sidenav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: -17.333177256734867,
  lng: -66.22648665411982,
};

const treesData = [
  {
    id: 1,
    position: { lat: -17.333177256734867, lng: -66.22648665411982 },
    name: 'Oak Tree',
    scientificName: 'Quercus',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '150 years'
  },
  {
    id: 2,
    position: { lat: -17.330377897325597, lng: -66.22621398305438 },
    name: 'Oak Tree3',
    scientificName: 'Quercus',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '150 years'
  },
  {
    id: 3,
    position: { lat: -17.332244519915612, lng: -66.2274450534757 },
    name: 'Maraco',
    scientificName: 'Marco',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '50 years'
  },
];

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCYUX86b8TJ1yDLVcObptfb3XF5L19BYzg',
  });

  const [selectedTree, setSelectedTree] = useState(null);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <div className="map-container">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
              >
                {treesData.map((tree) => (
                  <Marker
                    key={tree.id}
                    position={tree.position}
                    onClick={() => setSelectedTree(tree)}
                  />
                ))}
              </GoogleMap>
              {selectedTree && <Sidenav tree={selectedTree} onClose={() => setSelectedTree(null)} />}
            </div>

            {/* Agregar la sección de estadísticas */}
            <div className="statistics-container" style={{ padding: '20px', textAlign: 'center' }}>
              <h4>Estadísticas</h4>
              <p>Árboles registrados en el mapa: <strong>{treesData.length}</strong></p>
            </div>
          </>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
