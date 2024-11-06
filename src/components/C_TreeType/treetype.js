import React, { useState } from 'react';
import './treetypes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidenav from './Sidenav';

// Array local con las especies de árboles
const initialSpecies = [
    { id: 1, commonName: 'Pata de toro', scientificName: 'Gynoxys baccharoides', 
        description: 'Árbol con hojas en forma de pata de toro, perfecto para crear sombra en jardines amplios.', 
        longDescription: 'El Pata de toro es conocido por sus hojas grandes y únicas, que se asemejan a las patas de un toro. Este árbol es ideal para áreas donde se requiere sombra, especialmente en jardines amplios. Su crecimiento es robusto, proporcionando un refugio natural.' ,
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/tree-map-ae44c.appspot.com/o/species%2FPataDeToro.jpg?alt=media&token=e37eabea-eac9-4ce8-ba34-6e79a1ec9e8d' },
      
      { id: 2, commonName: 'Tajibo', scientificName: 'Tabebuia spp.', 
        description: 'Árbol ornamental de flores amarillas, atractivo y resistente a la sequía, que atrae polinizadores.', 
        longDescription: 'El Tajibo es un árbol conocido por sus flores amarillas brillantes que florecen en primavera. Su resistencia a la sequía lo hace ideal para climas áridos y es popular entre los polinizadores, lo que ayuda a promover la biodiversidad en jardines y parques.' },
      
      { id: 3, commonName: 'Álamo', scientificName: 'Populus spp.', 
        description: 'Árbol alto y delgado, crece cerca de cuerpos de agua, ideal para prevenir la erosión de las orillas.', 
        longDescription: 'Los álamos son árboles que crecen rápidamente y son conocidos por su capacidad de adaptarse a los suelos húmedos. Son fundamentales en la conservación del medio ambiente, ya que ayudan a prevenir la erosión de las orillas de los ríos y proporcionan refugio a diversas especies.' },
      
      { id: 4, commonName: 'Jacarandá', scientificName: 'Jacaranda mimosifolia', 
        description: 'Árbol famoso por sus flores violetas que florecen en primavera, proporciona sombra en parques.', 
        longDescription: 'El Jacarandá es reconocido por su espectacular floración de color violeta en primavera. Este árbol no solo embellece los paisajes urbanos, sino que también ofrece sombra durante los meses más cálidos, convirtiéndose en un lugar ideal para el descanso y la recreación.' },
      
      { id: 5, commonName: 'Pacay', scientificName: 'Inga feuilleei', 
        description: 'Árbol frutal que produce vainas comestibles, apreciadas en la gastronomía y que ofrece sombra.', 
        longDescription: 'El Pacay es un árbol que produce vainas grandes y comestibles, muy valoradas en la gastronomía local. Además de su valor alimenticio, proporciona una excelente sombra, convirtiéndolo en una elección popular para jardines y áreas recreativas.' },
      
      { id: 6, commonName: 'Branchichito', scientificName: 'Lantana camara', 
        description: 'Árbol de hojas brillantes, utilizado en jardines y setos, se adapta a diversas condiciones.', 
        longDescription: 'El Branchichito es un arbusto resistente y versátil que se adapta a diferentes climas y suelos. Es muy utilizado en jardinería por su atractivo follaje y la facilidad de mantenimiento, siendo ideal para setos y bordes de jardines.' },
      
      { id: 7, commonName: 'Guayaba', scientificName: 'Psidium guajava', 
        description: 'Árbol frutal con frutos jugosos y aromáticos, ideal para huertos y jardines frutales.', 
        longDescription: 'La Guayaba es un árbol frutal que produce frutos deliciosos y aromáticos, ricos en vitamina C. Su cultivo es popular en huertos familiares, donde no solo se disfruta de sus frutos, sino también de su belleza ornamental.' },
      
      { id: 8, commonName: 'Ciruela', scientificName: 'Prunus domestica', 
        description: 'Árbol que produce ciruelas dulces, florece en primavera y es adecuado para patios familiares.', 
        longDescription: 'El Ciruelo es conocido por sus frutos dulces y jugosos que maduran en verano. Este árbol florece en primavera, creando un espectáculo visual y aportando un valor estético a los patios familiares y jardines.' },
      
      { id: 9, commonName: 'Chirimoya', scientificName: 'Annona cherimola', 
        description: 'Árbol que produce fruta dulce con pulpa cremosa, requiere climas templados y húmedos.', 
        longDescription: 'La Chirimoya es un árbol frutal que produce una fruta única, con una pulpa cremosa y dulce. Este árbol prospera en climas templados y húmedos, siendo muy valorado en la gastronomía por su sabor distintivo.' },
      
      { id: 10, commonName: 'Limonero', scientificName: 'Citrus limon', 
        description: 'Árbol que produce limones, esencial en la gastronomía, requiere sol y riego regular.', 
        longDescription: 'El Limonero es un árbol frutal que proporciona limones frescos, muy utilizados en la cocina. Requiere una exposición solar adecuada y riego regular para mantener su producción de frutos.' },
      
      { id: 11, commonName: 'Tipuana', scientificName: 'Tipuana tipu', 
        description: 'Árbol de sombra con flores amarillas, ideal para parques y áreas urbanas.', 
        longDescription: 'El Tipuana es un árbol que no solo ofrece sombra, sino que también embellece el paisaje con sus flores amarillas. Es muy utilizado en parques y áreas urbanas, proporcionando un refugio para diversas especies.' },
      
      { id: 12, commonName: 'Laurel', scientificName: 'Laurus nobilis', 
        description: 'Árbol aromático, cuyas hojas se utilizan en la cocina y para dar sombra.', 
        longDescription: 'El Laurel es un árbol famoso por su aroma distintivo. Sus hojas son utilizadas en la cocina mediterránea, además de servir como un bello árbol de sombra en jardines.' },
      
      { id: 13, commonName: 'Peral', scientificName: 'Pyrus communis', 
        description: 'Árbol frutal que produce peras dulces, ideal para huertos familiares.', 
        longDescription: 'El Peral es un árbol que ofrece peras dulces y jugosas, muy apreciadas en la cocina. Su cultivo en huertos familiares es común, ya que proporciona frutos deliciosos y un hermoso entorno.' },
      
      { id: 14, commonName: 'Fresno', scientificName: 'Fraxinus spp.', 
        description: 'Árbol robusto conocido por su madera resistente, adecuado para áreas urbanas.', 
        longDescription: 'El Fresno es un árbol resistente que se adapta bien a las condiciones urbanas. Su madera es valorada en la construcción, y su estructura robusta lo hace ideal para proporcionar sombra.' },
      
      { id: 15, commonName: 'Molle', scientificName: 'Schinus molle', 
        description: 'Árbol que produce frutos utilizados en medicina tradicional, aporta sombra en jardines.', 
        longDescription: 'El Molle es conocido por sus frutos aromáticos, que se utilizan en la medicina tradicional. Este árbol también es apreciado por su capacidad de proporcionar sombra en jardines y parques.' },
      
      { id: 16, commonName: 'Iris africano', scientificName: 'Dietes bicolor', 
        description: 'Planta ornamental de flores coloridas, ideal para añadir belleza a jardines.', 
        longDescription: 'El Iris africano es una planta que aporta un toque de color a los jardines, con sus hermosas flores. Es fácil de cuidar y muy apreciada en paisajismo.' },
      
      { id: 17, commonName: 'Cucarda', scientificName: 'Cucarda spp.', 
        description: 'Planta ornamental de flores grandes y coloridas, perfecta para espacios exteriores.', 
        longDescription: 'La Cucarda es conocida por sus grandes flores coloridas que aportan vida a los jardines. Es ideal para decorar espacios exteriores y atraer polinizadores.' },
      
      { id: 18, commonName: 'Ficus', scientificName: 'Ficus spp.', 
        description: 'Árbol ornamental con follaje denso y brillante, ideal para dar sombra y decoración.', 
        longDescription: 'El Ficus es un árbol ornamental que se destaca por su follaje denso y brillante. Es utilizado tanto en jardines como en interiores, aportando un toque verde y fresco.' },
      
      { id: 19, commonName: 'Pino patula', scientificName: 'Pinus patula', 
        description: 'Árbol de coníferas, ideal para reforestación y crecimiento rápido.', 
        longDescription: 'El Pino patula es una especie de conífera que crece rápidamente, siendo una opción popular para proyectos de reforestación. Su madera es valiosa y se adapta bien a diversos tipos de suelo.' },
      
      { id: 20, commonName: 'Hibisco', scientificName: 'Hibiscus rosa-sinensis', 
        description: 'Planta ornamental con grandes flores coloridas, atrae mariposas y aves.', 
        longDescription: 'El Hibisco es conocido por sus grandes y coloridas flores que atraen mariposas y aves. Es ideal para agregar color y vida a jardines tropicales y subtropicales.' },
   
        { 
            id: 21, 
            commonName: 'Washingtona', 
            scientificName: 'Washingtonia filifera', 
            description: 'Palmera de tronco alto y elegante, con hojas que se disponen en forma de abanico, ideal para dar un toque tropical a jardines.', 
            longDescription: 'La Washingtona es una palmera majestuosamente alta, conocida por su tronco robusto y sus hojas en forma de abanico. Es perfecta para crear un ambiente tropical y se adapta bien a diversos climas.' 
        }, 
        { 
            id: 22, 
            commonName: 'Olivo', 
            scientificName: 'Olea europaea', 
            description: 'Árbol que produce aceitunas, valorado por su aceite en la gastronomía y sus propiedades en cosmética, también tiene un simbolismo de paz.', 
            longDescription: 'El Olivo es un árbol milenario que produce aceitunas, muy apreciadas por su aceite de oliva. Este árbol no solo es valioso en la gastronomía, sino que también simboliza la paz y la prosperidad.' 
        }, 
        { 
            id: 23, 
            commonName: 'Jazmín del Cabo', 
            scientificName: 'Jasminum mesnyi', 
            description: 'Planta aromática que destaca por sus flores blancas y fragantes, perfecta para jardines y balcones.', 
            longDescription: 'El Jazmín del Cabo es conocido por sus atractivas flores blancas y su intenso aroma. Es ideal para jardines y balcones, añadiendo belleza y fragancia al entorno.' 
        }, 
        { 
            id: 24, 
            commonName: 'Árbol pulpo', 
            scientificName: 'Enterolobium cyclocarpum', 
            description: 'Árbol de grandes hojas, conocido por su sombra abundante, lo que lo hace ideal para áreas de descanso.', 
            longDescription: 'El Árbol pulpo se caracteriza por su amplia copa y sombra densa, lo que lo convierte en una excelente opción para parques y áreas recreativas. Su apariencia distintiva lo hace también un atractivo ornamental.' 
        }, 
        { 
            id: 25, 
            commonName: 'Pino caribeño', 
            scientificName: 'Pinus caribaea', 
            description: 'Conífera que se adapta bien a climas cálidos, ideal para reforestación y para crear cortinas de viento.', 
            longDescription: 'El Pino caribeño es una conífera resistente que se adapta a diversas condiciones climáticas, siendo popular en proyectos de reforestación. Su rápido crecimiento lo hace ideal para establecer barreras de viento.' 
        }, 
        { 
            id: 26, 
            commonName: 'Níspero', 
            scientificName: 'Eriobotrya japonica', 
            description: 'Árbol que produce frutos dulces y jugosos, muy apreciados en la gastronomía y por su sabor único.', 
            longDescription: 'El Níspero es conocido por sus frutos dulces y jugosos, que son muy valorados en la cocina. Este árbol también proporciona sombra y belleza al jardín con sus hojas brillantes y su crecimiento moderado.' 
        }, 
        { 
            id: 27, 
            commonName: 'Cheflara', 
            scientificName: 'Aglaonema', 
            description: 'Planta ornamental con hojas brillantes y verdes, popular en decoración de interiores y exteriores.', 
            longDescription: 'La Cheflara es una planta muy valorada en la decoración, conocida por sus hojas brillantes y patrones atractivos. Es fácil de cuidar y se adapta bien a diferentes entornos, tanto interiores como exteriores.' 
        }, 
        { 
            id: 28, 
            commonName: 'Rosa enana', 
            scientificName: 'Rosa spp.', 
            description: 'Planta pequeña que produce flores coloridas, perfecta para jardinería y para añadir un toque de color a espacios reducidos.', 
            longDescription: 'La Rosa enana es ideal para jardinería en espacios pequeños. Sus flores coloridas y fragancia encantadora la hacen perfecta para adornar balcones y jardines.' 
        }, 
        { 
            id: 29, 
            commonName: 'Ciprés de Monterrey', 
            scientificName: 'Cupressus macrocarpa', 
            description: 'Árbol ornamental con un follaje denso y vertical, ideal para setos y para crear barreras visuales.', 
            longDescription: 'El Ciprés de Monterrey es conocido por su forma cónica y follaje denso. Se utiliza comúnmente para formar setos y barreras visuales en paisajismo, aportando un toque de elegancia al entorno.' 
        }, 
        { 
            id: 30, 
            commonName: 'Retama', 
            scientificName: 'Retama sphaerocarpa', 
            description: 'Arbusto atractivo que produce flores amarillas brillantes, muy utilizado en jardines y paisajismo.', 
            longDescription: 'La Retama es un arbusto conocido por sus flores amarillas brillantes que florecen en primavera. Es muy valorado en paisajismo por su belleza y su capacidad para atraer polinizadores.' 
        }, 
        { 
            id: 31, 
            commonName: 'Bambú', 
            scientificName: 'Bambusoideae', 
            description: 'Planta de rápido crecimiento, valorada por su resistencia y versatilidad, utilizada en construcción y decoración.', 
            longDescription: 'El Bambú es una planta de rápido crecimiento que se utiliza ampliamente en la construcción y la decoración. Su resistencia y flexibilidad lo convierten en un material ideal para diversos proyectos.' 
        }, 
        { 
            id: 32, 
            commonName: 'Carnavalito', 
            scientificName: 'Erythrina crista-galli', 
            description: 'Árbol con flores brillantes y coloridas, perfecto para jardines, atrayendo a polinizadores como mariposas y abejas.', 
            longDescription: 'El Carnavalito es conocido por sus flores vibrantes que atraen a polinizadores. Es un excelente árbol ornamental que añade color y vida a los jardines.' 
        }, 
        { 
            id: 33, 
            commonName: 'Falso Ciprés de Lawson', 
            scientificName: 'Chamaecyparis lawsoniana', 
            description: 'Árbol ornamental ideal para formar setos, conocido por su forma cónica y su follaje denso.', 
            longDescription: 'El Falso Ciprés de Lawson es ideal para crear setos y pantallas. Su forma cónica y follaje denso lo hacen popular en paisajismo, brindando privacidad y atractivo visual.' 
        }, 
        { 
            id: 34, 
            commonName: 'Bingo de Oro', 
            scientificName: 'Cassia fistula', 
            description: 'Árbol con flores amarillas que aporta un toque decorativo y vibrante a los jardines.', 
            longDescription: 'El Bingo de Oro es conocido por sus brillantes flores amarillas que florecen en racimos. Este árbol es una opción popular para jardines, aportando un color vibrante y atractivo.' 
        }, 
        { 
            id: 35, 
            commonName: 'Negundo', 
            scientificName: 'Ailanthus altissima', 
            description: 'Árbol de crecimiento rápido, utilizado en paisajismo para proporcionar sombra y embellecer el entorno.', 
            longDescription: 'El Negundo es un árbol de crecimiento rápido, ideal para crear sombra en jardines y parques. Su follaje denso y atractivo lo hace una opción popular en paisajismo.' 
        },
        { 
            id: 36, 
            commonName: 'Jazmín paraguayo', 
            scientificName: 'Jasminum multiflorum', 
            description: 'Planta trepadora con flores blancas y fragancia intensa, ideal para cubrir pérgolas y muros.', 
            longDescription: 'El Jazmín paraguayo es una planta trepadora muy valorada por sus flores blancas y su fragancia intensa. Es perfecta para cubrir pérgolas y muros, añadiendo un toque aromático y visual a cualquier jardín.' 
        },
        { 
            id: 37, 
            commonName: 'Calvelina', 
            scientificName: 'Myrtus communis', 
            description: 'Árbol pequeño con flores amarillas, que aporta color a jardines y es fácil de cuidar.', 
            longDescription: 'La Calvelina es un árbol pequeño conocido por sus atractivas flores amarillas. Su facilidad de cuidado la convierte en una excelente opción para aquellos que desean añadir color y vida a sus jardines.' 
        },
        { 
            id: 38, 
            commonName: 'Caliandra', 
            scientificName: 'Calliandra haematocephala', 
            description: 'Planta con flores esponjosas y atractivas, ideal para atraer aves y polinizadores.', 
            longDescription: 'La Caliandra es conocida por sus flores esponjosas y vibrantes, que son perfectas para atraer aves y polinizadores. Ideal para jardines donde se desea fomentar la biodiversidad y la vida silvestre.' 
        },
        { 
            id: 39, 
            commonName: 'Cepillo', 
            scientificName: 'Calliandra californica', 
            description: 'Planta de flores brillantes, utilizada en jardines por su atractivo visual y facilidad de cultivo.', 
            longDescription: 'El Cepillo es una planta ornamental que se destaca por sus flores brillantes. Su fácil cultivo la convierte en una elección popular para embellecer jardines y espacios exteriores.' 
        },
        { 
            id: 40, 
            commonName: 'Cedro', 
            scientificName: 'Cedrus', 
            description: 'Árbol con madera aromática, muy valorada en la construcción y carpintería por su durabilidad.', 
            longDescription: 'El Cedro es un árbol conocido por su madera aromática y duradera, ideal para la construcción y la carpintería. Su resistencia y belleza lo hacen una opción preferida en proyectos de alta calidad.' 
        },
        { 
            id: 41, 
            commonName: 'Taborochi', 
            scientificName: 'Tabebuia impetiginosa', 
            description: 'Árbol conocido por su sombra y belleza ornamental, perfecto para parques y jardines grandes.', 
            longDescription: 'El Taborochi es un árbol apreciado por su sombra densa y su belleza ornamental. Ideal para parques y jardines grandes, donde se puede disfrutar de su magnificencia y frescura.' 
        },
        { 
            id: 42, 
            commonName: 'Siraricito', 
            scientificName: 'Bauhinia variegata', 
            description: 'Planta de hojas pequeñas, común en jardines, que proporciona un toque verde a espacios reducidos.', 
            longDescription: 'El Siraricito es una planta de hojas pequeñas y compactas, ideal para proporcionar un toque verde a jardines y espacios reducidos. Es fácil de cuidar y se adapta a diversas condiciones.' 
        },
        { 
            id: 43, 
            commonName: 'Ciprés vela', 
            scientificName: 'Cupressus sempervirens', 
            description: 'Árbol alto y estrecho, ideal para setos, que ofrece una gran privacidad y es resistente.', 
            longDescription: 'El Ciprés vela es un árbol alto y estrecho que se utiliza frecuentemente para formar setos. Su densidad y resistencia lo convierten en una excelente opción para crear barreras de privacidad en jardines.' 
        },
        { 
            id: 44, 
            commonName: 'Chacatea', 
            scientificName: 'Peltophorum pterocarpum', 
            description: 'Árbol con flores amarillas que destaca en jardines, conocido por su belleza ornamental.', 
            longDescription: 'La Chacatea es un árbol ornamental que se caracteriza por sus hermosas flores amarillas. Ideal para embellecer jardines, su atractivo visual la convierte en una elección popular entre paisajistas.' 
        },
        { 
            id: 45, 
            commonName: 'Oreja de mono', 
            scientificName: 'Anacardium excelsum', 
            description: 'Árbol exótico con hojas grandes y decorativas, ideal para agregar un toque tropical a cualquier espacio.', 
            longDescription: 'La Oreja de mono es un árbol exótico que se distingue por sus hojas grandes y decorativas. Perfecto para jardines tropicales o para añadir un toque exótico a cualquier espacio exterior.' 
        },
        { 
            id: 46, 
            commonName: 'Chilijchi', 
            scientificName: 'Brosimum alicastrum', 
            description: 'Árbol con tronco recto, conocido por su sombra, perfecto para zonas calurosas.', 
            longDescription: 'El Chilijchi es un árbol de tronco recto que proporciona una sombra densa, ideal para zonas calurosas. Su robustez y resistencia lo convierten en una opción popular para parques y jardines.' 
        },
        { 
            id: 47, 
            commonName: 'Lloque', 
            scientificName: 'Myrciaria dubia', 
            description: 'Árbol pequeño que produce flores coloridas, ideal para jardines y bordes.', 
            longDescription: 'El Lloque es un árbol pequeño que se destaca por sus flores coloridas. Perfecto para jardines y bordes, añade un atractivo visual vibrante a cualquier espacio exterior.' 
        },
        { 
            id: 48, 
            commonName: 'Flor de Júpiter', 
            scientificName: 'Syzygium jambos', 
            description: 'Planta ornamental de flores vibrantes, muy popular en paisajismo por su belleza.', 
            longDescription: 'La Flor de Júpiter es una planta ornamental que produce flores vibrantes, muy apreciadas en el paisajismo. Su belleza la convierte en una opción popular para embellecer jardines y parques.' 
        },
        { 
            id: 49, 
            commonName: 'Magnolia', 
            scientificName: 'Magnolia grandiflora', 
            description: 'Árbol con flores grandes y fragantes, muy apreciado en jardines por su estética.', 
            longDescription: 'La Magnolia es un árbol majestuoso que produce grandes y fragantes flores. Su belleza y aroma la convierten en una de las favoritas en jardinería, añadiendo un toque de elegancia a cualquier entorno.' 
        },
        { 
            id: 50, 
            commonName: 'Falso laurel', 
            scientificName: 'Prunus laurocerasus', 
            description: 'Árbol de hojas brillantes y follaje denso, ideal para setos y cobertura.', 
            longDescription: 'El Falso laurel es un árbol que se caracteriza por sus hojas brillantes y su denso follaje. Es ideal para formar setos y cobertura, proporcionando privacidad y un atractivo visual a jardines.' 
        },
        { 
            id: 51, 
            commonName: 'Palo verde', 
            scientificName: 'Parkinsonia aculeata', 
            description: 'Árbol de sombra, conocido por su resistencia a la sequía, ideal para climas áridos.', 
            longDescription: 'El Palo verde es un árbol notable por su capacidad de proporcionar sombra en climas áridos. Su resistencia a la sequía lo convierte en una opción ideal para paisajes desérticos y jardines secos.' 
        },
        { 
            id: 52, 
            commonName: 'Algarrobo', 
            scientificName: 'Prosopis alba', 
            description: 'Árbol con frutos comestibles, utilizado en medicina tradicional y alimentación.', 
            longDescription: 'El Algarrobo es un árbol que produce frutos comestibles y es valorado tanto en la alimentación como en la medicina tradicional. Sus propiedades lo hacen un recurso importante en diversas culturas.' 
        },
        { 
            id: 53, 
            commonName: 'Soto', 
            scientificName: 'Quercus laurifolia', 
            description: 'Árbol de madera dura, muy valorada en construcción por su durabilidad.', 
            longDescription: 'El Soto es conocido por su madera dura y resistente, lo que lo convierte en una excelente opción para la construcción. Su durabilidad es apreciada en proyectos arquitectónicos de alta calidad.' 
        },
        { 
            id: 54, 
            commonName: 'Terbinto', 
            scientificName: 'Bursera graveolens', 
            description: 'Árbol conocido por su resina y propiedades medicinales, utilizado en tratamientos naturales.', 
            longDescription: 'El Terbinto es famoso por su resina, que se utiliza en tratamientos medicinales naturales. Además, su aroma característico lo hace popular en rituales y ceremonias.' 
        },
        { 
            id: 55, 
            commonName: 'Jarca', 
            scientificName: 'Cercis canadensis', 
            description: 'Árbol resistente y robusto, ideal para reforestación y paisajismo.', 
            longDescription: 'La Jarca es un árbol robusto y resistente, perfecto para proyectos de reforestación y paisajismo. Su adaptabilidad a diversas condiciones lo hace una opción popular entre los ecologistas.' 
        },
        { 
            id: 56, 
            commonName: 'Moto moto', 
            scientificName: 'Erythrina fusca', 
            description: 'Árbol ornamental que destaca por sus flores rojas brillantes, perfecto para jardines vibrantes.', 
            longDescription: 'El Moto moto es un árbol ornamental que se distingue por sus impresionantes flores rojas brillantes. Es ideal para jardines vibrantes, donde aporta un toque de color y belleza.' 
        },
        { 
            id: 57, 
            commonName: 'Tara', 
            scientificName: 'Caesalpinia spinosa', 
            description: 'Árbol de madera fuerte, utilizado en agricultura y construcción.', 
            longDescription: 'La Tara es un árbol conocido por su madera fuerte y durable, que se utiliza en diversas aplicaciones, desde la agricultura hasta la construcción, siendo una especie valiosa en el manejo de recursos.' 
        },
        { 
            id: 58, 
            commonName: 'Garrocha', 
            scientificName: 'Eucalyptus globulus', 
            description: 'Planta de rápido crecimiento, ideal para cercas y separación de espacios.', 
            longDescription: 'La Garrocha es una planta de rápido crecimiento que se utiliza frecuentemente para cercas y separación de espacios. Su crecimiento rápido la convierte en una opción eficaz para delimitaciones.' 
        },
        { 
            id: 59, 
            commonName: 'Tipa', 
            scientificName: 'Tipuana tipu', 
            description: 'Árbol grande con flores amarillas, muy utilizado para sombra y embellecimiento.', 
            longDescription: 'La Tipa es un árbol grande que produce hermosas flores amarillas. Es muy apreciado por su capacidad para proporcionar sombra y embellecer parques y jardines con su espectacular floración.' 
        }
];

const TreeType = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [species] = useState(initialSpecies);
    const [searchTerm, setSearchTerm] = useState('');

    const handleImageClick = (index) => {
        setSelectedIndex(index); // Guarda el índice del árbol seleccionado
    };

    const handleCloseSidenav = () => {
        setSelectedIndex(null); // Cierra el sidenav
    };

    // Filtrar especies según el término de búsqueda
    const filteredSpecies = species.filter(tree =>
        tree.commonName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2>Tipos de Árboles</h2>
                <p className="welcome-description">
                    Descubre una variedad de especies de árboles, cada uno con sus características únicas que enriquecen nuestro entorno. Desde árboles majestuosos que proporcionan sombra y frescura hasta especies ornamentales que embellecen nuestros paisajes urbanos, cada árbol desempeña un papel vital en nuestro ecosistema. Aprende sobre sus propiedades, como la capacidad de purificar el aire, almacenar carbono y ofrecer refugio a diversas formas de vida. A través de esta exploración, podrás apreciar la diversidad de la flora y entender cómo cada especie contribuye a la salud de nuestro planeta. ¡Sumérgete en el fascinante mundo de los árboles y descubre cómo puedes ser parte de su conservación y apreciación!
                </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar especies de árboles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredSpecies.map((tree, index) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={tree.id}> {/* Dos columnas en pantallas medianas y tres en grandes */}
                        <div className="card" onClick={() => handleImageClick(index)}>
                            <img
                                src={tree.imageUrl} // Muestra la imagen desde la URL
                                alt={tree.commonName}
                                className="tree-image"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{tree.commonName}</h5>
                                <p className="card-text">{tree.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <Sidenav tree={filteredSpecies[selectedIndex]} onClose={handleCloseSidenav} />
            )}
        </div>
    );
};

export default TreeType;
