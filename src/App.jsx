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
    const [minPrice, setMinPrice] = useState(''); // New state for min price
    const [maxPrice, setMaxPrice] = useState(''); // New state for max price
    const [expandedListings, setExpandedListings] = useState({}); // Tracks which listings are expanded

    const cities = [
        'London', 'Birmingham', 'Manchester', 'Glasgow', 
        'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Leeds', 
        'Cardiff', 'Nottingham', 'Coventry', 'Bradford', 'Belfast', 
        'Stoke-on-Trent', 'Wolverhampton', 'Sunderland', 'Portsmouth', 
        'Leicester', 'Aberdeen', 'Brighton', 'Plymouth', 'Derby', 
        'Swindon', 'Luton', 'Middlesbrough', 'Blackpool', 'Stockport', 
        'Bolton', 'York', 'Cambridge', 'Swansea', 'Dundee', 
        'Derry', 'Bournemouth', 'Exeter', 'Southampton', 'Inverness', 
        'Gloucester', 'Wakefield', 'Falkirk', 'Chester', 'St Albans', 
        'Slough', 'Lincoln', 'Hastings', 'Telford', 'Salisbury', 
        'Dunfermline', 'Camden', 'Islington', 'Southwark', 'Bromley', 
        'Tower Hamlets', 'Hackney', 'Brent', 'Ealing', 'Lambeth', 
        'Wandsworth', 'Hammersmith and Fulham', 'Croydon', 'Newham', 
        'Redbridge', 'Hounslow', 'Bexley', 'Barnet', 'Havering', 
        'Greenwich', 'Enfield', 'Haringey', 'Durham', 'Milton Keynes', 
        'Salford', 'Aberystwyth', 'Peterborough', 'Lichfield', 
        'Maidstone', 'Basingstoke', 'Woking', 'Rugby', 'Dudley', 
        'Kirkcaldy', 'Wokingham', 'Camberley', 
        'Colchester', 'Dartford', 'Wellingborough','Kent'
    ];

    const fetchImages = async (location, page) => {
        setLoading(true);
        setError(''); // Clear error message at the start

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}/${page}`, {
                params: { minPrice, maxPrice } // Pass minPrice and maxPrice as query params
            });
            if (response.data.length === 0) {
                setError('No rooms found in that price range.'); // Set error if no listings returned
            }
            setListings(prevListings => [...prevListings, ...response.data]); // Append new listings
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response?.data?.error || 'Failed to load rooms :(');
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        if (!selectedCity || !cities.includes(selectedCity)) {
            setError('Please select a valid city from the dropdown.');
            return;
        }
        // Reset listings only for a new search
        setListings([]); 
        // setCurrentPage(1); // Start from page 1 for a new city
        fetchImages(selectedCity, 1); // Fetch the first page of data
    };
    
    const handleLoadMore = () => {
        const nextPage = currentPage + 1; // Increment the current page
        setCurrentPage(nextPage);
        fetchImages(selectedCity, nextPage); // Fetch the next page
    };

    const handleCityChange = (e) => {
        const inputValue = e.target.value;
        setSelectedCity(inputValue);

        // Clear listings when user starts typing
        setListings([]);

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

    const toggleReadMore = (index) => {
        setExpandedListings((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
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

            {/* Input fields for min and max price */}
            <div className="flex justify-between w-full max-w-md mb-4">
                <input
                    disabled
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min price £"
                    className="w-1/2 p-2 mr-2 border border-gray-300 rounded-lg"
                />
                <input
                    disabled
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max price £"
                    className="w-1/2 p-2 ml-2 border border-gray-300 rounded-lg"
                />
            </div>

            <button
                onClick={handleFetch}
                disabled={loading}
                className={`px-4 py-2 bg-skyBBlue text-white rounded-lg w-full max-w-md transition duration-300 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
                {loading ? 'Loading...' : 'Find a room'}
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <div className="flex flex-col items-start gap-4 mt-6">
                
                {listings.map((listing, index) => (
                    <div key={listing._id} className="flex items-center w-full gap-1 bg-white shadow-md rounded-xl">
                        <a href={listing.link} target="_blank" rel="noopener noreferrer">
                            <img src={listing.image} alt={`Room ${index}`} className="object-cover w-48 rounded-lg shadow-lg h-28 md:w-28" />
                        </a>
                        <div className='flex flex-col'>
                            <span className="font-semibold leading-tight text-black">{listing.header || 'No headers available'}</span>
                            <span className="text-xs font-semibold text-black ">{listing.title || 'No title available'}</span>

                            <span className="max-w-md text-xs text-black break-words">
                                {expandedListings[index]
                                    ? listing.description || 'No description available'
                                    : (listing.description?.length > 100 ? listing.description.slice(0, 100) + '...' : listing.description)}
                            </span>

                            {listing.description?.length > 100 && (
                                <span
                                    className="text-xs font-semibold transition-all duration-300 ease-in-out cursor-pointer text-skyBBlue hover:text-sky-600 hover:underline"
                                    onClick={() => toggleReadMore(index)}
                                >
                                    {expandedListings[index] ? 'Read less' : 'Find out more'}
                                </span>
                            )}

                            <div className="flex items-center justify-between mr-2 ">
                                <span className="text-xs font-bold text-black">{listing.price || 'No price available'}</span>
                                <a
                                    href={listing.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-semibold transition-all duration-300 ease-in-out text-skyBBlue hover:text-sky-600 hover:underline"
                                >
                                    See The Room
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="mt-4">
                    <div className="loader"></div> {/* Spinner */}
                </div>
            )}

            {!loading && listings.length > 0 && (
                <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 mt-4 text-white rounded-lg bg-skyBBlue"
                >
                    Load More
                </button>
            )}
        </div>
    );
}
