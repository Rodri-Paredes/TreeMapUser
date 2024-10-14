import { useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polygon } from '@react-google-maps/api';
import Sidenav from 'components/C_Sidenav/Sidenav';
import './MapPage.css';
import useFetchTrees from "hooks/useFetchTrees";
import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';
import useFetchSectors from "hooks/useFetchSectors";
import messages from 'config/messages.json';
import { Button } from "react-bootstrap";

const mapContainerStyle = {
    width: '100%',
    height: '100%',  // El mapa debe ocupar el 100% del contenedor
};

// Función para obtener el icono del marcador basado en la especie y tamaño
function getMarkerIcon(tree) {
    if (typeof window.google === 'undefined') {
        return null;
    }

    let color= tree.species.color;
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

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

    // Cargar el script de Google Maps
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,  // Reemplaza con tu clave API válida
    });

    // Estado para manejar la selección de un árbol en el mapa
    const [selectedTree, setSelectedTree] = useState(null);

    // Mostrar un mensaje de carga mientras se carga el mapa
    if (!isLoaded) return <div>{messages.mapPage.loadingMessage}</div>;

    return (
    <>

                <div className="Scroll">
                    {sectors.map((sectorItem, index) => (
                        <>
                            <Button key={index}
                            className="custom-button"
                                style={{
                                    color: sectorItem.color,            // Color del texto
                                    borderColor: sectorItem.color,
                                    marginRight: 10,
                                    fontSize: 12,
                                    minWidth: '210px'
                                }}
                                variant="outline-primary"  // O cualquier otro estilo que estés usando
                            >
                                {sectorItem.name + " " + "(10)"}
                            </Button>
                        </>
                    ))}
                </div>
        <div className="main-container">
            <div className="statistics-container">
                <h4>{messages.mapPage.statisticsTitle}</h4>
                <p>
                    {messages.mapPage.registeredTrees} <strong>{trees.length}</strong>
                </p>

   
            </div>

            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={configuration.map.zoom}
                    center={configuration.map.center}
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
                    {trees?.map((tree) => (
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

        {/* Footer */}
        <footer className="footer">
            <p>{messages.mapPage.footerText}</p>
        </footer>
    </>
);
}

export default MapPage;