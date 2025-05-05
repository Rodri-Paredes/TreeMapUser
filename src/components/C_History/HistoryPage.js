import React, { useState, useEffect } from 'react';
import './HistoryPage.css';
import Footer from 'components/C_Footer/Footer';
import { Table, Form } from 'react-bootstrap';

const sampleData = [
  { species: 'Jacarandá', name: 'Azulito', planter: 'Pedro', date: '2023-10-05', zone: 'Centro', status: 'Saludable' },
  { species: 'Ceibo', name: 'Fénix', planter: 'Carlos', date: '2023-09-12', zone: 'Sur', status: 'Enfermo' },
  { species: 'Lapacho', name: 'Rosita', planter: 'Luis', date: '2024-01-20', zone: 'Norte', status: 'Saludable' },
  { species: 'Tajibo', name: 'Amarillo', planter: 'Daniel', date: '2024-03-01', zone: 'Este', status: 'Recién plantado' },
];

function HistoryPage() {
  const [data, setData] = useState(sampleData);
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredData = data.filter(entry => {
    return (
      (zoneFilter === '' || entry.zone === zoneFilter) &&
      (statusFilter === '' || entry.status === statusFilter)
    );
  });

  const uniqueZones = [...new Set(sampleData.map(entry => entry.zone))];
  const uniqueStatuses = [...new Set(sampleData.map(entry => entry.status))];

  return (
    <>
      <div className="history-page-container">
        <h3>📜 Historial de Árboles Plantados</h3>

        <div className="filter-container">
          <Form.Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="">Filtrar por zona</option>
            {uniqueZones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </Form.Select>

          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Filtrar por estado</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Form.Select>
        </div>

        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>🌳 Especie</th>
              <th>Nombre</th>
              <th>Plantador/a</th>
              <th>Fecha</th>
              <th>Zona</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.species}</td>
                <td>{entry.name}</td>
                <td>{entry.planter}</td>
                <td>{entry.date}</td>
                <td>{entry.zone}</td>
                <td>
                  <span className={`status-badge ${entry.status.toLowerCase().replace(/\s/g, '-')}`}>
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </>
  );
}

export default HistoryPage;
