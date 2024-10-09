import { useState } from "react";
import treesData from "data/treesData";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import Sidenav from 'components/C_Sidenav/Sidenav';
import './MapPage.css';
import useFetchTrees from "hooks/useFetchTrees";
import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';

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
    useFetchTrees(setTrees, firebaseConfig);

    // Cargar el script de Google Maps
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,  // Reemplaza con tu clave API válida
    });

    // Estado para manejar la selección de un árbol en el mapa
    const [selectedTree, setSelectedTree] = useState(null);

    // Mostrar un mensaje de carga mientras se carga el mapa
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <>
            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={configuration.map.zoom}
                    center={configuration.map.center}
                >
                    {/* Añadir marcadores de los árboles al mapa */}
                    {trees.map((tree) => (
                        <Marker
                        key={tree.id}
                        position={{ lat: tree.latitude, lng: tree.longitude }}
                        icon={getMarkerIcon(tree)}
                        onClick={() => setSelectedTree(tree)}
                    />
                    ))}
                </GoogleMap>
                {/* Mostrar detalles del árbol en un sidenav cuando se selecciona */}
                {selectedTree && <Sidenav tree={selectedTree} onClose={() => setSelectedTree(null)} />}
            </div>

            {/* Sección de estadísticas debajo del mapa */}
            <div className="statistics-container">
                <h4>Estadísticas</h4>
                <p>Árboles registrados en el mapa: <strong>{trees.length}</strong></p>
            </div>

            {/* Agregar el footer */}
            <footer className="footer">
                <p>© 2024 TreeMap NYC. Todos los derechos reservados.</p>
            </footer>
        </>
    )
}

export default MapPage;