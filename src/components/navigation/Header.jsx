// components/Header.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import dropdownData from "../../data/BuyDropdown.json";
import carosaCareDropdownData from "../../data/CarosaCareDropdown.json";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Offcanvas,
  Accordion,
  Button,
  Modal // Modal import is not needed here, but for completeness with other BS components
} from "react-bootstrap";
import { FaBars, FaChevronDown, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown as faChevronDownIcon,
  faChevronUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import CallUsForm from "../common/CallUsForm";
import BuyCarDropdown from "../common/dropdown/BuyCarDropdown";
import CarosaCareDropdown from "../common/dropdown/CarosaCareDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { useRouter, usePathname } from "next/navigation";
import LoginModal from "@/components/LoginModal"; // ✅ Reuse common LoginModal component
import useAuthStore from "../../store/authStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [countryOpen, setCountryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const countryRef = useRef(null);
  const [showCall, setShowCall] = useState(false);
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State for the Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Authentication state
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

  // Check if user is actually authenticated with valid access token
  const [hasValidAccessToken, setHasValidAccessToken] = useState(false);

  // Handlers for Login Modal
  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  useEffect(() => {
    setIsMounted(true);
    // Initialize authentication state
    initializeAuth();
  }, [initializeAuth]);

  // Note: We cannot check httpOnly cookies from JavaScript
  // We rely on Zustand authentication state instead
  useEffect(() => {
    if (!isMounted) return;

    console.log('Header: Zustand isAuthenticated:', isAuthenticated);
    console.log('Header: User from Zustand:', user);

    // Since we can't read httpOnly cookies, we trust the Zustand state
    // The backend will validate the cookie when making API calls
    setHasValidAccessToken(isAuthenticated && !!user);
  }, [isMounted, isAuthenticated, user]);

  useEffect(() => {
    if (!isMounted) return;

    const onDoc = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setCountryOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isMounted]);

  // ✅ Add this inside Header component, before return()
  const handleFilterClick = (e, href) => {
    e.preventDefault();

    const getBudgetParams = (href) => {
      if (href.includes("/price/under-2-lakh"))
        return { minPrice: 0, maxPrice: 200000 };
      if (href.includes("/price/under-5-lakh"))
        return { minPrice: 0, maxPrice: 500000 };
      if (href.includes("/price/under-10-lakh"))
        return { minPrice: 0, maxPrice: 1000000 };
      if (href.includes("/price/above-10-lakh"))
        return { minPrice: 1000000, maxPrice: 3000000 };
      return null;
    };

    const getFuelType = (href) => {
      if (href.includes("/fuel/petrol")) return "Petrol";
      if (href.includes("/fuel/diesel")) return "Diesel";
      if (href.includes("/fuel/cng")) return "CNG";
      return null;
    };

    const getTransmission = (href) => {
      if (href.includes("/transmission/automatic")) return "Automatic";
      if (href.includes("/transmission/manual")) return "Manual";
      return null;
    };

    const getYearRange = (href) => {
      const currentYear = new Date().getFullYear();
      if (href.includes("/year/2019-and-above"))
        return { minYear: 2019, maxYear: currentYear };
      if (href.includes("/year/2014-and-above"))
        return { minYear: 2014, maxYear: currentYear };
      if (href.includes("/year/2009-and-above"))
        return { minYear: 2009, maxYear: currentYear };
      if (href.includes("/year/2005-and-above"))
        return { minYear: 2005, maxYear: currentYear };
      return null;
    };

    const getSegment = (href) => {
      if (href.includes("/segment/mid-range") || href.includes("/used-cars/segment/mid-range")) return "Mid-Range Cars";
      if (href.includes("/segment/luxury") || href.includes("/used-cars/segment/luxury")) return "Luxury Cars";
      return null;
    };

    const getBodyType = (href) => {
      if (href.includes("/body/hatchback") || href.includes("/used-cars/body/hatchback")) return "Hatchback";
      if (href.includes("/body/sedan") || href.includes("/used-cars/body/sedan")) return "Sedan";
      if (href.includes("/body/suv") || href.includes("/used-cars/body/suv")) return "SUV";
      return null;
    };

    // ✅ Handle Segment Filters
    if (href.includes("/segment/") || href.includes("/used-cars/segment/")) {
      const segment = getSegment(href);
      if (segment) {
        router.push(`/recentCar?category=${segment}`);
        return;
      }
    }

    // ✅ Handle Price Filters
    if (href.includes("/price/")) {
      const params = getBudgetParams(href);
      if (params) {
        const query = new URLSearchParams({
          minPrice: params.minPrice.toString(),
          maxPrice: params.maxPrice.toString(),
        }).toString();
        router.push(`/recentCar?${query}`);
        return;
      }
    }

    // ✅ Handle Fuel Filters
    if (href.includes("/fuel/")) {
      const fuel = getFuelType(href);
      if (fuel) {
        router.push(`/recentCar?fuel=${fuel}`);
        return;
      }
    }

    // ✅ Handle Transmission Filters
    if (href.includes("/transmission/")) {
      const transmission = getTransmission(href);
      if (transmission) {
        router.push(`/recentCar?transmission=${transmission}`);
        return;
      }
    }

    // ✅ Handle Year Filters
    if (href.includes("/year/")) {
      const yearRange = getYearRange(href);
      if (yearRange) {
        router.push(
          `/recentCar?year=${yearRange.minYear}-${yearRange.maxYear}`
        );
        return;
      }
    }

    // ✅ Handle Body Type Filters
    if (href.includes("/body/") || href.includes("/used-cars/body/")) {
      const bodyType = getBodyType(href);
      if (bodyType) {
        router.push(`/recentCar?bodyType=${bodyType}`);
        return;
      }
    }

    // ✅ Fallback — just navigate
    router.push(href);
  };


  // Check if we're on dealer dashboard pages
  const isDealerPage = pathname?.includes('/dealers') || pathname?.includes('/dealer-dashboard') || pathname?.includes('/dealers-dashboard');
  
  // Add class to hide on mobile if dealer page (CSS will handle it)
  return (
    <header className={`site-header bg-white ${isDealerPage ? 'hide-on-mobile-dealer' : ''}`}>
      <section className="navbar px-3 pe-md-auto pe-0 px-lg-3 py-0">
        <Container fluid>
          <Row className="w-100 align-items-center">
            {/* LEFT */}
            <Col
              xxl={6}
              xs={4}
              className="d-flex align-items-center gap-sm-3 gap-0 gap-lg-4"
            >
              <button
                className="btn btn-link p-0 d-inline-flex d-xxl-none align-items-center me-1"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <FaBars size={22} className="text-dark" />
              </button>

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

              <nav className="navLinkLists d-none d-xxl-block">
                <ul className="nav-list p-0 m-0 d-flex align-items-center gap-4">
                  <li
                    className="nav-items has-mega"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <Link
                      href="/recentCar"
                      className="nav-links fSize-5 fw-semibold position-relative d-inline-flex align-items-center"
                    >
                      Buy Car
                      <span className="icon-wrapper ms-2 d-inline-flex align-items-center justify-content-center">
                        {isOpen ? (
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            className="text-dark icon-stable"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faChevronDownIcon}
                            className="text-dark icon-stable"
                          />
                        )}
                      </span>
                    </Link>

                    <BuyCarDropdown />
                  </li>


                  <li className="nav-items">
                    <Link
                      href={isAuthenticated && user?.role === "Dealer" ? "/dealers" : "/sell"}
                      className="nav-links fSize-5 fw-semibold position-relative d-inline-flex align-items-center"
                    >
                      Sell Car
                    </Link>

                  </li>

                  <li className="nav-items">
                    <Link
                      href="/finance"
                      className="nav-links fSize-5 fw-semibold position-relative d-inline-flex align-items-center"
                    >
                      Finance
                      {/* <FaChevronDown className="ms-2 text-dark" size={14} /> */}
                    </Link>
                  </li>

                  <li
                    className="nav-items has-mega"
                    onMouseEnter={() => setIsCareOpen(true)}
                    onMouseLeave={() => setIsCareOpen(false)}
                  >
                    <Link
                      href="/carosa-care"
                      className="nav-links fSize-5 fw-semibold position-relative d-inline-flex align-items-center"
                    >
                      Carosa Care
                      <span className="icon-wrapper ms-2 d-inline-flex align-items-center justify-content-center">
                        {isCareOpen ? (
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            className="text-dark icon-stable"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faChevronDownIcon}
                            className="text-dark icon-stable"
                          />
                        )}
                      </span>
                    </Link>

                    <CarosaCareDropdown />
                  </li>
                </ul>
              </nav>
            </Col>

            {/* RIGHT */}
            <Col xxl={6} xs={8} className="pe-0 pro__spe">
              <div className="rightWave d-flex align-items-center justify-content-end gap-3 gap-lg-3">
                <div className="navSearchInput d-none d-lg-block">
                  <InputGroup className="position-relative">
                    <span className="searchIconWrap">
                      <Image
                        src="/images/Search.png"
                        alt="search"
                        width={16}
                        height={16}
                      />
                    </span>
                    <Form.Control
                      placeholder="Search for your wish"
                      aria-label="Search"
                      className="searhInputNav ps-5"
                    />
                  </InputGroup>
                </div>

                <div
                  className="dropdownCountry position-relative d-none d-md-inline-block"
                  ref={countryRef}
                >
                  <button
                    className="dropdown-btn border-0 bg-transparent fSize-2 fw-medium rounded-2 d-inline-flex align-items-center"
                    onClick={() => setCountryOpen((v) => !v)}
                  >
                    <FaMapMarkerAlt size={15} className="text-dark me-2" />
                    Delhi
                    <FaChevronDown className="ms-2 text-dark" size={15} />
                  </button>
                  {isMounted && countryOpen && (
                    <div className="dropdown-menu show">
                      <ul className="countryLists p-0 m-0">
                        {["Delhi", "Gurgaon", "Ghaziabad", "Noida"].map(
                          (c) => (
                            <li key={c}>
                              <button className="dropdown-item">{c}</button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowCall(!showCall)}
                  className="callBtn d-none d-md-inline-flex align-items-center gap-2 text-white border-0 outline-none rounded-3 fSize-3"
                >
                  <Image
                    src="/images/callicon.png"
                    alt="call"
                    width={12}
                    height={12}
                  />
                  Call us
                </button>

                {isMounted && (
                  <div className={`popup-box ${showCall ? "show" : ""}`}>
                    <div className="position-relative pb-4">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="close-icon"
                        onClick={() => {
                          setShowCall(false);
                          setIsOTPMode(false);
                        }}
                      />
                      {!isOTPMode && (
                        <>
                          <p className="fSize-3 fw-normal text-dark fst-italic">
                            Connect With Us:
                          </p>
                          <p className="fSize-3 fw-semibold text-dark m-0">
                            Want the best car advice?
                          </p>
                          <p className="fSize-3 fw-semibold text-dark m-0">
                            Connect with us at <span>+91 9355530033</span>
                          </p>
                        </>
                      )}
                    </div>

                    {!isOTPMode && (
                      <>
                        <div className="OrLine border-bottom position-relative mb-4">
                          <div className="Or rounded-circle text-white d-flex justify-content-center align-items-center fSize-3 fw-medium">
                            Or
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <p className="fSize-4 fw-semibold text-dark">
                            Request a Call Back
                          </p>
                        </div>
                      </>
                    )}

                    <CallUsForm 
                      key={showCall ? 'call-form-open' : 'call-form-closed'} 
                      onOTPStateChange={setIsOTPMode} 
                    />
                  </div>
                )}

                {/* Authentication Button */}
                {isAuthenticated && user && hasValidAccessToken ? (
                  <ProfileDropdown user={user} onLogout={handleLogout} />
                ) : (
                  <button
                    className="signInBtn px-3 py-2 rounded-3 bg-transparent fw-semibold fSize-3"
                    onClick={handleOpenLoginModal}
                  >
                    Sign in
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </Container>

        {/* MOBILE DRAWER (Existing) */}
        {/* ✅ MOBILE DRAWER */}
        <Offcanvas
          placement="start"
          show={menuOpen}
          onHide={() => setMenuOpen(false)}
          className="mobile-drawer"
        >
          <Offcanvas.Header closeButton>
            <Link
              href={isAuthenticated && user?.role === "Dealer" ? "/dealers" : "/"}
              className="d-inline-flex align-items-center"
            >
              <Image
                src="/images/finalCarosalogo.png"
                alt="CAROSA"
                width={140}
                height={36}
                className="rounded object-fit-contain"
              />
            </Link>
          </Offcanvas.Header>

          <Offcanvas.Body>
            {/* 🔍 Search Bar */}
            <div className="mb-3">
              <InputGroup className="position-relative">
                <span className="searchIconWrap">
                  <Image
                    src="/images/Search.png"
                    alt="search"
                    width={16}
                    height={16}
                  />
                </span>
                <Form.Control
                  placeholder="Search for your wish"
                  aria-label="Search"
                  className="searhInputNav ps-5"
                />
              </InputGroup>
            </div>

            {/* 📍 Location Selector */}
            <div className="mb-3">
              <Button
                variant="light"
                className="w-100 d-flex align-items-center justify-content-between"
                onClick={() => setCountryOpen((v) => !v)}
              >
                <span className="d-inline-flex align-items-center">
                  <FaMapMarkerAlt size={15} className="text-dark me-2" />
                  Delhi
                </span>
                <FaChevronDown size={14} />
              </Button>
              {isMounted && countryOpen && (
                <div className="border rounded mt-2">
                  {["Delhi", "Gurgaon", "Ghaziabad", "Noida"].map((c) => (
                    <button key={c} className="dropdown-item py-2">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 🚗 Buy Used Car Dropdown (same JSON & logic as desktop) */}
            <Accordion alwaysOpen>
              <Accordion.Item eventKey="0" className="rounded-0">
                <Accordion.Header className="px-0mobile ">
                  <span className="text-dark fw-semibold fSize-4">Buy used car</span>
                </Accordion.Header>
                <Accordion.Body>
                  {dropdownData.map((category, index) => (
                    <div className="mb-3" key={index}>
                      <h6 className="mb-2 fw-semibold">{category.title}</h6>
                      <div className="d-grid gap-2">
                        {category.links.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleFilterClick(e, link.href);
                              setMenuOpen(false);
                            }}
                            className="text-dark text-decoration-none fSize-4 fw-normal"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              {/* 🛠️ CAROSA Care Dropdown */}
              <Accordion.Item eventKey="1" className="rounded-0">
                <Accordion.Header className="px-0mobile ">
                  <span className="text-dark fw-semibold fSize-4">CAROSA Care</span>
                </Accordion.Header>
                <Accordion.Body>
                  {carosaCareDropdownData.map((category, index) => (
                    <div className="mb-3" key={index}>
                      <h6 className="mb-2 fw-semibold">{category.title}</h6>
                      <div className="d-grid gap-2">
                        {category.links.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-dark text-decoration-none fSize-4 fw-normal"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* 🏷️ Direct Links (same as desktop nav) */}
            <div className=" d-grid gap-3">
              <Link
                href={
                  isAuthenticated && user?.role === "Dealer"
                    ? "/dealers"
                    : "/sell"
                }
                onClick={() => setMenuOpen(false)}
                className="text-dark fw-semibold text-decoration-none fSize-4"
              >
                Sell Car
              </Link>

              <Link
                href="/finance"
                onClick={() => setMenuOpen(false)}
                className="text-dark fw-semibold text-decoration-none fSize-4"
              >
                Finance
              </Link>
            </div>

            {/* ☎️ Call Us Section */}
            <div className="mt-4 d-grid">
              <Button
                variant="success"
                onClick={() => {
                  setShowCall(true);
                  setMenuOpen(false);
                }}
              >
                Call us
              </Button>
            </div>

            {/* 🔐 Auth Section */}
            <div className="mt-3 text-center">
              {isAuthenticated && user && hasValidAccessToken ? (
                <Button
                  variant="outline-dark"
                  className="w-100"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline-dark"
                  className="w-100"
                  onClick={() => {
                    setMenuOpen(false);
                    handleOpenLoginModal();
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>

      </section>

      {/* Login Modal is rendered here */}
      <LoginModal
        show={showLoginModal}
        handleClose={handleCloseLoginModal}
      />
    </header>
  );
}