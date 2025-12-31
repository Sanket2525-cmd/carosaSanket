"use client";

import React from "react";

const OffersModal = ({ show, data, onClose, onViewOffer }) => {
  if (!show || !data) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleViewOffer = (buyer) => {
    // If onViewOffer prop is provided, use it (allows parent to handle navigation)
    if (onViewOffer) {
      onViewOffer(buyer);
      return;
    }
    
    // Otherwise, use default navigation (fallback)
    const carId = data.did || data.carId;
    const negotiationId = buyer.negotiationId || buyer.offer?.id;
    
    if (!carId) {
      console.error('Car ID not found');
      return;
    }
    
    // Navigate to seller negotiation page - open in new tab
    const url = negotiationId 
      ? `/seller-negotiation?carId=${carId}&negotiationId=${negotiationId}`
      : `/seller-negotiation?carId=${carId}`;
    
    window.open(url, '_blank');
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Format: DD MMM YYYY, HH:MM AM/PM
      const formattedDate = date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      const formattedTime = date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="dashboard-modal-backdrop" onClick={handleBackdropClick}>
      <div className="dashboard-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-3">
          <div>
            <h3 className="dashboard-modal-title mb-1">Offers – {data.title}</h3>
            <p className="dashboard-modal-subtitle mb-0">
              DID: {data.did} • Total Offers: {data.totalOffers}
            </p>
          </div>
          <button type="button" className="dashboard-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="dashboard-modal-table-wrapper">
          {data.buyers && data.buyers.length > 0 ? (
            <table className="table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Offer Price</th>
                  <th scope="col">Date & Time</th>
                  <th scope="col" className="text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.buyers.map((buyer, index) => (
                  <tr key={buyer.id || `buyer-${index}`}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{buyer.name}</td>
                    <td>{buyer.price}</td>
                    <td className="text-muted small">{formatDateTime(buyer.createdAt)}</td>
                    <td className="text-end">
                      <button 
                        type="button" 
                        className="dashboard-modal-btn"
                        onClick={() => handleViewOffer(buyer)}
                      >
                        View Offer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No offers received yet for this car.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersModal;

