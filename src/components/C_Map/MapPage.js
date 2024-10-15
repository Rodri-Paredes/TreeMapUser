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
    const [selectedSector, setSelectedSector] = useState(null); // Estado para el sector seleccionado

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,  // Reemplaza con tu clave API válida
    });

    // Estado para manejar la selección de un árbol en el mapa
    const [selectedTree, setSelectedTree] = useState(null);

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
        disableDefaultUI: true, // Opcional: Oculta controles predeterminados como botones de zoom
    };

    // Filtrar los árboles que pertenecen al sector seleccionado
    const filteredTrees = selectedSector
        ? trees.filter(tree => tree.sectorId === selectedSector.id) // Filtra por ID de sector
        : trees; // Si no hay sector seleccionado, mostrar todos los árboles
    // Función para contar cuántos árboles hay por sector
    const countTreesBySector = (sectorId) => {
        return trees.filter((tree) => tree.sectorId === sectorId).length;
    };

    return (
        <>
           {/* Scroll con los sectores */}
            <div className="Scroll">
                {sectors.map((sectorItem, index) => (
                    <Button
                        key={index}
                        className="custom-button"
                        style={{
                            color: sectorItem.color,            // Color del texto
                            borderColor: sectorItem.color,
                            marginRight: 10,
                            fontSize: 12,
                            minWidth: '210px'
                        }}
                        variant="outline-primary"
                        onClick={() => setSelectedSector(sectorItem)} // Al hacer clic, selecciona el sector
                    >
                        {/* Mostrar el nombre del sector y la cantidad de árboles */}
                        {sectorItem.name} ({countTreesBySector(sectorItem.id)})
                    </Button>
                ))}
            </div>

            <div className="main-container">
                <div className="statistics-container">
                    <h4>{messages.mapPage.statisticsTitle}</h4>
                    <p>
                        {messages.mapPage.registeredTrees} <strong>{trees.length}</strong>
                    </p>
                    <h4>{messages.mapPage.statisticsSector}</h4>
                    <p>
                        {messages.mapPage.registeredTreesSector}
                        <strong>{selectedSector ? countTreesBySector(selectedSector.id) : 0}</strong>
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

                <div className="map-container">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={configuration.map.zoom}
                        center={configuration.map.center}
                        options={mapOptions}
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

            {/* Footer */}
            <footer className="footer">
                <p>{messages.mapPage.footerText}</p>
            </footer>
        </>
    );
}

export default MapPage;
