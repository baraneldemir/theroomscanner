import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoomDetailPage from './pages/RoomDetailPage'; // Import the RoomDetailPage
import './App.css';

function App() {
    return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/roomdetail" element={<RoomDetailPage />} />
            </Routes>
    );
}

export default App;
