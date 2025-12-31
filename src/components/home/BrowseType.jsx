"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CarService from "../../services/carService";
import browseTypeData from "../../data/BrowseType.json";
import { useFilterData } from "../../contexts/FilterDataContext";

function BrowseType() {
  const router = useRouter();
  const { filterData, loading: filterDataLoading } = useFilterData();
  const [bodyTypes, setBodyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get first 6 unique images from BrowseType.json to cycle through
  const bodyTypeImages = useMemo(() => {
    const images = [];
    const seenImages = new Set();
    
    browseTypeData.forEach((item) => {
      if (!seenImages.has(item.image) && images.length < 6) {
        images.push(item.image);
        seenImages.add(item.image);
      }
    });
    
    // If we have less than 6 images, repeat them to get 6
    while (images.length < 6 && images.length > 0) {
      images.push(...images.slice(0, 6 - images.length));
    }
    
    return images;
  }, []);

  // Helper function to get body type image by cycling through the 6 images
  const getBodyTypeImage = (bodyTypeIndex) => {
    if (bodyTypeImages.length === 0) return "/images/Hatchback.png";
    // Cycle through the 6 images based on index
    return bodyTypeImages[bodyTypeIndex % bodyTypeImages.length];
  };

  // Use filter data from context instead of making separate API call
  useEffect(() => {
    let isMounted = true;

    const processBodyTypes = () => {
      try {
        setLoading(true);
        // Use filter data from context (already fetched and cached)
        const response = filterData;
        
        if (isMounted && response && response.success && response.data && response.data.bodyTypes) {
          // Start with all body types from BrowseType.json as base (for images)
          const allBodyTypesMap = new Map();
          
          // Initialize all body types from BrowseType.json with default values (count: 0)
          browseTypeData.forEach((item) => {
            allBodyTypesMap.set(item.types.toLowerCase(), {
              name: item.types,
              image: item.image,
              count: 0
            });
          });
          
          // Merge API body types data (includes all body types, even with 0 count)
          response.data.bodyTypes.forEach((apiBodyType) => {
            const bodyTypeName = apiBodyType.name || apiBodyType.bodyType;
            if (!bodyTypeName) return;
            
            const normalizedKey = bodyTypeName.toLowerCase();
            
            // Update or add body type with count from API
            if (allBodyTypesMap.has(normalizedKey)) {
              const existing = allBodyTypesMap.get(normalizedKey);
              existing.count = apiBodyType.count || 0;
            } else {
              // Body type from API not in BrowseType.json - add it (image will be assigned later based on index)
              allBodyTypesMap.set(normalizedKey, {
                name: bodyTypeName,
                image: "", // Will be assigned based on index after sorting
                count: apiBodyType.count || 0
              });
            }
          });
          
          // Convert map to array, remove duplicates, filter by count > 0, and sort
          const processedBodyTypes = Array.from(allBodyTypesMap.values())
            // Remove duplicates based on body type name (case-insensitive)
            .filter((bodyType, index, self) => 
              index === self.findIndex(b => 
                b.name.toLowerCase() === bodyType.name.toLowerCase()
              )
            )
            // Filter to only show body types with count > 0
            .filter(bodyType => bodyType.count > 0)
            // Sort by count descending (body types with more cars first)
            .sort((a, b) => {
              // Primary sort: by count descending
              if (b.count !== a.count) {
                return b.count - a.count;
              }
              // Secondary sort: alphabetically if counts are equal
              return a.name.localeCompare(b.name);
            })
            // Assign images by cycling through the 6 images
            .map((bodyType, index) => ({
              ...bodyType,
              image: getBodyTypeImage(index)
            }));

          setBodyTypes(processedBodyTypes);
        } else {
          // If API fails or doesn't return bodyTypes, show empty array
          // (We can't determine which body types have count > 0 without API data)
          console.warn('API response missing bodyTypes data, showing empty array');
          setBodyTypes([]);
        }
      } catch (error) {
        console.error('Error fetching body types:', error);
        // On error, show empty array (we can't determine which body types have count > 0)
        if (isMounted) {
          setBodyTypes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Process body types when filter data is available
    if (filterData && !filterDataLoading) {
      processBodyTypes();
    } else if (filterDataLoading) {
      setLoading(true);
    }

    return () => {
      isMounted = false;
    };
  }, [filterData, filterDataLoading]);

  const handleBodyTypeClick = (bodyTypeName) => {
    // Navigate to buy page with selected body type filter
    const queryString = new URLSearchParams({
      bodyType: bodyTypeName
    }).toString();
    router.push(`/recentCar?${queryString}`);
  };

  return (
    <>
      <section className="sightingMain padding-Y-X ">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">Browse by Body Type</h1>
                </div>
              
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
                0: { slidesPerView: 2 },        // xs: 2 items (matches xs={6} = 12/6 = 2)
                768: { slidesPerView: 4 },      // md: 4 items (matches md={3} = 12/3 = 4)
                992: { slidesPerView: 4 },      // lg: 4 items (matches lg={3} = 12/3 = 4)
                1200: { slidesPerView: 6 },     // xl: 6 items (matches xl={2} = 12/2 = 6)
              }}
            >
            {loading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <SwiperSlide key={`loading-${index}`}>
                  <div className="sightingsParent">
                    <div className="sightingVideo position-relative" style={{ minHeight: '295px' }}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : bodyTypes.length === 0 ? (
              // Empty state
              <SwiperSlide>
                <div className="sightingsParent">
                  <div className="sightingVideo position-relative">
                    <div className="text-center py-5">
                      <p className="fSize-4 text-muted">No body types available</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ) : (
              // Body types list - shows ALL body types (including those with 0 count)
              bodyTypes.map((bodyType, index) => (
                <SwiperSlide key={`${bodyType.name}-${index}`}>
                  <div className="sightingsParent">
                    <div 
                      className="sightingVideo position-relative"
                      onClick={() => handleBodyTypeClick(bodyType.name)}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleBodyTypeClick(bodyType.name);
                        }
                      }}
                    >
                      <img 
                        src={bodyType.image} 
                        alt={bodyType.name} 
                        className="w-100 object-fit-cover rounded-4" 
                        height={295} 
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to default image if body type image fails to load
                          e.target.src = "/images/Hatchback.png";
                        }}
                      />
                      <div className="availableCard">
                        <p className="text-white m-0 fSize-3 fw-medium">{bodyType.count} Cars</p>
                        <h4 className="text-white fSize-5 fw-semibold">{bodyType.name}</h4>
                      </div>
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

export default BrowseType;
