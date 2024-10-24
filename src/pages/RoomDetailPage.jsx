import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './RoomDetailPage.css';
import { Link } from 'react-router-dom';


// Spinner component
const Spinner = () => (
    <div className="flex items-center justify-center h-48">
        <div className="loader"></div>
    </div>
);


// Modal component for viewing the full-size photo
const PhotoModal = ({ isOpen, photo, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <button onClick={onClose} className="absolute text-2xl text-white top-4 right-4">×</button>
            <img src={photo} alt="Full view" className="max-w-full max-h-screen" />
        </div>
    );
};

const RoomDetailPage = () => {
    const location = useLocation();
    const { link, title, header } = location.state || {}; // Get the link from location state
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalPhoto, setModalPhoto] = useState(null); // State for the modal photo
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        if (link) {
            fetchPhotos(link);
        }
    }, [link]);

    const fetchPhotos = async (link) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-photos`, {
                params: { link },
            });
            setPhotos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching photos:", error);
            setError("Failed to load photos.");
            setLoading(false);
        }
    };

    const openModal = (photo) => {
        setModalPhoto(photo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalPhoto(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-skyBack">
             <h1 className="my-4 text-3xl font-bold text-center text-white">{header}</h1>
             <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
            {loading ? <Spinner /> : error ? (
                <p className="text-red-500">{error}</p>
            ) : photos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="overflow-hidden rounded shadow-lg">
                            <img
                                src={photo}
                                alt={`Room ${index}`}
                                className="object-cover w-full h-48 cursor-pointer hover:opacity-75"
                                onClick={() => openModal(photo)} // Open modal on click
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No photos available.</p>
            )}
            <PhotoModal isOpen={isModalOpen} photo={modalPhoto} onClose={closeModal} />
            <Link to='/' 
            className="px-4 py-2 my-4 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700">
                <div>Go Back to Listings</div>
            </Link>
        </div>
        
    );
};

export default RoomDetailPage;
