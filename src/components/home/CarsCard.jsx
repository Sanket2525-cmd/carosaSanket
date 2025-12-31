"use client";

import {
  faIndianRupeeSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import CarService from "../../services/carService";
import { useAuthStore } from "../../store/authStore";
import { safeParseCustomFields } from '@/utils/jsonUtils';
import { calculateDefaultEMI } from '@/utils/emiCalculator';
import { normalizeBrand } from '@/utils/brandNormalizer';
import { API_BASE_URL } from "../../config/environment";
import SelectedCarFilter from "../viewCarsRecent/carsListing/filters/SelectedCarFilter";
import { useFilter } from "../../contexts/FilterContext";
import Image from "next/image";
import SkeletonCard from "../skeleton/SkeletonCard";

function CarItem({ items, href }) {
  const sellerRole = items.User?.Role?.name;
  const platformLabel =
    sellerRole === "Dealer"
      ? "CAROSA Partner"
      : sellerRole === "User"
      ? "Direct Owner"
      : null;
  
  const { isAuthenticated } = useAuthStore();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check wishlist status on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated && items.id) {
        try {
          const result = await CarService.checkWishlistStatus(items.id);
          if (result.success) {
            setIsInWishlist(result.isInWishlist);
          }
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      } else {
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, items.id]);

  // Handle wishlist click to prevent navigation
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show message
      alert('Please login to add cars to your wishlist');
      return;
    }

    if (isToggling) return; // Prevent multiple clicks

    setIsToggling(true);
    try {
      const result = await CarService.toggleWishlist(items.id);
      if (result.success) {
        setIsInWishlist(result.data?.isInWishlist ?? !isInWishlist);
      } else {
        console.error('Failed to toggle wishlist:', result.message);
        alert(result.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
    
    <div className="cardMain mb-3">
      <div className="card border-0 position-relative">
        <Link href={href} className="text-decoration-none" style={{ color: 'inherit', cursor: 'pointer' }} target="_blank" rel="noopener noreferrer">
          <div className="position-relative">
            <img
              src={items.imageReady !== false ? items.image : '/images/default-car.jpg'}
              alt={`${items.brand} ${items.modal}`}
              className="w-100 object-fit-cover imgcards"
              height={216}
              loading="lazy"
              onError={(e) => {
                // Prevent infinite retry loops - only set default once
                if (e.target.src !== '/images/default-car.jpg' && !e.target.dataset.errorHandled) {
                  e.target.dataset.errorHandled = 'true';
                  e.target.src = '/images/default-car.jpg';
                }
              }}
            />
            {/* {items.platform && (
              <div className="carosaBisk d-flex align-items-center gap-2 py-1 px-2">
                <img src="/images/assured.png" alt="" />
                <p className="text-white m-0  fSize-2 fw-medium">
                  {items.platform}
                </p>
              </div>
            )} */}
            {platformLabel && (
              <div className="carosaBisk d-flex align-items-center gap-2 py-1 px-2">
                <img src="/images/assured.png" alt="Carosa Verified" />
                <p className="text-white m-0 fSize-2 fw-medium">{platformLabel}</p>
              </div>
            )}
          </div>

          <div className="card-body py-2 px-3">
            <div className="vehicleDetaile ">
              <h4 className="fSize-6 fw-bold mb-1">{items.year} {items.brand} <span className="">{items.modal}</span></h4>
              {/* <p className="fSize-3 fw-semibold font-italic mb-1 fst-italic">{items.modal}</p> */}
              {/* <p className="fSize-3 fw-normal font-italic mb-1 fst-italic">Trim</p> */}
              <p className="fSize-4 fw-normal mb-0 font_sets pb-1">
                {/* <FontAwesomeIcon icon={faLocationDot} style={{ width: 13, height: 13 }} />{" "} */}
                <Image src="/images/location.png" alt="" width={13} height={16} className="me-2"/>
                {items.location || 'Location not specified'}
              </p>
              
            </div>

            <div className="vehicleCapibility mt-2 d-flex justify-content-between align-items-center px-0 ">
              <div className="miles d-flex align-items-center flex-column gap-2">
                <img src="/images/hugeicons_road.png" alt=""  />
                <p className="fSize-3 fw-normal mb-0">{Number(items.use.replace(/\D/g, "")).toLocaleString()}</p>
              </div>
              <div className="pump d-flex align-items-center flex-column gap-2">
                <img src="/images/petrol.png" alt=""  />
                <p className="fSize-3 fw-normal mb-0">{items.vehicle}</p>
              </div>
              <div className="auto d-flex align-items-center flex-column gap-2 etc">
                <img src="/images/automatic.png" alt=""  />
                <p className="fSize-3 fw-normal mb-0">{items.fModal}</p>
              </div>
              <div className="auto d-flex align-items-center flex-column gap-2 etc">
                <img src="/images/Owner.svg" alt=""  />
                <p className="fSize-3 fw-normal mb-0">
                  {items.own}
                  {/* <span>st</span> */}
                </p>
              </div>
            </div>

            
          </div>
          <div className="card-footer cards-foo py-2">
            <div className="pricingDetailes d-flex align-items-center justify-content-between ">
              <div>
                <h4 className="m-0 fSize-6 fw-bold">{items.price}</h4>
                {/* <span className="fSize-2 fw-normal" style={{ color: '#5B5B5B' }}>{items.charges}</span> */}
              </div>
              <div>
                <p className="fSize-4 fw-bold EMI-text m-0">
                  EMI{" "}
                  <FontAwesomeIcon icon={faIndianRupeeSign} style={{ width: 12, height: 16 }} />{" "}
                  {(() => {
                    // Format EMI value - handle both number and string with commas
                    const emiValue = typeof items.EMI === 'string' 
                      ? parseFloat(items.EMI.replace(/[,\s]/g, '')) 
                      : items.EMI;
                    // Format using same logic as RecentCarDetails.jsx
                    return emiValue > 0 
                      ? new Intl.NumberFormat('en-IN').format(emiValue) 
                      : '10,479';
                  })()}/m
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div 
          className="addMore d-flex justify-content-center align-items-center"
          onClick={handleWishlistClick}
          style={{ 
            cursor: isToggling ? 'wait' : 'pointer', 
            zIndex: 10,
            opacity: isToggling ? 0.6 : 1
          }}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {/* Original green tag design - only heart color changes */}
          <svg 
            width="42" 
            height="52" 
            viewBox="0 0 42 52" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '42px', height: '52px' }}
          >
            {/* Green tag triangle top */}
            <path d="M9.3815 0L16.9048 12.3266H1.85819L9.3815 0Z" fill="#639D11"/>
            {/* Green tag body */}
            <path d="M9.56445 0H41.1946V51.4135L25.4709 41.9526L9.56445 51.4135V0Z" fill="#8EC73E"/>
            {/* Heart icon - filled red when in wishlist, white outline when not */}
            {isInWishlist ? (
              // Filled red heart when in wishlist - complete heart shape filled with red
              <path 
                d="M31.3496 15.7114C29.5566 14.4889 27.3425 15.0594 26.1471 16.4585C24.9518 15.0594 22.7376 14.4821 20.9446 15.7114C19.9938 16.3634 19.3961 17.4637 19.3553 18.6251C19.2603 21.2603 21.5966 23.3725 25.1623 26.6122L25.2302 26.6733C25.7464 27.1419 26.541 27.1419 27.0572 26.6665L27.1319 26.5986C30.6976 23.3657 33.0272 21.2535 32.9389 18.6183C32.8981 17.4637 32.3004 16.3634 31.3496 15.7114Z" 
                fill="red"
              />
            ) : (
              // White outline heart when not in wishlist (original design - outline only)
              <path 
                d="M31.3496 15.7114C29.5566 14.4889 27.3425 15.0594 26.1471 16.4585C24.9518 15.0594 22.7376 14.4821 20.9446 15.7114C19.9938 16.3634 19.3961 17.4637 19.3553 18.6251C19.2603 21.2603 21.5966 23.3725 25.1623 26.6122L25.2302 26.6733C25.7464 27.1419 26.541 27.1419 27.0572 26.6665L27.1319 26.5986C30.6976 23.3657 33.0272 21.2535 32.9389 18.6183C32.8981 17.4637 32.3004 16.3634 31.3496 15.7114ZM26.215 25.6002L26.1471 25.6681L26.0792 25.6002C22.8463 22.673 20.7137 20.7373 20.7137 18.7745C20.7137 17.4161 21.7325 16.3974 23.0908 16.3974C24.1367 16.3974 25.1555 17.0698 25.5155 18.0002H26.7855C27.1387 17.0698 28.1575 16.3974 29.2034 16.3974C30.5617 16.3974 31.5805 17.4161 31.5805 18.7745C31.5805 20.7373 29.4479 22.673 26.215 25.6002Z" 
                fill="white"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
    </>
  );
}

function CarsCard({
  items = null, // Allow null to trigger API fetch
  slider = true,
  limit = null, // e.g. 8 ya 10 for home
  useAPI = true, // New prop to control API usage
}) {
  // Try to use filter context, but fallback to direct API calls if not available
  let filterContext = null;
  try {
    filterContext = useFilter();
  } catch (error) {
    // Filter context not available, will use direct API calls
    console.log('Filter context not available, using direct API calls');
  }

  const { cars, loading, loadingMore: contextLoadingMore, totalCount, pagination, hasMore: contextHasMore, fetchCars: contextFetchCars } = filterContext || { 
    cars: [], 
    loading: false, 
    loadingMore: false,
    totalCount: 0, 
    pagination: { page: 1, limit: 20, totalPages: 0 },
    hasMore: false,
    fetchCars: null
  };
  const [carsData, setCarsData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCars, setTotalCars] = useState(0);

  const slugify = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Transform API car data to match the expected format
  const transformCarData = (apiCar) => {
    // Extract custom fields - handle nested structure safely
    const customFields = safeParseCustomFields(apiCar);

    // Debug logging to see what data we're working with
    console.log('=== CAR DATA DEBUG ===');
    console.log('Transforming car data for:', apiCar.name || apiCar.id);
    console.log('Full API car object:', apiCar);
    console.log('Raw customFields:', apiCar.customFields);
    console.log('Parsed customFields:', customFields);
    console.log('All customFields keys:', Object.keys(customFields));
    console.log('Key fields:', {
      kmDriven: customFields.kmDriven,
      km: customFields.km,
      listingPrice: customFields.listingPrice,
      listing_price: customFields.listing_price,
      fuelType: customFields.fuelType,
      transmission: customFields.transmission,
      owner: customFields.owner
    });
    console.log('=== END DEBUG ===');

    // Get the first image or use VIN image or default
    // Only use image if backend confirms it's ready (imageReady flag)
    let firstImage = '/images/default-car.jpg';
    const imageReady = apiCar.imageReady !== false; // Default to true if not specified (backward compatibility)
    const hasValidImage = apiCar.hasValidImage !== false;
    
    if (imageReady && hasValidImage && apiCar.CarImages && apiCar.CarImages.length > 0) {
      // Use user-uploaded images first - only if backend confirms image is ready
      firstImage = `${API_BASE_URL}${apiCar.CarImages[0].url}`;
    } else if (customFields.vinImageUrl) {
      // Use VIN API image as fallback (external URLs are assumed ready)
      firstImage = customFields.vinImageUrl;
    }

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

    // Get raw listing price for EMI calculation
    const rawListingPrice = customFields.listingPrice || customFields.listing_price || customFields.price || customFields.listPrice || customFields.list_price || 0;
    const listingPrice = typeof rawListingPrice === 'string' 
      ? parseFloat(rawListingPrice.replace(/[₹,\s]/g, '')) || 0 
      : Number(rawListingPrice) || 0;
    
    // Calculate EMI using utility function (same as calculator)
    const calculatedEMI = calculateDefaultEMI(listingPrice) || 10479; // Fallback to default if calculation fails

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

    const transformedData = {
      id: apiCar.id,
      brand: normalizeBrand(apiCar.make) || 'Unknown',
      modal: apiCar.model || 'Unknown',
      image: firstImage,
      price: formatPrice(listingPrice),
      location: getLocation(),
      // Dynamic details for the 4 symbols - try multiple field name variations
      use: `${customFields.kmDriven || customFields.km || customFields.odometer || '0'} km`, // Kilometers driven with "km"
      vehicle: customFields.fuelType || customFields.fuel || customFields.fuel_type || 'Petrol', // Fuel type
      fModal: customFields.transmission || customFields.transmission_type || 'Manual', // Transmission
      own: formatOwner(customFields.owner || customFields.ownerNumber || customFields.owner_number || '1'), // Owner number
      // Additional fields
      kmDriven: customFields.kmDriven || customFields.km || '0',
      // Extract year - prioritize mfgYear over year, then fallback to current year
      year: (() => {
        // First try mfgYear (manufacturing year) - this is what should be displayed
        const mfgYearRaw = customFields.mfgYear || customFields.manufacturingYear || customFields.manufactureYear || apiCar.mfgYear || apiCar.manufacturingYear;
        
        if (mfgYearRaw) {
          // Case 1: Numeric or numeric string like "2024"
          if (!isNaN(mfgYearRaw)) return parseInt(mfgYearRaw, 10);
          
          // Case 2: Try to extract year from a date-like string (e.g., "March, 2014" or "2014-03")
          const match = mfgYearRaw.toString().match(/\b(19|20)\d{2}\b/);
          if (match) return parseInt(match[0], 10);
        }
        
        // Fallback to year field if mfgYear is not available
        const yearRaw = customFields.year || customFields.registrationYear || customFields.regYear || apiCar.year || apiCar.registrationYear;
        
        if (yearRaw) {
          // Case 1: Numeric or numeric string like "2024"
          if (!isNaN(yearRaw)) return parseInt(yearRaw, 10);
          
          // Case 2: Try to extract year from a date-like string
          const match = yearRaw.toString().match(/\b(19|20)\d{2}\b/);
          if (match) return parseInt(match[0], 10);
        }
        
        // Last resort: current year
        return new Date().getFullYear();
      })(),

      platform: 'CAROSA Partners', // Default platform
      fuel: customFields.fuelType || 'Petrol',
      transmission: customFields.transmission || 'Manual',
      charges: '+ other charges', // Static text
      EMI: calculatedEMI, // Calculated EMI value (number)
      createdAt: apiCar.createdAt,
      updatedAt: apiCar.updatedAt,
      User: apiCar.User, // Preserve User with Role for tag display
      imageReady: imageReady, // Flag from backend indicating image is ready
      hasValidImage: hasValidImage // Flag from backend indicating valid image exists
    };

    // Debug the final transformed data
    console.log('Final transformed data:', {
      id: transformedData.id,
      brand: transformedData.brand,
      modal: transformedData.modal,
      use: transformedData.use,
      vehicle: transformedData.vehicle,
      fModal: transformedData.fModal,
      own: transformedData.own,
      price: transformedData.price
    });

    return transformedData;
  };

  // Fetch cars function - can be used for initial load and pagination
  const fetchCars = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLocalLoading(true);
        setError(null);
      }
      
      const params = {
        limit: limit || 20,
        page: page,
        // Only add cache busting for subsequent loads, not initial load
        ...(append ? { _t: Date.now(), forceRefresh: true } : {})
      };
      
      const response = await CarService.getAllCars(params);
      
      if (response && response.data && response.data.length > 0) {
        const transformedCars = response.data.map(transformCarData);
        const total = response.meta?.total || response.total || 0;
        setTotalCars(total);
        
        if (append) {
          // Append new cars to existing data
          setCarsData(prev => {
            const newData = [...prev, ...transformedCars];
            setHasMore(newData.length < total);
            return newData;
          });
        } else {
          // Replace with new data (initial load)
          setCarsData(transformedCars);
          setHasMore(transformedCars.length < total);
        }
      } else {
        if (!append) {
          setCarsData([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      if (!append) {
        setError(err.message);
        setCarsData([]);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLocalLoading(false);
      }
    }
  }, [limit]);

  // Use filter context data or fetch from API (with proper dependency management)
  useEffect(() => {
    let isMounted = true;
    
    if (useAPI && !items) {
      if (filterContext) {
        // Use data from filter context
        if (cars && cars.length > 0) {
          const transformedCars = cars.map(transformCarData);
          if (isMounted) {
            setCarsData(transformedCars);
          }
        } else {
          if (isMounted) {
            setCarsData([]);
          }
        }
        if (isMounted) {
          setLocalLoading(loading);
        }
      } else {
        // Fallback to direct API call when filter context not available
        // Reset pagination on initial load
        if (!limit) {
          setCurrentPage(1);
          setHasMore(true);
        }
        fetchCars(1, false);
      }
    } else if (items) {
      // Use provided items (fallback to static data)
      if (isMounted) {
        setCarsData(Array.isArray(items) ? items : []);
        setLocalLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [useAPI, items, limit, fetchCars]); // Added fetchCars to dependencies

  // Handle filter context updates separately to prevent infinite loops
  useEffect(() => {
    if (filterContext && cars) {
      // Update carsData even if cars array is empty (filters applied but no matches)
      const transformedCars = cars.map(transformCarData);
      setCarsData(transformedCars);
    }
  }, [cars]); // Only depend on cars array changes

  useEffect(() => {
    if (filterContext) {
      setLocalLoading(loading);
      // Reset local pagination state when using filter context
      setCurrentPage(pagination.page || 1);
      setHasMore(contextHasMore || false);
    }
  }, [loading, filterContext, pagination, contextHasMore]); // Only depend on loading state changes

  // Load more cars function
  const loadMore = useCallback(() => {
    // Only load more if:
    // 1. Not in slider mode
    // 2. No limit is set (infinite scroll mode)
    // 3. Has more data to load
    // 4. Not currently loading
    if (!slider && !limit) {
      if (filterContext && contextFetchCars) {
        // Use FilterContext's fetchCars
        if (contextHasMore && !contextLoadingMore && !loading) {
          const nextPage = pagination.page + 1;
          contextFetchCars(nextPage, true);
        }
      } else {
        // Use local fetchCars
        if (hasMore && !loadingMore && !localLoading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchCars(nextPage, true);
        }
      }
    }
  }, [slider, limit, hasMore, loadingMore, localLoading, filterContext, currentPage, fetchCars, contextHasMore, contextLoadingMore, contextFetchCars, pagination, loading]);

  // Infinite scroll - only for grid mode without limit
  useEffect(() => {
    // Only enable infinite scroll if:
    // 1. Not in slider mode
    // 2. No limit is set
    if (slider || limit) {
      return;
    }

    const handleScroll = () => {
      // Check if user is near bottom of page (within 200px)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore();
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [slider, limit, loadMore]);

  // Use provided items or fetched data
  const list = items ? (Array.isArray(items) ? items : []) : carsData;
  const limited = limit ? list.slice(0, limit) : list;

  // Determine skeleton count - match the exact number of cards that will be shown
  const skeletonCount = limit || (list.length > 0 ? list.length : 8);

  // Loading state with skeleton cards - show all skeletons at once
  if (localLoading && list.length === 0) {
    // Slider mode skeleton
    if (slider) {
      return (
        <Swiper
          className="filters-carousel pTop"
          loop={false}
          spaceBetween={20}
          navigation={true}
          pagination={false}
          speed={500}
          breakpoints={{
            0: { slidesPerView: 1 },
            500: { slidesPerView: 1.5 },
            700: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1400: { slidesPerView: 5 },
          }}
          modules={[Navigation]}
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
              <SkeletonCard />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
    
    // Grid mode skeleton
    return (
      <>
        <SelectedCarFilter />
        <Row className="g-3">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Col key={`skeleton-${index}`} xxl={3} lg={4} md={6} sm={12}>
              <SkeletonCard />
            </Col>
          ))}
        </Row>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning" role="alert">
          <h5>Unable to load cars</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No cars found
  if (limited.length === 0) {
    // Check if filters are applied
    const hasActiveFilters = filterContext && filterContext.getActiveFilters && filterContext.getActiveFilters().length > 0;
    
    return (
      <div className="text-center py-5">
        <div className="alert alert-info" role="alert">
          <h5>No cars available</h5>
          {hasActiveFilters ? (
            <>
              <p>No cars match your selected filters. Try adjusting your search criteria.</p>
              <small className="text-muted">You can clear filters or modify your search to see more results.</small>
            </>
          ) : (
            <>
              <p>No cars are currently listed for sale. Cars need to be approved by admin before they appear here.</p>
              <small className="text-muted">Check back later or contact support if you've listed a car.</small>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Slider Mode (Home Page) ---
if (slider) {
  return (
    <div className="filters-carousel-wrapper">
      <Swiper
        className="filters-carousel pTop"
        loop={false}
        spaceBetween={20}
        navigation={true}
        pagination={false}
        speed={500}
        autoplay={limited.length > 0 ? { delay: 2500, disableOnInteraction: false } : false}
        breakpoints={{
          0: { slidesPerView: 1.15 },  // 👈 slight peek for next card
          500: { slidesPerView: 1.2 }, // 👈 keep small peek till ~700px
          700: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
          1400: { slidesPerView: 5 },
        }}
        modules={[Navigation, Autoplay]}
      >
        {limited.length > 0 ? (
          limited.map((items, index) => {
            const slug = slugify(`${items.brand}-${items.modal}`);
            const href = `/recentCar/${items.id}/${slug}`;
            return (
              <SwiperSlide key={items.id || index}>
                <CarItem items={items} href={href} />
              </SwiperSlide>
            );
          })
        ) : (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
              <SkeletonCard />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
}

return (
  <>
    <SelectedCarFilter />
    <Row className="g-3 pe-md-2 ">
      {limited.length > 0 ? (
        limited.map((items, index) => {
          const slug = slugify(`${items.brand}-${items.modal}`);
          const href = `/recentCar/${items.id}/${slug}`;
          return (
            <Col key={items.id || index} xxl={3} lg={4} md={6} sm={12}>
              <CarItem items={items} href={href} />
            </Col>
          );
        })
      ) : (
        Array.from({ length: skeletonCount }).map((_, index) => (
          <Col key={`skeleton-${index}`} xxl={3} lg={4} md={6} sm={12}>
            <SkeletonCard />
          </Col>
        ))
      )}
    </Row>
    {/* Loading indicator for infinite scroll */}
    {(loadingMore || contextLoadingMore) && !slider && !limit && (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading more cars...</span>
        </div>
        <p className="mt-2 text-muted">Loading more cars...</p>
      </div>
    )}
    {/* End of results message */}
    {!(filterContext ? contextHasMore : hasMore) && !slider && !limit && (filterContext ? cars.length : carsData.length) > 0 && (
      <div className="text-center py-4">
        <p className="text-muted">You've reached the end of the list</p>
      </div>
    )}
  </>
);

}

export default CarsCard;
