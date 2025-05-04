const treeTypes = [
    {
        description: 'Los pinos son árboles de hoja perenne que pertenecen a la familia de las coníferas. Son conocidos por su altura y su corteza característica.',
        color: '#88B04B',
        commonName: 'Pino',
        foliage: 'Perenne',
        scientificName: 'Pinus',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'Los robles son árboles de hoja caduca que pueden vivir cientos de años. Su madera es muy valorada por su dureza y resistencia.',
        color: '#B565A7',
        commonName: 'Roble',
        foliage: 'Caducifolio',
        scientificName: 'Quercus',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'Los sauces son conocidos por sus ramas largas y flexibles. A menudo se encuentran cerca de cuerpos de agua.',
        color: '#92A8D1',
        commonName: 'Sauce',
        foliage: 'Caducifolio',
        scientificName: 'Salix',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'Los abetos son árboles perennes que se utilizan comúnmente como árboles de Navidad. Tienen agujas cortas y un aroma agradable.',
        color: '#5B5EA6',
        commonName: 'Abeto',
        foliage: 'Perenne',
        scientificName: 'Abies',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'Los cipreses son árboles coníferos que se utilizan a menudo en paisajismo. Son conocidos por su forma cónica y su resistencia a la sequía.',
        color: '#009B77',
        commonName: 'Ciprés',
        foliage: 'Perenne',
        scientificName: 'Cupressus',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El manzano es un árbol que produce las famosas manzanas, muy apreciadas por su sabor y versatilidad.',
        color: '#FFD700',
        commonName: 'Manzano',
        foliage: 'Caducifolio',
        scientificName: 'Malus domestica',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'Los cerezos son conocidos por sus hermosas flores rosadas que adornan las calles en primavera.',
        color: '#EFC050',
        commonName: 'Cerezo',
        foliage: 'Caducifolio',
        scientificName: 'Prunus avium',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El fresno es un árbol resistente que se utiliza frecuentemente en paisajismo urbano.',
        color: '#FFA500',
        commonName: 'Fresno',
        foliage: 'Pinnaticompuestas',
        scientificName: 'Fraxinus',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El sauce llorón es un árbol típico en parques, conocido por su forma y follaje colgante.',
        color: '#45B8AC',
        commonName: 'Sauce Llorón',
        foliage: 'Caducifolio',
        scientificName: 'Salix babylonica',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El álamo es un árbol de rápido crecimiento, muy utilizado en calles y avenidas.',
        color: '#EFC050',
        commonName: 'Álamo',
        foliage: 'Caducifolio',
        scientificName: 'Populus alba',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El olivo es un árbol mediterráneo conocido por sus pequeñas hojas plateadas y su fruto, la aceituna.',
        color: '#88B04B',
        commonName: 'Olivo',
        foliage: 'Perenne',
        scientificName: 'Olea europaea',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    },
    {
        description: 'El lapacho es un árbol nativo de Sudamérica, conocido por sus impresionantes flores en tonos de rosa, amarillo y blanco.',
        color: '#9B2335',
        commonName: 'Lapacho',
        foliage: 'Caducifolio',
        scientificName: 'Handroanthus impetiginosus',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FWhitebarkPine_7467t.jpg?alt=media&token=fc1e504c-81c5-4dbb-ad98-3a95aa6f9f51'
    }
];

export default treeTypes;
