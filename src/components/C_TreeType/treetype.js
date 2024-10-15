import React, { useState } from 'react';
import './treetypes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useFetchSpecies from 'hooks/useFetchSpecies';
import config from 'config/firebaseConfig';
import messages from 'config/messages.json';

const TreeType = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTreeClass, setSelectedTreeClass] = useState('');
    const [species, setSpecies] = useState([]);
    useFetchSpecies(setSpecies, config);

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
                    <h2>{messages.treeType.title}</h2>
                    <p className="welcome-description">
                        {messages.treeType.description}
                    </p>
                </div>

                <div className="row">
                    {species?.map((tree) => (
                        <div className={`col-md-4 mb-4`} key={tree.commonName}>
                            <div className="card text-white" style={{ backgroundColor: tree.color }}>
                                <div className="card-body">
                                    <h5 className="card-title">{tree.commonName}</h5>
                                    <p className="card-text">{tree.description}</p>
                                    <p className='card-text'>{messages.treeType.co2AbsorptionRate}</p>
                                    <p className='card-text'>{messages.treeType.waterConsumption}</p>
                                    <p className='card-text'>{messages.treeType.thermalAbsorption}</p>
                                </div>
                                <img
                                    src={tree.imageUrl}
                                    alt={tree.commonName}
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
                                    {messages.treeType.modalTitle}
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
