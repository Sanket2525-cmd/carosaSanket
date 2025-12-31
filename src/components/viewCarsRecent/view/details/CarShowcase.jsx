"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import carData from "../../../../data/CarShowcase";

const flattenData = (categories) => {
  const allSlides = [];
  Object.keys(categories).forEach((cat) => {
    if (categories[cat].items && categories[cat].items.length > 0) {
      categories[cat].items.forEach((item) => {
        allSlides.push({ category: cat, item });
      });
    }
  });
  return allSlides;
};

export default function CarShowcase({ car }) {
  useEffect(() => {
    console.log("CarShowcase - Car data received:", car);
    console.log("CarShowcase - CarImages:", car?.CarImages);
    console.log("CarShowcase - CarImages count:", car?.CarImages?.length || 0);
  }, [car]);

  let categories = {};

  if (car && car.CarImages && car.CarImages.length > 0) {
    // Helper function to map backend category to frontend category name
    const mapCategoryToDisplayName = (category) => {
      if (!category) return null;
      const categoryUpper = category.toUpperCase();
      const categoryMap = {
        'EXTERIOR': 'Exterior',
        'INTERIOR': 'Interior',
        'HIGHLIGHT': 'Attractions', // Backend uses HIGHLIGHT, frontend uses Attractions
        'TYRE': 'Tyres', // Backend uses TYRE, frontend uses Tyres
      };
      return categoryMap[categoryUpper] || null;
    };

    // Initialize categorized images
    const categorizedImages = {
      Exterior: [],
      Interior: [],
      Tyres: [],
      Attractions: [],
      Videos: [],
    };

    // Group images by their actual category from database
    car.CarImages.forEach((img) => {
      const imageUrl = `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.carosa.in"
      }${img.url}`;
      
      const imageObj = {
        type: "image",
        src: imageUrl,
      };

      // Map backend category to frontend category name
      const displayCategory = mapCategoryToDisplayName(img.category);
      
      if (displayCategory && categorizedImages[displayCategory]) {
        categorizedImages[displayCategory].push(imageObj);
      } else {
        // If no category or unknown category, default to Exterior
        categorizedImages.Exterior.push(imageObj);
      }
    });

    categories = {
      Exterior: {
        icon: carData.Exterior?.icon || "/assets/carImage/exterior.avif",
        items: categorizedImages.Exterior,
      },
      Interior: {
        icon: carData.Interior?.icon || "/assets/carImage/Interior.avif",
        items: categorizedImages.Interior,
      },
      Tyres: {
        icon: carData.Tyres?.icon || "/assets/carImage/tyers.png",
        items: categorizedImages.Tyres,
      },
      Attractions: {
        icon: carData.Attractions?.icon || "/assets/carImage/attractions.png",
        items: categorizedImages.Attractions,
      },
      Videos: {
        icon: carData.Videos?.icon || "/assets/carImage/videos.png",
        items: [],
      },
    };
  } else {
    categories = {
      Exterior: {
        icon: carData.Exterior?.icon || "/assets/carImage/exterior.avif",
        items: [],
      },
      Interior: {
        icon: carData.Interior?.icon || "/assets/carImage/Interior.avif",
        items: [],
      },
      Tyres: {
        icon: carData.Tyres?.icon || "/assets/carImage/tyers.png",
        items: [],
      },
      Attractions: {
        icon: carData.Attractions?.icon || "/assets/carImage/attractions.png",
        items: [],
      },
      Videos: {
        icon: carData.Videos?.icon || "/assets/carImage/videos.png",
        items: [],
      },
    };
  }

  const allSlides = flattenData(categories);
  const firstCategory = Object.keys(categories)[0] || "Exterior";

  const [activeCategory, setActiveCategory] = useState(firstCategory);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxActiveCategory, setLightboxActiveCategory] =
    useState(firstCategory);
  const [isHovered, setIsHovered] = useState(false); // 🔥 For top bar animation
  const [isBottomHovered, setIsBottomHovered] = useState(false); // 🔥 For bottom thumbnails animation
  const [isDesktop, setIsDesktop] = useState(false); // 🔥 Track desktop view

  const hasImages = allSlides.length > 0;

  // Check if desktop view on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    const currentSlide = allSlides[index];
    if (currentSlide) {
      setLightboxActiveCategory(currentSlide.category);
    }
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => {
      const nextIndex = (prev + 1) % allSlides.length;
      const nextSlide = allSlides[nextIndex];
      if (nextSlide) setLightboxActiveCategory(nextSlide.category);
      return nextIndex;
    });
  };

  const prevImage = () => {
    setLightboxIndex((prev) => {
      const prevIndex = (prev - 1 + allSlides.length) % allSlides.length;
      const prevSlide = allSlides[prevIndex];
      if (prevSlide) setLightboxActiveCategory(prevSlide.category);
      return prevIndex;
    });
  };

  const getCurrentPositionInCategory = () => {
    const categorySlides = allSlides.filter(
      (s) => s.category === lightboxActiveCategory
    );
    const currentIndexInAll = lightboxIndex;
    const position = allSlides
      .slice(0, currentIndexInAll + 1)
      .filter((s) => s.category === lightboxActiveCategory).length;
    return { position, total: categorySlides.length };
  };

  const handleLightboxCategoryChange = (cat) => {
    setLightboxActiveCategory(cat);
    const firstIndex = allSlides.findIndex((s) => s.category === cat);
    if (firstIndex !== -1) setLightboxIndex(firstIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    if (isLightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  return (
    <div
      className="car-showcase-container d-flex overflow-hidden"
      style={{ height: "500px", width: "100%", position: "relative" }}
    >
      {/* Sidebar */}
      <div className="buttonSide text-white d-flex flex-column p-2">
        {Object.keys(categories).map((category) => {
          const categorySlides = allSlides.filter(
            (s) => s.category === category
          );
          const hasCategoryImages = categorySlides.length > 0;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              className="d-flex flex-column align-items-center justify-content-center p-2 border-0 bg-transparent text-white"
              style={{
                cursor: hasCategoryImages ? "pointer" : "not-allowed",
                width: "100%",
                opacity: hasCategoryImages ? 1 : 0.5,
                backgroundColor:
                  isActive && hasCategoryImages
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
              }}
              onClick={() => {
                if (!hasCategoryImages) return;
                setActiveCategory(category);
                const firstIndex = allSlides.findIndex(
                  (s) => s.category === category
                );
                if (firstIndex !== -1) {
                  const swiper = document.querySelector(".car-swiper")?.swiper;
                  if (swiper) swiper.slideToLoop(firstIndex);
                }
              }}
              disabled={!hasCategoryImages}
            >
              <img
                src={categories[category].icon}
                alt={category}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: isActive
                    ? "2px solid #fff"
                    : hasCategoryImages
                    ? "2px solid rgba(255, 255, 255, 0.5)"
                    : "2px solid transparent",
                  filter: hasCategoryImages ? "none" : "brightness(0.5)",
                }}
              />
              <span
                className="mt-2"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: hasCategoryImages ? 1 : 0.5,
                }}
              >
                {category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Swiper Slider */}
      <div className="car-showcase-main flex-grow-1 bg-light">
        {hasImages ? (
          <Swiper
            className="w-100 h-100 car-swiper"
            loop={allSlides.length > 1}
            speed={800}
            slidesPerView={1}
            modules={[Navigation]}
            navigation={true}  
            onSlideChange={(swiper) => {
              const current = allSlides[swiper.realIndex];
              if (current) setActiveCategory(current.category);
            }}
          >
            {allSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                {slide.item.type === "image" ? (
                  <img
                    src={slide.item.src}
                    alt={`${slide.category} ${idx}`}
                    onClick={() => handleImageClick(idx)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : null}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <div className="text-center text-muted">
              <p className="mb-2">No images available for this car</p>
              <small>Images will appear once uploaded by the seller</small>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
            className="lightbox-overlay"
    onClick={closeLightbox}
    onMouseMove={(e) => {
      // Desktop view: Show bottom thumbnails when cursor is near bottom
      if (isDesktop) {
        const viewportHeight = window.innerHeight;
        const mouseY = e.clientY;
        const distanceFromBottom = viewportHeight - mouseY;
        // Show when cursor is within 150px from bottom
        setIsBottomHovered(distanceFromBottom <= 150);
      }
    }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#ffffff",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
        >
          {/* 🔥 Top Bar with Hover Animation */}
          <div
           style={{
        position: "absolute",
        top: isHovered ? "-16px" : "-91px",
        left: 0,
        right: 0,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "top 0.4s ease",
        zIndex: 2,
      }}
      className="mobileResponsive_lightbox"
          >
            {/* Counter + Close */}
            <div
             style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          position: "fixed",
          top: "3%",
          right: "40px",
        }}
        className="posSet"
            >
              <div style={{ flex: 1 }}></div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {(() => {
                  const { position, total } = getCurrentPositionInCategory();
                  return (
                    <span
                      style={{
                        color: "#333",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {position} / {total}
                    </span>
                  );
                })()}
                <button
                  onClick={closeLightbox}
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    color: "#666",
                    fontSize: "20px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div
             style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          background: "#2a3a92",
          padding: "0px 80px",
          borderRadius: "0px 0px 64px 64px",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={() => setIsHovered(true)}  // 👈 Hover starts animation
        onMouseLeave={() => setIsHovered(false)} // 👈 Hover leaves — goes back up
            >
              {Object.keys(categories).map((cat) => {
                const categorySlides = allSlides.filter(
                  (s) => s.category === cat
                );
                const hasCategoryImages = categorySlides.length > 0;
                
                return (
                <button
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasCategoryImages) return;
                    handleLightboxCategoryChange(cat);
                  }}
                  disabled={!hasCategoryImages}
                   style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              cursor: hasCategoryImages ? "pointer" : "not-allowed",
              padding: "8px",
              transition: "transform 0.2s ease",
              opacity: hasCategoryImages ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (hasCategoryImages) {
                e.currentTarget.style.transform = "translateY(-3px)";
              }
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      border:
                        lightboxActiveCategory === cat
                          ? "3px solid #f97316"
                          : "none",
                      overflow: "hidden",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="CarImagesMobi"
                  >
                    <img
                      src={categories[cat].icon}
                      alt={cat}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: hasCategoryImages ? "none" : "brightness(0.5)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      color:
                        lightboxActiveCategory === cat ? "#f97316" : "#fff",
                      fontSize: "13px",
                      fontWeight: "500",
                      opacity: hasCategoryImages ? 1 : 0.5,
                    }}
                  >
                    {cat}
                  </span>
                </button>
              );
              })}
            </div>
          </div>

          {/* Main Image Section */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: "80px 0 120px 0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                left: "20px",
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#333",
                fontSize: "28px",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              ‹
            </button>

            {allSlides[lightboxIndex] && (
              <img
                src={
                  typeof allSlides[lightboxIndex].item === "string"
                    ? allSlides[lightboxIndex].item
                    : allSlides[lightboxIndex].item.src
                }
                alt={`${allSlides[lightboxIndex].category} ${lightboxIndex}`}
                style={{
                  maxWidth: "90%",
                  objectFit: "contain",
                  width: "auto",
                  height: "100%",
                  maxHeight: "calc(100vh - 80px)",
                  position: "relative",
                  zIndex: -1,
                }}
              />
            )}

            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                right: "20px",
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#333",
                fontSize: "28px",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              ›
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div
            style={{
              position: "absolute",
              bottom: isDesktop 
                ? (isBottomHovered ? "20px" : "-100px")
                : "20px",
              left: "20px",
              right: "20px",
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
              transition: "bottom 0.4s ease",
              zIndex: 2,
            }}
            onMouseEnter={() => {
              if (isDesktop) {
                setIsBottomHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) {
                setIsBottomHovered(false);
              }
            }}
          >
            {allSlides.map((slide, idx) => {
              const isActive = idx === lightboxIndex;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                    const currentSlide = allSlides[idx];
                    if (currentSlide)
                      setLightboxActiveCategory(currentSlide.category);
                  }}
                  style={{
                    minWidth: "80px",
                    height: "60px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: isActive
                      ? "2px solid #f97316"
                      : "2px solid transparent",
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={
                      typeof slide.item === "string"
                        ? slide.item
                        : slide.item.src
                    }
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
