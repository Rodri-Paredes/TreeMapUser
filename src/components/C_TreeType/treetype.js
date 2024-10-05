import React, { useState } from 'react';
import './treetypes.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const treeTypes = [
    {
        name: 'Pino',
        description: 'Los pinos son árboles de hoja perenne que pertenecen a la familia de las coníferas. Son conocidos por su altura y su corteza característica.',
        className: 'green',
        image: '/images/pine.jpg'
    },
    {
        name: 'Roble',
        description: 'Los robles son árboles de hoja caduca que pueden vivir cientos de años. Su madera es muy valorada por su dureza y resistencia.',
        className: 'brown',
        image: '/images/oak.jpg'
    },
    {
        name: 'Sauce',
        description: 'Los sauces son conocidos por sus ramas largas y flexibles. A menudo se encuentran cerca de cuerpos de agua.',
        className: 'green',
        image: '/images/willow.jpg'
    },
    {
        name: 'Abeto',
        description: 'Los abetos son árboles perennes que se utilizan comúnmente como árboles de Navidad. Tienen agujas cortas y un aroma agradable.',
        className: 'green',
        image: '/images/fir.jpg'
    },
    {
        name: 'Ciprés',
        description: 'Los cipreses son árboles coníferos que se utilizan a menudo en paisajismo. Son conocidos por su forma cónica y su resistencia a la sequía.',
        className: 'blue',
        image: '/images/cyp.jpg'
    },
    {
        name: 'Manzano',
        description: 'El manzano Duque (Malus domestica) es una variedad de manzana que se caracteriza por su robustez y su capacidad de adaptarse a diferentes climas y suelos.',
        className: 'blue',
        image: '/images/manza.jpg'
    },
    // Árboles de ciudad
    {
        name: 'Cerezo',
        description: 'Los cerezos son conocidos por sus hermosas flores rosadas que adornan las calles en primavera.',
        className: 'pink',
        image: '/images/cerezo.jpg' // Asegúrate de que esta imagen esté disponible
    },
    {
        name: 'Fresno',
        description: 'El fresno es un árbol resistente que se utiliza frecuentemente en paisajismo urbano.',
        className: 'blue',
        image: '/images/fresno.jpg' // Asegúrate de que esta imagen esté disponible
    },
    {
        name: 'Sauce Llorón',
        description: 'El sauce llorón es un árbol típico en parques, conocido por su forma y follaje colgante.',
        className: 'green',
        image: '/images/sauce_lloron.jpg' // Asegúrate de que esta imagen esté disponible
    },
    {
        name: 'Álamo',
        description: 'El álamo es un árbol de rápido crecimiento, muy utilizado en calles y avenidas.',
        className: 'brown',
        image: '/images/alamo.jpg' // Asegúrate de que esta imagen esté disponible
    },
    {
        name: 'Olivo',
        description: 'El olivo es un árbol mediterráneo conocido por sus pequeñas hojas plateadas y su fruto, la aceituna.',
        className: 'green',
        image: '/images/olivo.jpg' // Asegúrate de que esta imagen esté disponible
    },
    {
        name: 'Lapacho',
        description: 'El lapacho es un árbol nativo de Sudamérica, conocido por sus impresionantes flores en tonos de rosa, amarillo y blanco.',
        className: 'pink',
        image: '/images/lapacho.jpg' // Asegúrate de que esta imagen esté disponible
    }
];

const TreeType = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTreeClass, setSelectedTreeClass] = useState('');

    const handleImageClick = (tree) => {
        setSelectedImage(tree.image);
        setSelectedTreeClass(tree.className);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setSelectedTreeClass('');
    };

    return (
        <div
            style={{
                backgroundImage: `url('/images/f1.jpg')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            />
            <div className="container" style={{ marginTop: '70px', position: 'relative', zIndex: 1 }}>
            
            <div className="container text-center">
                <h2>Tipos de Árbol:</h2>
                <p className="welcome-description">
                    Bienvenido a la sección de Tipos de Árbol. Aquí podrás explorar diferentes variedades de árboles, 
                    aprender sobre sus características y apreciar la belleza de la naturaleza. Cada tipo de árbol juega un 
                    papel vital en nuestro ecosistema, proporcionando sombra, oxígeno y hábitats para la vida silvestre. 
                    Desde los majestuosos pinos que se alzan hacia el cielo hasta los delicados cerezos que adornan nuestras 
                    calles en primavera, cada árbol tiene su propia historia que contar. Te invitamos a sumergirte en el 
                    fascinante mundo de la arboricultura, donde podrás descubrir la importancia de cuidar y preservar estos 
                    valiosos recursos naturales. ¡Explora y aprende más sobre cada especie!
                </p>
            </div>

                <div className="row">
                    {treeTypes.map((tree) => (
                        <div className={`col-md-4 mb-4`} key={tree.name}>
                            <div className={`card ${tree.className} text-white`}>
                                <div className="card-body">
                                    <h5 className="card-title">{tree.name}</h5>
                                    <p className="card-text">{tree.description}</p>
                                </div>
                                <img
                                    src={tree.image}
                                    alt={tree.name}
                                    className="card-img-top tree-image mx-auto d-block"
                                    style={{ width: '100%', height: '200px', objectFit: 'contain', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(tree)} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className="modal show" style={{ display: 'block', zIndex: 1050 }}>
                    <div className={`modal-dialog modal-lg ${selectedTreeClass}`}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleCloseModal}>
                                    &times;
                                </button>
                                <h5 className="modal-title" style={{ marginLeft: '10px' }}>
                                    Imagen detallada del árbol
                                </h5>
                            </div>
                            <div className="modal-body">
                                <img 
                                    src={selectedImage} 
                                    alt="Ampliada" 
                                    style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeType;
