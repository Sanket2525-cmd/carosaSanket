"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CarService from "../../services/carService";
import brandsData from "../../data/Brands.json";
import { normalizeBrand } from "../../utils/brandNormalizer";
import { useFilterData } from "../../contexts/FilterDataContext";

function YourFavoriteBrand() {
  const router = useRouter();
  const { filterData, loading: filterDataLoading } = useFilterData();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a map of brand names to their images for quick lookup
  const brandImageMap = useMemo(() => {
    const map = new Map();
    brandsData.forEach((brand) => {
      // Store both exact match and lowercase match for case-insensitive lookup
      map.set(brand.brandName.toLowerCase(), brand.image);
      map.set(brand.brandName, brand.image);
    });
    return map;
  }, []);

  // Helper function to normalize brand names for matching
  const normalizeBrandName = (name) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[\s-]/g, '').trim();
  };

  // Helper function to find matching brand name (case-insensitive, handles spaces/hyphens)
  const findMatchingBrandName = (apiBrandName, brandsJsonNames) => {
    const normalizedApiName = normalizeBrandName(apiBrandName);
    
    // Try exact match first
    const exactMatch = brandsJsonNames.find(b => 
      b.brandName.toLowerCase() === apiBrandName.toLowerCase()
    );
    if (exactMatch) return exactMatch.brandName;
    
    // Try normalized match
    const normalizedMatch = brandsJsonNames.find(b => 
      normalizeBrandName(b.brandName) === normalizedApiName
    );
    if (normalizedMatch) return normalizedMatch.brandName;
    
    return null;
  };

  // Helper function to get brand image
  const getBrandImage = (brandName) => {
    if (!brandName) return "/images/brandslogo.png";
    
    // Try exact match first
    let image = brandImageMap.get(brandName);
    if (image) return image;
    
    // Try case-insensitive match
    image = brandImageMap.get(brandName.toLowerCase());
    if (image) return image;
    
    // Try partial match (for cases like "Mercedes Benz" vs "Mercedes-Benz")
    const normalizedBrandName = normalizeBrandName(brandName);
    for (const [key, value] of brandImageMap.entries()) {
      const normalizedKey = normalizeBrandName(key);
      if (normalizedKey === normalizedBrandName) {
        return value;
      }
    }
    
    // Fallback to default image
    return "/images/brandslogo.png";
  };

  // Use filter data from context instead of making separate API call
  useEffect(() => {
    let isMounted = true;

    const processBrands = () => {
      try {
        setLoading(true);
        // Use filter data from context (already fetched and cached)
        const response = filterData;
        
        if (isMounted && response && response.success && response.data && response.data.brands) {
          // Start with all brands from Brands.json as base (for images)
          const allBrandsMap = new Map();
          
          // Initialize all brands from Brands.json with default values (count: 0)
          brandsData.forEach((brandJson) => {
            allBrandsMap.set(brandJson.brandName.toLowerCase(), {
              brandName: brandJson.brandName,
              image: brandJson.image,
              count: 0
            });
          });
          
          // Merge API brands data (includes all brands, even with 0 count)
          response.data.brands.forEach((apiBrand) => {
            // Normalize brand name first (maps JSW MG Motor variations to MG Motors)
            const normalizedApiBrandName = normalizeBrand(apiBrand.name);
            // Find matching brand name from Brands.json
            const matchingBrandName = findMatchingBrandName(normalizedApiBrandName, brandsData);
            const brandName = matchingBrandName || normalizedApiBrandName;
            const normalizedKey = brandName.toLowerCase();
            
            // Update or add brand with count from API
            if (allBrandsMap.has(normalizedKey)) {
              const existing = allBrandsMap.get(normalizedKey);
              existing.count = apiBrand.count || 0;
            } else {
              // Brand from API not in Brands.json - add it with default image
              allBrandsMap.set(normalizedKey, {
                brandName: brandName,
                image: getBrandImage(brandName),
                count: apiBrand.count || 0
              });
            }
          });
          
          // Convert map to array, remove duplicates, and sort
          const processedBrands = Array.from(allBrandsMap.values())
            // Remove duplicates based on brand name (case-insensitive)
            .filter((brand, index, self) => 
              index === self.findIndex(b => 
                normalizeBrandName(b.brandName) === normalizeBrandName(brand.brandName)
              )
            )
            // Sort by count descending (brands with more cars first)
            .sort((a, b) => {
              // Primary sort: by count descending
              if (b.count !== a.count) {
                return b.count - a.count;
              }
              // Secondary sort: alphabetically if counts are equal
              return a.brandName.localeCompare(b.brandName);
            });

          setBrands(processedBrands);
        } else {
          // If API fails, show all brands from Brands.json with 0 count
          const fallbackBrands = brandsData.map(brand => ({
            brandName: brand.brandName,
            image: brand.image,
            count: 0
          }));
          setBrands(fallbackBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // On error, show all brands from Brands.json with 0 count
        if (isMounted) {
          const fallbackBrands = brandsData.map(brand => ({
            brandName: brand.brandName,
            image: brand.image,
            count: 0
          }));
          setBrands(fallbackBrands);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Process brands when filter data is available
    if (filterData && !filterDataLoading) {
      processBrands();
    } else if (filterDataLoading) {
      setLoading(true);
    }

    return () => {
      isMounted = false;
    };
  }, [filterData, filterDataLoading]);

  const handleBrandClick = (brandName) => {
    // Navigate to buy page with selected brand filter
    const queryString = new URLSearchParams({
      make: brandName
    }).toString();
    router.push(`/recentCar?${queryString}`);
  };

  return (
    <>
      <section className="yourBrandMain padding-Y-X">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">
                    Choose Your Favorite Brand
                  </h1>
                </div>
                {/* <div className="viewAll">
                  <Link href="" className="fSize-3 fw-medium viewBtn">
                    View All{" "}
                    <img
                      src="/images/arrowRight.png"
                      alt=""
                      width={14}
                      className="ms-2"
                    />{" "}
                  </Link>
                </div> */}
              </div>
            </Col>
          </Row>
       <div className="position-relative">
       <Swiper
  spaceBetween={20}
  grabCursor={true}
  modules={[Navigation]}
  navigation={true}
  breakpoints={{
    0: { slidesPerView: 2.2 },      // Mobile
    576: { slidesPerView: 3 },      // Small tablets
    768: { slidesPerView: 4 },      // Tablets
    992: { slidesPerView: 6 },      // Laptops
    1200: { slidesPerView: 7 },     // Desktops
  }}
>
  {loading ? (
    // Loading state
    Array.from({ length: 6 }).map((_, index) => (
      <SwiperSlide key={`loading-${index}`}>
        <div className="cardBrands bg-white rounded-3 d-flex align-items-center justify-content-center position-relative flex-column mb-4" style={{ minHeight: '120px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </SwiperSlide>
    ))
  ) : brands.length === 0 ? (
    // Empty state
    <SwiperSlide>
      <div className="cardBrands bg-white rounded-3 d-flex align-items-center justify-content-center position-relative flex-column mb-4">
        <p className="fSize-4 text-muted">No brands available</p>
      </div>
    </SwiperSlide>
  ) : (
    // Brands list - shows ALL brands (including those with 0 count)
    brands.map((brand, index) => (
      <SwiperSlide key={`${brand.brandName}-${index}`}>
        <div 
          className="cardBrands bg-white rounded-3 d-flex align-items-center justify-content-center position-relative flex-column mb-4"
          onClick={() => handleBrandClick(brand.brandName)}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBrandClick(brand.brandName);
            }
          }}
        >
          <img 
            src={brand.image} 
            alt={brand.brandName}
            onError={(e) => {
              // Fallback to default image if brand image fails to load
              e.target.src = "/images/brandslogo.png";
            }}
          />
          <div className="position-realative">
            <p className="fSize-4 fw-semibold text_colorblue sized-fav">{brand.brandName}</p>
          </div>
        </div>
      </SwiperSlide>
    ))
  )}
</Swiper>
       </div>

        </Container>
      </section>
    </>
  );
}

export default YourFavoriteBrand;
