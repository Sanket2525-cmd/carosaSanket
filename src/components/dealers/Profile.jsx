"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import DealerService from "@/services/dealerService";
import { useAuthStore } from "@/store/authStore";
import SearchInput from "@/components/common/SearchInput";
const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    dealerName: '',
    dealerPhone: '',
    contactPersonName: '',
    dealershipName: '',
    dealershipEmail: '',
    contactPersonPhone: ''
  });

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
          // Initialize form data with profile data
          setFormData({
            dealerName: result.data?.dealerName || '',
            dealerPhone: result.data?.dealerPhone || '',
            contactPersonName: result.data?.contactPersonName || '',
            dealershipName: result.data?.dealershipName || '',
            dealershipEmail: result.data?.dealershipEmail || result.data?.User?.email || '',
            contactPersonPhone: result.data?.contactPersonPhone || ''
          });
          // Set verification status based on API data
          if (result.data?.User?.isVerified) {
            setEmailVerified(true);
          }
          // Phone verification would be handled separately if there's a field for it
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

  const handleEditToggle = () => {
    if (editMode) {
      // If currently in edit mode and clicking to submit
      handleSubmit();
    } else {
      // Entering edit mode - reset form data to current profile data
      setFormData({
        dealerName: profileData?.dealerName || '',
        dealerPhone: profileData?.dealerPhone || '',
        contactPersonName: profileData?.contactPersonName || '',
        dealershipName: profileData?.dealershipName || '',
        dealershipEmail: profileData?.dealershipEmail || profileData?.User?.email || '',
        contactPersonPhone: profileData?.contactPersonPhone || ''
      });
      setEditMode(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!profileData?.id) {
      setError('Profile ID not found. Please refresh the page.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare update data - only include fields that have changed
      const updateData = {};
      if (formData.dealerName !== (profileData?.dealerName || '')) {
        updateData.dealerName = formData.dealerName;
      }
      if (formData.dealerPhone !== (profileData?.dealerPhone || '')) {
        updateData.dealerPhone = formData.dealerPhone;
      }
      if (formData.contactPersonName !== (profileData?.contactPersonName || '')) {
        updateData.contactPersonName = formData.contactPersonName;
      }
      if (formData.dealershipName !== (profileData?.dealershipName || '')) {
        updateData.dealershipName = formData.dealershipName;
      }
      if (formData.dealershipEmail !== (profileData?.dealershipEmail || profileData?.User?.email || '')) {
        updateData.dealershipEmail = formData.dealershipEmail;
      }
      if (formData.contactPersonPhone !== (profileData?.contactPersonPhone || '')) {
        updateData.contactPersonPhone = formData.contactPersonPhone;
      }

      // If no changes, just exit edit mode
      if (Object.keys(updateData).length === 0) {
        setEditMode(false);
        setSaving(false);
        return;
      }

      const result = await DealerService.updateMyDealerProfile(profileData.id, updateData);

      if (result.success) {
        // Refetch profile to get updated data
        const refreshResult = await DealerService.getMyDealerProfile();
        if (refreshResult.success) {
          setProfileData(refreshResult.data);
          // Update form data with new profile data
          setFormData({
            dealerName: refreshResult.data?.dealerName || '',
            dealerPhone: refreshResult.data?.dealerPhone || '',
            contactPersonName: refreshResult.data?.contactPersonName || '',
            dealershipName: refreshResult.data?.dealershipName || '',
            dealershipEmail: refreshResult.data?.dealershipEmail || refreshResult.data?.User?.email || '',
            contactPersonPhone: refreshResult.data?.contactPersonPhone || ''
          });
        }
        setEditMode(false);
        // Show success message (you can add a toast notification here if needed)
        console.log('Profile updated successfully');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneVerify = () => {
    // Simulate phone verification
    setPhoneVerified(true);
  };

  const handleEmailVerify = () => {
    // Simulate email verification
    setEmailVerified(true);
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="dashboard-content">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Profile</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get initial values from profile data or use defaults
  const dealerName = profileData?.dealerName || '';
  const dealerPhone = profileData?.dealerPhone || '';
  const contactPersonName = profileData?.contactPersonName || '';
  const dealershipName = profileData?.dealershipName || '';
  const dealershipEmail = profileData?.dealershipEmail || profileData?.User?.email || '';
  const contactPersonPhone = profileData?.contactPersonPhone || '';
  const dealerId = profileData?.id ? `${profileData.id}` : '';
  
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
            Profile
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
      {/* Error message for update errors */}
      {error && profileData && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <Row>
        <Col lg={12}>
          <div className="dealers-card p-4">
            <div className="d-flex align-items-start justify-content-between mb-4">
              <h3 className="fs-5 fw-bold profile-title">Basic Details</h3>
              <div className="d-flex gap-2">
                {editMode && (
                  <Button 
                    className="profile-back-btn"
                    onClick={() => {
                      setEditMode(false);
                      // Reset form data to original profile data
                      setFormData({
                        dealerName: profileData?.dealerName || '',
                        dealerPhone: profileData?.dealerPhone || '',
                        contactPersonName: profileData?.contactPersonName || '',
                        dealershipName: profileData?.dealershipName || '',
                        dealershipEmail: profileData?.dealershipEmail || profileData?.User?.email || '',
                        contactPersonPhone: profileData?.contactPersonPhone || ''
                      });
                    }}
                    disabled={saving}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  className="profile-edit-btn"
                  onClick={handleEditToggle}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editMode ? 'Submit' : 'Edit'}
                </Button>
              </div>
            </div>

            <Row className="g-4">
              {/* Left Column */}
              <Col md={6}>
                <div className="profile-field">
                  <p className="profile-label">Dealer Name</p>
                  {editMode ? (
                    <input 
                      type="text" 
                      className="form-control profile-input" 
                      value={formData.dealerName}
                      onChange={(e) => handleInputChange('dealerName', e.target.value)}
                      disabled={saving}
                    />
                  ) : (
                    <p className="profile-value">{dealerName || 'N/A'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <p className="profile-label">Dealer Phone</p>
                  <div className="d-flex align-items-center gap-3">
                    {editMode ? (
                      <input 
                        type="text" 
                        className="form-control profile-input" 
                        value={formData.dealerPhone}
                        onChange={(e) => handleInputChange('dealerPhone', e.target.value)}
                        disabled={saving}
                      />
                    ) : (
                      <p className="profile-value">{dealerPhone || 'N/A'}</p>
                    )}
                    <div className="profile-verify-area">
                      {phoneVerified ? (
                        <span className="profile-verified">Phone Verified ✅</span>
                      ) : (
                        <Button 
                          className="profile-verify-btn"
                          onClick={handlePhoneVerify}
                          disabled={editMode}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-field">
                  <p className="profile-label">Contact Person Name</p>
                  {editMode ? (
                    <input 
                      type="text" 
                      className="form-control profile-input" 
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      disabled={saving}
                    />
                  ) : (
                    <p className="profile-value">{contactPersonName || 'N/A'}</p>
                  )}
                </div>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <div className="profile-field">
                  <p className="profile-label">Dealership Name</p>
                  {editMode ? (
                    <input 
                      type="text" 
                      className="form-control profile-input" 
                      value={formData.dealershipName}
                      onChange={(e) => handleInputChange('dealershipName', e.target.value)}
                      disabled={saving}
                    />
                  ) : (
                    <p className="profile-value">{dealershipName || 'N/A'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <p className="profile-label">Dealership Email</p>
                  <div className="d-flex align-items-center gap-3">
                    {editMode ? (
                      <input 
                        type="email" 
                        className="form-control profile-input" 
                        value={formData.dealershipEmail}
                        onChange={(e) => handleInputChange('dealershipEmail', e.target.value)}
                        disabled={saving}
                      />
                    ) : (
                      <p className="profile-value">{dealershipEmail || 'N/A'}</p>
                    )}
                    <div className="profile-verify-area">
                      {emailVerified ? (
                        <span className="profile-verified">Email Verified ✅</span>
                      ) : (
                        <Button 
                          className="profile-verify-btn"
                          onClick={handleEmailVerify}
                          disabled={editMode}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-field">
                  <p className="profile-label">Contact Person No.</p>
                  {editMode ? (
                    <input 
                      type="text" 
                      className="form-control profile-input" 
                      value={formData.contactPersonPhone}
                      onChange={(e) => handleInputChange('contactPersonPhone', e.target.value)}
                      disabled={saving}
                    />
                  ) : (
                    <p className="profile-value">{contactPersonPhone || 'N/A'}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
