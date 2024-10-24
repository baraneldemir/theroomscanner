import React, { createContext, useContext, useState } from 'react';

const LandingListingContext = createContext();

export const LandinListingProvider = ({ children }) => {
    const [listings, setListings] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <LandingListingContext.Provider 
        value={{ 
            listings, 
            setListings, 
            selectedCity, 
            setSelectedCity, 
            currentPage, 
            setCurrentPage 
            }}>
            {children}
        </LandingListingContext.Provider>
    );
};

export const useLandingListingContext = () => useContext(LandingListingContext);
