"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Listing from "./Listing";
import BestOffer from "./BestOffer";
import Inspection from "./Inspection";
import TestDrive from "./TestDrive";
import Order from "./Order";
import Procurement from "./Procurement";
import Payment from "./Payment";
import Profile from "./Profile";
import KYC from "./KYC";
import SellerSetting from "./SellerSetting";
import Notifications from "./Notifications";
import DealerService from "@/services/dealerService";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import ProfileDropdown from "@/components/navigation/ProfileDropdown";
import { FaBars } from "react-icons/fa";
const DashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // Valid sections for dealer dashboard
  const validSections = [
    'dashboard', 'listing', 'best-offer', 'inspection', 'test-drive',
    'orders', 'procurement', 'payments', 'profile', 'kyc',
    'seller-setting', 'notifications'
  ];

  // Initialize activeSection from URL params on mount
  useEffect(() => {
    const section = searchParams?.get('section');
    if (section && validSections.includes(section)) {
      setActiveSection(section);
    } else if (!section) {
      // If no section in URL, default to dashboard
      setActiveSection('dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams?.toString());
    if (section === 'dashboard') {
      params.delete('section');
    } else {
      params.set('section', section);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // Close sidebar on mobile when section changes
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardMainContent />;
      case 'listing':
        return <Listing />;
      case 'best-offer':
        return <BestOffer />;
      case 'inspection':
        return <Inspection />;
      case 'test-drive':
        return <TestDrive />;
      case 'orders':
        return <Order />;
      case 'procurement':
        return <Procurement />;
      case 'payments':
        return <Payment />;
      case 'profile':
        return <Profile />;
      case 'kyc':
        return <KYC />;
      case 'seller-setting':
        return <SellerSetting />;
      case 'notifications':
        return <Notifications />;
      default:
        return <DashboardMainContent />;
    }
  };

  return (
    <div className="dealers-dashboard padding-Y-X">
      {/* Mobile Header */}
      <div className="dealers-mobile-header d-lg-none">
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center gap-3">
            <button 
              className="dealers-menu-toggle border-0 bg-transparent"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FaBars size={24} />
            </button>
            <Link href="/" className="d-inline-flex align-items-center">
              <Image
                src="/images/finalCarosalogo.png"
                alt="CAROSA"
                width={120}
                height={30}
                className="rounded object-fit-contain"
                priority
              />
            </Link>
          </div>
          <div className="d-flex align-items-center gap-3">
            {user && (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="dealers-sidebar-overlay d-lg-none"
          onClick={closeSidebar}
        />
      )}

      <Container fluid>
        <Row>
          <Col lg={3} xl={2}  className="p-0">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />
          </Col>
          <Col lg={9} xl={10}  className="p-0">
            <div className="dealers-main">
              {renderContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={
      <div className="dealers-dashboard" style={{ minHeight: '400px' }}>
        <div className="dealers-main d-flex align-items-center justify-content-center" >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
};

const DashboardMainContent = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const result = await DealerService.getMyDealerProfile();
        
        if (result.success) {
          setProfileData(result.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.role]);

  // Get values from profile data or use defaults
  const dealershipName = profileData?.dealershipName || 'Dealership';
  const dealerId = profileData?.id ? `${profileData.id}` : 'N/A';
  // Use delivery hub fullAddress if available, otherwise construct from delivery hub fields, or fallback to completeAddress
  const getDriveHubAddress = () => {
    if (profileData?.DeliveryHub?.fullAddress) {
      return profileData.DeliveryHub.fullAddress;
    }
    if (profileData?.DeliveryHub) {
      const hub = profileData.DeliveryHub;
      const parts = [hub.address, hub.city, hub.state, hub.pincode].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    return profileData?.completeAddress || 'Assigned drive hub location';
  };
  const completeAddress = getDriveHubAddress();
  const isVerified = profileData?.isVerified || false;
  const isActive = profileData?.isActive !== false; // Default to true

  // Get first letter for avatar
  const getAvatarLetter = (name) => {
    if (!name) return 'D';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-content">
      {/* Header Section */}
      <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Dashboard</h2>
        
        <div className="d-flex align-items-center gap-3 flex-wrap flex-md-nowrap">
          {/* <Button className="dealers-btn-secondary px-4 py-2 rounded-xl">
            Filters
          </Button> */}
          <Link className="dealers-btn-primary px-4 py-2 rounded-2 rounded-xl bg-success text-white text-decoration-none" href="/RegistrationYourCar">
            Create Listing
          </Link>
          <Button className="dealers-btn-primary px-md-4 px-2 py-2 rounded-xl bg-warning">
            Raise Inspection
          </Button>
        </div>
        </div>
      </div>
      {/* <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
       
      </div> */}

      {/* Main Content Cards */}
      <Row className="g-4 mb-4">
        {/* Main Card - Profile Section with Account Manager */}
        <Col lg={12}>
          <div className="dealers-card p-4">
            <Row className="">
              {/* Left Section - Profile */}
              <Col xs={12} lg={6}>
                <div className="d-flex align-items-start gap-2">
                  <Image 
                    className="dashboard-profile-img" 
                    src="/images/userPRofile.png" 
                    alt="Profile"
                    width={56}
                    height={56}
                  />
                  <div>
                    <div className="d-flex gap-2 mb-2">
                      <h3 className="fs-5 mb-0 font-extrabold">Welcome to your Dashboard</h3>
                      {isVerified && (
                        <span className="dealers-chip text-success fw-semibold">Verified ✓</span>
                      )}
                      {isActive && (
                        <span className="dealers-chip text-primary fw-semibold">Active</span>
                      )}
                    </div>
                  <p className="dashboard-dealer-id mb-1 d-md-block d-none">
                      Carosa Dealer ID: <span className="fw-semibold text-dark">{dealerId}</span>
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                      <p className="dashboard-dealer-id d-md-none  mb-1">
                      Carosa Dealer ID: <span className="fw-semibold text-dark">{dealerId}</span>
                    </p>
                    <p className="mt-1 fw-medium mb-0">
                      Carosa Drive Hub Address: <span className="" style={{color:"#2a3a92"}}>{completeAddress}</span>
                    </p>
                </div>
              </Col>

              {/* Right Section - Account Manager */}
              <Col xs={12} lg={6}>
                <div className="dealers-glass p-4 border border-slate-200 mt-3 mt-lg-0">
                  <p className="small text-muted mb-1">Reach out to your Account Manager</p>
                  <h4 className="fs-5 fw-bold mb-0">Hemant</h4>
                  <p className="text-muted mb-1">hemant.kashyap@carosa.in </p>
                  <p className="fw-semibold mt-0 mb-0">9540097113</p>
                  <Button className="mt-3 px-3 py-2 text-white rounded-lg small  w-md-auto" style={{backgroundColor: 'var(--c-primary)'}}>
                    Contact Now
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {/* KPI Cards Section */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <div className="dealers-card p-3">
            <p className="small text-muted mb-1">Vehicles Sold</p>
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
              <div className="fs-1 fw-bold">0</div>
              <span className="dealers-chip" style={{backgroundColor: 'rgba(134, 199, 59, 0.15)', color: 'var(--c-green)'}}>+12% MoM</span>
            </div>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="dealers-card p-3">
            <p className="small text-muted mb-1">GMV (SOLD)</p>
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
              <div className="fs-1 fw-bold">0</div>
              <span className="dealers-chip" style={{backgroundColor: 'rgba(12, 58, 137, 0.1)', color: 'var(--c-primary)'}}>₹ Crore</span>
            </div>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="dealers-card p-3">
            <p className="small text-muted mb-1">Total Active Listing</p>
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
              <div className="fs-1 fw-bold">0</div>
              <span className="dealers-chip bg-light text-info">Healthy</span>
            </div>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="dealers-card p-3">
            <p className="small text-muted mb-1">Total Inspected Listing</p>
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
              <div className="fs-1 fw-bold">0</div>
              <span className="dealers-chip bg-warning bg-opacity-25 text-warning">QC Passed</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Performance Overview and Right Column Section */}
      <Row className="g-4">
        {/* Left Side - Performance Overview Card */}
        <Col lg={8}>
          <div className="dealers-card p-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
              <h4 className="fs-5 fw-bold">Performance Overview</h4>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <Button className="px-3 py-2 rounded-lg border small flex-fill flex-md-grow-0">7D</Button>
                <Button className="px-3 py-2 rounded-lg border bg-dark text-white small flex-fill flex-md-grow-0">30D</Button>
                <Button className="px-3 py-2 rounded-lg border small flex-fill flex-md-grow-0">YTD</Button>
              </div>
            </div>

            <Row className="g-4">
              {/* Chart Area - Left */}
              <Col xs={12} md={8}>
                <div className="p-3 rounded bg-light">
                  <div className="d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                    <p className="text-muted mb-0">Chart Area (GMV Area Chart)</p>
                  </div>
                </div>
              </Col>
              
              {/* Donut Chart Area - Right */}
              <Col xs={12} md={4}>
                <div className="p-3 rounded bg-light">
                  <div className="d-flex align-items-center justify-content-center mb-3" style={{height: '150px'}}>
                    <p className="text-muted mb-0">Donut Chart</p>
                  </div>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <span className="w-2 h-2 rounded-circle bg-success"></span>
                        <span>Active</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <span className="w-2 h-2 rounded-circle" style={{backgroundColor: 'var(--c-orange)'}}></span>
                        <span>Pending</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <span className="w-2 h-2 rounded-circle" style={{backgroundColor: 'var(--c-primary)'}}></span>
                        <span>Inspected</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <span className="w-2 h-2 rounded-circle bg-secondary"></span>
                        <span>Inactive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Right Side - Activity and Quick Actions */}
        <Col lg={4}>
          <div className="d-flex flex-column gap-4">
            {/* Today's Activity Card */}
            <div className="dealers-card p-4">
              <h4 className="fs-5 fw-bold mb-4">Today's Activity</h4>
              <div className="dealers-scroll" style={{maxHeight: '256px', overflowY: 'auto'}}>
                <ul className="list-unstyled mb-0">
                  {/* <li className="d-flex gap-3 mb-3">
                    <span className="w-2 h-2 rounded-circle bg-success mt-2"></span>
                    <div>
                      <p className="fw-semibold mb-1">3 vehicles approved by QC</p>
                      <p className="small text-muted mb-0">11:40 AM • Alto, Baleno, XUV300</p>
                    </div>
                  </li>
                  <li className="d-flex gap-3 mb-3">
                    <span className="w-2 h-2 rounded-circle" style={{backgroundColor: 'var(--c-primary)'}}></span>
                    <div>
                      <p className="fw-semibold mb-1">Best offer received: ₹5.2L</p>
                      <p className="small text-muted mb-0">11:05 AM • Swift 2019</p>
                    </div>
                  </li>
                  <li className="d-flex gap-3 mb-3">
                    <span className="w-2 h-2 rounded-circle" style={{backgroundColor: 'var(--c-orange)'}}></span>
                    <div>
                      <p className="fw-semibold mb-1">2 test drives booked</p>
                      <p className="small text-muted mb-0">10:50 AM • Tomorrow 4–6 PM</p>
                    </div>
                  </li>
                  <li className="d-flex gap-3 mb-3">
                    <span className="w-2 h-2 rounded-circle bg-secondary"></span>
                    <div>
                      <p className="fw-semibold mb-1">Listing draft saved</p>
                      <p className="small text-muted mb-0">9:30 AM • Creta 2020</p>
                    </div>
                  </li> */}
                </ul>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="dealers-card p-4">
              <h4 className="fs-5 fw-bold mb-4">Quick Actions</h4>
              <Row className="g-3">
                <Col xs={6}>
                  <Button className="w-100 px-3 py-3 border text-start dealers-btn-secondary">
                    <div className="fw-semibold">New Listing</div>
                    <div className="small text-muted">Add a vehicle in 2 min</div>
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button className="w-100 px-3 py-3 border text-start dealers-btn-secondary">
                    <div className="fw-semibold">Schedule Inspection</div>
                    <div className="small text-muted">Pick slot & hub</div>
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button className="w-100 px-3 py-3 border text-start dealers-btn-secondary">
                    <div className="fw-semibold">Create Best Offer</div>
                    <div className="small text-muted">Boost conversions</div>
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button className="w-100 px-3 py-3 border text-start dealers-btn-secondary">
                    <div className="fw-semibold">Export Report</div>
                    <div className="small text-muted">CSV for accounts</div>
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
