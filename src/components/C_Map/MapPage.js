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

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const cochabambaBounds = {
    north: -16.98,   // Limite norte general de la región de Cochabamba
    south: -18.42,   // Limite sur general de la región de Cochabamba
    east: -65.13,    // Limite este general de la región de Cochabamba
    west: -67.15     // Limite oeste general de la región de Cochabamba
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
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationSearch, setLocationSearch] = useState(""); 
    const [autocomplete, setAutocomplete] = useState(null);
    const [showSpeciesModal, setShowSpeciesModal] = useState(false); 
    const [selectedSpecies, setSelectedSpecies] = useState(""); 
    const [mapCenter, setMapCenter] = useState(configuration.map.center); 
    const [mapZoom, setMapZoom] = useState(configuration.map.zoom); 
    const [markerPosition, setMarkerPosition] = useState(null);

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,
        libraries: ['places'],
    });

    const [selectedTree, setSelectedTree] = useState(null);
    const mapRef = useRef();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            setShowStats(false);
        }
    }, [isMobile]);

    if (!isLoaded) return <div>{messages.mapPage.loadingMessage}</div>;

    const mapOptions = {
        restriction: {
            latLngBounds: cochabambaBounds,
            strictBounds: true,
        },
        minZoom: 12,
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

    const handleLocationSearch = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                if (
                    lat <= cochabambaBounds.north &&
                    lat >= cochabambaBounds.south &&
                    lng <= cochabambaBounds.east &&
                    lng >= cochabambaBounds.west
                ) {
                    setMapCenter({ lat, lng });
                    setMapZoom(15);
                    setMarkerPosition({ lat, lng });
                } else {
                    alert('La ubicación seleccionada no está dentro de Cochabamba.');
                }
            } else {
                alert('No se encontró la ubicación.');
            }
        }
    };

    const handleCenterMap = () => {
        if (mapRef.current) {
            mapRef.current.panTo(configuration.map.center);
            mapRef.current.setZoom(configuration.map.zoom);
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
                </div>
            )}

                <div className="map-container">
                    <div className="location-search-box">
                        <Autocomplete
                            onLoad={(autocompleteInstance) => {
                                setAutocomplete(autocompleteInstance);
                                autocompleteInstance.setBounds(new window.google.maps.LatLngBounds(
                                    new window.google.maps.LatLng(cochabambaBounds.south, cochabambaBounds.west),
                                    new window.google.maps.LatLng(cochabambaBounds.north, cochabambaBounds.east)
                                ));
                                autocompleteInstance.setComponentRestrictions({
                                    country: "BO" // Limitar a Bolivia
                                });
                            }}
                        >
                            <Form.Control
                                type="text"
                                placeholder="Buscar ubicación..."
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                            />
                        </Autocomplete>
                        <Button onClick={handleLocationSearch}>Buscar</Button>
                    </div>
                    <Button className="center-button" onClick={handleCenterMap}>
                        Centrar
                    </Button>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      zoom={mapZoom}
                      center={mapCenter}
                      options={mapOptions}
                      onLoad={(map) => (mapRef.current = map)}
                    >
                        {sectors?.map((sectorItem, index) => (
                         <Polygon
                         key={index}
                         paths={sectorItem.polygonPath}
                         options={{ fillColor: sectorItem.color, fillOpacity: 0.5, strokeColor: sectorItem.color }}
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
                        {markerPosition && (
                            <Marker position={markerPosition} icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            }} />
                        )}
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