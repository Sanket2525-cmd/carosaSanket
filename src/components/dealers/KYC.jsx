"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import DealerService from "@/services/dealerService";
import { useAuthStore } from "@/store/authStore";

const KYC = () => {
  const [bankVerified, setBankVerified] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();

  // Fetch dealer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || user?.role !== 'Dealer') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await DealerService.getMyDealerProfile();
        
        if (result.success) {
          setProfileData(result.data);
        } else {
          setError(result.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.role]);

  const handleKycSubmit = () => {
    // Show bank verification button after KYC submit
    setShowBankModal(true);
  };

  const handleBankVerify = () => {
    setBankVerified(true);
    setShowBankModal(false);
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading KYC information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading KYC</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get values from profile data or use defaults
  const dealershipName = profileData?.dealershipName || 'Dealership';
  const dealerName = profileData?.dealerName || '';
  const contactPersonName = profileData?.contactPersonName || '';
  
  // Address & KYC fields
  const city = profileData?.city || '';
  const pincode = profileData?.pincode || '';
  const location = profileData?.location || '';
  const completeAddress = profileData?.completeAddress || '';
  const aadhaarNumber = profileData?.aadhaarNumber || '';
  const panNumber = profileData?.panNumber || '';
  const gstNumber = profileData?.gstNumber || '';
  
  // Bank details
  const bankName = profileData?.bankName || '';
  const accountNumber = profileData?.accountNumber || '';
  const confirmAccountNumber = profileData?.confirmAccountNumber || '';
  const ifscCode = profileData?.ifscCode || '';
  const accountHolderName = profileData?.accountHolderName || '';
  
  // Get first letter for avatar
  const getAvatarLetter = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-content">
      {/* Header Section */}
       <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
            KYC Information
          </h2>

          {/* <div className="d-flex align-items-center gap-3 flex-wrap">
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Page will reset via useEffect when debouncedSearch changes
              }}
              placeholder="Search by Name, Model, Reg. No, Brand..."
            />
         
          </div> */}
        </div>
      </div>

      {/* Address & KYC Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="dealers-card p-4">
            <h3 className="fs-5 fw-bold kyc-title mb-4">Address & KYC</h3>
            
            <Row className="g-4">
              {/* Left Column */}
              <Col md={6}>
                <div className="kyc-field">
                  <label className="kyc-label">City</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={city}
                    readOnly={!city}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Pincode</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={pincode}
                    readOnly={!pincode}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Upload Address Proof</label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      className="form-control kyc-input" 
                    />
                    {profileData?.addressProofUrl && (
                      <span className="kyc-check">✅</span>
                    )}
                  </div>
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Aadhaar No.</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={aadhaarNumber}
                    readOnly={!aadhaarNumber}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">PAN No.</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={panNumber}
                    readOnly={!panNumber}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">GST No.</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={gstNumber || ''}
                    readOnly={!gstNumber}
                    placeholder={gstNumber ? '' : 'Optional'}
                  />
                </div>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <div className="kyc-field">
                  <label className="kyc-label">Location</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={location || ''}
                    readOnly={!location}
                    placeholder={location ? '' : 'Optional'}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Address</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={completeAddress}
                    readOnly={!completeAddress}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Upload Aadhaar Card</label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      className="form-control kyc-input" 
                    />
                    {(profileData?.aadhaarFrontUrl || profileData?.aadhaarBackUrl) && (
                      <span className="kyc-check">✅</span>
                    )}
                  </div>
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Upload PAN Card</label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      className="form-control kyc-input" 
                    />
                    {profileData?.panDocumentUrl && (
                      <span className="kyc-check">✅</span>
                    )}
                  </div>
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Upload GST Certificate</label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      className="form-control kyc-input" 
                    />
                    {profileData?.gstDocumentUrl && (
                      <span className="kyc-check">✅</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Bank Details Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="dealers-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fs-5 fw-bold kyc-title">Bank Details</h3>
              <div className="kyc-bank-controls">
                {showBankModal && !bankVerified && (
                  <Button 
                    className="kyc-verify-btn"
                    onClick={handleBankVerify}
                  >
                    Verify Account
                  </Button>
                )}
                {bankVerified && (
                  <span className="kyc-verified">✅ Bank Verified</span>
                )}
              </div>
            </div>

            <Row className="g-4">
              {/* Left Column */}
              <Col md={6}>
                <div className="kyc-field">
                  <label className="kyc-label">Bank Name</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={bankName}
                    readOnly={!bankName}
                    placeholder={bankName ? '' : 'HDFC Bank'}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Account Number</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={accountNumber}
                    readOnly={!accountNumber}
                    placeholder={accountNumber ? '' : '50100234567890'}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">IFSC Code</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={ifscCode}
                    readOnly={!ifscCode}
                    placeholder={ifscCode ? '' : 'HDFC0001234'}
                  />
                </div>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <div className="kyc-field">
                  <label className="kyc-label">Account Holder Name</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={accountHolderName}
                    readOnly={!accountHolderName}
                    placeholder={accountHolderName ? '' : 'AutoWorld Motors Pvt. Ltd.'}
                  />
                </div>

                <div className="kyc-field">
                  <label className="kyc-label">Confirm Account Number</label>
                  <input 
                    type="text" 
                    className="form-control kyc-input" 
                    defaultValue={confirmAccountNumber}
                    readOnly={!confirmAccountNumber}
                    placeholder={confirmAccountNumber ? '' : '50100234567890'}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Submit Button */}
      <Row>
        <Col lg={12} className="text-center">
          <Button 
            className="kyc-submit-btn"
            onClick={handleKycSubmit}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default KYC;
