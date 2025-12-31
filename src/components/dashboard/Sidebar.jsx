"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaTachometerAlt, FaShoppingCart, FaTag, FaGift, FaHeart,
  FaUser, FaBell, FaQuestionCircle, FaTimes
} from 'react-icons/fa';
import KYCModal from './KYCModal';
import useAuthStore from '@/store/authStore';
import AuthService from '@/services/authService';

export default function Sidebar({
  active = 'dashboard',
  onChange,
  isOpen = false,
  onClose,
}) {
  const [showKYCModal, setShowKYCModal] = useState(false);
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [displayId, setDisplayId] = useState(null);

  // Fetch user profile to get CID (displayId)
  useEffect(() => {
    const fetchDisplayId = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      // Check if displayId is already in user object
      if (user.displayId) {
        setDisplayId(user.displayId);
        return;
      }

      // Fetch profile to get displayId
      try {
        const result = await AuthService.getProfile();
        if (result.success && result.data?.user) {
          const updatedUser = result.data.user;
          if (updatedUser.displayId) {
            setDisplayId(updatedUser.displayId);
            // Update auth store with displayId
            const existingToken = user?.token || null;
            setUser(updatedUser, existingToken);
          }
        }
      } catch (error) {
        console.error('Error fetching display ID:', error);
      }
    };

    fetchDisplayId();
  }, [isAuthenticated, user, setUser]);
  
  return (
    <aside className={`dv2-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Close Button */}
      {onClose && (
        <div className="dv2-sidebar-close d-lg-none">
          <button
            type="button"
            onClick={onClose}
            className="border-0 bg-transparent p-2"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>
      )}

      {/* Profile/KYC card */}
      <div className="card dv2-card p-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <Image src="/images/user1.png" alt="user" width={52} height={52} className="rounded-3 object-fit-cover" />
          <div>
            <div className="fSize-3 text-muted">Customer ID</div>
            <div className="fw-bold">{displayId || 'Loading...'}</div>
          </div>
        </div>
        <div className="mt-3 fSize-3 text-muted d-flex justify-content-between">
          <span>KYC Status</span>
          <span>75%</span>
        </div>
        <div className="progress rounded-pill" style={{height:'8px'}}>
          <div className="progress-bar bg-success" style={{width:'75%'}} />
        </div>
        <button
          onClick={() => setShowKYCModal(true)}
          className="btn btn-kyc mt-3 w-100 rounded-pill fSize-3 fw-semibold"
        >
          Complete KYC
        </button>
      </div>

      {/* KYC Modal */}
      <KYCModal isOpen={showKYCModal} onClose={() => setShowKYCModal(false)} />

      {/* Nav */}
      <nav className="dv2-nav card dv2-card p-2 mb-3">
        <div className="dv2-nav-title px-2 pt-2 pb-1 fSize-3 text-muted">MAIN</div>
        <ul className="list-unstyled m-0">
          {[
            {key:'dashboard',label:'Dashboard', icon: <FaTachometerAlt size={16} />},
            {key:'buy',label:'Buy', icon: <FaShoppingCart size={16} />},
            {key:'sell',label:'Sell', icon: <FaTag size={16} />},
            {key:'wishlist',label:'Wishlist', icon: <FaHeart  size={16} />},
            {key:'offers',label:'Orders', icon: <FaGift size={16} />},
          ].map((item)=> (
            <li key={item.label}>
              <button
                type="button"
                onClick={()=> onChange && onChange(item.key)}
                className={`dv2-nav-item w-100 text-start border-0 bg-transparent ${active===item.key? 'active':''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="dv2-nav-title px-2 pt-3 pb-1 fSize-3 text-muted">SETTINGS</div>
        <ul className="list-unstyled m-0">
          {[
            {key:'profile', label:'Profile', icon: <FaUser size={16} />},
            {key:'notifications', label:'Notifications', icon: <FaBell size={16} />},
            {key:'help', label:'Help Center', icon: <FaQuestionCircle size={16} />},
          ].map((item)=> (
            <li key={item.label}>
              <button
                type="button"
                onClick={()=> onChange && onChange(item.key)}
                className={`dv2-nav-item w-100 text-start border-0 bg-transparent ${active===item.key? 'active':''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Refer & Earn */}
      <div className="card dv2-card p-4 dv2-refer">
        <div className="fw-bold fSize-5 text-white mb-2">Refer & Earn</div>
        <div className="text-white-50 fSize-3 mb-3">Invite friends and win rewards & waiting offers.</div>
        <div className="d-flex mobibts gap-2">
          <button className="btn btn-light mobibts rounded-pill px-3 fSize-3">Refer Now</button>
          <button className="btn btn-outline-light mobibts rounded-pill px-3 fSize-3">Keep Earning</button>
        </div>
      </div>
    </aside>
  );
}


