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

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

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
            </div>

            <div className="main-container">
                {showStats && (
                    <div className="statistics-container">
                        <h4>{messages.mapPage1.communityImpactTitle}</h4>
                        <p>
                            {messages.mapPage1.totalTrees} <strong>{trees.length}</strong>
                        </p>
                        <h4>{messages.mapPage1.sectorImpact}</h4>
                        <h4>{selectedSector?.name || "Todos los Sectores"}</h4>
                        <p>
                            {messages.mapPage1.totalTreesInSector} 
                            <strong>{selectedSector ? countTreesBySector(selectedSector.id) : trees.length}</strong>
                        </p>
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
