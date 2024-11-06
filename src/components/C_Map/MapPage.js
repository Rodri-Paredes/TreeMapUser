import { useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polygon, Autocomplete } from '@react-google-maps/api';
import Sidenav from 'components/C_Sidenav/Sidenav';
import './MapPage.css';
import useFetchTrees from "hooks/useFetchTrees";
import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';
import useFetchSectors from "hooks/useFetchSectors";
import messages from 'config/messages.json';
import { Button, Form, Modal } from "react-bootstrap";

const mapContainerStyle = {
    width: '100%',
    height: '100%',
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
    const [searchTerm, setSearchTerm] = useState("");
    const [locationSearch, setLocationSearch] = useState(""); 
    const [autocomplete, setAutocomplete] = useState(null);
    const [showSpeciesModal, setShowSpeciesModal] = useState(false); 
    const [selectedSpecies, setSelectedSpecies] = useState(""); 
    const [selectedTree, setSelectedTree] = useState(null);
    const [mapCenter, setMapCenter] = useState(configuration.map.center); 
    const [mapZoom, setMapZoom] = useState(configuration.map.zoom); 
    const [markerPosition, setMarkerPosition] = useState(null);

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,
        libraries: ['places'],
    });

    const mapOptions = {
        styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit.station", stylers: [{ visibility: "off" }] },
        ],
        disableDefaultUI: true,
    };

    if (!isLoaded) return <div>{messages.mapPage.loadingMessage}</div>;

    const handleLocationSearch = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMapCenter({ lat, lng });
                setMapZoom(15);
                setMarkerPosition({ lat, lng });
            } else {
                alert('No se encontró la ubicación.');
            }
        }
    };

    const filteredTrees = trees.filter(tree => {
        const matchesSpecies = selectedSpecies ? (tree.species.commonName === selectedSpecies || tree.species.scientificName === selectedSpecies) : true;
        const matchesSector = selectedSector ? tree.sectorId === selectedSector.id : true;
        return matchesSpecies && matchesSector;
    });

    const filteredSectors = sectors.filter(sector =>
        sector.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const countFilteredTreesBySector = selectedSector
        ? filteredTrees.length
        : trees.length;

    const speciesList = [...new Set(trees.map(tree => tree.species.commonName || tree.species.scientificName))];

    const cityBounds = {
        north: -17.3310, // Latitud norte
        south: -17.4330, // Latitud sur
        east: -66.0935,  // Longitud este
        west: -66.2235   // Longitud oeste
    };

    return (
        <>
            <div className="filter-container">
                <div className="combo-box">
                    <Form.Select
                        aria-label="Selecciona un sector"
                        onChange={(e) => {
                            const sectorId = e.target.value;
                            const sector = sectors.find(s => s.id === sectorId);
                            setSelectedSector(sector);
                        }}
                    >
                        <option value="">Selecciona un sector</option>
                        {filteredSectors.map((sector, index) => (
                            <option key={index} value={sector.id}>
                                {sector.name} ({trees.filter(tree => tree.sectorId === sector.id).length})
                            </option>
                        ))}
                    </Form.Select>
                </div>

                <div className="search-box">
                    <Form.Control
                        type="text"
                        placeholder="Buscar sector..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
            </div>

            <div className="show-stats">
                <Button className="btn-custom" onClick={() => setShowStats(!showStats)}>
                    {showStats ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
                </Button>
                <Button className="btn-custom" onClick={() => setShowSpeciesModal(true)}>
                    Filtrar por Especie
                </Button>
                {selectedSpecies && (
                    <Button className="btn-custom" onClick={() => setSelectedSpecies("")}>
                        Quitar Filtro de Especie
                    </Button>
                )}
                {selectedSector && (
                    <Button className="btn-custom" onClick={() => setSelectedSector(null)}>
                        Mostrar todos los sectores
                    </Button>
                )}
            </div>

            <Modal show={showSpeciesModal} onHide={() => setShowSpeciesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona una Especie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select
                        aria-label="Selecciona una especie"
                        onChange={(e) => setSelectedSpecies(e.target.value)}
                    >
                        <option value="">Selecciona una especie</option>
                        {speciesList.map((species, index) => (
                            <option key={index} value={species}>
                                {species}
                            </option>
                        ))}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSpeciesModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="main-container">
                {showStats && (
                    <div className="statistics-container">
                        <h4>{messages.mapPage.statisticsTitle}</h4>
                        <p>
                            {messages.mapPage.registeredTrees} <strong>{trees.length}</strong>
                        </p>
                        <h4>{messages.mapPage.statisticsSector}</h4>
                        <h4>{selectedSector?.name}</h4>
                        <p>
                            {messages.mapPage.registeredTreesSector}
                            <strong>{countFilteredTreesBySector}</strong>
                        </p>
                        <div className="beneficStyle">
                            <h4>Beneficios Ambientales</h4>
                            <p>
                                {messages.ecologicalBenefits.stormwaterLabel}
                                <strong>959 gallons</strong>
                            </p>
                            <p>
                                {messages.ecologicalBenefits.valueLabel}
                                <strong>$9.49</strong>
                            </p>
                            <p>
                                {messages.ecologicalBenefits.energyLabel}
                                <strong>1,052 kWh</strong>
                            </p>
                            <p>
                                {messages.ecologicalBenefits.energyValueLabel}
                                <strong>$132.75</strong>
                            </p>
                            <p>
                                {messages.ecologicalBenefits.pollutantsLabel}
                                <strong>2 pounds</strong>
                            </p>
                            <p>
                                {messages.ecologicalBenefits.pollutantsValueLabel}
                                <strong>$9.28</strong>
                            </p>
                            <p>
                                <strong>{messages.ecologicalBenefits.totalValueLabel} $152.35</strong>
                            </p>
                        </div>
                    </div>
                )}

                <div className="map-container">
                    <div className="location-search-box">
                    <Autocomplete
                        onLoad={autocomplete => {
                            setAutocomplete(autocomplete);
                            autocomplete.setBounds(new window.google.maps.LatLngBounds(
                                new window.google.maps.LatLng(cityBounds.south, cityBounds.west),
                                new window.google.maps.LatLng(cityBounds.north, cityBounds.east)
                            ));
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
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={mapZoom}
                        center={mapCenter}
                        options={mapOptions}
                    >
                        {sectors?.map((sectorItem, index) => (
                            <Polygon
                                key={index}
                                paths={sectorItem.polygonPath}
                                options={{ fillColor: sectorItem.color, fillOpacity: 0.5, strokeColor: sectorItem.color }}
                            />
                        ))}
                        {filteredTrees.map((tree, index) => (
                            <Marker
                                key={index}
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
