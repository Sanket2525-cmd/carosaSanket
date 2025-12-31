"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from './Sidebar';
import Main from './Main';
import '@/styles/dashboard.css';
import { FaBars } from 'react-icons/fa';
import useAuthStore from '@/store/authStore';
import ProfileDropdown from '@/components/navigation/ProfileDropdown';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const validSections = ['dashboard', 'buy', 'sell', 'wishlist', 'offers', 'profile', 'notifications', 'help'];

  useEffect(() => {
    // Get active section from URL params
    const tab = searchParams?.get('tab');
    if (tab && validSections.includes(tab)) {
      setActiveSection(tab);
    } else {
      // If no tab in URL, default to dashboard
      setActiveSection('dashboard');
    }
  }, [searchParams]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Update URL without page reload
    const params = new URLSearchParams(searchParams?.toString());
    if (section === 'dashboard') {
      params.delete('tab');
    } else {
      params.set('tab', section);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dv2-app">
      {/* Mobile Header */}
      <div className="dv2-mobile-header d-lg-none">
        <div className="d-flex align-items-center justify-content-between px-2 py-2">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="dv2-menu-toggle py-0 px-1 border-0 bg-transparent"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FaBars size={22} />
            </button>
            <Link href="/" className="d-inline-flex align-items-center">
              <Image
                src="/images/finalCarosalogo.png"
                alt="CAROSA"
                width={140}
                height={42}
                className="object-fit-contain"
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
          className="dv2-sidebar-overlay d-lg-none"
          onClick={closeSidebar}
        />
      )}

      <div className="dv2-body  container-fluid padding-Y-X">
        <div className="row g-4">
          <div className="col-12 col-lg-3">
            <Sidebar
              active={activeSection}
              onChange={handleSectionChange}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />
          </div>
          <div className="col-12 col-lg-9">
            <Main active={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}


