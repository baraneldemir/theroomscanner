import React, { useEffect, useState } from 'react';
import './DescriptionModal.css'; // Import CSS for animations

export default function DescriptionModal({ show, onClose, title, description, x, y }) {
    const [modalWidth, setModalWidth] = useState(0);
    const [modalHeight, setModalHeight] = useState(0);

    useEffect(() => {
        // Get the dimensions of the modal after it mounts
        const modal = document.getElementById('description-modal');
        if (modal) {
            setModalWidth(modal.offsetWidth);
            setModalHeight(modal.offsetHeight);
        }
    }, [show]);

    if (!show) return null;

    // Calculate adjusted positions
    const adjustedX = Math.max(0, Math.min(x, window.innerWidth - modalWidth));
    const adjustedY = Math.max(0, Math.min(y, window.innerHeight - modalHeight));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                id="description-modal" // Add an ID for width/height calculation
                className="modal-container animate-slide-up"
                style={{ top: `${adjustedY}px`, left: `${adjustedX}px`, transform: 'translate(0, 0)' }} // No translation
            >
                <div className="modal-content">
                    <div className="flex justify-between mb-2">
                        <h2 className="text-lg font-semibold">{title || 'No title available'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-black">
                            ✕
                        </button>
                    </div>
                    {/* Display the full description without shortening */}
                    <p className="mb-2 text-sm text-gray-700">{description || 'No description available'}</p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-white rounded-lg bg-skyBBlue hover:bg-sky-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
