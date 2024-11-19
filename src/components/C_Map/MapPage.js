import { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, Polygon, Autocomplete } from '@react-google-maps/api';
import Sidenav from 'components/C_Sidenav/Sidenav';
import './MapPage.css';
import useFetchTrees from "hooks/useFetchTrees";
import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';
import useFetchSectors from "hooks/useFetchSectors";
import messages from 'config/messages.json';
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

// Usamos los límites que cubren las áreas cercanas a Univalle, ajustándolos si es necesario
const univalleBounds = {
    north: -9.68,
    south: -22.9,
    east: -57.47,
    west: -69.64
};

const CO2_TO_BOLIVIANOS = 0.60891;

function getMarkerIcon(tree) {
    if (typeof window.google === 'undefined') {
        return null;
    }

    let color = tree.species.color;
    let size;

    if (tree.diameter < 20) {
        size = 20;
    } else if (tree.diameter >= 20 && tree.diameter <= 30) {
        size = 30;
    } else if (tree.diameter > 30) {
        size = 40;
    }

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
    const [showStats, setShowStats] = useState(true);
    const mapRef = useRef(null);

    const [oxygenProduction, setOxygenProduction] = useState(0);
    const [temperatureReduction, setTemperatureReduction] = useState(0);
    const [particleCapture, setParticleCapture] = useState(0);
    const [CO2Absorption, setCO2Absorption] = useState(0);
    const [CO2Price, setCO2Price] = useState(0);
    const [H2OAbsorption, setH2OAbsorption] = useState(0);

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

    useEffect(() => {
        const db = getDatabase(firebaseConfig);
        const speciesRef = ref(db, 'species');

        onValue(speciesRef, (snapshot) => {
            const speciesData = snapshot.val();
            let totalOxygen = 0;
            let totalTemperatureReduction = 0;
            let totalParticleCapture = 0;
            let totalCO2Absorption = 0;
            let totalH2OAbsorption = 0;

            Object.values(speciesData).forEach(species => {
                totalOxygen += species.OxygenProduction || 0;
                totalTemperatureReduction += species.TemperatureReduction || 0;
                totalParticleCapture += species.ParticleCapture || 0;
                totalCO2Absorption += species.CO2Absorption || 0;
                totalH2OAbsorption += species.H2OAbsorption || 0;
            });

            setOxygenProduction(totalOxygen);
            setTemperatureReduction(totalTemperatureReduction);
            setParticleCapture(totalParticleCapture);
            setCO2Absorption(totalCO2Absorption);
            setCO2Price(totalCO2Absorption * CO2_TO_BOLIVIANOS);
            setH2OAbsorption(totalH2OAbsorption);
        });
    }, []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,
    });

    const [selectedTree, setSelectedTree] = useState(null);

    if (!isLoaded) return <div>{messages.mapPage.loadingMessage}</div>;

    const mapOptions = {
        restriction: {
            latLngBounds: univalleBounds,
            strictBounds: true,
        },
        minZoom: 15,
        maxZoom: 18,
        styles: [
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit.station",
                stylers: [{ visibility: "off" }]
            },
        ],
        disableDefaultUI: true,
        gestureHandling: 'greedy'
    };
    

    const handleCenterMap = () => {
        if (mapRef.current) {
            mapRef.current.panTo(configuration.map.center); // Centra en el punto de configuración
            mapRef.current.setZoom(configuration.map.zoom);  // Usa el zoom de configuración
        }
    };

    const filteredTrees = selectedSector
        ? trees.filter(tree => tree.sectorId === selectedSector.id)
        : trees;

    const countTreesBySector = (sectorId) => {
        return trees.filter((tree) => tree.sectorId === sectorId).length;
    };

    return (
        <>
            <div className="Scroll">
                {sectors.map((sectorItem, index) => (
                    <Button
                        key={index}
                        className="custom-button"
                        style={{
                            color: sectorItem.color,
                            borderColor: sectorItem.color,
                            marginRight: 10,
                            fontSize: 12,
                            minWidth: '210px'
                        }}
                        variant="outline-primary"
                        onClick={() => setSelectedSector(sectorItem)}
                    >
                        {sectorItem.name} ({countTreesBySector(sectorItem.id)})
                    </Button>
                ))}
            </div>

            <div className="show-stats">
                <Button className="btn-custom" onClick={() => setShowStats(!showStats)}>
                    {showStats ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
                </Button>
                <Button className="btn-custom" onClick={handleCenterMap}>
                    Centrar en Univalle
                </Button>
                {selectedSector && (
                    <Button className="btn-custom" onClick={() => setSelectedSector(null)}>
                        Mostrar todos los sectores
                    </Button>
                )}
                <Button className="btn-custom">
                    <Link to="/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Mostrar Reportes
                    </Link>
                </Button>
            </div>
            <div className="main-container">
  {showStats && (
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
      
      {/* Nueva Sección: Beneficios Ecológicos */}
      <div className="ecological-benefits">
        <h4>Beneficios Ecológicos</h4>
        <div className="benefit">
          <p>Producción de oxígeno al año (por persona)</p>
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
          <p>Absorción de CO2</p>
          <strong>{CO2Absorption.toFixed(2)} kg</strong>
          <p>Valor:</p>
          <strong>Bs. {CO2Price.toFixed(2)}</strong>
        </div>
        <div className="benefit total-value">
          <p>Absorción de H2O</p>
          <strong>{H2OAbsorption.toFixed(2)} litros</strong>
        </div>
      </div>
    </div>
  )}



                <div className="map-container">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={configuration.map.zoom} // Usa el zoom de configuración
                        center={configuration.map.center} // Usa el centro de configuración
                        options={mapOptions}
                        onLoad={(map) => (mapRef.current = map)}
                    >
                        {sectors?.map((sectorItem, index) => (
                            <Polygon
                                key={index}
                                paths={sectorItem.polygonPath}
                                options={{
                                    fillColor: sectorItem.color,
                                    fillOpacity: 0.5,
                                    strokeColor: sectorItem.color,
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                }}
                            />
                        ))}
                        {filteredTrees?.map((tree) => (
                            <Marker
                                key={tree.id}
                                position={{ lat: tree.latitude, lng: tree.longitude }}
                                icon={getMarkerIcon(tree)}
                                onClick={() => setSelectedTree(tree)}
                            />
                        ))}
                    </GoogleMap>
                    {selectedTree && <Sidenav tree={selectedTree} onClose={() => setSelectedTree(null)} />}
                </div>
            </div>

            <footer className="footer">
                <p>{messages.mapPage.footerText}</p>
            </footer>
        </>
    );
}

export default MapPage;
