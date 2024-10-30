import { useState, useEffect } from "react";
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
    height: '100%',  // El mapa debe ocupar el 100% del contenedor
};

// Función para obtener el icono del marcador basado en la especie y tamaño
function getMarkerIcon(tree) {
    if (typeof window.google === 'undefined') {
        return null;
    }

    let color = tree.species.color;
    let size;

    // Definir el tamaño del marcador basado en el diámetro del árbol
    if (tree.diameter < 20) {
        size = 20; // Tamaño pequeño
    } else if (tree.diameter >= 20 && tree.diameter <= 30) {
        size = 30; // Tamaño mediano
    } else if (tree.diameter > 30) {
        size = 40; // Tamaño grande
    }

    // Retornar un icono con el tamaño ajustado
    return {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.8,
        scale: size / 5, // Escala ajustada para que sea visible desde lejos
        strokeColor: color,
        strokeWeight: 2, // Borde más grueso para mejor visibilidad
    };
}

function MapPage() {
    const [trees, setTrees] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null); // Estado para el sector seleccionado
    const [showStats, setShowStats] = useState(true);  // Estado de estadísticas
    const [isMobile, setIsMobile] = useState(false);   // Estado de si es móvil
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
        libraries: ['places'], // Reemplaza con tu clave API válida
    });


    // Estado para manejar la selección de un árbol en el mapa
    const [selectedTree, setSelectedTree] = useState(null);

    // Detecta si la pantalla es móvil (por ejemplo, ancho < 768px)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);  // Define el tamaño límite para móvil
        };
        
        // Ejecutar al montar el componente
        checkMobile();
        
        // Agregar el event listener para cambio de tamaño
        window.addEventListener('resize', checkMobile);
        
        // Limpiar el event listener al desmontar el componente
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Si la vista es móvil, ocultamos las estadísticas por defecto
    useEffect(() => {
        if (isMobile) {
            setShowStats(false); // Ocultar las estadísticas en móviles por defecto
        }
    }, [isMobile]);

    // Mostrar un mensaje de carga mientras se carga el mapa
    if (!isLoaded) return <div>{messages.mapPage.loadingMessage}</div>;

    // Estilos de mapa para ocultar POIs como restaurantes y otros negocios
    const mapOptions = {
        styles: [
            {
                featureType: "poi", // "Points of Interest" (lugares de interés)
                stylers: [{ visibility: "off" }] // Oculta los POI
            },
            {
                featureType: "transit.station",
                stylers: [{ visibility: "off" }] // Oculta estaciones de transporte
            },
        ],
        disableDefaultUI: true, // Oculta controles predeterminados
        gestureHandling: 'greedy' // Permite zoom sin CTRL
    };
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


    const filteredTrees = selectedSector
        ? trees.filter(tree => tree.sectorId === selectedSector.id)
        : trees;


    const countTreesBySector = (sectorId) => {
        return trees.filter((tree) => tree.sectorId === sectorId).length;
    };
    const cityBounds = {
        north: -17.3310, // Latitud norte
        south: -17.4330, // Latitud sur
        east: -66.0935,  // Longitud este
        west: -66.2235   // Longitud oeste
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

        <div className="benefits-container">
            <h4>{messages.ecologicalBenefits.title}</h4>
            {['stormwater', 'value', 'energy', 'energyValue', 'pollutants', 'pollutantsValue', 'totalValue'].map((benefit, idx) => (
                <div key={idx} className="benefit">
                    <p>{messages.ecologicalBenefits[`${benefit}Label`]}</p>
                    <strong>{/* Valor dinámico aquí */}</strong>
                </div>
            ))}
        </div>
    </div>
)}

                <div className="map-container">
                    <div className="location-search-box">
                        <Autocomplete
                            onLoad={(autocompleteInstance) => {
                                setAutocomplete(autocompleteInstance);
                                autocompleteInstance.setBounds(new window.google.maps.LatLngBounds(
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
