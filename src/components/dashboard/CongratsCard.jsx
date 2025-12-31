"use client";

import React from 'react';

export default function CongratsCard({count=1, onClick, offerStatus='sent'}){
  const getTitle = () => {
    switch (offerStatus) {
      case 'sent':
        return 'Offer Sent Successfully';
      case 'accepted':
        return 'Congratulations!';
      case 'rejected':
        return 'Offer Rejected';
      default:
        return 'Offer Sent Successfully';
    }
  };

  const getMessage = () => {
    switch (offerStatus) {
      case 'sent':
        return 'Your offer has been successfully sent to the seller';
      case 'accepted':
        return 'Your offer has been accepted by the seller';
      case 'rejected':
        return 'Your offer was rejected by the seller';
      default:
        return 'Your offer has been successfully sent to the seller';
    }
  };

  const getButtonText = () => {
    switch (offerStatus) {
      case 'sent':
        return 'View Offer Status';
      case 'accepted':
        return 'Complete Booking';
      case 'rejected':
        return 'Make New Offer';
      default:
        return 'View Offer Status';
    }
  };

  return (
    <div className="dv2-congrats position-relative">
      <div className="dv2-congrats-badge">{getTitle()}</div>
      <div className="dv2-congrats-dot fw-bold">{count}</div>
      <div className="dv2-congrats-body">
        <div className="dv2-congrats-text fw-bold">{getMessage()}</div>
        <button onClick={onClick} className="dv2-congrats-btn">{getButtonText()}</button>
      </div>
    </div>
  );
}


