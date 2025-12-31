"use client";

import React, { useState, useEffect } from 'react';
import CongratsCard from './CongratsCard';
import CarService from '../../services/carService';
import { API_BASE_URL } from '../../config/environment';
import { safeParseCustomFields } from '@/utils/jsonUtils';
import { useAuthStore } from '@/store/authStore';
import Pagination from '@/components/common/Pagination';
import DeactivateListingModal from '@/components/modals/DeactivateListingModal';
import UpdatePriceModal from '@/components/modals/UpdatePriceModal';
import OffersModal from '@/components/modals/OffersModal';
import TestDriveModal from '@/components/modals/TestDriveModal';
import Link from "next/link";

// Removed dummy data - all data will be fetched dynamically from API
function SellBadge({children, variant='active'}){
  const styles = {
    active: {background:'#16A34A', color:'#fff'},
    inactive: {background:'#DC2626', color:'#fff'},
    certified: {background:'#16A34A', color:'#fff'},
    offers: {background:'#F3FFF3', color:'#16A34A', border:'2px solid #8ED47A'}
  };
  return (
    <span className="dv2-sell-badge" style={styles[variant]}>
      {variant==='certified' && '✓ '}{children}
    </span>
  );
}

function SellButton({children, variant='view', onClick}){
  const styles = {
    view: {background:'#16A34A', color:'#fff'},
    edit: {background:'#1D61E7', color:'#fff'},
    deactivate: {background:'#DC2626', color:'#fff'},
    inspection: {background:'#16A34A', color:'#fff'},
    update: {background:'#7C3AED', color:'#fff'}
  };
  return (
    <button 
      className="dv2-sell-btn" 
      style={styles[variant]}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Car Card Component
function CarCard({ car, onEditListing, onDeactivate, onActivate, onUpdatePrice, onShowOffers, onShowTestDrives }) {
  // Debug: Log car data to help identify image issues
  useEffect(() => {
    console.log('SellList - Car data:', car);
    console.log('SellList - CarImages:', car?.CarImages);
    console.log('SellList - CarImages count:', car?.CarImages?.length || 0);
    if (car?.CarImages && car.CarImages.length > 0) {
      console.log('SellList - First image URL:', car.CarImages[0].url);
      console.log('SellList - Full image URL:', `${API_BASE_URL}${car.CarImages[0].url}`);
    }
  }, [car]);
  
  // Helper function to generate URL slug for car detail page
  const slugify = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Generate car detail page URL
  const getCarDetailUrl = (car) => {
    if (!car || !car.id) return "/recentCar";
    
    // Generate slug from car name, or make+model if name is not available
    const slugSource = car.name || `${car.make || ""} ${car.model || ""}`.trim() || "car";
    const slug = slugify(slugSource);
    
    return `/recentCar/${car.id}/${slug}`;
  };
  
  // Extract data from customFields - handle nested structure safely
  const extractedCustomFields = safeParseCustomFields(car);
  
  const kmDriven = extractedCustomFields.kmDriven || extractedCustomFields.km || '0';
  
  // Check both extractedCustomFields and top-level car object for prices
  const listingPrice = extractedCustomFields.listingPrice !== undefined ? extractedCustomFields.listingPrice :
                      extractedCustomFields.listing_price !== undefined ? extractedCustomFields.listing_price :
                      extractedCustomFields.listPrice !== undefined ? extractedCustomFields.listPrice :
                      extractedCustomFields.list_price !== undefined ? extractedCustomFields.list_price :
                      car.listingPrice !== undefined ? car.listingPrice :
                      car.listing_price !== undefined ? car.listing_price :
                      0;
  const offerPrice = extractedCustomFields.offerPrice !== undefined ? extractedCustomFields.offerPrice :
                    extractedCustomFields.offer_price !== undefined ? extractedCustomFields.offer_price :
                    car.offerPrice !== undefined ? car.offerPrice :
                    car.offer_price !== undefined ? car.offer_price :
                    0;
  const isCertified = extractedCustomFields.isCertified || false;
  // Use dynamically fetched offersCount from car object (set during fetchCars)
  // Fallback to 0 if not available
  const offersCount = car?.offersCount ?? 0;
  // Use testDrivesCount from API response (set by backend)
  // Fallback to checking various fields for backward compatibility
  const testDriveCount = car?.testDrivesCount ??
    (Array.isArray(car?.TestDrive) ? car.TestDrive.length : 0) ??
    (Array.isArray(extractedCustomFields.testDriveList) ? extractedCustomFields.testDriveList.length : 0) ??
    (Array.isArray(extractedCustomFields.testDriveRequests) ? extractedCustomFields.testDriveRequests.length : 0) ??
    extractedCustomFields.totalTestDrives ??
    extractedCustomFields.testDrivesCount ??
    extractedCustomFields.testDrives ??
    car?.totalTestDrives ??
    car?.testDrives ??
    0;
  
  // Format prices to show format like ₹8.93 Lakh, ₹7.93 Lakh
 const formatPrice = (price) => {
  // Handle different price formats
  let numPrice;
  if (typeof price === 'string') {
    // Remove any currency symbols and commas
    const cleanPrice = price.replace(/[₹,]/g, '').trim();
    numPrice = parseFloat(cleanPrice);
  } else if (typeof price === 'number') {
    numPrice = price;
  } else {
    numPrice = parseFloat(price);
  }

  if (isNaN(numPrice)) {
    return '₹0';
  }

  // Format in Indian numbering system (1,20,000)
  return `₹${numPrice.toLocaleString("en-IN")}`;
};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="card dv2-card p-3 mb-4 position-relative">
      {/* Congrats Card - Positioned Absolutely */}
      {/* <div className="dv2-congrats-position">
        <CongratsCard />
      </div> */}

      <div className="row g-3">
        {/* Car Image */}
        <div className="col-12 col-md-4">
          <div className="position-relative h-100">
            <div className="dv2-sellimg-wrapper h-100">
              <img 
                src={car.CarImages && car.CarImages.length > 0 ? `${API_BASE_URL}${car.CarImages[0].url}` : "/assets/carImage/exterior3.avif"} 
                alt={car.name || "car"} 
                className="w-100 h-100 object-fit-cover rounded" 
              />
            </div>
            {/* <div className="dv2-fresh-badge">
              <span className="dv2-fresh-text">Fresh • Verified</span>
            </div> */}
          </div>
        </div>

        {/* Car Details */}
        <div className="col-12 col-md-8">
          <div className="d-flex flex-column h-100">
            {/* Title and DID */}
            <div className="mb-3">
              <h4 className="dv2-sell-title fw-bold mb-1">
                {car.name || 'Unknown Car'}
              </h4>
              <div className="dv2-did text-muted"><span className='fw-semibold'>CLID:</span> {car.id || 'N/A'}</div>
              <div className="dv2-did text-muted"><span className='fw-semibold'>Reg.No:</span> {extractedCustomFields.registrationNumber ||
                              extractedCustomFields.regNumber ||
                              "N/A"}
                         
                         </div>
            </div>

            {/* Status Badges */}
            {isCertified && <SellBadge variant="certified">Certified Cars</SellBadge>}
            <div className="d-flex flex-wrap gap-2 mb-3 position_desktops">
              {extractedCustomFields.isActive === false ? (
                <SellBadge variant="inactive">Inactive</SellBadge>
              ) : (
                <SellBadge variant="active">Active</SellBadge>
              )}
            

             <button className="btns_offers" onClick={() => onShowOffers?.(car)}>
               {offersCount} Offers
             </button>
             <button className="btns_offers testDrive" onClick={() => onShowTestDrives?.(car)}>
               {testDriveCount} Test Drive
             </button>
        
    
            </div>

            {/* Timestamps */}
            <div className="dv2-timestamps mb-4">
              <div className="dv2-timestamp">
                <span className="text-muted">Active Since:</span>
                <span className="ms-1">{formatDate(car.createdAt)}</span>
              </div>
              <div className="dv2-timestamp">
                <span className="text-muted">Last Modified:</span>
                <span className="ms-1">{formatDate(car.updatedAt)}</span>
              </div>
            </div>

            {/* Price Info */}
            <div className="dv2-price-info mb-4">
              <div className="d-flex gap-4">
                <div>
                  <span className="text-muted">Selling Price:</span>
                  <span className="ms-2 fw-bold dv2-price">{formatPrice(listingPrice)}</span>
                </div>
                <div>
                  <span className="text-muted">Listing Price:</span>
                  <span className="ms-2 fw-bold dv2-price">{formatPrice(offerPrice)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="d-flex gap-2 dv2-sell-buttons">
               
                <SellButton variant="view"> <Link href={getCarDetailUrl(car)} className='text-white' >View Listing</Link></SellButton>
                <SellButton variant="edit" onClick={() => onEditListing(car)}>Edit Listing</SellButton>
                {extractedCustomFields.isActive === false ? (
                  <SellButton variant="inspection" onClick={() => onActivate(car.id)}>Activate</SellButton>
                ) : (
                  <SellButton variant="deactivate" onClick={() => onDeactivate(car.id)}>Deactivate</SellButton>
                )}
                <SellButton variant="inspection">Raise Inspection</SellButton>
                <SellButton variant="update" onClick={() => onUpdatePrice(car)}>Update Price</SellButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellList(){
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();
  
  // Backend pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paginationMeta, setPaginationMeta] = useState(null);
  
  // Modal states
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [offersModalData, setOffersModalData] = useState(null);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveModalData, setTestDriveModalData] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // If user is a dealer, don't show anything in normal user dashboard
        if (isAuthenticated && user?.role === 'Dealer') {
          setCars([]);
          setPaginationMeta(null);
          setLoading(false);
          return;
        }
        
        // Pass pagination params to backend
        const result = await CarService.getMyCars({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (result.success) {
          const carsData = result.data || [];
          
          // Fetch offers count for each car
          const carsWithOffersCount = await Promise.all(
            carsData.map(async (car) => {
              try {
                const offersResult = await CarService.getOffersForCar(car.id);
                if (offersResult.success && Array.isArray(offersResult.data)) {
                  // Count unique buyers (deals) for this car
                  const offersCount = offersResult.data.length;
                  return {
                    ...car,
                    offersCount: offersCount,
                    _offersData: offersResult.data // Store offers data for modal
                  };
                }
                return {
                  ...car,
                  offersCount: 0,
                  _offersData: []
                };
              } catch (error) {
                console.error(`Error fetching offers for car ${car.id}:`, error);
                return {
                  ...car,
                  offersCount: 0,
                  _offersData: []
                };
              }
            })
          );
          
          setCars(carsWithOffersCount);
          setPaginationMeta(result.meta || null);
        } else {
          setError(result.message);
          setCars([]);
          setPaginationMeta(null);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to load cars');
        setCars([]);
        setPaginationMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [isAuthenticated, user?.role, currentPage]);

  // Handler functions
  const handleEditListing = (car) => {
    window.location.href = `/RegistrationYourCar?editId=${car.id}`;
  };

  const handleDeactivateClick = (carId) => {
    setSelectedCarId(carId);
    setShowDeactivateModal(true);
  };

  const handleCloseDeactivateModal = () => {
    setShowDeactivateModal(false);
    setSelectedCarId(null);
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedCarId) return;
    
    try {
      setLoading(true);
      const result = await CarService.updateCar(selectedCarId, {
        customFields: {
          isActive: false
        }
      });

      if (result.success) {
        // Refresh the car list
        const refreshResult = await CarService.getMyCars({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (refreshResult.success) {
          setCars(refreshResult.data || []);
          setPaginationMeta(refreshResult.meta || null);
        }
        setShowDeactivateModal(false);
        setSelectedCarId(null);
      } else {
        setError(result.message || "Failed to deactivate listing");
      }
    } catch (err) {
      console.error("Error deactivating car:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateClick = async (carId) => {
    if (!carId) return;
    
    try {
      setLoading(true);
      const result = await CarService.updateCar(carId, {
        customFields: {
          isActive: true
        }
      });

      if (result.success) {
        // Refresh the car list
        const refreshResult = await CarService.getMyCars({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (refreshResult.success) {
          setCars(refreshResult.data || []);
          setPaginationMeta(refreshResult.meta || null);
        }
      } else {
        setError(result.message || "Failed to activate listing");
      }
    } catch (err) {
      console.error("Error activating car:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdatePrice = (car) => {
    setSelectedCar(car);
    setShowUpdatePriceModal(true);
  };

  const handleCloseUpdatePrice = () => {
    setShowUpdatePriceModal(false);
    setSelectedCar(null);
  };

  const handleConfirmUpdatePrice = async (prices) => {
    if (!selectedCar?.id) return;

    try {
      setLoading(true);
      
      // Parse prices: remove ₹ symbol, commas, and convert to number
      const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        const cleanPrice = String(priceStr)
          .replace(/₹/g, "")
          .replace(/,/g, "")
          .replace(/\s+/g, "")
          .trim();
        const num = parseFloat(cleanPrice);
        return Number.isFinite(num) ? num : 0;
      };

      const listingPriceNum = parsePrice(prices.listingPrice);
      const offerPriceNum = parsePrice(prices.offerPrice);

      const result = await CarService.updateCar(selectedCar.id, {
        customFields: {
          listingPrice: listingPriceNum,
          offerPrice: offerPriceNum
        }
      });

      if (result.success) {
        // Refresh the car list
        const refreshResult = await CarService.getMyCars({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (refreshResult.success) {
          setCars(refreshResult.data || []);
          setPaginationMeta(refreshResult.meta || null);
        }
        setShowUpdatePriceModal(false);
        setSelectedCar(null);
      } else {
        setError(result.message || "Failed to update prices");
      }
    } catch (err) {
      console.error("Error updating prices:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatOfferPrice = (value) => {
    if (value === null || value === undefined || value === '') return '₹0';
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    const stringValue = String(value).trim();
    if (!stringValue) return '₹0';
    return stringValue.includes('₹') ? stringValue : `₹${stringValue}`;
  };

  const formatTestDriveSlot = (value, index) => {
    if (!value) return `Slot ${index + 1}`;
    return String(value);
  };

  const handleShowOffersModal = async (car) => {
    if (!car || !car.id) return;
    
    try {
      setLoading(true);
      
      // Use cached offers data if available, otherwise fetch from API
      let offersData = car._offersData;
      
      if (!offersData || !Array.isArray(offersData)) {
        // Fetch offers from API if not cached
        const result = await CarService.getOffersForCar(car.id);
        if (result.success && result.data && Array.isArray(result.data)) {
          offersData = result.data;
        } else {
          offersData = [];
        }
      }
      
      // Transform API response to match OffersModal structure
      // Each deal represents one buyer, and we show their latest offer
      const buyersList = offersData
        .map((deal) => {
          // Get the latest negotiation (offer) for this buyer
          const latestNegotiation = deal.DealNegotiation && deal.DealNegotiation.length > 0
            ? deal.DealNegotiation[0] // Already sorted by createdAt desc
            : null;
          
          if (!latestNegotiation) return null;
          
          // Get buyer name from User object
          const buyerName = deal.User?.name || 
                           deal.User?.username || 
                           deal.User?.email?.split('@')[0] || 
                           `Buyer ${deal.User?.id || 'Unknown'}`;
          
          // Format the offer amount
          const offerAmount = latestNegotiation.amount || 0;
          const formattedPrice = formatOfferPrice(offerAmount);
          
          return {
            id: latestNegotiation.id || `offer-${deal.id}`,
            name: buyerName,
            price: formattedPrice,
            dealId: deal.id,
            negotiationId: latestNegotiation.id,
            userId: deal.User?.id,
            createdAt: latestNegotiation.createdAt,
          };
        })
        .filter(offer => offer !== null) // Remove null entries
        .sort((a, b) => {
          // Sort by creation date, newest first
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
      
      setOffersModalData({
        title: car.name || 'Unknown Car',
        did: car.id || 'N/A',
        carId: car.id,
        totalOffers: buyersList.length,
        buyers: buyersList, // Always use real data, even if empty
      });
      
      setShowOffersModal(true);
    } catch (error) {
      console.error('Error fetching offers:', error);
      // On error, show empty state (no dummy data)
      setOffersModalData({
        title: car.name || 'Unknown Car',
        did: car.id || 'N/A',
        carId: car.id,
        totalOffers: 0,
        buyers: [], // Empty array instead of dummy data
      });
      setShowOffersModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOffersModal = () => {
    setShowOffersModal(false);
    setOffersModalData(null);
  };

  const handleShowTestDriveModal = (car) => {
    if (!car) return;
    const extracted = safeParseCustomFields(car);

    const getRawTestDrives = () => {
      if (Array.isArray(extracted?.testDriveList) && extracted.testDriveList.length) return extracted.testDriveList;
      if (Array.isArray(extracted?.testDriveRequests) && extracted.testDriveRequests.length) return extracted.testDriveRequests;
      if (Array.isArray(extracted?.testDrives) && extracted.testDrives.length) return extracted.testDrives;
      if (Array.isArray(car?.testDriveList) && car.testDriveList.length) return car.testDriveList;
      if (Array.isArray(car?.testDriveRequests) && car.testDriveRequests.length) return car.testDriveRequests;
      if (Array.isArray(car?.testDrives) && car.testDrives.length) return car.testDrives;
      return [];
    };

    const normalizedRequests = getRawTestDrives().map((request, index) => ({
      id: request?.id || request?._id || `test-drive-${index}`,
      name: request?.name || request?.buyerName || request?.customerName || `Buyer ${index + 1}`,
      slot: formatTestDriveSlot(
        request?.slot ||
          request?.preferredSlot ||
          request?.time ||
          request?.schedule ||
          request?.dateTime,
        index
      ),
    }));

    // Use only real test drive data, no dummy data
    const testDriveList = normalizedRequests;

    setTestDriveModalData({
      title: car.name || 'Unknown Car',
      did: car.id || 'N/A',
      totalRequests: testDriveList.length,
      requests: testDriveList,
    });
    setShowTestDriveModal(true);
  };

  const handleCloseTestDriveModal = () => {
    setShowTestDriveModal(false);
    setTestDriveModalData(null);
  };

  if (loading) {
    return (
      <div className="dv2-selllist">
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your car listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dv2-selllist">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Cars</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="dv2-selllist">
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-car text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4 className="text-muted mb-3">No Cars Listed</h4>
          <p className="text-muted mb-4">You haven't listed any cars for sale yet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/sell'}
          >
            List Your First Car
          </button>
        </div>
      </div>
    );
  }

  // Get prices for selected car (for UpdatePriceModal)
  const getSelectedCarPrices = () => {
    if (!selectedCar) return { listingPrice: "₹0", offerPrice: "₹0" };
    
    const extractedCustomFields = safeParseCustomFields(selectedCar);
    const listingPrice = extractedCustomFields.listingPrice !== undefined ? extractedCustomFields.listingPrice :
                        extractedCustomFields.listing_price !== undefined ? extractedCustomFields.listing_price :
                        extractedCustomFields.listPrice !== undefined ? extractedCustomFields.listPrice :
                        extractedCustomFields.list_price !== undefined ? extractedCustomFields.list_price :
                        selectedCar.listingPrice !== undefined ? selectedCar.listingPrice :
                        selectedCar.listing_price !== undefined ? selectedCar.listing_price :
                        0;
    const offerPrice = extractedCustomFields.offerPrice !== undefined ? extractedCustomFields.offerPrice :
                      extractedCustomFields.offer_price !== undefined ? extractedCustomFields.offer_price :
                      selectedCar.offerPrice !== undefined ? selectedCar.offerPrice :
                      selectedCar.offer_price !== undefined ? selectedCar.offer_price :
                      0;

    return {
      listingPrice: `₹${listingPrice.toLocaleString("en-IN")}`,
      offerPrice: `₹${offerPrice.toLocaleString("en-IN")}`
    };
  };

  const selectedCarPrices = getSelectedCarPrices();

  return (
    <div className="dv2-selllist">
      {cars.map((car, index) => (
        <CarCard 
          key={car.id || `car-${index}`}
          car={car} 
          onEditListing={handleEditListing}
          onDeactivate={handleDeactivateClick}
          onActivate={handleActivateClick}
          onUpdatePrice={handleOpenUpdatePrice}
          onShowOffers={handleShowOffersModal}
          onShowTestDrives={handleShowTestDriveModal}
        />
      ))}
      
      {/* Modals - Outside the map to avoid multiple renders */}
      <DeactivateListingModal
        show={showDeactivateModal}
        onHide={handleCloseDeactivateModal}
        onConfirm={handleConfirmDeactivate}
      />
      <UpdatePriceModal
        show={showUpdatePriceModal}
        onHide={handleCloseUpdatePrice}
        onConfirm={handleConfirmUpdatePrice}
        initialListingPrice={selectedCarPrices.listingPrice}
        initialOfferPrice={selectedCarPrices.offerPrice}
      />
      <OffersModal show={showOffersModal} data={offersModalData} onClose={handleCloseOffersModal} />
      <TestDriveModal show={showTestDriveModal} data={testDriveModalData} onClose={handleCloseTestDriveModal} />
      
      {/* Backend Pagination */}
      {paginationMeta && paginationMeta.total.items > 0 && (
        <Pagination
          currentPage={paginationMeta.page || currentPage}
          totalItems={paginationMeta.total.items}
          itemsPerPage={paginationMeta.limit || itemsPerPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
