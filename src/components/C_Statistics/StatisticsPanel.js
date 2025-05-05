import React from 'react';
import './StatisticsPanel.css';

function StatisticsPanel({ trees, selectedSector, countTreesBySector, oxygenProduction, temperatureReduction, particleCapture, CO2Absorption, CO2Price, H2OAbsorption, messages }) {
  return (
    <div className="statistics-container">
      <h3>{messages.mapPage.statisticsTitle}</h3>

      <div className="statistic">
        <p>{messages.mapPage.registeredTrees}</p>
        <strong>{trees.length}</strong>
      </div>

      <h4>{messages.mapPage.statisticsSector}</h4>
      <p className="sector-name">{selectedSector?.name || 'Seleccione un sector'}</p>
      <div className="statistic">
        <p>{messages.mapPage.registeredTreesSector}</p>
        <strong>{selectedSector ? countTreesBySector(selectedSector.id) : 0}</strong>
      </div>

      <div className="ecological-benefits">
        <h4>Beneficios Ecológicos</h4>
        <div className="benefit">
          <p>Producción de oxígeno</p>
          <strong>{oxygenProduction.toFixed(2)}</strong>
        </div>
        <div className="benefit">
          <p>Reducción de temperatura</p>
          <strong>{temperatureReduction.toFixed(2)} °C</strong>
        </div>
        <div className="benefit">
          <p>Captura de partículas</p>
          <strong>{particleCapture.toFixed(2)} kg</strong>
        </div>
        <div className="benefit">
          <p>Absorción de CO₂</p>
          <strong>{CO2Absorption.toFixed(2)} kg</strong>
          <p>Valor:</p>
          <strong>Bs. {CO2Price.toFixed(2)}</strong>
        </div>
        <div className="benefit total-value">
          <p>Absorción de H₂O</p>
          <strong>{H2OAbsorption.toFixed(2)} litros</strong>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
