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
    const [currentPage, setCurrentPage] = useState(1); // Track the current page

    const fetchImages = async (location, pageNum = 1) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}/page${pageNum}`);
            // Append new data to existing state
            setImages(prevImages => [...prevImages, ...response.data.images]);
            setTitles(prevTitles => [...prevTitles, ...response.data.titles]);
            setHeaders(prevHeaders => [...prevHeaders, ...response.data.headers]);
            setPrices(prevPrices => [...prevPrices, ...response.data.prices]);
            setLinks(prevLinks => [...prevLinks, ...response.data.links]);
            setDescription(prevDescription => [...prevDescription, ...response.data.description]);
            setCurrentPage(pageNum); // Update current page
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
        setImages([]); // Clear images for a new search
        setTitles([]);
        setHeaders([]);
        setPrices([]);
        setLinks([]);
        setDescription([]);
        setCurrentPage(1); // Reset to the first page
        fetchImages(location, 1); // Fetch first page
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1; // Increment page number
        fetchImages(location, nextPage); // Fetch next page
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
            
            {/* Display images and room info */}
            <div className="flex flex-col items-start gap-4 mt-6">
                {images.map((image, index) => (
                    <div key={index} className="flex items-center w-full gap-4 p-5 bg-white shadow-md rounded-xl">
                        <a href={links[index]} target="_blank" rel="noopener noreferrer">
                            <img src={image} alt={`Room ${index}`} className="shadow-lg w-48 h-28 md:w-28" />
                        </a>
                        <div className='flex flex-col'>
                            <span className="text-black">{headers[index] || 'No headers available'}</span>
                            <span className="text-black">{titles[index] || 'No title available'}</span>
                            <span className="max-w-md text-xs leading-relaxed text-black break-words">{description[index] || 'No description available'}</span>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-black">{prices[index] || 'No price available'}</span>
                                <a 
                                    href={links[index]} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-skyBBlue text-sm font-semibold transition-all duration-300 ease-in-out hover:text-sky-600 hover:underline"
                                >
                                    See The Room
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4">
                    <div className="loader"></div> {/* Spinner */}
                </div>
            )}

            {/* Load More Button */}
            {!loading && images.length > 0 && (
                <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-4 py-2 mt-4 bg-skyBBlue text-white rounded-lg w-full max-w-md transition duration-300 hover:bg-blue-800"
                >
                    Load More
                </button>
            )}
        </div>
    );
}
