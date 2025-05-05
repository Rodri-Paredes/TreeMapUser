import React, { useState, useEffect } from 'react';
import useFetchTrees from 'hooks/useFetchTrees';
import useFetchSectors from 'hooks/useFetchSectors';
import firebaseConfig from 'config/firebaseConfig';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './StatisticsPage.css';
import CustomLegend from '../C_Legend/CustomLegend';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function StatisticsPage() {
  const [trees, setTrees] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [activeSpecies, setActiveSpecies] = useState({});
  const [activeSectors, setActiveSectors] = useState({});

  useFetchTrees(setTrees, firebaseConfig);
  useFetchSectors(setSectors, firebaseConfig);

  const allSpecies = [...new Set(trees.map(tree => tree.species?.commonName || 'Desconocido'))];
  const filteredSpecies = allSpecies.filter(sp => activeSpecies[sp] !== false);
  const speciesCounts = filteredSpecies.map(sp => 
    trees.filter(tree => (tree.species?.commonName || 'Desconocido') === sp).length
  );
  const speciesColors = allSpecies.map((_, i) => `hsl(${(i * 30) % 360}, 70%, 50%)`);

  const speciesBarData = {
    labels: filteredSpecies,
    datasets: [{
      label: 'Árboles por Especie',
      data: speciesCounts,
      backgroundColor: filteredSpecies.map((sp, i) => speciesColors[allSpecies.indexOf(sp)]),
    }]
  };

  // 🔧 FIX: coerción para comparar sectorId (string vs number)
  const treesBySector = sectors.map(sector => ({
    name: sector.name,
    count: trees.filter(tree => String(tree.sectorId) === String(sector.id)).length
  }));
  const sortedSectors = treesBySector.sort((a, b) => b.count - a.count);
  const allSectorNames = sortedSectors.map(s => s.name);
  const filteredSectors = allSectorNames.filter(s => activeSectors[s] !== false);
  const sectorCounts = filteredSectors.map(name => sortedSectors.find(s => s.name === name)?.count || 0);
  const sectorColors = allSectorNames.map((_, i) => `hsl(${(i * 30) % 360}, 70%, 50%)`);

  const sectorBarData = {
    labels: filteredSectors,
    datasets: [{
      label: 'Árboles por Sector',
      data: sectorCounts,
      backgroundColor: filteredSectors.map((name, i) => sectorColors[allSectorNames.indexOf(name)]),
    }]
  };

  const summary = {
    total: trees.length,
    uniqueSpecies: allSpecies.length,
    coveredZones: sectors.length
  };

  function downloadAllReports() {
    const doc = new jsPDF("p", "mm", "a4");
    html2canvas(document.querySelector('.chart-species')).then((canvas1) => {
      doc.addImage(canvas1.toDataURL("image/png"), 'PNG', 10, 10, 190, 80);
      html2canvas(document.querySelector('.chart-sectors')).then((canvas2) => {
        doc.addImage(canvas2.toDataURL("image/png"), 'PNG', 10, 100, 190, 80);
        doc.save("reportes.pdf");
      });
    });
  }

  return (
    <div className="statistics-page">
      <h2>📊 Panel de Estadísticas</h2>

      <div className="summary-panel">
        <div className="summary-box">Árboles Registrados<br /><strong>{summary.total}</strong></div>
        <div className="summary-box">Especies Únicas<br /><strong>{summary.uniqueSpecies}</strong></div>
        <div className="summary-box">Zonas Cubiertas<br /><strong>{summary.coveredZones}</strong></div>
      </div>

      <button className="download-button" onClick={downloadAllReports}>Descargar PDF de Reportes</button>

      <div className="charts-row">
        <div className="chart-box chart-species">
          <h3>Árboles por Especie</h3>
          <Bar data={speciesBarData} options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
          <CustomLegend
            labels={allSpecies}
            colors={speciesColors}
            activeItems={activeSpecies}
            setActiveItems={setActiveSpecies}
          />
        </div>

        <div className="chart-box chart-sectors">
          <h3>Árboles por Sector</h3>
          <Bar data={sectorBarData} options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
          <CustomLegend
            labels={allSectorNames}
            colors={sectorColors}
            activeItems={activeSectors}
            setActiveItems={setActiveSectors}
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
