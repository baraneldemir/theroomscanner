import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLandingListingContext } from '../contexts/LandingListingContext';

export default function LandingPage() {
    const { listings, setListings, selectedCity, setSelectedCity, currentPage, setCurrentPage } = useLandingListingContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');


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
        setError('');

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape-images/${location}/${page}`, {
                params: { minPrice, maxPrice }
            });
            if (response.data.length === 0) {
                setError('No rooms found in that price range.');
            }
            setListings(prevListings => [...prevListings, ...response.data]);
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
        setListings([]);
        setCurrentPage(1);
        fetchImages(selectedCity, 1);
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchImages(selectedCity, nextPage);
    };

    const handleCityChange = (e) => {
        const inputValue = e.target.value;
        setSelectedCity(inputValue);
        setListings([]);
        setCurrentPage(1);

        if (inputValue) {
            const filtered = cities.filter(city => city.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setCurrentPage(1);
        setListings([]);
        fetchImages(city, 1);
        setFilteredCities([]);
    };

 return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-skyBack">
            <h1 className="mb-4 text-3xl font-bold text-white">RoomScanner</h1>

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

            <div className="flex flex-col items-start w-full max-w-lg gap-4 mt-6">
                {listings.map((listing, index) => (
                    <div key={listing._id} className="flex items-start w-full gap-4 p-4 bg-white shadow-md rounded-xl">
                        <Link to="/roomdetail" state={{ 
                            link: listing.link, 
                            title: listing.title, 
                            header: listing.header, 
                            description: listing.description
                        }}>
                            <img src={listing.image} alt={`Room ${index}`} className="object-cover w-48 rounded-lg h-28" />
                        </Link>
                        <div className="flex flex-col justify-between flex-grow">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-black">{listing.header || 'No headers available'}</h3>
                                <p className="text-sm text-gray-700">
                                    {listing.title?.length > 50 ? listing.title.slice(0, 50) + '...' : listing.title}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                    {listing.description?.length > 80 ? listing.description.slice(0, 80) + '...' : listing.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-black">{listing.price || 'No price available'}</span>
                                <Link
                                    to='/roomdetail'
                                    state={{ 
                                        link: listing.link, 
                                        title: listing.title, 
                                        header: listing.header, 
                                        description: listing.description
                                    }}
                                    className="px-3 py-1 text-xs text-white rounded-lg bg-skyBBlue"
                                >
                                    <button>See Room Photos</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="mt-4">
                    <div className="loader"></div>
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
    )

}