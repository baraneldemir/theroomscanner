import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
    const [images, setImages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [links, setLinks] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [description, setDescription] = useState([]);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');

    const fetchImages = async (location) => {
        setImages([]);
        setTitles([]);
        setHeaders([]);
        setDescription([]);
        setLinks([]);
        setPrices([]);
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}`);
            setImages(response.data.images);
            setTitles(response.data.titles);
            setHeaders(response.data.headers);
            setPrices(response.data.prices);
            setLinks(response.data.links);
            setDescription(response.data.description);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.error || 'Failed to load rooms :(');
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        if (location.trim().length < 3) {
            setError('Please enter a valid location (at least 3 characters).');
            return;
        }
        fetchImages(location);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-skyBack">
            <h1 className="mb-4 text-3xl font-bold text-white">RoomScanner</h1>
            <input
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
                onClick={handleFetch}
                disabled={loading}
                className={`px-4 py-2 bg-skyBBlue text-white rounded-lg w-full max-w-md transition duration-300 ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-800'
                }`}
            >
                {loading ? 'Loading...' : 'Find a room'}
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4">
                    <div className="loader"></div> {/* Spinner */}
                </div>
            )}
            
            {/* Display images and room info after loading */}
            {!loading && images.length > 0 && (
                <div className="flex flex-col items-start gap-4 mt-6">
                    {images.map((image, index) => (
                        <div key={index} className="flex items-center w-full gap-4 p-5 bg-white shadow-md rounded-xl">
                            <a href={links[index]} target="_blank" rel="noopener noreferrer">
                                <img src={image} alt={`Room ${index}`} className="rounded-lg shadow-lg w-28 h-28" />
                            </a>
                            <div className='flex flex-col'>
                                <span className="text-black">{headers[index] || 'No headers available'}</span>
                                <span className="text-black">{titles[index] || 'No title available'}</span>
                                <span className="max-w-md text-xs leading-relaxed text-black break-words">{description[index] || 'No description available'}</span>
                                <span className="text-black">{prices[index] || 'No price available'}</span>
                            </div> 
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
