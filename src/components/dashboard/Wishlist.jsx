"use client";

import React, { useState, useEffect } from 'react';
import CarService from '../../services/carService';
import { API_BASE_URL } from '../../config/environment';
import { safeParseCustomFields } from '@/utils/jsonUtils';
import { useAuthStore } from '@/store/authStore';
import Image from "next/image";
import Link from "next/link";
import { normalizeBrand } from '@/utils/brandNormalizer';

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

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Wishlist Car Card Component
function WishlistCarCard({ car, onRemove }) {
  const extractedCustomFields = safeParseCustomFields(car);
  
  // Get listing price
  const listingPrice = extractedCustomFields.listingPrice !== undefined ? extractedCustomFields.listingPrice :
                      extractedCustomFields.listing_price !== undefined ? extractedCustomFields.listing_price :
                      extractedCustomFields.listPrice !== undefined ? extractedCustomFields.listPrice :
                      extractedCustomFields.list_price !== undefined ? extractedCustomFields.list_price :
                      car.listingPrice !== undefined ? car.listingPrice :
                      car.listing_price !== undefined ? car.listing_price :
                      0;
  
  // Format price
  const formatPrice = (amount) => {
    if (!amount) return "0";
    return parseInt(amount).toLocaleString("en-IN"); // Indian-style commas
  };

  // Get car image
  const carImage = car.CarImages && car.CarImages.length > 0 
    ? (car.CarImages[0].url?.startsWith('http') 
        ? car.CarImages[0].url 
        : `${API_BASE_URL}${car.CarImages[0].url}`)
    : "/assets/carImage/exterior1.avif";

  // Get car name
  const carName = car.name || `${car.make || ''} ${car.model || ''}`.trim() || 'Unknown Car';
  
  // Get specs
  const kmDriven = extractedCustomFields.kmDriven || extractedCustomFields.km || '0';
  const fuelType = extractedCustomFields.fuelType || extractedCustomFields.fuel || 'Petrol';
  const transmission = extractedCustomFields.transmission || 'Manual';
  const owner = extractedCustomFields.owner || '1st';
  
  // Extract owner number for ordinal display
  const ownerNumber = typeof owner === 'string' ? parseInt(owner.replace(/\D/g, '')) || 1 : owner || 1;

  return (
    <div className="card dv2-card p-3 mb-4 position-relative">
      {/* Remove from wishlist button */}
      <button
        className="btn btn-sm position-absolute top-0 end-0 m-2"
        onClick={() => onRemove(car.id)}
        style={{ 
          background: 'rgba(255,255,255,0.95)', 
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        title="Remove from wishlist"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      <div className="row g-3">
        {/* Image Column */}
        <div className="col-12 col-md-3">
          <div className="position-relative h-100">
            <div className="dv2-buyimg-wrapper h-100">
              <img src={carImage} alt={carName} className="w-100 h-100 object-fit-cover rounded" />
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column h-100">
            {/* Title */}
            <h5 className="fw-bold mb-1 dv2-buy-title">
              <Link href={getCarDetailUrl(car)} style={{ textDecoration: 'none', color: 'inherit' }}>
                {carName}
              </Link>
            </h5>
            <div className="fSize-3 text-muted mb-2">Trim</div>
            <div className="fSize-2 text-muted mb-2 fw-semibold">CLID: {car.id || 'N/A'}</div>

            {/* Spec chips */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              <span className="dv2-spec">
                {parseInt(kmDriven).toLocaleString("en-IN")} km
              </span>
              <span className="dv2-spec">
                {getOrdinal(ownerNumber)}
              </span>
              <span className="dv2-spec">{fuelType}</span>
              <span className="dv2-spec">{transmission}</span>
            </div>

            {/* Pills */}
            <div className="d-flex flex-wrap gap-2 mb-3 pt-2">
              <Pill>
                <Image src="/assets/img/tik.png" alt="" width={16} height={16} className="me-2 viewCarosaBisk " /> 
                Direct Owner
              </Pill>
              <Pill variant="secondary"> 
                <Image src="/assets/img/certifierd.png" alt="" width={16} height={16} className="viewCarosaBisk " /> 
                Certified Cars
              </Pill>
            </div>

            <div className="row g-3 mt-auto">
              {/* Price box */}
              <div className="col-12 col-lg-7">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="dv2-pricebox">
                      <div className="dv2-pricelabel fw-bold">SELLING PRICE</div>
                      <div className="dv2-pricevalue fw-bold">₹ {formatPrice(listingPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="col-12 col-lg-5">
                <div className="d-flex gap-2 h-100 align-items-end">
                  <Link 
                    href={getCarDetailUrl(car)}
                    className="dv2-ghost flex-fill text-center text-decoration-none d-inline-block"
                    style={{ padding: '9px 16px', lineHeight: '1.5' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wishlist(){
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated) {
        setCars([]);
        setLoading(false);
        return;
      }
      
      const result = await CarService.getWishlist();
      
      if (result.success) {
        setCars(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleRemoveFromWishlist = async (carId) => {
    try {
      const result = await CarService.removeFromWishlist(carId);
      if (result.success) {
        // Remove car from local state
        setCars(prevCars => prevCars.filter(car => car.id !== carId));
      } else {
        alert(result.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Wishlist</h4>
        <p>{error}</p>
        <hr />
        <button className="btn btn-primary" onClick={fetchWishlist}>
          Try Again
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Please login to view your wishlist.</p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-muted"
            style={{ margin: '0 auto' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h4 className="text-muted mb-3">Your wishlist is empty</h4>
        <p className="text-muted mb-4">Start adding cars to your wishlist by clicking the heart icon on car listings.</p>
        <a href="/recentCar" className="btn btn-primary">
          Browse Cars
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted mb-3">You have {cars.length} {cars.length === 1 ? 'car' : 'cars'} in your wishlist</p>
      {cars.map((car) => (
        <WishlistCarCard 
          key={car.id} 
          car={car} 
          onRemove={handleRemoveFromWishlist}
        />
      ))}
    </div>
  );
}
