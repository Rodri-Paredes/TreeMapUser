import React from 'react';
import Navbar from './components/C_Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import About from './components/C_About/About';
import TreeType from './components/C_TreeType/treetype';
import './App.css';
import MapPage from './components/C_Map/MapPage';
import './tokens.css';
import Reports from './components/C_Reports/Reports';
import StatisticsPage from './components/C_Statistics/StatisticsPage'; 
import Footer from 'components/C_Footer/Footer';
import HistoryPage from 'components/C_History/HistoryPage';

function App() {
  return (
    <>
      <Navbar /> {/* Barra de navegación */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/about" element={<About />} />  {/* Ruta para la página About */}
          <Route path="/treetype" element={<TreeType />} /> {/* Ruta para Tree Type */}
          <Route path="/reports" element={<Reports />} />   {/* Ruta para Reportes */}
          <Route path="/estadisticas" element={<StatisticsPage />} /> 
          <Route path="/history" element={<HistoryPage />} /> 
        </Routes>
      </div>
      <Footer/>
    </>
  );
}

export default App;
