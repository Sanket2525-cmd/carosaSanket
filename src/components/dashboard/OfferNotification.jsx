"use client";

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

export default function OfferNotification({ offerStatus, offerAmount, carDetails }) {
  if (!offerStatus || offerStatus === 'initial') {
    return null;
  }

  const formatPrice = (amount) => {
    return (amount / 100000).toFixed(2).replace(/\.00$/, '');
  };

  const getNotificationContent = () => {
    switch (offerStatus) {
      case 'sent':
        return {
          icon: faClock,
          title: 'Offer Sent Successfully',
          message: `Your offer of ₹${formatPrice(offerAmount)} has been sent to the seller`,
          buttonText: 'View Offer Status',
          buttonVariant: 'primary',
          cardClass: 'border-primary'
        };
      case 'accepted':
        return {
          icon: faCheckCircle,
          title: 'Congratulations!',
          message: `Your offer of ₹${formatPrice(offerAmount)} has been accepted by the seller`,
          buttonText: 'Complete Booking',
          buttonVariant: 'success',
          cardClass: 'border-success bg-light-success'
        };
      case 'rejected':
        return {
          icon: faCheckCircle,
          title: 'Offer Rejected',
          message: `Your offer of ₹${formatPrice(offerAmount)} was rejected by the seller`,
          buttonText: 'Make New Offer',
          buttonVariant: 'danger',
          cardClass: 'border-danger bg-light-danger'
        };
      default:
        return null;
    }
  };

  const content = getNotificationContent();
  if (!content) return null;

  return (
    <Card className={`offer-notification ${content.cardClass}`}>
      <Card.Body className="p-3">
        <div className="d-flex align-items-start">
          <div className={`notification-icon me-3 ${
            offerStatus === 'sent' ? 'text-primary' :
            offerStatus === 'accepted' ? 'text-success' : 'text-danger'
          }`}>
            <FontAwesomeIcon icon={content.icon} size="lg" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-2">{content.title}</h6>
            <p className="text-muted mb-2 small">{content.message}</p>
            {carDetails && (
              <div className="car-details mb-2">
                <small className="text-muted">
                  {carDetails.brand} {carDetails.model}
                </small>
              </div>
            )}
            <Button 
              variant={content.buttonVariant} 
              size="sm"
              href="/make-offer"
            >
              {content.buttonText}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

