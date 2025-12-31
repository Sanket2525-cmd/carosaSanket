"use client";

import React, { useState, useEffect } from 'react';
import AuthService from '@/services/authService';
import useAuthStore from '@/store/authStore';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pan: '',
    aadhaar: '',
    location: '',
    pincode: '',
    landmark: '',
    city: '',
    state: '',
    bankingType: 'Savings',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { setUser: updateAuthUser } = useAuthStore();

  // Helper function to split name into first and last name
  const splitName = (name) => {
    if (!name || !name.trim()) {
      return { firstName: '', lastName: '' };
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    const lastName = parts.pop();
    const firstName = parts.join(' ');
    return { firstName, lastName };
  };

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // First try to get from localStorage
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          const { firstName, lastName } = splitName(currentUser.name || '');
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: currentUser.email || prev.email,
            phone: currentUser.mobile || prev.phone
          }));
        }

        // Then fetch from API to get latest data
        const result = await AuthService.getProfile();
        if (result.success && result.data?.user) {
          const user = result.data.user;
          const { firstName, lastName } = splitName(user.name || '');
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: user.email || prev.email,
            phone: user.mobile || prev.phone
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear any previous save messages when user starts typing
    if (saveSuccess || saveError) {
      setSaveSuccess(false);
      setSaveError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Concatenate first and last name
      const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim();

      // Prepare update data
      const updateData = {};
      if (fullName) {
        updateData.name = fullName;
      }
      if (formData.email) {
        updateData.email = formData.email;
      }
      if (formData.phone) {
        updateData.mobile = formData.phone;
      }

      // Save profile to backend
      if (Object.keys(updateData).length > 0) {
        const result = await AuthService.updateProfile(updateData);
        
        if (result.success) {
          setSaveSuccess(true);
          console.log('Profile saved successfully:', updateData);
          
          // Update auth store with new user data
          const updatedUser = result.data?.user;
          if (updatedUser) {
            const currentUser = AuthService.getCurrentUser();
            if (currentUser) {
              const newUser = {
                ...currentUser,
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile
              };
              updateAuthUser(newUser);
              AuthService.setUser(newUser);
            }
          }
          
          // Refresh profile to get latest data
          const profileResult = await AuthService.getProfile();
          if (profileResult.success && profileResult.data?.user) {
            const user = profileResult.data.user;
            updateAuthUser(user);
          }
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess(false);
          }, 3000);
        } else {
          setSaveError(result.message || 'Failed to save profile');
        }
      } else {
        setSaveError('Please enter at least a first name or phone number to save');
      }
    } catch (error) {
      setSaveError('Network error. Please try again.');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dv2-profile">
      {/* Header Card */}
      <div className="card dv2-card py-3 px-4 mb-4">
        <h3 className="fw-bold fSize-7 mb-0">Profile & KYC</h3>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="card dv2-card p-4 mb-4">
          <h5 className="dv2-section-title mb-4">Personal Details</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="dv2-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control dv2-input"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control dv2-input"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit"
                className="form-control dv2-input"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control dv2-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">PAN</label>
              <input
                type="text"
                name="pan"
                placeholder="ABCDE1234F"
                className="form-control dv2-input"
                value={formData.pan}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar"
                placeholder="12-digit"
                className="form-control dv2-input"
                value={formData.aadhaar}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card dv2-card p-4 mb-4">
          <h5 className="dv2-section-title mb-4">Documents</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="dv2-label">Aadhaar Document (image/pdf)</label>
              <input
                type="file"
                className="form-control dv2-file-input"
                accept="image/*,.pdf"
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Address Proof Document (image/pdf)</label>
              <input
                type="file"
                className="form-control dv2-file-input"
                accept="image/*,.pdf"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card dv2-card p-4 mb-4">
          <h5 className="dv2-section-title mb-4">Address</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="dv2-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control dv2-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="dv2-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                className="form-control dv2-input"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="dv2-label">Landmark</label>
              <input
                type="text"
                name="landmark"
                className="form-control dv2-input"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">City</label>
              <input
                type="text"
                name="city"
                className="form-control dv2-input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">State</label>
              <input
                type="text"
                name="state"
                className="form-control dv2-input"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div className="card dv2-card p-4 mb-4">
          <h5 className="dv2-section-title mb-4">Banking Details</h5>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="dv2-label">Banking Type</label>
              <select
                name="bankingType"
                className="form-select dv2-input"
                value={formData.bankingType}
                onChange={handleChange}
              >
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Account Holder Name</label>
              <input
                type="text"
                name="accountHolder"
                className="form-control dv2-input"
                value={formData.accountHolder}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Bank Name</label>
              <input
                type="text"
                name="bankName"
                className="form-control dv2-input"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="dv2-label">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                className="form-control dv2-input"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
                <div className="col-md-6">
              <label className="dv2-label">Confirm Account Number</label>
              <input
                type="text"
                name="accountNumber"
                className="form-control dv2-input"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="dv2-label">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                placeholder="E.G., HDFC0001234"
                className="form-control dv2-input"
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Save Button and Messages */}
        <div className="d-flex flex-column align-items-end gap-2">
          {saveSuccess && (
            <div className="text-success fSize-3">
              Profile saved successfully!
            </div>
          )}
          {saveError && (
            <div className="text-danger fSize-3">
              {saveError}
            </div>
          )}
          <button 
            type="submit" 
            className="btn dv2-save-btn"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
