import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const useFetchSpecies = (setSpecies, config) => {
    useEffect(() => {
        const database = getDatabase(config);
        const speciesRef = ref(database, "species");

        // Escuchar los cambios en especies
        const unsubscribe = onValue(speciesRef, (snapshot) => {
            const speciesItem = snapshot.val();
            let speciesArray = []; // Cambiar a arreglo

            if (speciesItem) {
                speciesArray = Object.entries(speciesItem).map(([key, value]) => ({
                    id: key,
                    commonName: value.commonName,
                    scientificName: value.scientificName,
                    foliage: value.foliage,
                    color: value.color,
                    description: value.description,
                    imageUrl: value.imageUrl,
                }));
            }

            console.log("Datos de especies:", speciesArray);
            setSpecies(speciesArray); // Actualizar el estado con las especies
        }, (error) => {
            console.error("Error al obtener los datos de especies:", error);
        });

        // Limpieza del efecto
        return () => unsubscribe();
    }, [setSpecies, config]);
};

export default useFetchSpecies;
