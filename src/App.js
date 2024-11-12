import React from 'react';
import Navbar from './components/C_Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import About from './components/C_About/About';
import TreeType from './components/C_TreeType/treetype';
import './App.css';
import MapPage from './components/C_Map/MapPage';
import './tokens.css';
import Reports from 'components/C_Reports/Reports';

// Estilos para el contenedor del mapa

function App() {
  return (
    <>
      <Navbar /> {/* Barra de navegación */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <MapPage></MapPage>
          } />
          <Route path="/about" element={<About />} />  {/* Ruta para la página About */}
          <Route path="/treetype" element={<TreeType />} /> {/* Nueva ruta para Tree Type */}
          <Route path="/reports" element={<Reports />} /> {/* Nueva ruta para Tree Type */}
        </Routes>
      </div>
    </>
  );
}

export default App;
