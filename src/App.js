import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Navbar from './components/C_Navbar/Navbar';
import Sidenav from './components/C_Sidenav/Sidenav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import About from './components/C_About/About';
import TreeType from './components/C_TreeType/treetype';  // Importa el componente TreeType
import './App.css';  // Importar los estilos globales

// Estilos para el contenedor del mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%',  // El mapa debe ocupar el 100% del contenedor
};

// Centro del mapa (coordenadas)
const center = {
  lat: -17.333177256734867,
  lng: -66.22648665411982,
};

// Datos de ejemplo de los árboles que se van a mostrar en el mapa
const treesData = [
  {
    id: 1,
    position: { lat: -17.333177256734867, lng: -66.22648665411982 },
    name: 'Oak Tree',
    scientificName: 'Quercus',
    species: 'Maple',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '150 years',
    diameter: 45,
    foliage: 'Dense green foliage',
    sector: 'North Park',
    polygon: 'Polygon 1',
    censusDate: '2022-10-01',
    imageUrl: 'https://example.com/oak-tree.jpg',
  },
  {
    id: 2,
    position: { lat: -17.330377897325597, lng: -66.22621398305438 },
    name: 'Oak Tree3',
    scientificName: 'Quercus',
    species: 'Oak',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '150 years',
    diameter: 50,
    foliage: 'Sparse foliage',
    sector: 'Central Park',
    polygon: 'Polygon 2',
    censusDate: '2021-12-15',
    imageUrl: 'https://example.com/oak-tree3.jpg',
  },
  {
    id: 3,
    position: { lat: -17.332244519915612, lng: -66.2274450534757 },
    name: 'Maraco',
    scientificName: 'Marco',
    species: 'Maraco',
    description: 'A large, strong tree known for its longevity.',
    estimatedLife: '50 years',
    diameter: 35,
    foliage: 'Medium foliage',
    sector: 'South Park',
    polygon: 'Polygon 3',
    censusDate: '2020-11-25',
    imageUrl: 'https://example.com/maraco.jpg',
  },
];

// Función para obtener el icono del marcador basado en la especie y tamaño
function getMarkerIcon(tree) {
  if (typeof window.google === 'undefined') {
    return null;
  }

  let color;
  let size;

  // Cambiar el color del marcador según la especie
  switch (tree.species) {
    case 'Oak':
      color = 'red'; // Color para Oak
      break;
    case 'Maple':
      color = 'green'; // Color para Maple
      break;
    case 'Maraco':
      color = 'blue'; // Color para Maraco
      break;
    default:
      color = 'gray'; // Color por defecto para otras especies
      break;
  }

  // Definir el tamaño del marcador basado en el diámetro del árbol
  if (tree.diameter < 20) {
    size = 20; // Tamaño pequeño
  } else if (tree.diameter >= 20 && tree.diameter <= 30) {
    size = 30; // Tamaño mediano
  } else if (tree.diameter > 30) {
    size = 40; // Tamaño grande
  }

  // Retornar un icono con el tamaño ajustado
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.8,
    scale: size / 5, // Escala ajustada para que sea visible desde lejos
    strokeColor: color,
    strokeWeight: 2, // Borde más grueso para mejor visibilidad
  };
}

function App() {
  // Cargar el script de Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCYUX86b8TJ1yDLVcObptfb3XF5L19BYzg',  // Reemplaza con tu clave API válida
  });

  // Estado para manejar la selección de un árbol en el mapa
  const [selectedTree, setSelectedTree] = useState(null);

  // Mostrar un mensaje de carga mientras se carga el mapa
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Navbar /> {/* Barra de navegación */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                  center={center}
                >
                  {/* Añadir marcadores de los árboles al mapa */}
                  {treesData.map((tree) => (
                    <Marker
                      key={tree.id}
                      position={tree.position}
                      icon={getMarkerIcon(tree)} // Aquí aplicamos el icono personalizado
                      onClick={() => setSelectedTree(tree)}  // Mostrar el árbol seleccionado en el sidenav
                    />
                  ))}
                </GoogleMap>
                {/* Mostrar detalles del árbol en un sidenav cuando se selecciona */}
                {selectedTree && <Sidenav tree={selectedTree} onClose={() => setSelectedTree(null)} />}
              </div>

              {/* Sección de estadísticas debajo del mapa */}
              <div className="statistics-container">
                <h4>Estadísticas</h4>
                <p>Árboles registrados en el mapa: <strong>{treesData.length}</strong></p>
              </div>

              {/* Agregar el footer */}
              <footer className="footer">
                <p>© 2024 TreeMap NYC. Todos los derechos reservados.</p>
              </footer>
            </>
          } />
          <Route path="/about" element={<About />} />  {/* Ruta para la página About */}
          <Route path="/treetype" element={<TreeType />} /> {/* Nueva ruta para Tree Type */}
        </Routes>
      </div>
    </>
  );
}

export default App;
