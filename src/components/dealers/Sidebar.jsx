"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ activeSection, onSectionChange, isOpen = false, onClose }) => {
  const handleNavClick = (section) => {
    onSectionChange(section);
  };

  return (
    <aside className={`dealers-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Close Button */}
        {onClose && (
          <div className="dealers-sidebar-close d-lg-none">
            <button 
              className="border-0 bg-transparent p-2"
              onClick={onClose}
              aria-label="Close menu"
            >
              <FaTimes size={20} />
            </button>
          </div>
        )}

        {/* Logo Section */}
        {/* <div className="d-flex align-items-center gap-2 mb-4">
              <div className="mainLogo d-flex align-items-baseline">
                  <Link href="/" className="d-inline-flex align-items-center">
                    <Image
                      src="/images/finalCarosalogo.png"
                      alt="CAROSA"
                      width={160}
                      height={40}
                      className="rounded object-fit-contain"
                      priority
                    />
                  </Link>
                </div>
        </div> */}

        {/* Navigation */}
      <nav className="dealers-nav">
        <button 
          onClick={() => handleNavClick('dashboard')}
          className={`dealers-nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
        >
          <span>🏠</span> Dashboard
        </button>
        <button 
          onClick={() => handleNavClick('listing')}
          className={`dealers-nav-link ${activeSection === 'listing' ? 'active' : ''}`}
        >
          <span>📦</span> Listing
        </button>
        <button 
          onClick={() => handleNavClick('inspection')}
          className={`dealers-nav-link ${activeSection === 'inspection' ? 'active' : ''}`}
        >
          <span>🛡️</span> Inspection
        </button>
        <button 
          onClick={() => handleNavClick('best-offer')}
          className={`dealers-nav-link ${activeSection === 'best-offer' ? 'active' : ''}`}
        >
          <span>🏷️</span> Best Offer
        </button>
        <button 
          onClick={() => handleNavClick('test-drive')}
          className={`dealers-nav-link ${activeSection === 'test-drive' ? 'active' : ''}`}
        >
          <span>🚗</span> Test Drive
        </button>
        <button 
          onClick={() => handleNavClick('orders')}
          className={`dealers-nav-link ${activeSection === 'orders' ? 'active' : ''}`}
        >
          <span>🧾</span> Orders
        </button>
        <button 
          onClick={() => handleNavClick('procurement')}
          className={`dealers-nav-link ${activeSection === 'procurement' ? 'active' : ''}`}
        >
          <span>📥</span> Procurement
        </button>
        <button 
          onClick={() => handleNavClick('payments')}
          className={`dealers-nav-link ${activeSection === 'payments' ? 'active' : ''}`}
        >
          <span>💳</span> Payments
        </button>

        {/* Settings Section */}
        <div className="dealers-settings-section">
          <p className="dealers-settings-title">
            Settings
          </p>
          <button 
            onClick={() => handleNavClick('profile')}
            className={`dealers-nav-link ${activeSection === 'profile' ? 'active' : ''}`}
          >
            <span>👤</span> Profile
          </button>
          <button 
            onClick={() => handleNavClick('kyc')}
            className={`dealers-nav-link ${activeSection === 'kyc' ? 'active' : ''}`}
          >
            <span>✅</span> KYC
          </button>
          <button 
            onClick={() => handleNavClick('seller-setting')}
            className={`dealers-nav-link ${activeSection === 'seller-setting' ? 'active' : ''}`}
          >
            <span>⚙️</span> Seller Setting
          </button>
          <button 
            onClick={() => handleNavClick('notifications')}
            className={`dealers-nav-link ${activeSection === 'notifications' ? 'active' : ''}`}
          >
            <span>🔔</span> Notifications
          </button>
          <button 
            onClick={() => handleNavClick('help-center')}
            className={`dealers-nav-link ${activeSection === 'help-center' ? 'active' : ''}`}
          >
            <span>❓</span> Help Center
          </button>
        </div>
      </nav>

      {/* Help Section */}
      <div className="dealers-help-section">
        <div className="dealers-help-card">
          <p className="dealers-help-text text-white m-0">Need help?</p>
          <p className="dealers-help-title text-white mb-0">Contact Carosa</p>
          <button className="dealers-help-btn text-white">Open Chat</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;