"use client";

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TestDriveFeedbackModal = ({ show, onClose, testDriveId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [needImprovements, setNeedImprovements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine comments and need improvements into review
      const review = [comments, needImprovements]
        .filter(Boolean)
        .join('\n\n');
      
      await onSubmit(testDriveId, rating, review);
      
      // Reset form
      setRating(0);
      setComments('');
      setNeedImprovements('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div 
      className="dashboard-modal-backdrop" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div 
        className="dashboard-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1976d2', fontSize: '20px', fontWeight: '600', margin: 0 }}>
            Buyer Feedback
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#666',
              padding: 0,
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaTimes />
          </button>
        </div>

        <hr style={{ marginBottom: '20px', borderColor: '#e0e0e0' }} />

        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#333', fontWeight: '500' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: rating >= star ? '#ff9800' : 'transparent',
                    border: '2px solid #ff9800',
                    borderRadius: '4px',
                    width: '40px',
                    height: '40px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: rating >= star ? '#fff' : '#ff9800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (rating === 0 || rating < star) {
                      e.currentTarget.style.backgroundColor = '#fff3e0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (rating === 0 || rating < star) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#333', fontWeight: '500' }}>
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Need Improvements Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#333', fontWeight: '500' }}>
              Need Improvements
            </label>
            <textarea
              value={needImprovements}
              onChange={(e) => setNeedImprovements(e.target.value)}
              placeholder="Enter"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting || rating === 0 ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || rating === 0 ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestDriveFeedbackModal;

