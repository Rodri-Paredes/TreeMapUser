import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Polygon, Autocomplete } from '@react-google-maps/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from "react-chartjs-2";
import Sidenav from 'components/C_Sidenav/Sidenav';
import './MapPage.css';
import useFetchTrees from "hooks/useFetchTrees";
import firebaseConfig from "config/firebaseConfig";
import configuration from 'config/configuration';
import useFetchSectors from "hooks/useFetchSectors";
import messages from 'config/messages.json';
import { Button, Form, Modal } from "react-bootstrap";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import { getDatabase, ref, onValue } from "firebase/database";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions = {
    styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit.station", stylers: [{ visibility: "off" }] },
    ],
    disableDefaultUI: true,
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

function downloadAllReports(pieData, barData, pieData2) {
    const doc = new jsPDF("p", "mm", "a4");

    const pieChartElement = document.querySelector('.tipeDiagram');
    if (pieChartElement) {
        html2canvas(pieChartElement).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, 'PNG', 50, 20, 90, 100);

            const barChartElement = document.querySelector('.monthDiagram');
            if (barChartElement) {
                html2canvas(barChartElement).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    doc.addImage(imgData, 'PNG', 10, 120, 190, 120);

                    const pieChartElement2 = document.querySelector('.sectorDiagram');
                    if (pieChartElement2) {
                        doc.addPage(); // Agrega una nueva página antes del siguiente gráfico
                        html2canvas(pieChartElement2).then((canvas) => {
                            const imgData = canvas.toDataURL("image/png");
                            doc.addImage(imgData, 'PNG', 50, 20, 90, 100);

                            // Guardar el PDF después de que todas las imágenes estén en el documento
                            doc.save("reportes.pdf");
                        });
                    } else {
                        // Si no se encuentra el segundo gráfico
                        doc.save("reportes.pdf");
                    }
                });
            } else {
                // Si no se encuentra el primer gráfico, pero hay un segundo
                doc.save("reportes.pdf");
            }
        });
    }
}


function downloadPieChart() {
    const pieChartElement = document.querySelector('.pieDiagram');
    if (pieChartElement) {
        html2canvas(pieChartElement).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'pie_chart.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}

function downloadBarChart() {
    const barChartElement = document.querySelector('.barDiagram');
    if (barChartElement) {
        html2canvas(barChartElement).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'bar_chart.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
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
    const [showPieChart, setShowPieChart] = useState(false);
    const [showBarChart, setShowBarChart] = useState(false); 
    const [showReports, setShowReports] = useState(false);

    // Environmental counters
    const [oxygenProduction, setOxygenProduction] = useState(0);
    const [temperatureReduction, setTemperatureReduction] = useState(0);
    const [particleCapture, setParticleCapture] = useState(0);
    const [CO2Absorption, setCO2Absorption] = useState(0);
    const [CO2Price, setCO2Price] = useState(0);
    const [H2OAbsorption, setH2OAbsorption] = useState(0); // New state for H2O absorption

    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);


    const treesBySector = sectors.map(sector => ({
        name: sector.name,
        count: trees.filter(tree => tree.sectorId === sector.id).length,
    }));

    // Ordena los sectores por la cantidad de árboles en orden descendente
    const sortedSectors = treesBySector.sort((a, b) => b.count - a.count);

    // Configura los datos para el gráfico de torta
    const pieData2 = {
        labels: sortedSectors.map(sector => sector.name),
        datasets: [
            {
                data: sortedSectors.map(sector => sector.count),
                backgroundColor: sortedSectors.map(
                    (_, index) => `hsl(${(index * 30) % 360}, 70%, 50%)`
                ),
                borderColor: sortedSectors.map(
                    (_, index) => `hsl(${(index * 30) % 360}, 70%, 40%)`
                ),
                borderWidth: 1,
            },
        ],
    };



    const { isLoaded } = useLoadScript({
        googleMapsApiKey: configuration.map.googleMapsApiKey,
        libraries: ['places'],
    });

    // Fetch species data and calculate totals
    useEffect(() => {
        const db = getDatabase(firebaseConfig);
        const speciesRef = ref(db, 'species');

        onValue(speciesRef, (snapshot) => {
            const speciesData = snapshot.val();
            let totalOxygen = 0;
            let totalTemperatureReduction = 0;
            let totalParticleCapture = 0;
            let totalCO2Absorption = 0;
            let totalH2OAbsorption = 0; // Variable for H2O absorption

            Object.values(speciesData).forEach(species => {
                totalOxygen += species.OxygenProduction || 0;
                totalTemperatureReduction += species.TemperatureReduction || 0;
                totalParticleCapture += species.ParticleCapture || 0;
                totalCO2Absorption += species.CO2Absorption || 0;
                totalH2OAbsorption += species.H2OAbsorption || 0; // Accumulate H2O absorption
            });

            setOxygenProduction(totalOxygen);
            setTemperatureReduction(totalTemperatureReduction);
            setParticleCapture(totalParticleCapture);
            setCO2Absorption(totalCO2Absorption);
            setCO2Price(totalCO2Absorption * CO2_TO_BOLIVIANOS);
            setH2OAbsorption(totalH2OAbsorption); // Update H2O absorption state
        });
    }, []);

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
    const speciesCount = speciesList.map(species =>
        trees.filter(tree => (tree.species.commonName || tree.species.scientificName) === species).length
    );

    const cityBounds = {
        north: -17.3310, // Latitud norte
        south: -17.4330, // Latitud sur
        east: -66.0935,  // Longitud este
        west: -66.2235   // Longitud oeste
    };

    const treesGroupedByMonth = filteredTrees.reduce((acc, tree) => {
        const month = new Date(tree.registerDate).getMonth(); // Usamos registerDate o modifyDate, ajustado para formato ISO
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month]++;
        return acc;
    }, {});

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Datos para el gráfico de barras (meses y cantidad de árboles)
    const barData = {
        labels: months,
        datasets: [
            {
                label: 'Número de Árboles Registrados por Mes',
                data: months.map((_, index) => treesGroupedByMonth[index] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
        ],
    };
    

    const pieData = {
        labels: speciesList,
        datasets: [
            {
                label: 'Distribución de Especies',
                data: speciesCount,
                backgroundColor: speciesList.map((_, index) => `hsl(${(index * 30) % 360}, 70%, 50%)`),
                borderColor: speciesList.map((_, index) => `hsl(${(index * 30) % 360}, 70%, 40%)`),
                borderWidth: 1,
            },
        ],
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
                <Button className="btn-custom" onClick={() => setShowReports(!showReports)}>
                    {showReports ? 'Ocultar Reportes' : 'Mostrar Todos los Reportes'}
                </Button>
            </div>

            {showReports && (
                <>
                    <div className="pie-chart-container pieDiagram tipeDiagram">
                        <Button className="btn-custom" onClick={() => downloadAllReports(pieData2, pieData, barData)}>
                            Descargar Todos los Reportes
                        </Button>
                        <h3>Distribución de Árboles Tipo de Árbol</h3>
                        <Pie data={pieData} />
                    </div>

                    <div className="bar-chart-container barDiagram monthDiagram">
                        <h3>Distribución de Meses por más Árboles Plantados</h3>
                        <Bar data={barData} />
                    </div>
                    <div className="pie-chart-container pieDiagram sectorDiagram">
                        <h3>Distribución de Árboles por Sector</h3>
                        <Pie data={pieData2} />
                    </div>
                </>
            )}

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
                        <p>{messages.mapPage.registeredTrees} <strong>{trees.length}</strong></p>
                        <h4>{messages.mapPage.statisticsSector}</h4>
                        <h4>{selectedSector?.name}</h4>
                        <p>{messages.mapPage.registeredTreesSector}<strong>{countFilteredTreesBySector}</strong></p>
                        <div className="beneficStyle">
                            <h4>Beneficios Ambientales</h4>
                            <p>Producción de Oxígeno: <strong>{oxygenProduction.toFixed(2)} kg</strong></p>
                            <p>Reducción de Temperatura: <strong>{temperatureReduction.toFixed(2)} °C</strong></p>
                            <p>Captura de Partículas: <strong>{particleCapture.toFixed(2)} μg/m³</strong></p>
                            <p>Absorción de CO₂: <strong>{CO2Absorption.toFixed(2)} kg</strong></p>
                            <p>Absorción de H₂O: <strong>{H2OAbsorption.toFixed(2)} L</strong></p> {/* New H2O absorption line */}
                            <p>Precio Total del CO₂ Absorbido: <strong>{CO2Price.toFixed(2)} Bs</strong></p>
                        </div>
                    </div>
                )}

                <div className="map-container">
                    <div className="location-search-box">
                        {isLoaded && (
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
                        )}
                        <Button onClick={handleLocationSearch}>Buscar</Button>
                    </div>
                    {isLoaded && (
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
                    )}
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
