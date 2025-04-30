import { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, Polygon, Autocomplete } from '@react-google-maps/api';
import Sidenav from 'components/C_Sidenav/Sidenav';
import StatisticsPanel from 'components/C_Statistics/StatisticsPanel';
import './MapPage.css';

import useFetchTrees from "hooks/useFetchTrees";
import useFetchSectors from "hooks/useFetchSectors";

import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';
import messages from 'config/messages.json';

import { Button, Form } from "react-bootstrap";
import { getDatabase, ref, onValue } from "firebase/database";

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const CO2_TO_BOLIVIANOS = 0.60891;
const cochabambaBounds = {
  north: -16.98,
  south: -18.42,
  east: -65.13,
  west: -67.15
};

function getMarkerIcon(tree) {
  if (typeof window.google === 'undefined') return null;

  let color = tree.species.color;
  let size = tree.diameter < 20 ? 20 : tree.diameter <= 30 ? 30 : 40;

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.8,
    scale: size / 5,
    strokeColor: color,
    strokeWeight: 2,
  };
}

function MapPage() {
  const [trees, setTrees] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);

  const [mapCenter, setMapCenter] = useState(configuration.map.center);
  const [mapZoom, setMapZoom] = useState(configuration.map.zoom);
  const [markerPosition, setMarkerPosition] = useState(null);

  const [autocomplete, setAutocomplete] = useState(null);
  const [locationSearch, setLocationSearch] = useState("");

  const [oxygenProduction, setOxygenProduction] = useState(0);
  const [temperatureReduction, setTemperatureReduction] = useState(0);
  const [particleCapture, setParticleCapture] = useState(0);
  const [CO2Absorption, setCO2Absorption] = useState(0);
  const [CO2Price, setCO2Price] = useState(0);
  const [H2OAbsorption, setH2OAbsorption] = useState(0);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: configuration.map.googleMapsApiKey,
    libraries: ['places'],
  });

  const mapRef = useRef();

  useFetchTrees(setTrees, firebaseConfig);
  useFetchSectors(setSectors, firebaseConfig);

  useEffect(() => {
    const db = getDatabase(firebaseConfig);
    const speciesRef = ref(db, 'species');

    onValue(speciesRef, (snapshot) => {
      const data = snapshot.val();
      let totalOxygen = 0;
      let totalTemp = 0;
      let totalParticles = 0;
      let totalCO2 = 0;
      let totalWater = 0;

      Object.values(data).forEach(s => {
        totalOxygen += s.OxygenProduction || 0;
        totalTemp += s.TemperatureReduction || 0;
        totalParticles += s.ParticleCapture || 0;
        totalCO2 += s.CO2Absorption || 0;
        totalWater += s.H2OAbsorption || 0;
      });

      setOxygenProduction(totalOxygen);
      setTemperatureReduction(totalTemp);
      setParticleCapture(totalParticles);
      setCO2Absorption(totalCO2);
      setCO2Price(totalCO2 * CO2_TO_BOLIVIANOS);
      setH2OAbsorption(totalWater);
    });
  }, []);

  const handleSearch = () => {
    const place = autocomplete?.getPlace();
    if (!place?.geometry) return alert("Ubicación inválida.");

    const { lat, lng } = place.geometry.location;
    const latVal = lat(), lngVal = lng();

    if (
      latVal <= cochabambaBounds.north &&
      latVal >= cochabambaBounds.south &&
      lngVal <= cochabambaBounds.east &&
      lngVal >= cochabambaBounds.west
    ) {
      setMapCenter({ lat: latVal, lng: lngVal });
      setMapZoom(15);
      setMarkerPosition({ lat: latVal, lng: lngVal });
    } else {
      alert("Ubicación fuera de Cochabamba.");
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.panTo(configuration.map.center);
      mapRef.current.setZoom(configuration.map.zoom);
    }
  };

  const countTreesBySector = (sectorId) =>
    trees.filter(tree => tree.sectorId === sectorId).length;

  const filteredTrees = selectedSector
    ? trees.filter(tree => tree.sectorId === selectedSector.id)
    : trees;

  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <div className="map-page-container">

      {/* Contenido principal */}
      <div className="map-wrapper">
        <div className="map-box">
          <div className="location-search-box">
            <Autocomplete
              onLoad={(a) => {
                setAutocomplete(a);
                a.setComponentRestrictions({ country: "BO" });
              }}
            >
              <Form.Control
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Buscar ubicación..."
              />
            </Autocomplete>
            <Button onClick={handleSearch}>Buscar</Button>
            <Button className="center-button" onClick={handleCenterMap}>Centrar</Button>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={mapZoom}
            center={mapCenter}
            options={{
              restriction: { latLngBounds: cochabambaBounds, strictBounds: true },
              disableDefaultUI: true,
              minZoom: 12,
              maxZoom: 18,
              gestureHandling: "greedy"
            }}
            onLoad={(map) => (mapRef.current = map)}
          >
            {sectors.map((s, i) => (
              <Polygon
                key={i}
                paths={s.polygonPath}
                options={{ fillColor: s.color, fillOpacity: 0.1, strokeColor: s.color }}
              />
            ))}
            {filteredTrees.map((tree) => (
              <Marker
                key={tree.id}
                position={{ lat: tree.latitude, lng: tree.longitude }}
                icon={getMarkerIcon(tree)}
                onClick={() => setSelectedTree(tree)}
              />
            ))}
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>

        {selectedTree && (
          <Sidenav tree={selectedTree} onClose={() => setSelectedTree(null)} />
        )}
      </div>
    </div>
  );
}

export default MapPage;
