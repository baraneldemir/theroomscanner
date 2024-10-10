import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
    const [images, setImages] = useState([]);
    const [titles, setTitles] = useState([]);
     // State for listing locations
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [prices, setPrices] = useState([]);


    const fetchImages = async (location) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}`);
            setImages(response.data.images);  // Expect an array of image URLs
            
            setTitles(response.data.titles); 
            setPrices(response.data.prices);  // Expect an array of locations
        } catch (error) {
            console.error("Error fetching images:", error);
            setError('Failed to load images.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
      console.log("Images:", images);

console.log("titles:", titles);
console.log("titles:", prices);

        if (location) {
            fetchImages(location);
        } else {
            setError('Please enter a location.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">RoomScanner</h1>
            <input
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded-lg w-full max-w-md"
            />
            <button
                onClick={handleFetch}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg w-full max-w-md transition duration-300 ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
            >
                {loading ? 'Loading...' : 'Find a room'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            <div className="flex flex-col items-start gap-4 mt-6">
    {images.length > 0 ? (
        images.map((image, index) => (
            <div key={index} className="flex items-center gap-4">
                <img src={image} alt={`Room ${index}`} className="w-20 h-20 rounded-lg shadow-lg" />
                <div className='flex flex-col'>
                <span className="text-gray-700">{titles[index] || 'No title available'}</span> {/* Display the location */}
                <span className="text-gray-700">{prices[index] || 'No prices available'}</span> {/* Display the location */}
                </div>
            </div>
        ))
    ) : (
        <p className="text-gray-500">No rooms to display</p>
    )}
</div>

        </div>
    );
}
