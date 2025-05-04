import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from 'react';
import useFetchTrees from 'hooks/useFetchTrees';
import useFetchSectors from 'hooks/useFetchSectors';
import firebaseConfig from "config/firebaseConfig";
import { Button } from 'react-bootstrap';
import './Reports.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


function Reports() {
    const [trees, setTrees] = useState([]);
    const [sectors, setSectors] = useState([]);


    useFetchTrees(setTrees, firebaseConfig);
    useFetchSectors(setSectors, firebaseConfig);

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

    const speciesList = [...new Set(trees.map(tree => tree.species.commonName || tree.species.scientificName))];
    const speciesCount = speciesList.map(species =>
        trees.filter(tree => (tree.species.commonName || tree.species.scientificName) === species).length
    );


    const treesGroupedByMonth = trees.reduce((acc, tree) => {
        const month = new Date(tree.registerDate).getMonth();
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

    const treesBySector = sectors.map(sector => ({
        name: sector.name,
        count: trees.filter(tree => tree.sectorId === sector.id).length,
    }));


    const sortedSectors = treesBySector.sort((a, b) => b.count - a.count);


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
    return (
        <div >
            <>
                <div className="pie-chart-container pieDiagram tipeDiagram">
                    <Button className="btn-custom1" onClick={() => downloadAllReports(pieData2, pieData, barData)}>
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
        </div>
    )
}
export default Reports;