"use client";

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TestDriveNoModal = ({ show, onClose, dealId, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    'Price too high',
    'Condition not as expected',
    'Not suitable for my needs',
    'Found another car',
    'Changed my mind',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a reason');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine reason and comments
      const comment = comments 
        ? `Reason: ${reason}\nComments: ${comments}`
        : `Reason: ${reason}`;
      
      await onSubmit(dealId, comment);
      
      // Reset form
      setReason('');
      setComments('');
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
            Not
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

        <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
          Oops! Sorry to hear you didn't like the car.
        </div>

        <form onSubmit={handleSubmit}>
          {/* Reason Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#333', fontWeight: '500' }}>
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
              required
            >
              <option value="">Select</option>
              {reasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !reason}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting || !reason ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !reason ? 0.6 : 1,
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

export default TestDriveNoModal;




