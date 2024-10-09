import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const useFetchTrees = (setTrees, config) => {
    useEffect(() => {
        const database = getDatabase(config);
        const treesRef = ref(database, "trees");
        const speciesRef = ref(database, "species");
        const sectorsRef = ref(database, "sectors");

        // Escuchar los cambios en especies
        onValue(speciesRef, (snapshot) => {
            const speciesItem = snapshot.val();
            let speciesArray = {};

            if (speciesItem) {
                speciesArray = Object.fromEntries(
                    Object.entries(speciesItem).map(([key, value]) => [
                        key,
                        {
                            commonName: value.commonName,
                            scientificName: value.scientificName,
                            foliage: value.foliage,
                            color: value.color,
                            description: value.description,
                            imageUrl: value.imageUrl
                        },
                    ])
                );
            }

            // Escuchar los cambios en sectores
            onValue(sectorsRef, (snapshot) => {
                const sectorItem = snapshot.val();
                let sectorArray = {};

                if (sectorItem) {
                    sectorArray = Object.fromEntries(
                        Object.entries(sectorItem).map(([key, value]) => [
                            key,
                            {
                                name: value.name,
                                polygon: value.polygon,
                            },
                        ])
                    );
                }

                // Escuchar los cambios en árboles
                onValue(treesRef, (snapshot) => {
                    const dataItem = snapshot.val();

                    if (dataItem) {
                        const displayItem = Object.entries(dataItem).map(([key, value]) => {
                            // Convertir a tipo árbol
                            const tree = value;

                            return {
                                ...tree,
                                id: key,
                                species: speciesArray[tree.speciesId] || undefined, // Asignar el objeto de especie o undefined
                                sector: sectorArray[tree.sectorId] || undefined,   // Asignar el objeto de sector o undefined
                            };
                        });

                        console.log("Datos de árboles con especies y sectores:", displayItem);
                        setTrees(displayItem); // Actualizar el estado con árboles incluyendo info de especies y sectores
                    } else {
                        console.log("No se encontraron árboles.");
                    }
                }, (error) => {
                    console.error("Error al obtener los datos de árboles:", error);
                });
            }, (error) => {
                console.error("Error al obtener los datos de sectores:", error);
            });
        }, (error) => {
            console.error("Error al obtener los datos de especies:", error);
        });
    }, [setTrees, config]);
};

export default useFetchTrees;
