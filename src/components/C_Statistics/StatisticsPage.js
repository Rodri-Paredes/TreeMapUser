import React from 'react';
import StatisticsPanel from './StatisticsPanel';
import useFetchTrees from 'hooks/useFetchTrees';
import useFetchSectors from 'hooks/useFetchSectors';
import firebaseConfig from 'config/firebaseConfig';
import messages from 'config/messages.json';
import Footer from '../C_Footer/Footer';
import './StatisticsPage.css';

function StatisticsPage() {
  const [trees, setTrees] = React.useState([]);
  const [sectors, setSectors] = React.useState([]);
  const [selectedSector, setSelectedSector] = React.useState(null);

  const [oxygenProduction, setOxygenProduction] = React.useState(0);
  const [temperatureReduction, setTemperatureReduction] = React.useState(0);
  const [particleCapture, setParticleCapture] = React.useState(0);
  const [CO2Absorption, setCO2Absorption] = React.useState(0);
  const [CO2Price, setCO2Price] = React.useState(0);
  const [H2OAbsorption, setH2OAbsorption] = React.useState(0);

  const CO2_TO_BOLIVIANOS = 0.60891;

  useFetchTrees(setTrees, firebaseConfig);
  useFetchSectors(setSectors, firebaseConfig);

  React.useEffect(() => {
    import('firebase/database').then(({ getDatabase, ref, onValue }) => {
      const db = getDatabase(firebaseConfig);
      const speciesRef = ref(db, 'species');

      onValue(speciesRef, (snapshot) => {
        const data = snapshot.val();
        let oxy = 0, temp = 0, particles = 0, co2 = 0, h2o = 0;
        Object.values(data).forEach(sp => {
          oxy += sp.OxygenProduction || 0;
          temp += sp.TemperatureReduction || 0;
          particles += sp.ParticleCapture || 0;
          co2 += sp.CO2Absorption || 0;
          h2o += sp.H2OAbsorption || 0;
        });
        setOxygenProduction(oxy);
        setTemperatureReduction(temp);
        setParticleCapture(particles);
        setCO2Absorption(co2);
        setCO2Price(co2 * CO2_TO_BOLIVIANOS);
        setH2OAbsorption(h2o);
      });
    });
  }, []);

  const countTreesBySector = (sectorId) => {
    return trees.filter((tree) => tree.sectorId === sectorId).length;
  };

  const handleSectorChange = (e) => {
    const sectorId = e.target.value;
    const selected = sectors.find(sector => sector.id === sectorId);
    setSelectedSector(selected || null);
  };

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h2>📊 Panel de Estadísticas</h2>
      </div>
  
      <div className="statistics-main-metrics">
        <div className="stat-box">Árboles Registrados<br /><strong>{trees.length}</strong></div>
        <div className="stat-box">Especies Únicas<br /><strong>{new Set(trees.map(t => t.species?.commonName)).size}</strong></div>
        <div className="stat-box">Zonas Cubiertas<br /><strong>{sectors.length}</strong></div>
        <div className="stat-box">CO₂ Absorbido<br /><strong>{(CO2Absorption / 1000).toFixed(1)} Tn</strong></div>
      </div>
  
      <div className="sector-selector">
        <label htmlFor="sector">Selecciona un sector: </label>
        <select id="sector" onChange={handleSectorChange} defaultValue="">
          <option value="">-- Ninguno --</option>
          {sectors.map((sector) => (
            <option key={sector.id} value={sector.id}>{sector.name}</option>
          ))}
        </select>
      </div>
  
      <StatisticsPanel
        trees={trees}
        selectedSector={selectedSector}
        countTreesBySector={countTreesBySector}
        oxygenProduction={oxygenProduction}
        temperatureReduction={temperatureReduction}
        particleCapture={particleCapture}
        CO2Absorption={CO2Absorption}
        CO2Price={CO2Price}
        H2OAbsorption={H2OAbsorption}
        messages={messages}
      />
    </div>
  );
}

export default StatisticsPage;
