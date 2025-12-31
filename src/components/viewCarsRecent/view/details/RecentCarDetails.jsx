"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import inspectionData from "../../../../data/CarInspection.json";
// import higlightsCars from "../../../../data/HighlightsCars.json"; // Now using dynamic highlights from addons
import { FaLock, FaCarCrash, FaTachometerAlt, FaTint, } from "react-icons/fa";
import {
  faCheck,
  faChevronRight,
  faHeart,
  faIndianRupeeSign,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Banner from "./comps/Banner";
import AccordionList from "./comps/AccordionList";
import EMICalculator from "./comps/EMICalculator";
import { safeParseCustomFields } from '@/utils/jsonUtils';
import { normalizeBrand } from '@/utils/brandNormalizer';
import CarosaKaBharosa from "./comps/CarosaKaBharosa";
import CarosaLoanCalculator from "./comps/CarosaLoanCalculator";
import ExploreOurFullCollection from "@/components/home/ExploreOurFullCollection";
import Stories from "@/components/home/Stories";
import AskAssistance from "@/components/home/AskAssistance";
import MoreExplore from "./comps/MoreExplore";
import { useSelectedCar } from "@/store/selectedCar";
import Image from "next/image";
import CarShowcase from "./CarShowcase";
import BookKnowModal from "../../BookKnowModal";
import ServiceRecords from "./comps/ServiceRecords";
import { useRouter } from "next/navigation";
import Inspection from "@/components/dealers/Inspection";
import InspectionReport from "./InspectionReport";
import GetCallBackModal from "@/components/common/GetCallBackModal";
import { useAuthStore } from "@/store/authStore";
import DeactivateListingModal from "@/components/modals/DeactivateListingModal";
import RaiseInspectionModal from "@/components/modals/RaiseInspectionModal";
import ThankYouModal from "@/components/modals/ThankYouModal";
import ScheduleInspectionModal from "@/components/modals/ScheduleInspectionModal";
import AuthService from "@/services/authService";
import CarService from "@/services/carService";
import { BOOKING_AMOUNT } from "@/config/environment";

export default function RecentCarDetails({ car, carIndex }) {
  // if (!car) {
  //   return (
  //     <section className="container py-5">
  //       <h2 className="text-white">No car selected</h2>
  //       <p className="text-white-50">Open this page from the listing.</p>
  //     </section>
  //   );
  // }
  const { user, isAuthenticated, setUser, initializeAuth } = useAuthStore();
  const { setCar } = useSelectedCar();
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showCostsTooltip, setShowCostsTooltip] = useState(false);
  const handleOpenBookModal = () => setShowBookModal(true);
  const handleCloseBookModal = () => setShowBookModal(false);
  const handleOpenCallModal = () => setShowCallModal(true);
  const handleCloseCallModal = () => setShowCallModal(false);
  const router = useRouter();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [carActiveStatus, setCarActiveStatus] = useState(null); // Track car's active status
  const [userProfileLoaded, setUserProfileLoaded] = useState(false); // Track if user profile has been loaded
  const [calculatedEMI, setCalculatedEMI] = useState(0); // Store calculated EMI from calculator
  const [showRaiseInspectionModal, setShowRaiseInspectionModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const carListingId = useMemo(() => {
    return (
      car?.id ||
      car?._id ||
      car?.customFields?.carId ||
      car?.customFields?.listingId ||
      "N/A"
    );
  }, [car]);

  // Initialize auth store on mount to ensure we have the latest user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, [initializeAuth]);

  // Helper function to extract user ID from JWT token if user.id is not available
  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // Decode the payload (second part) - JWT uses base64url encoding
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      const payload = JSON.parse(atob(base64));
      // Try multiple possible ID fields in the token payload
      return payload.id || payload.userId || payload.user_id || payload.user?.id || null;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  // Helper function to get access token from sessionStorage
  const getTokenFromSessionStorage = () => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('accessToken');
    } catch (e) {
      return null;
    }
  };

  // Fetch user profile when authenticated to ensure we have complete user object with ID
  // This is important for ownership checks, especially for non-dealers
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        // Check if we already have user ID - if yes, mark as loaded
        if (user && (user.id || user._id)) {
          setUserProfileLoaded(true);
          return;
        }

        // If profile not loaded yet, fetch it
        if (!userProfileLoaded) {
          try {
            console.log('🔄 Fetching user profile to get user ID...');
            console.log('🔄 Current user object:', user);
            console.log('🔄 isAuthenticated:', isAuthenticated);

            const result = await AuthService.getProfile();
            console.log('🔄 Profile fetch result:', result);

            if (result.success && result.data?.user) {
              // Preserve token if it exists
              const existingToken = user?.token || getTokenFromSessionStorage();
              // Update auth store with complete user object including ID
              setUser(result.data.user, existingToken);
              setUserProfileLoaded(true);
              console.log('✅ User profile fetched, ID:', result.data.user.id);
            } else {
              console.warn('⚠️ Failed to fetch user profile:', result.message);
              // Try to extract ID from token as fallback
              const token = user?.token || getTokenFromSessionStorage();
              if (token) {
                const tokenUserId = getUserIdFromToken(token);
                if (tokenUserId && user) {
                  // Update user with ID from token
                  setUser({ ...user, id: tokenUserId }, token);
                  setUserProfileLoaded(true);
                  console.log('✅ User ID extracted from token:', tokenUserId);
                } else {
                  setUserProfileLoaded(true);
                }
              } else {
                setUserProfileLoaded(true);
              }
            }
          } catch (error) {
            console.error('❌ Error fetching user profile:', error);
            // Try to extract ID from token as fallback
            const token = user?.token || getTokenFromSessionStorage();
            if (token) {
              const tokenUserId = getUserIdFromToken(token);
              if (tokenUserId && user) {
                // Update user with ID from token
                setUser({ ...user, id: tokenUserId }, token);
                setUserProfileLoaded(true);
                console.log('✅ User ID extracted from token (fallback):', tokenUserId);
              } else {
                setUserProfileLoaded(true);
              }
            } else {
              setUserProfileLoaded(true);
            }
          }
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, setUser, userProfileLoaded]);

  // Initialize car active status from car data
  useEffect(() => {
    if (car?.customFields) {
      // Get isActive from customFields, default to true if not set
      const isActive = car.customFields.isActive !== undefined
        ? car.customFields.isActive
        : true; // Default to true if not set
      setCarActiveStatus(isActive);
    } else if (car) {
      // If customFields doesn't exist, default to true
      setCarActiveStatus(true);
    }
  }, [car]);

  // Reactive ownership check using useMemo - recalculates when user or car changes
  const isCarOwner = useMemo(() => {
    if (!isAuthenticated || !car) {
      return false;
    }

    // Check if current user is the owner/creator of this car listing
    // Support multiple ways the car owner ID might be stored:
    // Priority order based on schema: car.userId is the direct foreign key field
    // 1. car.userId (direct field from schema) - PRIMARY SOURCE
    // 2. car.User.id (from API with User relation populated) - SECONDARY SOURCE
    // 3. car.UserId (alternative casing)
    // 4. car.createdBy (if available)
    const carOwnerId = car?.userId || car?.UserId || car?.User?.id || car?.User?.Id || car?.createdBy || null;

    // Get current user ID from multiple possible sources (works for both dealers and non-dealers):
    // 1. user.id (direct field - works for dealers and some non-dealers) - PRIMARY SOURCE
    // 2. user._id (alternative field)
    // 3. Extract from JWT token in user.token (if available)
    // 4. Extract from sessionStorage accessToken (for non-dealers where user.id might not be set)
    const tokenFromStorage = getTokenFromSessionStorage();
    const userIdFromStorageToken = tokenFromStorage ? getUserIdFromToken(tokenFromStorage) : null;
    const userIdFromUserToken = user?.token ? getUserIdFromToken(user.token) : null;
    const currentUserId = user?.id || user?.Id || user?._id || userIdFromUserToken || userIdFromStorageToken || null;

    // If we don't have both IDs, can't determine ownership
    if (!currentUserId || !carOwnerId) {
      console.log('⚠️ Ownership check: Missing IDs', { currentUserId, carOwnerId });
      return false;
    }

    // Convert both IDs to strings first, then compare (handles string/number mismatches better)
    const currentUserIdStr = String(currentUserId).trim();
    const carOwnerIdStr = String(carOwnerId).trim();

    // Also try numeric comparison as fallback
    const currentUserIdNum = Number(currentUserId);
    const carOwnerIdNum = Number(carOwnerId);

    // Check ownership: both IDs must exist and match (try both string and numeric comparison)
    const stringMatch = currentUserIdStr === carOwnerIdStr;
    const numericMatch = !isNaN(currentUserIdNum) && !isNaN(carOwnerIdNum) && currentUserIdNum === carOwnerIdNum;
    const ownerCheck = stringMatch || numericMatch;

    // Debug logging to trace the issue
    console.log('=== OWNERSHIP CHECK DEBUG ===');
    console.log('Current user:', user);
    console.log('Current user role:', user?.role || user?.Role?.name);
    console.log('Current user ID (from user.id):', user?.id);
    console.log('Current user ID (from user._id):', user?._id);
    console.log('Current user ID (from user.token):', userIdFromUserToken);
    console.log('Current user ID (from sessionStorage token):', userIdFromStorageToken);
    console.log('Current user ID (resolved):', currentUserId);
    console.log('Current user ID (as string):', currentUserIdStr);
    console.log('Current user ID (as number):', currentUserIdNum);
    console.log('Car object:', car);
    console.log('Car.User:', car?.User);
    console.log('Car.User.id:', car?.User?.id);
    console.log('Car.userId:', car?.userId);
    console.log('Car.UserId:', car?.UserId);
    console.log('Car.createdBy:', car?.createdBy);
    console.log('Car owner ID (resolved):', carOwnerId);
    console.log('Car owner ID (as string):', carOwnerIdStr);
    console.log('Car owner ID (as number):', carOwnerIdNum);
    console.log('Is authenticated:', isAuthenticated);
    console.log('User profile loaded:', userProfileLoaded);
    console.log('String match:', stringMatch);
    console.log('Numeric match:', numericMatch);
    console.log('isCarOwner result:', ownerCheck);
    console.log('=== END OWNERSHIP CHECK DEBUG ===');

    return ownerCheck;
  }, [isAuthenticated, user, car, userProfileLoaded]); // Recalculate when user, car, or profile load status changes
  // Tab items data
  const tabItems = [
    { id: "Overview", label: "Overview" },
    { id: "Inspection", label: "Car inspection" },
    { id: "Features", label: "Features and specs" },
    { id: "Videos", label: "Videos" },
  ];
  // const handlePrepareOfferData = () => {
  //   setCar(car);
  //   if (typeof window !== "undefined") {
  //     try {
  //       sessionStorage.setItem("selectedCar", JSON.stringify(car));
  //     } catch {}
  //   }
  // };
  const handleEditCar = () => {
    // Use car.id or car._id - check which one is available
    const carId = car?.id || car?._id;
    if (!carId) return;
    router.push(`/RegistrationYourCar?editId=${carId}`);
  };
  const handlePrepareOfferData = () => {
    // ✅ __ui = transformedCar ko attach karke save karo
    const payload = { ...car, __ui: transformedCar };

    setCar(payload);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("selectedCar", JSON.stringify(payload));
      } catch { }
    }

    // ✅ route to make-offer
    router.push(`/make-offer${typeof carIndex !== "undefined" ? `?carId=${carIndex}` : ""}`);
  };

  function maskRegistrationNumber(regNumber) {
  if (!regNumber || regNumber === 'N/A') return 'N/A';

  // Remove all spaces
  const clean = regNumber.replace(/\s+/g, '');

  // Show only first 4 characters
  const visible = clean.slice(0, 4);

  // Replace rest with *
  const masked = '*'.repeat(clean.length - 4);

  return visible + masked;
}
  // function maskRegistrationNumber(regNumber) {
  //   if (!regNumber || regNumber === 'N/A') return 'N/A';

  //   const clean = regNumber.trim().replace(/\s+/g, ' ');

  //   const parts = clean.split(' ');

  //   if (parts.length === 4) {
  //     return `${parts[0]} ${parts[1]} ** ${parts[3]}`;
  //   }

  //   if (parts.length === 3) {
  //     return `${parts[0]} ** ${parts[2]}`;
  //   }
  //   return clean.replace(/^(.{4}).*(.{4})$/, '$1**$2');
  // }


  const displayMonthYear = (labelLike, yearNum, monthNum) => {
    if (!labelLike && !yearNum) return 'N/A';

    // Agar label string already "Month, YYYY" ya "Aug 2011" jaisa hai → use as-is (comma normalize)
    if (typeof labelLike === 'string' && /[A-Za-z]/.test(labelLike)) {
      return labelLike.replace(/,\s*/g, ', ');
    }

    // Agar label "YYYY-MM" / "YYYY-MM-DD" ho
    if (typeof labelLike === 'string' && /^\d{4}-\d{1,2}(-\d{1,2})?$/.test(labelLike)) {
      const [y, m] = labelLike.split('-').map(n => parseInt(n, 10));
      const d = new Date(y, Math.min(11, Math.max(0, (m || 1) - 1)), 1);
      return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }

    // Numeric year + optional month
    const y = Number.isFinite(Number(yearNum)) ? Number(yearNum) : Number(labelLike);
    if (!Number.isFinite(y)) return 'N/A';
    const m = Number.isFinite(Number(monthNum)) ? Number(monthNum) : null;

    const d = new Date(y, (m ? m - 1 : 0), 1);
    return d.toLocaleDateString('en-IN', { month: m ? 'short' : undefined, year: 'numeric' });
  };
  // Transform API data to match component expectations
  const transformCarData = (apiCar) => {
    // Extract custom fields - handle nested structure safely
    const customFields = safeParseCustomFields(apiCar);

    // Get the first image or use a default
    const firstImage = apiCar.CarImages && apiCar.CarImages.length > 0
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.carosa.in'}${apiCar.CarImages[0].url}`
      : '/images/default-car.jpg';

    // Format price with rupee symbol
    const formatPrice = (price) => {
      if (!price || price === 0) return '₹0';
      const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[₹,]/g, '')) : parseFloat(price);
      if (isNaN(numPrice)) return '₹0';
      return `₹${numPrice.toLocaleString('en-IN')}`;
    };

    // Format owner number
    const formatOwner = (owner) => {
      if (!owner) return '1st';
      const ownerNum = typeof owner === 'string' ? owner.toLowerCase() : owner.toString();
      if (ownerNum.includes('1') || ownerNum.includes('first')) return '1st';
      if (ownerNum.includes('2') || ownerNum.includes('second')) return '2nd';
      if (ownerNum.includes('3') || ownerNum.includes('third')) return '3rd';
      return `${ownerNum}th`;
    };

    // Clean model name - remove duplicate trim name
    // Example: "VENTO PETROL VENTO PETROL" -> "VENTO PETROL" (first part is model, second is trim)
    const cleanModelName = (modelName) => {
      if (!modelName || typeof modelName !== 'string') return modelName || 'Unknown';

      const trimmed = modelName.trim();
      const words = trimmed.split(/\s+/);

      // If we have duplicate words (like "VENTO PETROL VENTO PETROL"), take only the first half
      if (words.length >= 4) {
        const midPoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, midPoint).join(' ');
        const secondHalf = words.slice(midPoint).join(' ');

        // If first half and second half are the same, return only first half
        if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
          return firstHalf;
        }
      }

      return trimmed;
    };

    // Enhanced field extraction with more variations and fallbacks to main car fields
    const kmDriven = customFields.kmDriven || customFields.km || customFields.odometer || customFields.mileage || apiCar.kmDriven || apiCar.km || '0';
    const rawListingPrice = customFields.listingPrice || customFields.listing_price || customFields.price || customFields.listPrice || customFields.list_price || apiCar.price || apiCar.listingPrice || 0;
    // Convert to number if it's a string (remove currency symbols, commas, etc.)
    const listingPrice = typeof rawListingPrice === 'string' 
      ? parseFloat(rawListingPrice.replace(/[₹,\s]/g, '')) || 0 
      : Number(rawListingPrice) || 0;
    const fuelType = customFields.fuelType || customFields.fuel || customFields.fuel_type || apiCar.fuelType || apiCar.fuel || 'Petrol';
    const transmission = customFields.transmission || customFields.transmission_type || apiCar.transmission || 'Manual';
    const owner = customFields.owner || customFields.ownerNumber || customFields.owner_number || apiCar.owner || '1';
    const year = customFields.year || customFields.registrationYear || customFields.regYear || apiCar.year || apiCar.registrationYear || new Date().getFullYear();
    const mfgYear = customFields.mfgYear || customFields.manufacturingYear || customFields.manufactureYear || apiCar.mfgYear || apiCar.manufacturingYear || year;
    const registrationNumber = customFields.registrationNumber || customFields.regNumber || customFields.regNo || apiCar.registrationNo || apiCar.registrationNumber || 'N/A';
    const spareKey = customFields.spareKey || customFields.spare_key || apiCar.spareKey || 'No';
    const engineCapacity = customFields.engineCapacity || customFields.engine_capacity || customFields.engine || customFields.engineSize || customFields.engine_size || apiCar.engineCapacity || apiCar.engine || apiCar.engineSize || 'N/A';
    let insurance = customFields.insurance || customFields.insuranceStatus || apiCar.insurance || 'No';
    const insuranceType = customFields.insuranceType || customFields.insurance_type || apiCar.insuranceType || 'Comprehensive';
    const insuranceDate = customFields.insuranceDate || customFields.insurance_date || apiCar.insuranceDate || null;

    // Check if insurance date is expired (less than current date)
    // If insurance date exists and is less than current date, set insurance to "Expired"
    if (insuranceDate) {
      try {
        const insuranceDateObj = new Date(insuranceDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        insuranceDateObj.setHours(0, 0, 0, 0);

        if (!isNaN(insuranceDateObj.getTime()) && insuranceDateObj < currentDate) {
          insurance = 'Expired';
        }
      } catch (error) {
        // If date parsing fails, keep original insurance value
        console.error('Error parsing insurance date:', error);
      }
    }

    // Get raw model name and clean it
    const rawModel = apiCar.model || 'Unknown';
    const cleanedModel = cleanModelName(rawModel);
    const warranty = customFields.warranty || customFields.warrantyStatus || apiCar.warranty || 'No';
    const warrantyType = customFields.warrantyType || customFields.warranty_type || apiCar.warrantyType || 'Extended';
    const warrantyDate = customFields.warrantyDate || customFields.warranty_date || apiCar.warrantyDate || null;

    // Debug the extracted values
    console.log('=== FIELD EXTRACTION DEBUG ===');
    console.log('KmDriven extracted:', kmDriven);
    console.log('ListingPrice extracted:', listingPrice);
    console.log('FuelType extracted:', fuelType);
    console.log('Transmission extracted:', transmission);
    console.log('Owner extracted:', owner);
    console.log('Year extracted:', year);
    console.log('MfgYear extracted:', mfgYear);
    console.log('RegistrationNumber extracted:', registrationNumber);
    console.log('Insurance extracted:', insurance);
    console.log('Warranty extracted:', warranty);
    console.log('=== END FIELD EXTRACTION DEBUG ===');

    return {
      id: apiCar.id,
      image: firstImage,
      brand: normalizeBrand(apiCar.make) || 'Unknown',
      modal: cleanedModel,
      location: customFields.location || 'Location not specified',
      use: kmDriven,
      vehicle: fuelType,
      fModal: transmission,
      own: formatOwner(owner),
      price: formatPrice(listingPrice),
      charges: '+ other charges',
      EMI: '10,479',
      platform:
        apiCar?.User?.Role?.name === "Dealer"
          ? "CAROSA Partner"
          : apiCar?.User?.Role?.name === "User"
            ? "Direct Owner"
            : null,
      // Additional fields for the component
      year: year,
      mfgYear: mfgYear,
      transmission: transmission,
      fuel: fuelType,
      kmDriven: kmDriven,
      owner: owner,
      registrationNumber: maskRegistrationNumber(registrationNumber),
      spareKey: spareKey,
      engineCapacity: engineCapacity,
      insurance: insurance,
      insuranceType: insuranceType,
      insuranceDate: insuranceDate,
      warranty: warranty,
      warrantyType: warrantyType,
      warrantyDate: warrantyDate,
      exteriorColor: customFields.exteriorColor || 'White',
      additionalFeatures: customFields.additionalFeatures || [],
      listingPrice: listingPrice // Raw numeric price for calculator
    };
  };

  // Transform the car data
  const transformedCar = transformCarData(car);
  console.log('=== RecentCarDetails Debug ===');
  console.log('Original car data:', car);
  console.log('Custom fields raw:', car?.customFields);
  console.log('Transformed car data for detail page:', transformedCar);
  console.log('Key fields - Year:', transformedCar.year, 'MfgYear:', transformedCar.mfgYear);
  console.log('Key fields - KmDriven:', transformedCar.kmDriven, 'Owner:', transformedCar.own);
  console.log('Key fields - Transmission:', transformedCar.transmission, 'Fuel:', transformedCar.fuel);
  console.log('Key fields - Price:', transformedCar.price);
  console.log('=== End RecentCarDetails Debug ===');

  // Transform addons (additionalFeatures) into highlights format
  const transformAddonsToHighlights = (addons) => {
    if (!Array.isArray(addons) || addons.length === 0) {
      return [];
    }
    
    // Transform each addon into highlight format
    // Use the addon name as heading, and a descriptive title
    return addons.map((addon, index) => {
      if (!addon || typeof addon !== 'string') {
        return null;
      }
      
      // Truncate long addon names for heading (max 30 chars)
      const heading = addon.length > 30 ? addon.substring(0, 30) + '...' : addon;
      
      // Create a descriptive title based on addon type
      let title = '';
      const addonLower = addon.toLowerCase();
      
      if (addonLower.includes('music') || addonLower.includes('sound') || addonLower.includes('speaker') || addonLower.includes('audio')) {
        title = 'Premium sound system installed.';
      } else if (addonLower.includes('seat') || addonLower.includes('upholstery')) {
        title = 'Premium seating upgrade installed.';
      } else if (addonLower.includes('light') || addonLower.includes('ambient')) {
        title = 'Enhanced lighting system installed.';
      } else if (addonLower.includes('camera') || addonLower.includes('dash cam')) {
        title = 'Advanced camera system installed.';
      } else if (addonLower.includes('body') || addonLower.includes('kit') || addonLower.includes('spoiler')) {
        title = 'Premium body modifications installed.';
      } else if (addonLower.includes('wheel') || addonLower.includes('alloy')) {
        title = 'Premium wheel upgrade installed.';
      } else if (addonLower.includes('coating') || addonLower.includes('ppf') || addonLower.includes('ceramic')) {
        title = 'Premium protection coating applied.';
      } else {
        title = `Premium ${addon} installed.`;
      }
      
      return {
        id: `highlight-${index}`,
        heading: heading,
        title: title,
        img: "/assets/img/repaintedcar.png" // Default icon
      };
    }).filter(item => item !== null); // Filter out any null items
  };

  // Get dynamic highlights from addons
  const dynamicHighlights = transformAddonsToHighlights(transformedCar.additionalFeatures || []);

  // JSON keys ko yahin map kar lo (aapke list component ke hisaab se)
  const image = transformedCar.image;
  const brand = transformedCar.brand;
  const model = transformedCar.modal; // agar JSON me "model" hai to yahan car.model kar dena
  const location = transformedCar.location;
  const usageMiles = transformedCar.use;
  const vehicleType = transformedCar.vehicle;
  const price = transformedCar.price;
  const charges = transformedCar.charges;
  const emi = transformedCar.EMI;
  const platform = transformedCar.platform;
  // const year = transformedCar.year ? new Date(transformedCar.year).getFullYear() : "";
  const year = transformedCar.year
  ? Number(String(transformedCar.year).match(/\d{4}/)?.[0] || "")
  : "";
  const variant = transformedCar.variant;

  const handleDeactivateClick = (carId) => {
    // Use car.id or car._id - check which one is available
    const idToUse = carId || car?.id || car?._id;
    setSelectedCarId(idToUse);
    setShowDeactivateModal(true);
  };

  const handleCloseDeactivateModal = () => {
    setShowDeactivateModal(false);
    setSelectedCarId(null);
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedCarId) return;

    try {
      // Update car's customFields to set isActive: false (same as dealer dashboard)
      const result = await CarService.updateCar(selectedCarId, {
        customFields: {
          isActive: false
        }
      });

      if (result.success) {
        // Update local state to reflect the change (button will change to "Activate")
        setCarActiveStatus(false);
        setShowDeactivateModal(false);
        setSelectedCarId(null);
        // No alert, no redirect - just update the button
      } else {
        alert(result.message || "Failed to deactivate listing. Please try again.");
      }
    } catch (err) {
      console.error("Error deactivating car:", err);
      alert("Network error. Please try again.");
    } finally {
      setShowDeactivateModal(false);
      setSelectedCarId(null);
    }
  };

  const handleActivateClick = async () => {
    const carId = car?.id || car?._id;
    if (!carId) return;

    try {
      // Update car's customFields to set isActive: true
      const result = await CarService.updateCar(carId, {
        customFields: {
          isActive: true
        }
      });

      if (result.success) {
        // Update local state to reflect the change (button will change to "Deactivate")
        setCarActiveStatus(true);
        // No alert, no redirect - just update the button
      } else {
        alert(result.message || "Failed to activate listing. Please try again.");
      }
    } catch (err) {
      console.error("Error activating car:", err);
      alert("Network error. Please try again.");
    }
  };
  return (
    <>
      {/* <Banner /> */}
      <section className="padding-Y-X topSpacing">
        <Container fluid>
          {/* Mobile Tabs - Visible below 992px */}
          {/* <Row className="d-lg-none mb-4">
            <Col xs={12}>
              <div className="mobile-tabs-container">
                <div className="mobile-tabs-scroll d-flex justify-content-between align-items-center">
                  {tabItems.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`mobile-tab-btn fSize-3 fw-medium ${activeTab === tab.id ? "mobile-tab-active" : ""
                        }`}
                      style={{
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </Col>
          </Row> */}

          <Row>
            {/* Desktop Tabs - Hidden below 992px */}
            <Col lg={2} className="d-none d-lg-block">
              <div
                className="tabBtnsList d-flex flex-column gap-2 position-sticky"
              >
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" });
                      // URL hash update without page reload:
                      history.replaceState(null, "", `#${tab.id}`);
                    }}
                    className={`tabBtn fSize-3 fw-medium py-3 bg-white w-100 d-inline-block text-center rounded-3 border ${activeTab === tab.id ? "tabBtn-active" : ""
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Col>
            <Col lg={6} >
              <div className="d-flex sticky__carShowcase">
                <CarShowcase car={car} />
              </div>
              
              {/* Mobile Sidebar - Shows only on mobile, right after CarShowcase */}
              <div className="d-lg-none mt-3">
                <div className="carDetailsMainParent p-3 rounded-4 bg-white position-relative">
                  <h2 className=" fw-bold mb-1 mobile_fonts widthSet">{year} {brand} {model}</h2>
                  {/* <p className="fSize-3 fw-normal  mb-3">Trim</p> */}

                  {/* <div className="aboutCar d-flex flex-wrap gap-1 align-items-baseline mb-4 mt-3">
                    <div className="km">
                      <Link
                        href=""
                        className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                      >
                        {transformedCar.kmDriven ? `${Number(String(transformedCar.kmDriven).replace(/\D/g, "")).toLocaleString('en-US')} km` : "N/A"}
                      </Link>
                    </div>
                    <div className="owner">
                      <Link
                        href=""
                        className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                      >
                        {transformedCar.own || 'N/A'} Owner
                      </Link>
                    </div>
                    <div className="petrol">
                      <Link
                        href=""
                        className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                      >
                        {transformedCar.fuel || 'N/A'}
                      </Link>
                    </div>
                    <div className="automatic">
                      <Link
                        href=""
                        className="aboutCarTab py-1 px-2 rounded-4 fSize-3 fw-semibold"
                      >
                        {transformedCar.transmission || 'N/A'}
                      </Link>
                    </div>
                  </div> */}

                  {platform && (
                    <div className="viewCarosaBisk border-bottom pb-4 d-flex align-items-center gap-2">
                      <span className="text-white m-0 py-1 px-3 fSize-4 fw-medium">
                        <Image
                          src="/assets/img/tik.png"
                          alt=""
                          width={16}
                          height={16}
                          className="me-2 viewCarosaBisk"
                        />
                        {platform}
                      </span>
                    </div>
                  )}

                  <div className="deliveryLocation d-flex justify-content-between align-items-center border-bottom pt-3 pb-4">
                    <div className="HomeTest">
                      <p className="m-0 fSize-3 fw-normal pb-2">
                        Home Test Drive:
                      </p>
                      <h6 className="m-0 fSize-3 fw-bold">N/A</h6>
                    </div>
                    <div className="deliveryCenter">
                      <p className="m-0 fSize-3 fw-normal pb-2">
                        Drive Hub Location
                      </p>
                      <h6 className="m-0 fSize-3 fw-bold">
                        Shakti Nagar, Delhi
                      </h6>
                    </div>
                  </div>
                  
                  <div className="PriceArea d-flex align-items-center justify-content-between pt-3 pb-4">
                    <div className="roadPrice position-relative">
                      <p className="m-0 fSize-2 fw-semibold pb-2">
                        Selling price
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="m-0 fsSize-7-5 fw-bold position-relative mobile_fonts">{transformedCar.price} <span></span></h6>
                        <div
                          className="price-info-icon d-flex align-items-center justify-content-center"
                          style={{
                            width: "18px",
                            height: "18px",
                            border: "2px solid #000",
                            borderRadius: "50%",
                            fontSize: "12px",
                            color: "black",
                            marginTop: "-14px",
                            cursor: "pointer"
                          }}
                          onMouseEnter={() => setShowCostsTooltip(true)}
                          onMouseLeave={() => setShowCostsTooltip(false)}
                        >
                          i
                        </div>

                        {/* Additional Costs & Services Tooltip */}
                        {showCostsTooltip && (
                          <div className="additional-costs-tooltip">
                            <div className="additional-costs-header">
                              <h6 className="mb-2 fSize-4 fw-bold">Additional Costs & Services</h6>
                            </div>
                            <div className="additional-costs-content">
                              <div className="cost-item">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="cost-label">RC / NOC Transfer Charges:</span>
                                  <span className="cost-value">₹5,000*</span>
                                </div>
                              </div>
                              {/* <div className="cost-item">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="cost-label">Insurance:</span>
                                  <span className="cost-value">Starting from ₹5,000*</span>
                                </div>
                              </div>
                              <div className="cost-item">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="cost-label">Refurbishment Cost:</span>
                                  <span className="cost-value">₹12,000*</span>
                                </div>
                              </div>
                              <div className="cost-item">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="cost-label">Pending Challan:</span>
                                  <span className="cost-value">₹12,000*</span>
                                </div>
                              </div> */}
                            </div>
                            <div className="additional-costs-notes">
                              <p className="m-0 fSize-2 fw-normal mb-1">
                                <span className="fw-semibold">Note:</span>
                              </p>
                              <ul className="m-0 ps-1">
                                <li className="fSize-2 fw-normal">
                                  RC Transfer / NOC charges may vary depending on your location and respective RTO.
                                </li>
                                <li className="fSize-2 fw-normal">
                                  Insurance premium is based on vehicle inspection and the type of coverage selected.
                                </li>
                                <li className="fSize-2 fw-normal">
                                  Refurbishment cost is indicative and may change based on actual vehicle condition and part requirements.
                                </li>
                                <li className="fSize-2 fw-normal">
                                  Pending challan amount is subject to verification from the RTO and traffic authority portals.
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-column">
                      <div className="validTill d-flex align-items-center gap-2">
                        <div className="fSize-5 fw-normal">
                          <p className="mb-0 fSize-3 fw-semibold">EMI Start From</p>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            style={{ width: 12, height: 16 }}
                          />{" "}
                          {calculatedEMI > 0 ? new Intl.NumberFormat('en-IN').format(calculatedEMI) : '10,479'}/m
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Row className="getCallBack align-items-center g-lg-0">
                      {/* Get Call Back button - Only show for non-owners */}
                      {!isCarOwner && (
                        <Col xxl={3} lg={6} className="mb-xxl-0 mb-1 col-12 mobilepostion">
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenCallModal();
                              }}
                              className="border-0 bg-transparent p-0 text-dark text-decoration-none fSize-2 fw-semibold d-flex align-items-center gap-1 position-callBack"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="outerPart">
                                <div className="phoneIcon d-flex justify-content-center align-items-center">
                                  <FontAwesomeIcon icon={faPhone} size="15" className="text-white" />
                                </div>
                              </div>
                              <p className="m-0 fSize-2 fw-semibold d-lg-block d-none">Get call back</p>
                            </button>
                          </div>
                        </Col>
                      )}

                      {/* Book Now / Edit button */}
                      <Col
                        xxl={isCarOwner ? 6 : 4}
                        lg={isCarOwner ? 6 : 6}
                        sm={6}
                        xs={6}
                        className={`text-center mb-xxl-0 mb-1 ${isCarOwner ? "col-6" : ""}`}
                      >
                        <div className="bookBtn">
                          <button
                            type="button"
                            className={`bookHere fSize-4 fw-bold py-2 px-4 ${isCarOwner
                              ? "editBtn"
                              : "bookBtnMain"
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isCarOwner) {
                                handleEditCar();
                              } else {
                                handleOpenBookModal();
                              }
                            }}
                          >
                            {isCarOwner
                              ? "Edit"
                              : "Book Now"}
                          </button>
                        </div>
                      </Col>

                      {/* Make Best Offer / Activate-Deactivate button */}
                      <Col
                        xxl={isCarOwner ? 6 : 5}
                        lg={12}
                        sm={6}
                        xs={6}
                        className={`text-center ${isCarOwner ? "col-6" : ""}`}
                      >
                        <div className="bestOffers">
                          {isCarOwner ? (
                            // Show Activate/Deactivate button based on car's active status
                            carActiveStatus === false ? (
                              <button
                                type="button"
                                className="offerHere fSize-4 fw-bold py-3 px-4"
                                style={{ backgroundColor: '#16A34A', color: '#fff', border: 'none' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleActivateClick();
                                }}
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="offerHere fSize-4 fw-bold py-3 px-4 deactivateBtn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeactivateClick(car?.id || car?._id);
                                }}
                              >
                                Deactivate
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              className="offerHere fSize-4 fw-bold py-3 px-4 offerBtnMain"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePrepareOfferData();
                              }}
                            >
                              Make Best Offer
                            </button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="crnrImg-sx-th">
                    <div className="position-relative">
                      <img src="/images/shihiting.png" alt="" className="" />
                      <Link href="" className="setting__whishlist">
                        <img
                          src="/assets/img/whishlist.png"
                          className="whishlist__like mb-2"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="carListId rounded mt-4 d-flex align-items-center justify-content-center gap-5">
                  <div>
                    <span className="fw-normal">
                      Car Listing ID:{carListingId}
                      {/* <span className="bol-ter">CLID: </span> */}
                    </span>
                  </div>
                </div>
                <div className="shareFriend mt-2 mt-md-4 d-flex align-items-center justify-content-center gap-3 py-3 px-md-0 px-2">
                  <div>
                    <span className="fSize-4 fw-normal">
                      Share with a friend :
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <Link href="">
                      <img
                        src="/images/facebookShare.png"
                        alt=""
                        className=""
                        width={20}
                      />
                    </Link>
                    <Link href="">
                      <img src="/images/Xshare.png" alt="" width={18} />
                    </Link>
                    <Link href="">
                      <img src="/images/insta.png" alt="" width={18} />
                    </Link>
                    <Link href="">
                      <img src="/images/msgShare.png" alt="" width={20} />
                    </Link>
                  </div>
                </div>
              </div>
              {/* End Mobile Sidebar */}
              
              <div className="overview_sections mt-md-0 mt-4">
                {/* Car overview section  */}
                <div className="mt-3 mb-3">
                  <Col xs={12} className="">
                    <div className="hdTile pb-2">
                      <h6 className="fsSize-7-5 fw-bold">Vehicle Summary</h6>
                    </div>
                  </Col>

                  <Row className="carOverView mobileResponsive m-0 py-4 px-3">
                    <Col xs={6} lg={4} className="pb-3">
                      <div className="card__inner mobile_res d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/reg-years-icon.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            Mfg. Year
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {displayMonthYear(
                              transformedCar.mfgYearLabel || transformedCar.mfgYear,  // string label ya number
                              transformedCar.mfgYear,                                  // number (agar hai)
                              transformedCar.mfgMonth                                  // 1..12 (agar hai)
                            )}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={6} lg={4} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/reg-years-icon.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            Reg. Year
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {displayMonthYear(
                              transformedCar.yearLabel || transformedCar.year,         // DB ka "year" string ho sakta hai
                              transformedCar.regYear ?? transformedCar.year,           // number fallback
                              transformedCar.regMonth                                  // 1..12
                            )}
                          </p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} xs={6} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/Transmission.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            Transmission
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.transmission || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} xs={6}  className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/fuelboat.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            ⁠Fuel Type
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.fuel || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} xs={6} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/kms.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            ⁠KMs Driven
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.kmDriven && transformedCar.kmDriven !== '0' ?
                              `${Number(transformedCar.kmDriven).toLocaleString('en-US')} km` :
                              'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} xs={6} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/theowner.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            OwnerShip
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.own || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} xs={6} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/regnumber.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            ⁠Reg. Number
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.registrationNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} xs={6} className="pb-3">
                      <div className="card__inner mobile_res  d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/key.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            Spare Key
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.spareKey || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4}  className="pb-3">
                      <div className="card__inner   d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/engine.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            Engine Capacity
                          </span>
                          <p className="text-white fSize-4 fw-semibold m-0">
                            {transformedCar.engineCapacity || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} className="pb-3">
                      <div className="card__inner   d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/insurenceandvara.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="text-white fSize-2 pb-1 fw-medium m-0 text-uppercase">
                            ⁠Insurance
                          </span>
                          {/* <p className="text-white fSize-4 fw-semibold m-0">
                          1197cc
                        </p> */}
                          <div className="d-flex gap-md-3 gap-1 align-items-center flex-wrap">
                            <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                              <FontAwesomeIcon icon={faCheck} /> {transformedCar.insurance || 'No'}
                            </button>
                            {(transformedCar.insurance === 'Yes' || transformedCar.insurance === 'Expired') && (
                              <>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {transformedCar.insuranceType || 'N/A'}
                                </span>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {transformedCar.insuranceDate ? new Date(transformedCar.insuranceDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} className="pb-3">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img
                            src="/assets/img/insurenceandvara.png"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">
                            ⁠Warranty
                          </span>
                          <div className="d-flex gap-3 align-items-center">
                            <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                              <FontAwesomeIcon icon={faCheck} /> {transformedCar.warranty || 'No'}
                            </button>
                            {transformedCar.warranty === 'Yes' && (
                              <>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {transformedCar.warrantyType || 'N/A'}
                                </span>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {transformedCar.warrantyDate ? new Date(transformedCar.warrantyDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* Car overview section  */}

                {/* inspections car sections  */}
                <div className="inspectionSections mt-md-2 mt-1 p-md-3 p-0" id="Inspection">
                  <Col xs={12} className="pb-2">
                    <div className="hdTile pb-3">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h6 className="fsSize-7-5 fw-bold mb-0">
                          Car Ka Bhar<span className="acc-osa fw-semibold">osa</span> Report
                        </h6>
                        <div className="mt-sm-0 mt-1">
                          <Image src="/assets/img/motorepologo.png" width="120" height="30" className="object-fit-contain" alt="Motor Report Logo" />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <div className="cars_inspection inspection-wrapper locked">
                    <div className="d-flex align-items-center gap-2 mobileres pb-3">
                      <div className="report__chips fSize-3 fw-medium py-2 px-2 d-flex align-items-center gap-1">
                        <FaCarCrash size={15} color="#fff" />
                        <span className="text-white">No accident history</span>
                      </div>

                      <div className="report__chips fSize-3 fw-medium py-2 px-2 d-flex align-items-center gap-1">
                        <FaTachometerAlt size={15} color="#fff" />
                        <span className="text-white">No odometer tampering</span>
                      </div>

                      <div className="report__chips fSize-3 fw-medium py-2 px-2 d-flex align-items-center gap-1">
                        <FaTint size={15} color="#fff" />
                        <span className="text-white">No water damages</span>
                      </div>
                    </div>
                    <InspectionReport />
                    <div className="lock-overlay" aria-hidden="true">
                      <div className="lock-center">
                        <div className="lock-circle" role="img" aria-label="locked">
                          <FaLock size={28} />
                        </div>
                        <div className="lock-text">
                          <div className="view-line">Get peace of mind before you buy.</div>
                          <div className="report-titles">Click “Raise Inspection” to initiate the process.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Row className="justify-content-between align-items-center p-2">
                    <Col xl={7}>
                      <div className="qualityCheck d-flex align-items-center gap-2">
                        <img
                          src="/assets/img/point-inspections.png"
                          alt=""
                          width={18}

                        />{" "}
                        <p className="fSize-3 m-0 fw-semibold">
                          250-Point Inspected & Certified for Quality by CAROSA
                        </p>
                      </div>
                    </Col>
                    <Col xl={4}>
                      <div className="viewInspectionReportBtn d-flex justify-content-end">
                        <button
                          onClick={() => setShowRaiseInspectionModal(true)}
                          className="in-peton-btn fSize-4 fw-bold text-white py-2 px-4 rounded-2 border-0"
                          style={{ cursor: 'pointer' }}
                        >
                          {/* View inspection report */}
                          Raise Inspection
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* inspections car sections  */}

                {/* Highlights of This Car sections  */}
                {dynamicHighlights.length > 0 && (
                  <div className="higlightsCars rounded-2 mt-4 p-3">
                    <div className="hdTile pb-3">
                      <h6 className="text-white fsSize-7-5 fw-bold">
                        Highlights of This Car
                      </h6>
                    </div>
                    <Row>
                      {dynamicHighlights.map((item, index) => (
                        <Col xl={4} xs={6} key={item.id || index} className="pb-4">
                          <div className="higlightsCarsCard d-flex justify-content-center align-items-center flex-column">
                            <div className="higlightImg rounded-circle bg-white d-flex justify-content-center align-items-center mb-2">
                              <img
                                src={item.img || "/assets/img/repaintedcar.png"}
                                alt={item.heading}
                                width={14}
                              />
                            </div>
                            <h6 className="text-white fsizeSet2 fSize-4 fw-semibold">
                              {item.heading}
                            </h6>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                {/* Highlights of This Car sections  */}

                {/* Features and specs section  */}
                {/* <div className="featuresSections rounded-2 mt-4 p-3" id="Features">
                <div className="hdTile pb-3">
                  <h6 className="text-white fsSize-7-5 fw-bold">
                    Features and specs
                  </h6>
                </div>
                <Row className="justify-content-center">
                  <Col xl={11}>
                    <div className="featureInputField position-relative">
                      <Form.Group className="" controlId="">
                        <Form.Control
                          className="featureFill"
                          type="email"
                          placeholder="Search for features or specs"
                        />
                      </Form.Group>
                      <div className="searchBtn">
                        <button
                          type="btn"
                          className="border-0 outline-none bg-white fSize-3 fw-medium"
                        >
                          <img
                            src="/images/Search.png"
                            className="me-2"
                            alt=""
                            width={12}
                          />{" "}
                          Search
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="pt-3">
                  <Col xl={3}>
                    <div className="featuresLiks d-flex flex-column">
                      <Link
                        href=""
                        className="mb-3 pb-1 features fSize-4 fw-medium"
                      >
                        Features
                      </Link>
                      <Link
                        href=""
                        className="specifications pb-1 fSize-4 fw-medium text-white"
                      >
                        Specifications
                      </Link>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/steering.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Steering Mounted Controls
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/airbag.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Airbags
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/ebd.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          EBD - Electronic Brakeforce Distribution
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/central.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Central Locking
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/bluetooth.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Bluetooth Compatibility
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/abs.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          ABS - Anti-lock Braking System
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/airconditions.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Air Conditioner
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 pb-3">
                        <img
                          src="/assets/img/rearDefoger.png"
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="m-0 text-white fSize-2 fw-semibold text-wrap overflow-visible text-overflow-unset">
                          Rear Defogger
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8}>
                    <p className="m-0 fSize-4 fw-normal text-white text-wrap overflow-hedden text-overflow-unset">
                      Features and specifications bring superior driving
                      experience and comfort.
                    </p>
                  </Col>
                  <Col xl={4}>
                    <div className="viewInspectionReportBtn d-flex justify-content-end">
                      <Link
                        href=""
                        className="in-peton-btn fSize-2 fw-medium text-white py-2 px-5 rounded-2"
                      >
                        View all
                      </Link>
                    </div>
                  </Col>
                </Row>
              </div> */}
                {/* Features and specs section  */}
                <ServiceRecords />

                <AccordionList />

                <CarosaKaBharosa />

                <CarosaLoanCalculator 
                  sellingPrice={transformedCar.listingPrice || 893000} 
                  onEMIChange={(emi) => setCalculatedEMI(emi)}
                />

              </div>
            </Col>
            <Col lg={4} className="position-relative d-none d-lg-block" >
             <div className="sticy_postionSet">
               <div className="carDetailsMainParent p-3 rounded-4 bg-white position-relative">
                <h2 className=" fw-bold mb-1 mobile_fonts widthSet">{year} {brand} {model}</h2>
                {/* <p className="fSize-3 fw-normal  mb-3">Trim</p> */}

                <div className="aboutCar d-flex flex-wrap gap-1 align-items-baseline mb-4 mt-3">
                  <div className="km">
                    <Link
                      href=""
                      className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                    >
                      {transformedCar.kmDriven ? `${Number(String(transformedCar.kmDriven).replace(/\D/g, "")).toLocaleString()} km` : "N/A"}
                    </Link>
                  </div>
                  <div className="owner">
                    <Link
                      href=""
                      className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                    >
                      {transformedCar.own || 'N/A'} Owner
                    </Link>
                  </div>
                  <div className="petrol">
                    <Link
                      href=""
                      className="aboutCarTab py-1 px-3 rounded-4 fSize-3 fw-semibold"
                    >
                      {transformedCar.fuel || 'N/A'}
                    </Link>
                  </div>
                  <div className="automatic">
                    <Link
                      href=""
                      className="aboutCarTab py-1 px-2 rounded-4 fSize-3 fw-semibold"
                    >
                      {transformedCar.transmission || 'N/A'}
                    </Link>
                  </div>
                </div>

                {platform && (
                  <div className="viewCarosaBisk border-bottom pb-4 d-flex align-items-center gap-2">
                    <span className="text-white m-0 py-1 px-3 fSize-4 fw-medium">
                      <Image
                        src="/assets/img/tik.png"
                        alt=""
                        width={16}
                        height={16}
                        className="me-2 viewCarosaBisk"
                      />
                      {platform}
                    </span>
                    {/* <span className="text-white m-0 py-1 px-3 fSize-4 fw-medium">
                      <Image src="/assets/img/certifierd.png" alt="" width={16} height={16} className="me-2 viewCarosaBisk " />
                      Certified Cars
                    </span> */}
                  </div>
                )}

                <div className="deliveryLocation d-flex justify-content-between align-items-center border-bottom pt-3 pb-4">
                  <div className="HomeTest">
                    <p className="m-0 fSize-3 fw-normal pb-2">
                      Home Test Drive:
                    </p>
                    <h6 className="m-0 fSize-3 fw-bold">N/A</h6>
                  </div>
                  <div className="deliveryCenter">
                    <p className="m-0 fSize-3 fw-normal pb-2">
                      Drive Hub Location
                    </p>
                    <h6 className="m-0 fSize-3 fw-bold">
                      Shakti Nagar, Delhi
                    </h6>
                  </div>
                </div>
                {/* <div className="d-flex gap-4 my-3">
                  <div>
                    <div className="">Usage</div>
                    <div className="">{usageMiles} km</div>
                  </div>
                  <div>
                    <div className="">Fuel/Type</div>
                    <div className="">{vehicleType}</div>
                  </div>
                  <div>
                    <div className="">Transmission</div>
                    <div className="">{vehicleType}</div>
                  </div>
                </div> */}
                <div className="PriceArea d-flex align-items-center justify-content-between pt-3 pb-4">
                  <div className="roadPrice position-relative">
                    <p className="m-0 fSize-2 fw-semibold pb-2">
                      Selling price
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="m-0 fsSize-7-5 fw-bold position-relative mobile_fonts">{transformedCar.price} <span></span></h6>
                      <div
                        className="price-info-icon d-flex align-items-center justify-content-center"
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid #000",
                          borderRadius: "50%",
                          fontSize: "12px",
                          color: "black",
                          marginTop: "-14px",
                          cursor: "pointer"
                        }}
                        onMouseEnter={() => setShowCostsTooltip(true)}
                        onMouseLeave={() => setShowCostsTooltip(false)}
                      >
                        i
                      </div>

                      {/* Additional Costs & Services Tooltip */}
                      {showCostsTooltip && (
                        <div className="additional-costs-tooltip">
                          <div className="additional-costs-header">
                            <h6 className="mb-2 fSize-4 fw-bold">Additional Costs & Services</h6>
                          </div>
                          <div className="additional-costs-content">
                            <div className="cost-item">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="cost-label">RC / NOC Transfer Charges:</span>
                                <span className="cost-value">₹5,000*</span>
                              </div>
                            </div>
                            {/* <div className="cost-item">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="cost-label">Insurance:</span>
                                <span className="cost-value">Starting from ₹5,000*</span>
                              </div>
                            </div>
                            <div className="cost-item">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="cost-label">Refurbishment Cost:</span>
                                <span className="cost-value">₹12,000*</span>
                              </div>
                            </div>
                            <div className="cost-item">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="cost-label">Pending Challan:</span>
                                <span className="cost-value">₹12,000*</span>
                              </div>
                            </div> */}
                          </div>
                          <div className="additional-costs-notes">
                            <p className="m-0 fSize-2 fw-normal mb-1">
                              <span className="fw-semibold">Note:</span>
                            </p>
                            <ul className="m-0 ps-1">
                              <li className="fSize-2 fw-normal">
                                RC Transfer / NOC charges may vary depending on your location and respective RTO.
                              </li>
                              <li className="fSize-2 fw-normal">
                                Insurance premium is based on vehicle inspection and the type of coverage selected.
                              </li>
                              <li className="fSize-2 fw-normal">
                                Refurbishment cost is indicative and may change based on actual vehicle condition and part requirements.
                              </li>
                              <li className="fSize-2 fw-normal">
                                Pending challan amount is subject to verification from the RTO and traffic authority portals.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center flex-column">
                    <div className="validTill d-flex align-items-center gap-2">
                      {/* <p className="m-0 fSize-3 fw-semibold text-decoration-line-through">
                        ₹ 15,207
                      </p> */}

                      <div className="fSize-5 fw-normal">
                        <p className="mb-0 fSize-3 fw-semibold">EMI Start From</p>
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          style={{ width: 12, height: 16 }}
                        />{" "}
                        {calculatedEMI > 0 ? new Intl.NumberFormat('en-IN').format(calculatedEMI) : '10,479'}/m
                      </div>
                    </div>
                    {/* <p className="m-0 fSize-3 fw-normal validParagrapg d-flex justify-content-end w-100">
                      Valid till 11th Aug
                    </p> */}
                  </div>
                </div>
                <div>
                  <Row className="getCallBack align-items-center g-lg-0">
                    {/* Get Call Back button - Only show for non-owners */}
                    {!isCarOwner && (
                      <Col xxl={3} lg={6} className="mb-xxl-0 mb-1 col-12 mobilepostion">
                        <div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenCallModal();
                            }}
                            className="border-0 bg-transparent p-0 text-dark text-decoration-none fSize-2 fw-semibold d-flex align-items-center gap-1 position-callBack"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="outerPart">
                              <div className="phoneIcon d-flex justify-content-center align-items-center">
                                <FontAwesomeIcon icon={faPhone} size="15" className="text-white" />
                              </div>
                            </div>
                            <p className="m-0 fSize-2 fw-semibold d-lg-block d-none">Get call back</p>
                          </button>
                        </div>
                      </Col>
                    )}

                    {/* Book Now / Edit button */}
                    <Col
                      xxl={isCarOwner ? 6 : 4}
                      lg={isCarOwner ? 6 : 6}
                      sm={6}
                      xs={6}
                      className={`text-center mb-xxl-0 mb-1 ${isCarOwner ? "col-6" : ""}`}
                    >
                      <div className="bookBtn">
                        <button
                          type="button"
                          className={`bookHere fSize-4 fw-bold py-2 px-4 ${isCarOwner
                            ? "editBtn"
                            : "bookBtnMain"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isCarOwner) {
                              handleEditCar();
                            } else {
                              handleOpenBookModal();
                            }
                          }}
                        >
                          {isCarOwner
                            ? "Edit"
                            : "Book Now"}
                        </button>
                      </div>
                    </Col>

                    {/* Make Best Offer / Activate-Deactivate button */}
                    <Col
                      xxl={isCarOwner ? 6 : 5}
                      lg={12}
                      sm={6}
                      xs={6}
                      className={`text-center ${isCarOwner ? "col-6" : ""}`}
                    >
                      <div className="bestOffers">
                        {isCarOwner ? (
                          // Show Activate/Deactivate button based on car's active status
                          carActiveStatus === false ? (
                            <button
                              type="button"
                              className="offerHere fSize-4 fw-bold py-3 px-4"
                              style={{ backgroundColor: '#16A34A', color: '#fff', border: 'none' }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleActivateClick();
                              }}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="offerHere fSize-4 fw-bold py-3 px-4 deactivateBtn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeactivateClick(car?.id || car?._id);
                              }}
                            >
                              Deactivate
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            className="offerHere fSize-4 fw-bold py-3 w-100 px-4 offerBtnMain"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePrepareOfferData();
                            }}
                          >
                            Make Best Offer
                          </button>
                        )}
                      </div>
                    </Col>

                  </Row>
                </div>

                {/* <div className="d-flex align-items-end justify-content-between">
                  <div>
                    <div className=" fw-bold fSize-6">{price}</div>
                    <div className=" fSize-2">+ {charges}</div>
                </div>
                </div>

                <div className="mt-4 d-flex gap-3">
                  <button className="btn btn-primary">Contact Seller</button>
                  <button className="btn btn-outline-light">
                    Add to Wishlist
                  </button>
                </div> */}
                <div className="crnrImg-sx-th">
                  <div className="position-relative">
                    <img src="/images/shihiting.png" alt="" className="" />
                    <Link href="" className="setting__whishlist">
                      <img
                        src="/assets/img/whishlist.png"
                        className="whishlist__like mb-2"
                      />
                      {/* <p className="m-0 text-white">(0)</p>
                      <span className="fSize-1 fw-bold text-white">shortlisted</span> */}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="carListId rounded mt-4 d-flex align-items-center justify-content-center gap-5">
                <div>
                  <span className="fw-normal">
                    Car Listing ID: <span className="bol-ter">{carListingId}</span>
                    {/* <span className="bol-ter">CLID: </span> */}
                  </span>
                </div>
              </div>
              <div className="shareFriend mt-2 mt-md-4 d-flex align-items-center justify-content-center gap-3 py-3 px-md-0 px-2">
                <div>
                  <span className="fSize-4 fw-normal">
                    Share with a friend :
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Link href="">
                    <img
                      src="/images/facebookShare.png"
                      alt=""
                      className=""
                      width={20}
                    />
                  </Link>
                  <Link href="">
                    <img src="/images/Xshare.png" alt="" width={18} />
                  </Link>
                  <Link href="">
                    <img src="/images/insta.png" alt="" width={18} />
                  </Link>
                  <Link href="">
                    <img src="/images/msgShare.png" alt="" width={20} />
                  </Link>
                </div>
              </div>
             </div>
            </Col>
          </Row>

        </Container>
      </section>
      {/* explore car collections  */}
      <div className="for__positioning">
        <ExploreOurFullCollection />
      </div>

      {/* explore car collections  */}

      {/* stori bharosa  */}
      <Stories />
      {/* stori bharosa  */}

      {/* explore car here  */}
      <MoreExplore />
      {/* explore car here  */}

      {/* assistance  */}
      <AskAssistance />
      {/* assistance  */}
      <BookKnowModal 
        show={showBookModal} 
        handleClose={handleCloseBookModal}
        carDetails={{
          name: car?.name || `${transformedCar?.brand || ''} ${transformedCar?.modal || ''}`.trim() || 'Car',
          sellingPrice: transformedCar?.price || '₹0',
          bookingAmount: `₹ ${BOOKING_AMOUNT}`,
          image: transformedCar?.image || '/images/default-car.jpg',
          carId: car?.id || car?._id || null
        }}
        car={car}
        carId={car?.id || car?._id || null}
      />
      <GetCallBackModal
        show={showCallModal}
        onHide={handleCloseCallModal}
        phoneNumber="+91-9090909090"
        car={car}
      />
      <DeactivateListingModal
        show={showDeactivateModal}
        onHide={handleCloseDeactivateModal}
        onConfirm={handleConfirmDeactivate}
      />
      <RaiseInspectionModal
        show={showRaiseInspectionModal}
        onClose={() => setShowRaiseInspectionModal(false)}
        onPaymentSuccess={(packageType) => {
          setSelectedPackage(packageType);
          setShowThankYouModal(true);
        }}
      />
      <ThankYouModal
        show={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        onScheduleInspection={() => {
          setShowThankYouModal(false);
          setShowScheduleModal(true);
        }}
        packageType={selectedPackage}
      />
      <ScheduleInspectionModal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirm={(formData) => {
          console.log('Inspection scheduled:', formData);
          // Here you can add API call to save the inspection schedule
        }}
      />
    </>
  );
}
