import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCities, setFilteredCities] = useState([]);

    const cities = [
        'London',
        'Birmingham',
        'Manchester',
        'Glasgow',
        'Liverpool',
        'Newcastle',
        'Sheffield',
        'Bristol',
        'Leeds',
        'Cardiff',
        'Nottingham',
        'Coventry',
        'Bradford',
        'Belfast',
        'Stoke-on-Trent',
        'Wolverhampton',
        'Sunderland',
        'Portsmouth',
        'Leicester',
        'Aberdeen',
        'Brighton',
        'Plymouth',
        'Derby',
        'Swindon',
        'Luton',
        'Middlesbrough',
        'Blackpool',
        'Stockport',
        'Bolton',
        'York',
        'Cambridge',
        'Wolverhampton',
        'Swansea',
        'Dundee',
        'Derry',
        'Bournemouth',
        'Exeter',
        'Southampton',
        'Inverness',
        'Gloucester',
        'Wakefield',
        'Falkirk',
        'Chester',
        'St Albans',
        'Slough',
        'Aberdeen',
        'Lincoln',
        'Hastings',
        'Telford',
        'Salisbury',
        'Dunfermline',
        'Belfast',
    ];

    const fetchImages = async (location, page) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}/${page}`);
            setListings(prevListings => [...prevListings, ...response.data]); // Append new listings
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.error || 'Failed to load rooms :(');
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        if (!selectedCity) {
            setError('Please select a valid city.');
            return;
        }
        setListings([]); // Reset listings on new fetch
        setCurrentPage(1); // Reset page to 1 when fetching new city
        fetchImages(selectedCity, 1);
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1; // Increment the current page
        setCurrentPage(nextPage);
        fetchImages(selectedCity, nextPage);
    };
    const handleCityChange = (e) => {
        const inputValue = e.target.value;
        setSelectedCity(inputValue);

        // Filter cities based on input value
        if (inputValue) {
            const filtered = cities.filter(city => 
                city.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setFilteredCities([]); // Clear the suggestions after selecting a city
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-skyBack">
            <h1 className="mb-4 text-3xl font-bold text-white">RoomScanner</h1>

            {/* Input for selecting city */}
            <div className="relative w-full max-w-md mb-4">
                <input
                    type="text"
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="Select a city"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {/* Dropdown list for suggestions */}
                {filteredCities.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {filteredCities.map((city, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleCitySelect(city)} 
                                className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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

            {/* Display images and room info after loading */}
            <div className="flex flex-col items-start gap-4 mt-6">
                {listings.map((listing, index) => (
                    <div key={listing._id} className="flex items-center w-full gap-4 p-5 bg-white shadow-md rounded-xl">
                        <a href={listing.link} target="_blank" rel="noopener noreferrer">
                            <img src={listing.image} alt={`Room ${index}`} className="shadow-lg w-48 h-28 md:w-28" />
                        </a>
                        <div className='flex flex-col'>
                            <span className="text-black">{listing.header || 'No headers available'}</span>
                            <span className="text-black">{listing.title || 'No title available'}</span>
                            <span className="max-w-md text-xs leading-relaxed text-black break-words">{listing.description || 'No description available'}</span>

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-black">{listing.price || 'No price available'}</span>
                                <a 
                                    href={listing.link} 
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
            {!loading && listings.length > 0 && (
                <button
                    onClick={handleLoadMore}
                    className="mt-4 px-4 py-2 bg-skyBBlue text-white rounded-lg"
                >
                    Load More
                </button>
            )}
        </div>
    );
}