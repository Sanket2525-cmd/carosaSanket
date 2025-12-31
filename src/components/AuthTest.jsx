// Authentication Test Component
// Use this component to test the authentication flow during development

"use client";

import React from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import useAuthStore from '../store/authStore';

const AuthTest = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    logout, 
    clearError,
    initializeAuth 
  } = useAuthStore();

  const handleInitialize = () => {
    initializeAuth();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card className="m-3">
      <Card.Header>
        <h5>Authentication Test Component</h5>
        <small className="text-muted">Use this to test auth state during development</small>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <strong>Authentication Status:</strong>
          <span className={`ms-2 badge ${isAuthenticated ? 'bg-success' : 'bg-danger'}`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>

        {user && (
          <div className="mb-3">
            <strong>User Info:</strong>
            <pre className="mt-2 p-2 bg-light rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mb-3">
            <strong>Error:</strong> {error}
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="ms-2"
              onClick={clearError}
            >
              Clear
            </Button>
          </Alert>
        )}

        {isLoading && (
          <Alert variant="info" className="mb-3">
            Loading...
          </Alert>
        )}

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleInitialize}
            disabled={isLoading}
          >
            Initialize Auth
          </Button>
          
          {isAuthenticated && (
            <Button 
              variant="danger" 
              onClick={handleLogout}
              disabled={isLoading}
            >
              Logout
            </Button>
          )}
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Instructions:</strong>
            <br />
            1. Click "Sign in / Login" in the header to open the auth modal
            <br />
            2. Enter a phone number and click "Send OTP"
            <br />
            3. Check your SMS for the OTP code
            <br />
            4. Enter the OTP and verify
            <br />
            5. Check this component to see the auth state
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthTest;

