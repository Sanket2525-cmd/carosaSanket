"use client";

import React, { useState, useEffect } from 'react';
import CongratsCard from './CongratsCard';
import { useChatStore } from '@/store/chatStore';
import CarService from '@/services/carService';
import Image from "next/image";
import Link from "next/link";
import Pagination from '@/components/common/Pagination';
import { useAuthStore } from '@/store/authStore';
import { normalizeBrand } from '@/utils/brandNormalizer';
import { API_BASE_URL } from '@/config/environment';

function Pill({children, variant='primary'}){
  const cls = variant==='primary' ? 'dv2-pill dv2-pill--primary' : 'dv2-pill dv2-pill--success';
  return <span className={cls}>{children}</span>;
}

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

export default function BuyListV2(){
  const { getMessages, getChatStats } = useChatStore();
  const { user, isAuthenticated } = useAuthStore();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paginationMeta, setPaginationMeta] = useState(null);

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        setLoading(true);
        
        // For non-dealers, fetch cars where user has made offers
        if (isAuthenticated && user?.role !== 'Dealer') {
          try {
            // Fetch user's offers (deals where user is the buyer)
            const offersResult = await CarService.getDealerOffers();
            
            if (offersResult.success && Array.isArray(offersResult.data)) {
              // Extract unique cars from deals and get latest offer info
              const carMap = new Map();
              
              offersResult.data.forEach((deal) => {
                if (deal.Car) {
                  const carId = deal.Car.id;
                  
                  // Get latest negotiation (offer)
                  const latestNegotiation = deal.DealNegotiation && deal.DealNegotiation.length > 0
                    ? deal.DealNegotiation[0] // Already sorted by createdAt desc
                    : null;
                  
                  // Determine offer status
                  let offerStatus = null;
                  if (latestNegotiation) {
                    if (deal.status === 'BOOKED' || deal.status === 'COMPLETED') {
                      offerStatus = 'accepted';
                    } else if (deal.status === 'CANCELLED' || deal.status === 'REJECTED') {
                      offerStatus = 'rejected';
                    } else {
                      offerStatus = 'sent';
                    }
                  }
                  
                  // If car already exists in map, keep the one with latest offer
                  if (!carMap.has(carId) || (latestNegotiation && latestNegotiation.createdAt > (carMap.get(carId).latestOfferDate || ''))) {
                    carMap.set(carId, {
                      carId: carId,
                      carData: deal.Car,
                      offerStatus: offerStatus,
                      offerAmount: latestNegotiation?.amount || 0,
                      messageCount: deal.DealNegotiation?.length || 0,
                      hasOffer: !!latestNegotiation,
                      latestOfferDate: latestNegotiation?.createdAt || deal.createdAt
                    });
                  }
                }
              });
              
              // Convert map to array and sort by latest offer date
              const enrichedCars = Array.from(carMap.values()).sort((a, b) => {
                const dateA = new Date(a.latestOfferDate || 0);
                const dateB = new Date(b.latestOfferDate || 0);
                return dateB - dateA; // Newest first
              });
              
              setCars(enrichedCars);
              setPaginationMeta(null); // No pagination for offers list
            } else {
              setCars([]);
              setPaginationMeta(null);
            }
          } catch (error) {
            console.error('Error fetching user offers:', error);
            setCars([]);
            setPaginationMeta(null);
          } finally {
            setLoading(false);
          }
          return;
        }
        
        // Fetch cars from API with pagination (only for dealers)
        const response = await CarService.getAllCars({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        if (response && response.data && Array.isArray(response.data)) {
          const allMessages = getMessages();
          
          // Enrich each car with offer information if available
          const enrichedCars = response.data.map((carData) => {
            const carId = String(carData.id);
            const messages = allMessages[carId];
            const stats = messages ? getChatStats(carId) : null;
            const latestMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
            
            return {
              carId: carData.id,
              carData: carData,
              offerStatus: latestMessage?.type === 'offer' ? 'sent' : 
                          latestMessage?.type === 'acceptance' ? 'accepted' :
                          latestMessage?.type === 'rejection' ? 'rejected' : null,
              offerAmount: latestMessage?.amount || 0,
              messageCount: stats?.totalMessages || 0,
              hasOffer: !!messages && messages.length > 0
            };
          });
          
          setCars(enrichedCars);
          
          // Set pagination meta from backend response
          // Backend returns: { data, total, page, limit, totalPages }
          if (response.total !== undefined) {
            setPaginationMeta({
              page: response.page || currentPage,
              limit: response.limit || itemsPerPage,
              total: {
                items: response.total || 0,
                pages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || itemsPerPage))
              }
            });
          } else {
            setPaginationMeta(null);
          }
        } else {
          setCars([]);
          setPaginationMeta(null);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
        setPaginationMeta(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCars();
  }, [currentPage, isAuthenticated, user?.role]);

const formatPrice = (amount) => {
  if (!amount) return "0";
  return parseInt(amount).toLocaleString("en-IN"); // Indian-style commas
};

  const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
  // Helper function to extract car details from API response
  const extractCarDetails = (carData) => {
    // Handle customFields - could be string or object
    let customFields = {};
    if (typeof carData.customFields === 'string') {
      try {
        customFields = JSON.parse(carData.customFields);
      } catch (e) {
        customFields = {};
      }
    } else if (carData.customFields && typeof carData.customFields === 'object') {
      customFields = carData.customFields;
    }
    
    // Get listing price from customFields with fallbacks
    const listingPrice = customFields.listingPrice || 
                        customFields.listing_price || 
                        customFields.listPrice || 
                        customFields.list_price ||
                        carData.price ||
                        0;
    
    // Get year - prioritize mfgYear (manufacturing year) over year (registration year)
    const mfgYearRaw = customFields.mfgYear || customFields.manufacturingYear || customFields.manufactureYear || carData.mfgYear || carData.manufacturingYear;
    const year = mfgYearRaw ? (() => {
      // Extract year from various formats (e.g., "March, 2014" or "2014-03" or just "2014")
      if (!isNaN(mfgYearRaw)) return parseInt(mfgYearRaw, 10);
      const match = mfgYearRaw.toString().match(/\b(19|20)\d{2}\b/);
      return match ? parseInt(match[0], 10) : (customFields.year || carData.year || (carData.registrationYear ? new Date(carData.registrationYear).getFullYear() : null) || new Date().getFullYear());
    })() : (customFields.year || 
                carData.year || 
                (carData.registrationYear ? new Date(carData.registrationYear).getFullYear() : null) ||
                new Date().getFullYear());
    
    // Get images - prioritize CarImages array, then VIN image, then images array
    // Only use image if backend confirms it's ready (imageReady flag)
    let imageUrl = '/images/default-car.jpg';
    const imageReady = carData.imageReady !== false; // Default to true if not specified (backward compatibility)
    const hasValidImage = carData.hasValidImage !== false;
    
    if (imageReady && hasValidImage && carData.CarImages && carData.CarImages.length > 0) {
      // Use user-uploaded images first - only if backend confirms image is ready
      const firstImage = carData.CarImages[0];
      const imagePath = firstImage.url || firstImage.path || firstImage;
      
      if (imagePath) {
        // If image URL is already a full URL (starts with http), return as is
        if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
          imageUrl = imagePath;
        } else {
          // If it's a relative path, prepend API_BASE_URL
          // Remove leading slash if present to avoid double slashes
          const cleanPath = typeof imagePath === 'string' && imagePath.startsWith('/') 
            ? imagePath 
            : `/${imagePath}`;
          imageUrl = `${API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''}${cleanPath}`;
        }
      }
    } else if (customFields.vinImageUrl) {
      // Use VIN API image as fallback (external URLs are assumed ready)
      imageUrl = customFields.vinImageUrl;
    } else if (imageReady && carData.images && carData.images.length > 0) {
      const firstImage = Array.isArray(carData.images) ? carData.images[0] : carData.images;
      if (typeof firstImage === 'string') {
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          imageUrl = firstImage;
        } else {
          const cleanPath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
          imageUrl = `${API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ''}${cleanPath}`;
        }
      }
    }
    
    // Extract location from customFields - prioritize carLocationAddress
    const getLocation = () => {
      // First try carLocationAddress (from the new location picker)
      if (customFields.carLocationAddress) {
        // Extract city/area from full address if it's too long
        const address = customFields.carLocationAddress;
        // If address is very long, try to extract a shorter version
        // Otherwise use the full address
        return address.length > 50 ? address.substring(0, 50) + '...' : address;
      }
      // Fallback to old location field
      if (customFields.location) {
        return customFields.location;
      }
      // If no location, return default
      return 'Location not specified';
    };

    return {
      id: carData.id,
      name: carData.name || `${carData.make || ''} ${carData.model || ''}`.trim() || 'Car Listing',
      brand: normalizeBrand(customFields.brand || carData.make) || 'Unknown',
      model: customFields.variant || carData.model || 'Unknown',
      year: year,
      listingPrice: listingPrice,
      mileage: customFields.kmDriven ? `${customFields.kmDriven} km` : (carData.kmDriven ? `${carData.kmDriven} km` : '0 km'),
      fuel: customFields.fuelType || carData.fuelType || 'Petrol',
      transmission: customFields.transmission || carData.transmission || 'Manual',
      owner: customFields.owner || customFields.ownership || '1st owner',
      location: getLocation(),
      image: imageUrl
    };
  };

  if (loading) {
    return (
      <div className="dv2-buylist">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading cars...</p>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    // For non-dealers, show empty state for offers
    if (isAuthenticated && user?.role !== 'Dealer') {
      return (
        <div className="dv2-buylist">
          <div className="text-center py-5">
            <h5>No offers made</h5>
            <p className="text-muted">Cars on which you make offers will appear here.</p>
          </div>
        </div>
      );
    }
    
    // For dealers, show default empty state
    return (
      <div className="dv2-buylist">
        <div className="text-center py-5">
          <h5>No cars available</h5>
          <p className="text-muted">Check back later for new listings!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dv2-buylist">
      {cars.map((carOffer, index) => {
        const carDetails = extractCarDetails(carOffer.carData);

        return (
          <div key={carOffer.carId} className="card dv2-card p-3 mb-4 position-relative">
            {/* Congrats Card - Positioned Absolutely (only show if offer exists) */}
            {/* {carOffer.hasOffer && (
              <div className="dv2-congrats-position">
                <CongratsCard 
                  count={carOffer.messageCount}
                  offerStatus={carOffer.offerStatus}
                  onClick={() => window.location.href = `/make-offer?carId=${carOffer.carId}`}
                />
              </div>
            )} */}

             {carOffer.hasOffer && (
              <div className="dv2-congrats-position">
                <CongratsCard 
                  count={carOffer.messageCount}
                  offerStatus={carOffer.offerStatus}
                  onClick={() => window.location.href = `/make-offer?carId=${carOffer.carId}`}
                />
              </div>
            )}

            <div className="row g-3">
              {/* Image Column */}
              <div className="col-12 col-md-3">
                <div className="position-relative h-100">
                  <div className="dv2-buyimg-wrapper h-100">
                    <img 
                      src={carDetails.image} 
                      alt={carDetails.name} 
                      className="w-100 h-100 object-fit-cover rounded"
                      loading="lazy"
                      onError={(e) => {
                        // Prevent infinite retry loops - only set default once
                        if (e.target.src !== '/images/default-car.jpg' && !e.target.dataset.errorHandled) {
                          e.target.dataset.errorHandled = 'true';
                          e.target.src = '/images/default-car.jpg';
                        }
                      }}
                    />
                  </div>
                  {/* <div className="dv2-fresh-badge">
                    <span className="dv2-fresh-text">Fresh • Verified</span>
                  </div> */}
                </div>
              </div>

              {/* Content Column */}
              <div className="col-12 col-md-9">
                <div className="d-flex flex-column h-100">
                  {/* Title */}
                  <h5 className="fw-bold mb-1 dv2-buy-title">
                    <Link href={getCarDetailUrl(carOffer.carData)} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {carDetails.name}
                    </Link>
                  </h5>
                  {/* Location */}
                  {carDetails.location && (
                    <div className="fSize-3 text-muted mb-2 d-flex align-items-center">
                      <Image src="/images/location.png" alt="" width={13} height={16} className="me-2"/>
                      {carDetails.location}
                    </div>
                  )}
                   <div className="fSize-3 text-muted mb-2">Trim</div>
                  <div className="fSize-2 text-muted mb-2 fw-semibold">CLID: {carDetails.id || 'N/A'}</div>

                  {/* <div className="fSize-3 text-muted mb-2">{carDetails.year} • {carDetails.fuel} • {carDetails.transmission}</div> */}
                 

                  {/* Spec chips */}
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="dv2-spec">
                      {carDetails.mileage
                        ? parseInt(carDetails.mileage).toLocaleString("en-IN") + " km"
                        : "0 km"}
                    </span>
                    <span className="dv2-spec">
                      {carDetails.owner
                        ? getOrdinal(carDetails.owner)
                        : "1st"}
                    </span>

                    <span className="dv2-spec">{carDetails.fuel}</span>
                    <span className="dv2-spec">{carDetails.transmission}</span>
                  </div>

                  {/* Pills */}
                  <div className="d-flex flex-wrap gap-2 mb-3 pt-2">
                    <Pill>  <Image src="/assets/img/tik.png" alt="" width={16} height={16} className="me-2 viewCarosaBisk " /> Direct Owner</Pill>
                    <Pill variant="secondary"> <Image src="/assets/img/certifierd.png" alt="" width={16} height={16} className="viewCarosaBisk " /> Certified Cars</Pill>
                  </div>

                  <div className="row g-3 mt-auto">
                    {/* Price boxes */}
                    <div className="col-12 col-lg-7">
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="dv2-pricebox">
                            <div className="dv2-pricelabel fw-bold">SELLING PRICE</div>
                            <div className="dv2-pricevalue fw-bold">₹ {formatPrice(carDetails.listingPrice)}</div>
                          </div>
                        </div>
                        {carOffer.offerAmount > 0 && (
                          <div className="col-6">
                            <div className="dv2-pricebox">
                              <div className="dv2-pricelabel fw-bold">OFFER PRICE</div>
                              <div className="dv2-pricevalue fw-bold">₹ {formatPrice(carOffer.offerAmount)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="col-12 col-lg-5">
                      <div className="d-flex gap-2 h-100 align-items-end">
                        <button className="dv2-ghost flex-fill">Shortlist</button>
                        <button className="dv2-ghost flex-fill">Compare</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
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
