import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const useFetchSectors = (setSectors, config) => {
    useEffect(() => {
        const database = getDatabase(config);
        const sectorsRef = ref(database, "sectors");

        // Escuchar los cambios en sectores
        const unsubscribe = onValue(sectorsRef, (snapshot) => {
            const sectorsItem = snapshot.val();
            let sectorsArray = []; // Cambiar a arreglo

            if (sectorsItem) {
                sectorsArray = Object.entries(sectorsItem).map(([key, value]) => ({
                    id: key, // Asigna un ID si es necesario
                    name: value.name,
                    polygon: value.polygon,
                    polygonPath: value.polygonPath,
                    color: value.color
                }));
            }

            console.log("Datos de sectores:", sectorsArray);
            setSectors(sectorsArray); // Actualizar el estado con los sectores
        }, (error) => {
            console.error("Error al obtener los datos de sectores:", error);
        });

        // Limpieza del efecto
        return () => unsubscribe();
    }, [setSectors, config]);
};

export default useFetchSectors;
