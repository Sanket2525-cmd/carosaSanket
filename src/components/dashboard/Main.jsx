"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import AuthService from "@/services/authService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const BuyList = dynamic(() => import('./BuyList'), { ssr: false });
const SellList = dynamic(() => import('./SellList'), { ssr: false });
const Wishlist = dynamic(() => import('./Wishlist'), { ssr: false });
const BestOffers = dynamic(() => import('./BestOffers'), { ssr: false });
const Profile = dynamic(() => import('./Profile'), { ssr: false });
const Notifications = dynamic(() => import('./Notifications'), { ssr: false });

function StatCard({label, value, sub}) {
  return (
    <div className="card dv2-card p-3 h-100">
      <div className="fSize-3 text-muted mb-1">{label}</div>
      <div className="fw-bold fSize-7">{value}</div>
      {sub && (
        <div className="d-flex align-items-center gap-2 mt-2">
          <span className="rounded-3" style={{width:6,height:6,background:'#29b34a'}} />
          <span className="fSize-3 text-muted">{sub}</span>
        </div>
      )}
    </div>
  );
}

function ActivityItem() {
  return (
    <div className="card dv2-card p-3 mb-3">
      <div className="d-flex gap-3">
        <div className="ratio ratio-4x3 dv2-thumb rounded">
          <img src="/assets/carImage/exterior.avif" alt="car" className="w-100 h-100 object-fit-cover rounded" />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div className="fw-bold">Tata Indigo eCS LS CR4 BS–IV 2011</div>
            <button className="btn btn-warning rounded-pill px-3 fSize-3">Offer</button>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2 fSize-3 text-muted">
            <span>40,780 km</span>
            <span>1st owner</span>
            <span>Petrol</span>
            <span>Automatic</span>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-outline-primary outline_btn rounded-pill px-3 fSize-3">Details</button>
            <button className="btn btn-outline-secondary rounded-pill px-3 fSize-3">Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main({ active = 'dashboard' }) {
  const router = useRouter(); // ✅ moved inside component
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [userName, setUserName] = useState('RONAK');
  const [displayId, setDisplayId] = useState(null);
  const [userLocation, setUserLocation] = useState('Jaunpur');

  // Fetch user profile from API to get complete user data including CID
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setUserName('RONAK');
        return;
      }
      
      // Use user's name or fallback to "User"
      const name = user?.name || 'User';
      setUserName(name);

      // Check if displayId is already in user object
      if (user.displayId) {
        setDisplayId(user.displayId);
        return;
      }

      // Fetch profile to get displayId (CID)
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
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, setUser]);

  // ✅ your same navigation function (unchanged)
  const handleTabClick = (tab) => {
    switch (tab) {
      case "Buy":
        router.push("/recentCar");
        break;
      case "Sell":
        router.push("/sell");
        break;
      case "Insurance":
        router.push("/insurance");
        break;
      case "Vehicle Info":
        router.push("/vehicle-info");
        break;
      case "Challan Check":
        router.push("/challan-check");
        break;
      default:
        break;
    }
  };

  const [metrics, setMetrics] = useState({
    savedCars: 0,
    activeOffers: 0,
    wallet: 0,
    buyCount: 0,
    sellCount: 0,
    wishlistCount: 0
  });

  useEffect(() => {
    const savedMetrics = localStorage.getItem('dashboardMetrics');
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    } else {
      setMetrics({
        savedCars: 0,
        activeOffers: 0,
        wallet: 0,
        buyCount: 0,
        sellCount: 0,
        wishlistCount: 0
      });
    }
  }, []);

  return (
    <div className="dv2-main">
      {/* Welcome banner (only on dashboard) */}
      {active === 'dashboard' && (
        <div className="card dv2-card p-4 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center phonesert gap-3">
              <Image src="/images/user1.png" alt="user" width={64} height={64} className="rounded-circle object-fit-cover" />
              <div>
                <div className="fSize-3 text-muted mb-1">
                  WELCOME {userName.toUpperCase()} !
                </div>
                <div className="fw-bold fSize-7">You can manage your buying and selling.</div>
                <div className="fSize-3 text-muted mt-1">
                  Customer ID <span className="fw-semibold">{displayId || 'Loading...'}</span>
                  {/* <span className="mx-1">•</span> */}
                  {/* <Image src="/images/Icon.png" alt="location" width={12} height={12} className="d-inline-block mb-1" /> {userLocation} */}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn customer_btn rounded-pill px-4 py-2 fSize-3 fw-semibold">Customer Support</button>
              <button className="btn btn-kyc d-lg-block d-none rounded-pill px-4 py-2 fSize-3 fw-semibold">Carosa knowledge hub</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Card with Tabs */}
      {active === 'dashboard' && (
        <>
          <div className="card dv2-card p-4 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              {/* Desktop View - Regular Flex */}
              <div className="dv2-tabs d-none d-md-flex gap-2 flex-wrap">
                {["Buy", "Sell", "Insurance", "Vehicle Info", "Challan Check"].map(
                  (t, i) => (
                    <button
                      key={t}
                      onClick={() => handleTabClick(t)}
                      className={`btn rounded-pill px-3 py-2 fSize-3 fw-semibold ${
                        i === 0 ? "btn-kyc" : "btn-light border"
                      }`}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
              
              {/* Mobile View - Swiper Slider */}
              <div className="dv2-tabs-swiper d-md-none w-100">
                <Swiper
                  spaceBetween={8}
                  slidesPerView="auto"
                  grabCursor={true}
                  className="dv2-tabs-swiper-container"
                >
                  {["Buy", "Sell", "Insurance", "Vehicle Info", "Challan Check"].map(
                    (t, i) => (
                      <SwiperSlide key={t} style={{ width: 'auto' }}>
                        <button
                          onClick={() => handleTabClick(t)}
                          className={`btn rounded-pill px-3 py-2 fSize-3 fw-semibold ${
                            i === 0 ? "btn-kyc" : "btn-light border"
                          }`}
                        >
                          {t}
                        </button>
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
              
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary rounded-pill px-3 py-2 fSize-3 fw-semibold">Filters</button>
                <button className="btn btn-orangebtn rounded-pill px-3 py-2 fSize-3 fw-semibold">Post a Requirement</button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="dv2-stat-card">
                  <div className="fSize-3 text-muted mb-2">Saved Cars</div>
                  <div className="fw-bold" style={{ fontSize: '2rem' }}>{metrics.savedCars}</div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <span className="rounded-circle" style={{ width: 8, height: 8, background: '#16A34A' }} />
                    <span className="fSize-3 text-muted">
                      {metrics.savedCars > 0 ? `+${Math.floor(metrics.savedCars * 0.2)} this week` : 'Start saving cars'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="dv2-stat-card">
                  <div className="fSize-3 text-muted mb-2">Active Offers</div>
                  <div className="fw-bold" style={{ fontSize: '2rem' }}>{metrics.activeOffers}</div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <span className="rounded-circle" style={{ width: 8, height: 8, background: '#F59E0B' }} />
                    <span className="fSize-3 text-muted">
                      {metrics.activeOffers > 0 ? `${Math.floor(metrics.activeOffers * 0.4)} expiring soon` : 'No active offers'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="dv2-stat-card">
                  <div className="fSize-3 text-muted mb-2">Wallet</div>
                  <div className="fw-bold" style={{ fontSize: '2rem' }}>₹{metrics.wallet.toLocaleString()}</div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <span className="rounded-circle" style={{ width: 8, height: 8, background: '#1D61E7' }} />
                    <span className="fSize-3 text-muted">
                      {metrics.wallet > 0 ? 'Refer & earn more' : 'Start earning'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity tabs */}
          <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
            <button className="btn btn-kyc rounded-pill px-4 py-2 fSize-3 fw-semibold">Buy ({metrics.buyCount})</button>
            <button className="btn btn-light border rounded-pill px-4 py-2 fSize-3 fw-semibold">Sell ({metrics.sellCount})</button>
            <button className="btn btn-light border rounded-pill px-4 py-2 fSize-3 fw-semibold">Wishlist ({metrics.wishlistCount})</button>
          </div>
        </>
      )}

      {/* Activity list */}
      {/* {active === 'dashboard' && (
        <>
          <ActivityItem />
          <ActivityItem />
        </>
      )} */}

      {/* Other sections remain same */}
      {active === 'buy' && (
        <div className="mt-1">
          <h4 className="fw-bold mb-3">Buy</h4>
          <BuyList />
        </div>
      )}

      {active === 'sell' && (
        <div className="mt-1">
          <h4 className="fw-bold mb-3">Sell</h4>
          <SellList />
        </div>
      )}

        {active === 'wishlist' && (
        <div className="mt-1">
          <h4 className="fw-bold mb-3">Wishlist</h4>
          <Wishlist />
        </div>
      )}

      {active === 'offers' && (
        <div className="mt-1">
          <h4 className="fw-bold mb-3">Orders</h4>
          <BestOffers />
        </div>
      )}

      {active === 'profile' && (
        <div className="mt-1">
          <Profile />
        </div>
      )}

      {active === 'notifications' && (
        <div className="mt-1">
          <Notifications />
        </div>
      )}
    </div>
  );
}
