"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import DealerService from "@/services/dealerService";
import useAuthStore from "@/store/authStore";

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState('Hi, Customer');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  // Fetch user type (dealer profile for dealers)
  useEffect(() => {
    const fetchUserType = async () => {
      // If user is not authenticated, show "Hi, Customer"
      if (!isAuthenticated || !user) {
        setUserType('Hi, Customer');
        return;
      }

      // For dealers, fetch dealer name
      if (user.role === 'Dealer') {
        try {
          setLoading(true);
          const result = await DealerService.getMyDealerProfile();
          
          if (result.success && result.data) {
            // Use dealer name (primary) or contact person name, or user name as fallback
            const name = result.data.dealerName || result.data.contactPersonName || user?.name || 'Dealer';
            setUserType(`Hi, ${name}`);
          } else {
            // Fallback to user name or "Dealer"
            const name = user?.name || 'Dealer';
            setUserType(`Hi, ${name}`);
          }
        } catch (err) {
          console.error('Error fetching dealer profile:', err);
          // Fallback to user name or "Dealer"
          const name = user?.name || 'Dealer';
          setUserType(`Hi, ${name}`);
        } finally {
          setLoading(false);
        }
      } else {
        // For non-dealers, use user's name or fallback to "User"
        const name = user?.name || 'User';
        setUserType(`Hi, ${name}`);
      }
    };

    fetchUserType();
  }, [user, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

const handleMenuItemClick = (action) => {
  setIsOpen(false);
  
  // Check if we're on a dealer dashboard page
  const isDealerDashboard = pathname?.includes('/dealers') || pathname?.includes('/dealer-dashboard') || pathname?.includes('/dealers-dashboard');
  
  if (user?.role === 'Dealer' || isDealerDashboard) {
    // For dealer dashboard, use section parameter
    const basePath = '/dealers-dashboard';
    
    switch (action) {
      case 'Dashboard':
        router.push(basePath);
        break;
      case 'Edit your Details':
        router.push(`${basePath}?section=profile`);
        break;
      case 'Wishlist':
        router.push(`${basePath}?section=wishlist`);
        break;
      case 'KYC Verification':
        router.push(`${basePath}?section=kyc`);
        break;
      case 'Notification Settings':
        router.push(`${basePath}?section=notifications`);
        break;
      case 'Change Password':
        router.push(`${basePath}?section=password`);
        break;
      default:
        router.push(basePath);
    }
  } else {
    // For regular users, use tab parameter
    const basePath = '/dashboard';
    
    switch (action) {
      case 'Dashboard':
        router.push(basePath);
        break;
      case 'Edit your Details':
        router.push(`${basePath}?tab=profile`);
        break;
      case 'Wishlist':
        router.push(`${basePath}?tab=wishlist`);
        break;
      case 'KYC Verification':
        router.push(`${basePath}?tab=kyc`);
        break;
      case 'Notification Settings':
        router.push(`${basePath}?tab=notifications`);
        break;
      case 'Change Password':
        router.push(`${basePath}?tab=password`);
        break;
      default:
        router.push(basePath);
    }
  }
};

  return (
    <div className="profile-dropdown-container position-relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        className="profile-button d-flex align-items-center gap-2 border-0 bg-transparent py-2 rounded-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <Image
              src="/images/userPRofile.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-circle"
            />
          </div>
        </div>
        <div className="profile-info d-none d-md-block">
          <div className="profile-name fSize-3 fw-semibold text-dark">
            {loading ? 'Loading...' : userType}
          </div>
        </div>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-dark transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size="sm"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown-menu">
          {/* Profile Header in Dropdown */}
          <div className="profile-dropdown-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                <Image
                  src="/images/userPRofile.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-circle"
                />
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-name fSize-4 fw-semibold text-dark">
                {loading ? 'Loading...' : userType}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="profile-progress-container">
            <div className="profile-progress-bar">
              <div className="profile-progress-fill" style={{ width: '100%' }}></div>
            </div>
            <span className="profile-progress-text fSize-3 fw-medium text-dark">100%</span>
          </div>

          {/* Menu Items */}
          <div className="profile-menu-items">
             <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('Dashboard')}
            >
             Dashboard
            </button>
            <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('Edit your Details')}
            >
              Edit your Details
            </button>
            <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('KYC Verification')}
            >
              KYC Verification
            </button>
              <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('Wishlist')}
            >
              Wishlist
            </button>
            <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('Notification Settings')}
            >
              Notification Settings
            </button>
            <button 
              className="profile-menu-item"
              onClick={() => handleMenuItemClick('Change Password')}
            >
              Change Password
            </button>
            <button 
              className="profile-menu-item profile-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
