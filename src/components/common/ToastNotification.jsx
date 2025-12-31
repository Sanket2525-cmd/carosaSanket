import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

const ToastNotification = ({ show, message, type = 'success', onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger me-2" />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <div 
      className="position-fixed"
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px'
      }}
    >
      <Alert 
        variant={getVariant()} 
        className="d-flex align-items-center justify-content-between shadow"
        style={{ marginBottom: 0 }}
      >
        <div className="d-flex align-items-center">
          {getIcon()}
          <span>{message}</span>
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </Alert>
    </div>
  );
};

export default ToastNotification;







