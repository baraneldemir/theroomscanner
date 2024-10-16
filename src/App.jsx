import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

export default function App() {
    const [images, setImages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [links, setLinks] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [description, setDescription] = useState([]);
    const [listingLocations, setListingLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [prices, setPrices] = useState([]);

    const fetchImages = async (location) => {
        // Clear existing data before fetching new data
        setImages([]);
        setTitles([]);
        setHeaders([]);
        setDescription([]);
        setLinks([]);
        setPrices([]);
        setListingLocations([]);
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}`);
            setImages(response.data.images); // Expect an array of image URLs
            setTitles(response.data.titles); 
            setPrices(response.data.prices);
            setHeaders(response.data.headers);
            setLinks(response.data.links); 
            setDescription(response.data.description); 
            setListingLocations(response.data.listingLocations);// Expect an array of locations
        } catch (error) {
            console.error("Error fetching images:", error);
            setError('Failed to load rooms :(');
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        console.log("Images:", images);
        console.log("Titles:", titles);
        console.log("Prices:", prices);
        console.log("Links:", links);
        console.log("Headers:", headers);
        console.log("Locations:", listingLocations);
        console.log("Description:", description);

        if (location) {
            fetchImages(location);
        } else {
            setError('Please enter a location.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-skyBack">
            <h1 className="mb-4 text-3xl font-bold text-white">RoomScanner Test Website</h1>
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
            {!loading && (
                <div className="flex flex-col items-start gap-4 mt-6">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <div key={index} className="flex items-center w-full gap-4 p-5 bg-white rounded-xl">
                                <a href={links[index]}>
                                    <img src={image} alt={`Room ${index}`} className="rounded-lg shadow-lg w-28 h-28" />
                                </a>
                                <div className='flex flex-col'>
                                    <span className="text-black">{headers[index] || 'No headers available'}</span>
                                    <span className="text-black">{titles[index] || 'No title available'}</span>
                                    <span className="max-w-md text-xs leading-relaxed text-black break-words ">{description[index] || 'No description available'}</span>
                                    <span className="text-black">{listingLocations[index] || 'No location available'}</span>
                                    <span className="text-black">{prices[index] || 'No prices available'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </div>
    );
}
