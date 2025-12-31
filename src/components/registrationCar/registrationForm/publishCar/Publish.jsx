"use client";

import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Card, Button, Modal, Alert } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";

import carData from "../../../../data/CarShowcase";
import useAuthStore from "../../../../store/authStore";
import { useFormDataStore } from "../../../../store/formDataStore";
import CarService from "../../../../services/carService";
import { SkeletonPublish } from "@/components/skeleton";
import LoginModal from "@/components/LoginModal";

/* --------------------------- Month-Year + Image Helpers --------------------------- */
const buildMonthYearLabel = (monthLike, yearLike) => {
  if (!monthLike && !yearLike) return null;
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const idxFromName = (m) => {
    if (!m) return null;
    const s = String(m).slice(0,3).toLowerCase();
    const idx = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(s);
    return idx >= 0 ? idx : null;
  };
  const idxFromNum = (m) => {
    const n = parseInt(m, 10);
    return Number.isFinite(n) && n>=1 && n<=12 ? n-1 : null;
  };
  let monIdx = idxFromName(monthLike);
  if (monIdx == null) monIdx = idxFromNum(monthLike);

  let y = null;
  if (yearLike != null) {
    const s = String(yearLike).trim();
    const m4 = s.match(/\b(19|20)\d{2}\b/);
    if (m4) y = parseInt(m4[0], 10);
    else if (/^\d{2}$/.test(s)) {
      const yy = parseInt(s, 10);
      y = yy <= 69 ? 2000 + yy : 1900 + yy;
    }
  }
  if (typeof monthLike === "string" && !y) {
    const m = String(monthLike).trim();
    const match = m.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*,?\s*(\d{2,4})$/i);
    if (match) {
      const idx = idxFromName(match[1]);
      const yr = match[2].length === 2 ? (parseInt(match[2],10) <= 69 ? 2000+parseInt(match[2],10) : 1900+parseInt(match[2],10)) : parseInt(match[2],10);
      if (idx != null && yr) return `${monthNames[idx]}, ${yr}`;
    }
  }
  if (monIdx == null || !y) return null;
  return `${monthNames[monIdx]}, ${y}`;
};
const formatMonthYears = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return value; // fallback if invalid
  // Format like "Feb, 2011"
  return date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .replace(" ", ", ");
};
const formatMonthYear = (val, { noSpaceAfterComma = false } = {}) => {
  if (!val) return null;
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const sep = noSpaceAfterComma ? "," : ", ";
  const s = String(val).trim();

  let m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mon = Math.min(12, Math.max(1, parseInt(m[2], 10)));
    return `${monthNames[mon - 1]}${sep}${y}`;
  }
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mon = Math.min(12, Math.max(1, parseInt(m[2], 10)));
    return `${monthNames[mon - 1]}${sep}${y}`;
  }
  m = s.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?)\s*,?\s*(\d{4})$/i);
  if (m) {
    const idx = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(m[1].slice(0,3).toLowerCase());
    const y = parseInt(m[2], 10);
    return `${monthNames[idx]}${sep}${y}`;
  }
  const onlyYear = s.match(/\b(19|20)\d{2}\b/);
  if (onlyYear) return s;
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return `${monthNames[d.getMonth()]}${sep}${d.getFullYear()}`;
  }
  return s;
};

const toOrdinal = (val) => {
  if (val == null || val === "") return "";
  const num = parseInt(String(val).match(/\d+/)?.[0] ?? "", 10);
  if (!Number.isFinite(num)) return String(val);
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
  const mod10 = num % 10;
  if (mod10 === 1) return `${num}st`;
  if (mod10 === 2) return `${num}nd`;
  if (mod10 === 3) return `${num}rd`;
  return `${num}th`;
};

// const toLakhDisplay = (numLike) => {
//   const n = parseFloat(numLike ?? "");
//   if (!Number.isFinite(n) || n === 0) return "₹0";
//   return `₹${(n / 100000).toFixed(2)} Lakh`;
// };
const toLakhDisplay = (numLike) => {
  const n = parseFloat(numLike ?? "");
  if (!Number.isFinite(n) || n === 0) return "₹0";

  // Format in Indian numbering system (like ₹2,45,000)
  return `₹${n.toLocaleString("en-IN")}`;
};
const getImgSrc = (img) => {
  if (typeof img === "string") return img;
  // Check for compressed image with item.src (from Zustand store)
  const direct = img?.src || img?.item?.src;
  if (direct) return direct;
  // Handle new structure: { file: File, section: string } or compressed version
  if (img?.file && typeof window !== "undefined" && img.file instanceof File) {
    return URL.createObjectURL(img.file);
  }
  if (typeof window !== "undefined" && img instanceof File) {
    return URL.createObjectURL(img);
  }
  return null;
};

const flattenData = (categories) => {
  const allSlides = [];
  Object.keys(categories).forEach((cat) => {
    (categories[cat].items || []).forEach((item) => {
      allSlides.push({ category: cat, item });
    });
  });
  return allSlides;
};

/* ------------------------------ Main Component ------------------------------ */
function Publish() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Auth store
  const {
    isAuthenticated,
    user,
    isLoading: authLoading,
    error: authError,
    clearError,
    initializeAuth,
    forceRefreshAuth,
  } = useAuthStore();

  // Form store
  const {
    formData: zustandFormData,
    clearFormData,
    getFormSummary,
  } = useFormDataStore();

  // Edit mode state
  const [editCarId, setEditCarId] = useState(null);

  // UI states
  const [dynamicImages, setDynamicImages] = useState([]);
  const [allSlides, setAllSlides] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Exterior");
  const [isLoading, setIsLoading] = useState(true);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("danger");

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPublish, setPendingPublish] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("LISTED"); // LISTED | PENDING

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => {
    setShowLoginModal(false);
    clearError();
  };
  const showAlert = (m, t = "danger") => { setAlertMessage(m); setAlertType(t); };
  const hideAlert = () => setAlertMessage("");

  const showDuplicateCarDialog = (m) => {
    setDuplicateMessage(m);
    setShowDuplicateDialog(true);
    setTimeout(() => {
      setShowDuplicateDialog(false);
      setDuplicateMessage("");
    }, 3000);
  };

  // init auth and check for pending publish on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    initializeAuth();
    forceRefreshAuth();
    
    // Check URL for pending publish parameter (in case user just logged in)
    const urlParams = new URLSearchParams(window.location.search);
    const urlHasPendingPublish = urlParams.get('pendingPublish') === 'true';
    
    if (urlHasPendingPublish) {
      console.log('📋 Detected pending publish from URL parameter');
      // Set pending publish state so useEffect can handle it
      setPendingPublish(true);
      setPendingStatus("LISTED"); // Default to LISTED if not specified
    }
  }, [initializeAuth, forceRefreshAuth]);

  // Check for editId in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    if (editId) {
      setEditCarId(parseInt(editId, 10));
    }
  }, []);

  // Build categories only with dynamic images (keep icons from carData)
  const createCategories = useMemo(
    () => () => {
      // Group images by their category
      const categorizedImages = {
        Exterior: [],
        Interior: [],
        Tyres: [],
        Attractions: [],
        Videos: [],
      };

      dynamicImages.forEach((slide) => {
        const category = slide.category || 'Exterior';
        if (categorizedImages[category]) {
          categorizedImages[category].push(slide.item);
        } else {
          // Default to Exterior if category not found
          categorizedImages.Exterior.push(slide.item);
        }
      });

      return {
        ...carData,
        Exterior: {
          ...carData.Exterior,
          items: categorizedImages.Exterior,
        },
        Interior: {
          ...carData.Interior,
          items: categorizedImages.Interior,
        },
        Tyres: {
          ...carData.Tyres,
          items: categorizedImages.Tyres,
        },
        Attractions: {
          ...carData.Attractions,
          items: categorizedImages.Attractions,
        },
        Videos: {
          ...carData.Videos,
          items: categorizedImages.Videos,
        },
      };
    },
    [dynamicImages]
  );

  useEffect(() => {
    const categories = createCategories();
    setAllSlides(flattenData(categories) || []);
  }, [dynamicImages, createCategories]);

  // Display card state (ONLY for UI)
  const [vehicleData, setVehicleData] = useState({
    regYear: "Apr 2015",
    mfgYear: "Apr 2015",
    transmission: "Automatic",
    fuel: "CNG",
    km: "40,780",
    owner: "1st",
    regNumber: "DL3C**2432",
    spareKey: "Yes",
    engineCapacity: "1197cc",
    insurance: "Yes",
    insuranceType: "Comprehensive",
    insuranceValidity: "Apr 2015",
    warranty: "Yes",
    warrantyType: "Extended",
    warrantyValidity: "Apr 2015",
    listingPrice: "₹8.93 Lakh",
    offerPrice: "₹7.93 Lakh",
    brand: "Mahindra",
    model: "XUV300",
    year: "2023",
    variant: "2.0 GTX+ 5dr Auto SUV",
  });

  // Load UI display data from store
  useEffect(() => {
    if (typeof window === "undefined") return;

    const load = () => {
      try {
        const f = zustandFormData;
        if (f && Object.keys(f).length > 0) {
          const kmRaw = f.kmDriven ?? f.km;
          const kmDisp = Number.isFinite(Number(kmRaw))
            ? Number(kmRaw).toLocaleString("en-IN")
            : kmRaw ?? "0";

          const regLabel =
            buildMonthYearLabel(f.regMonthName || f.regMonth || f.regMonthNumber, f.regYear || f.year) ||
            formatMonthYear(f.regYear || f.year) ||
            "January, 1970";

          const mfgLabel =
            buildMonthYearLabel(f.mfgMonthName || f.mfgMonth || f.mfgMonthNumber, f.mfgYear || f.year) ||
            formatMonthYear(f.mfgYear || f.year) ||
            regLabel;

          setVehicleData({
            regYear: regLabel,
            mfgYear: mfgLabel,
            transmission: f.transmission || "Manual",
            fuel: f.fuel || f.fuelType || "Petrol",
            km: kmDisp,
            owner: f.owner ? toOrdinal(f.owner) : "1st",
            regNumber: f.registrationNumber || "DL3C**2432",
            spareKey: f.spareKey || "No",
            engineCapacity: f.engineCapacity || "1197cc",
            insurance: f.insurance || "No",
            insuranceType: (f.insurance === "Yes" ? (f.insuranceType || "Comprehensive") : "NA"),
            insuranceValidity: (f.insurance === "Yes" ? formatMonthYear(f.insuranceDate || "N/A") : "NA"),
            warranty: f.warranty || "No",
            warrantyType: (f.warranty === "Yes" ? (f.warrantyType || "Extended") : "NA"),
            warrantyValidity: (f.warranty === "Yes" ? formatMonthYear(f.warrantyDate || "N/A") : "NA"),
            listingPrice:
              f.listingPrice && f.listingPrice !== "" && f.listingPrice !== "0"
                ? toLakhDisplay(parseFloat(f.listingPrice))
                : "₹8.93 Lakh",
            offerPrice:
              f.offerPrice && f.offerPrice !== "" && f.offerPrice !== "0"
                ? toLakhDisplay(parseFloat(f.offerPrice))
                : "₹7.93 Lakh",
            brand: f.brand || "Unknown",
            model: f.model || "Unknown",
            year: f.year || "2023",
            variant: f.variant || "Unknown",
          });

          // Dynamic images
          if (f.images && Array.isArray(f.images) && f.images.length > 0) {
            console.log('📸 Processing images from formData:', f.images);
            console.log('📸 Number of images:', f.images.length);
            
            // Helper function to map section to category display name
            const mapSectionToCategory = (section) => {
              if (!section) return "Exterior"; // Default to Exterior
              const sectionLower = section.toLowerCase();
              const categoryMap = {
                'exterior': 'Exterior',
                'interior': 'Interior',
                'highlights': 'Attractions',
                'tyres': 'Tyres',
                'tyre': 'Tyres',
              };
              return categoryMap[sectionLower] || 'Exterior';
            };

            const slides = f.images
              .map((imgData, idx) => {
                console.log(`📸 Processing image ${idx}:`, imgData);
                const src = getImgSrc(imgData);
                console.log(`📸 Image ${idx} src:`, src);
                
                if (!src) {
                  console.warn(`⚠️ No src found for image ${idx}:`, imgData);
                  return null;
                }
                
                // Extract category from image data
                const section = imgData?.section || imgData?.item?.section || null;
                const category = mapSectionToCategory(section);
                console.log(`📸 Image ${idx} category:`, category, 'from section:', section);
                
                return { category, item: { type: "image", src } };
              })
              .filter(Boolean);
            
            console.log('📸 Final slides:', slides);
            console.log('📸 Number of valid slides:', slides.length);
            setDynamicImages(slides);
          } else {
            console.log('⚠️ No images found in formData or images array is empty');
            console.log('📸 formData.images:', f.images);
            setDynamicImages([]);
          }
        }
      } catch (e) {
        console.error("Error loading form data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [zustandFormData, getFormSummary]);

  // Auth gate
  const ensureAuthOrOpenModal = (statusToSet) => {
    if (isAuthenticated && user) return true;
    setPendingPublish(true);
    setPendingStatus(statusToSet);
    
    // Add pendingPublish parameter to URL so login modal knows to return here
    const url = new URL(window.location.href);
    url.searchParams.set('pendingPublish', 'true');
    window.history.replaceState({}, '', url);
    
    openLogin();
    return false;
  };

  const handlePublishClick = async () => {
    if (!ensureAuthOrOpenModal("LISTED")) return;
    handleActualPublish("LISTED");
  };

  const handleSaveAsDraft = async () => {
    if (!ensureAuthOrOpenModal("PENDING")) return;
    handleActualPublish("PENDING");
  };

  // After modal login succeeds → continue
  // This effect runs when authentication state changes and there's a pending publish
  useEffect(() => {
    // Check URL parameter for pending publish (in case of page reload after login)
    const urlParams = new URLSearchParams(window.location.search);
    const urlHasPendingPublish = urlParams.get('pendingPublish') === 'true';
    
    // If authenticated and (pendingPublish flag is set OR URL has pendingPublish parameter)
    if (isAuthenticated && user && (pendingPublish || urlHasPendingPublish)) {
      console.log('✅ User authenticated, auto-publishing car...');
      
      // Determine status from pendingStatus or URL
      const statusToUse = pendingStatus || (urlHasPendingPublish ? "LISTED" : "LISTED");
      
      const t = setTimeout(() => {
        handleActualPublish(statusToUse);
        setPendingPublish(false);
        closeLogin();
        
        // Remove pendingPublish parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('pendingPublish');
        window.history.replaceState({}, '', url);
      }, 1000); // Increased timeout to ensure auth state is fully updated
      
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, user, pendingPublish, pendingStatus]);

  const handleActualPublish = async (status = "LISTED") => {
    if (typeof window === "undefined") return;

    try {
      if (!zustandFormData || Object.keys(zustandFormData).length === 0) {
        showAlert("No car data found. Please fill the form again.", "danger");
        return;
      }

      // ---- PRE-SHAPE PAYLOAD (exact format to DB) ----
      const f = zustandFormData;

      const regLabel =
        buildMonthYearLabel(f.regMonthName || f.regMonth || f.regMonthNumber, f.regYear || f.year) ||
        formatMonthYear(f.regYear || f.year) ||
        "January, 1970";

      const mfgLabel =
        buildMonthYearLabel(f.mfgMonthName || f.mfgMonth || f.mfgMonthNumber, f.mfgYear || f.year) ||
        formatMonthYear(f.mfgYear || f.year) ||
        regLabel;

      const rawImages = Array.isArray(f.images) ? f.images : [];
      console.log('📸 Images from Zustand store:', rawImages.length, 'images');
      if (rawImages.length > 0) {
        console.log('📸 First image structure:', rawImages[0]);
      }
      const imageUrlsPlaceholders = Array.from({ length: rawImages.length }, () => ({}));

      const prepared = {
        ...f,

        // ✅ DB ko yahi string labels chahiye
        year: regLabel,            // e.g. "May, 2024"
        mfgYear: mfgLabel,         // e.g. "June, 2024"

        // (Optional pretty labels for backend use)
        regYearFormatted: regLabel,
        mfgYearFormatted: mfgLabel,

        // ✅ imageUrls placeholder [{},{},...]
        imageUrls: imageUrlsPlaceholders,

        // images as-is (File/base64/url) — CarService khud handle karega
        images: rawImages,
        
        // Include removed image IDs if any (for edit mode)
        removedImageIds: f.removedImageIds || [],
      };

      let result;
      if (editCarId) {
        // Update existing car
        result = await CarService.updateCar(editCarId, prepared);
        
        if (result.success) {
          showAlert("Car updated successfully!", "success");
          clearFormData();
          if (user?.role === "Dealer") window.location.href = "/dealer-dashboard";
          else window.location.href = "/dashboard";
        } else {
          if (result.status === 401) {
            setPendingPublish(true);
            setPendingStatus(status);
            openLogin();
          } else {
            showAlert(`Failed to update car: ${result.message}`, "danger");
          }
        }
      } else {
        // Create new car
        result = await CarService.createCar(prepared, status);

        if (result.success) {
          showAlert("Car published successfully!", "success");
          clearFormData();
          if (user?.role === "Dealer") window.location.href = "/dealer-dashboard";
          else window.location.href = "/dashboard";
        } else {
          if (result.status === 401) {
            setPendingPublish(true);
            setPendingStatus(status);
            openLogin();
          } else if (
            result.message &&
            String(result.message).toLowerCase().includes("already published or listed")
          ) {
            showDuplicateCarDialog(
              "This car is already published or listed. Please use a different registration number."
            );
          } else {
            showAlert(`Failed to publish car: ${result.message}`, "danger");
          }
        }
      }
    } catch (error) {
      console.error("Car publishing error:", error);
      showAlert("An error occurred while publishing the car. Please try again.", "danger");
    }
  };

  if (!isClient || isLoading) return <SkeletonPublish />;

  return (
    <>
      <section className="publishMain padding-Y-X">
        <Container fluid className="py-6 paddintMobiel" style={{ paddingTop: "150px" }}>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Alerts */}
              {alertMessage && (
                <Row className="mb-3">
                  <Col>
                    <Alert variant={alertType} onClose={hideAlert} dismissible>
                      {alertMessage}
                    </Alert>
                  </Col>
                </Row>
              )}

              {/* Duplicate dialog */}
              <Modal
                show={showDuplicateDialog}
                onHide={() => setShowDuplicateDialog(false)}
                centered
                size="sm"
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header className="border-0 pb-0">
                  <Modal.Title className="text-center w-100">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
                    Car Already Published
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-3">
                  <p className="mb-0">{duplicateMessage || "This car is already published."}</p>
                </Modal.Body>
              </Modal>

              {/* Header + actions */}
              <Row className="mb-4 align-items-center">
                <Col lg={8} className="pb-lg-0 pb-2">
                  <h1 className="fSize-10 mbile_font fw-bold text-dark mb-0">Your car is ready for the list.</h1>
                </Col>
                <Col lg={4}>
                  <div className="d-flex gap-4 w-100">
                    <Button
                      variant="outline-primary"
                      className="px-md-4 px-2 py-2 d-flex fsizeSet align-items-center justify-content-center gap-2 flex-grow-1"
                      style={{
                        borderColor: "#1e3a8a",
                        color: "#1e3a8a",
                        backgroundColor: "white",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                      onClick={handleSaveAsDraft}
                      disabled={authLoading}
                    >
                      {authLoading ? "Saving..." : "Save as draft"}
                    </Button>
                    <Button
                      variant="primary"
                      className="px-md-4 px-2 py-2 fsizeSet d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                      style={{
                        backgroundColor: "#1e3a8a",
                        borderColor: "#1e3a8a",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                      onClick={handlePublishClick}
                      disabled={authLoading}
                    >
                      {authLoading ? "Loading..." : "Publish"}
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                {/* Gallery */}
                <Col lg={7} className="mb-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      <div className="d-flex overflow-hidden heightAdded" style={{ height: "500px" }}>
                        {/* Sidebar (only if we have images) */}
                        {allSlides.length > 0 && (
                          <div
                            className="buttonSide text-white d-flex flex-column p-2"
                            style={{ backgroundColor: "#1E3A8A", borderRadius: "8px 0 0 8px" }}
                          >
                            {Object.keys(createCategories()).map((category) => (
                              <button
                                key={category}
                                className="d-flex flex-column align-items-center justify-content-center p-2 border-0 bg-transparent text-white"
                                style={{ cursor: "pointer", width: "100%" }}
                                onClick={() => {
                                  setActiveCategory(category);
                                  const firstIndex = allSlides.findIndex((s) => s.category === category);
                                  const el = document.querySelector(".car-swiper");
                                  const swiper = el && el.swiper;
                                  if (swiper && firstIndex >= 0) {
                                    swiper.slideToLoop(firstIndex);
                                  }
                                }}
                              >
                                <img
                                  src={createCategories()[category].icon}
                                  alt={category}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: activeCategory === category ? "3px solid #fff" : "2px solid rgba(255,255,255,0.3)",
                                  }}
                                  onError={(e) => { e.currentTarget.src = "/images/car-exterior-icon.png"; }}
                                />
                                <span className="mt-2" style={{ fontSize: "14px", fontWeight: 500 }}>{category}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Swiper */}
                        <div className="flex-grow-1 bg-light position-relative">
                          <Swiper
                            className="w-100 h-100 car-swiper"
                            loop={allSlides.length > 1}
                            speed={800}
                            slidesPerView={1}
                            modules={[Navigation]}
                            navigation={
                              allSlides.length > 1
                                ? { nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }
                                : false
                            }
                            onSlideChange={(swiper) => {
                              if (allSlides.length > 0) {
                                const current = allSlides[swiper.realIndex];
                                if (current?.category) setActiveCategory(current.category);
                              }
                            }}
                          >
                            {allSlides.length > 0 ? (
                              allSlides.map((slide, idx) => {
                                const src = typeof slide.item === "string" ? slide.item : getImgSrc(slide.item);
                                return (
                                  <SwiperSlide key={idx} className="slide-container">
                                    {slide?.item?.type === "youtube" ? (
                                      <iframe
                                        src={slide.item.src.replace("watch?v=", "embed/")}
                                        title={`YouTube ${idx}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    ) : src ? (
                                      <img src={src} alt={`${slide.category} ${idx}`} />
                                    ) : null}
                                  </SwiperSlide>
                                );
                              })
                            ) : (
                              <SwiperSlide className="slide-container d-flex align-items-center justify-content-center">
                                <div className="text-center text-muted">
                                  <i className="fas fa-camera fa-3x mb-3"></i>
                                  <h5>No Images Uploaded</h5>
                                  <p>Please go back and upload car images to see them here.</p>
                                </div>
                              </SwiperSlide>
                            )}
                          </Swiper>

                          {allSlides.length > 1 && (
                            <>
                              <button
                                className="swiper-button-prev-custom position-absolute top-50 start-0 translate-middle-y bg-white border-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, zIndex: 10, marginLeft: 10 }}
                              >
                                <i className="fas fa-chevron-left text-dark"></i>
                              </button>
                              <button
                                className="swiper-button-next-custom position-absolute top-50 end-0 translate-middle-y bg-white border-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, zIndex: 10, marginRight: 10 }}
                              >
                                <i className="fas fa-chevron-right text-dark"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Right card */}
                <Col lg={5}>
                  <Card className="border-0 publish-car-details-card">
                    <Card.Body className="p-3 border-0">
                      <h2 className="fw-bold mb-1 text-dark fSize-8">
                       {vehicleData?.year ? new Date(vehicleData.year).getFullYear() : ""} {vehicleData.brand} <span className="fSize-3">{vehicleData.model}</span> 
                      </h2>
                      <p className="fSize-4 fw-normal mb-4 text-muted">{vehicleData.variant}</p>

                      <div className="d-flex gap-2 align-items-center mb-4 flex-wrap">
                        <span className="aboutCarTab fw-semibold px-3 py-1 rounded-pill fSize-3 fw-normal">
                          {vehicleData.km} km
                        </span>
                        <span className="aboutCarTab fw-semibold px-3 py-1 rounded-pill fSize-3 fw-normal">
                          {vehicleData.owner} owner
                        </span>
                        <span className="aboutCarTab fw-semibold px-3 py-1 rounded-pill fSize-3 fw-normal">
                          {vehicleData.fuel}
                        </span>
                        <span className="aboutCarTab fw-semibold px-3 py-1 rounded-pill fSize-3 fw-normal">
                          {vehicleData.transmission}
                        </span>
                      </div>

                      <div className="row g-3 my-2">
                        <div className="col-12">
                          <div className="pricing-section">
                            <p className="fw-medium fSize-3 mb-1 text-black" style={{ fontSize: ".875rem" }}>
                              Selling Price
                            </p>
                            <div className="d-flex align-items-center">
                              <h5 className="fw-semibold fsSize-7-5 mb-0 text-black me-2" style={{ fontSize: "1.25rem" }}>
                                {vehicleData.listingPrice}
                              </h5>
                              {/* <div className="d-flex align-items-center justify-content-center"
                                   style={{ width: 16, height: 16, backgroundColor: "#6b7280", borderRadius: "50%", fontSize: 10, color: "white" }}>
                                i
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="pricing-section">
                            <p className="fw-medium fSize-3 mb-1 text-black" style={{ fontSize: ".875rem" }}>
                              Deal Close Price
                            </p>
                            <div className="d-flex align-items-center">
                              <h5 className="fw-semibold fsSize-7-5 mb-0 text-black me-2" style={{ fontSize: "1.25rem" }}>
                                {vehicleData.offerPrice}
                              </h5>
                              {/* <div className="d-flex align-items-center justify-content-center"
                                   style={{ width: 16, height: 16, border: "1px solid #000", borderRadius: "50%", fontSize: 10, color: "black" }}>
                                i
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Vehicle Summary */}
              <Row className="mt-4">
                <Col lg={7}>
                  <div className="hdTile pb-2">
                    <h6 className="fsSize-7-5 fw-bold">Vehicle Summary</h6>
                  </div>

                  <Row className="carOverView m-0 py-4 px-3 g-3">
                    {/* Reg. Year */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/reg-years-icon.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Reg. Year</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.regYear}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Mfg. Year */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/reg-years-icon.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Mfg. Year</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.mfgYear}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Transmission */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/Transmission.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Transmission</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.transmission}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Fuel */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/fuelboat.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Fuel Type</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.fuel}</p>
                        </div>
                      </div>
                    </Col>

                    {/* KM */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/kms.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">KMs Driven</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.km} km</p>
                        </div>
                      </div>
                    </Col>

                    {/* Owner */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/theowner.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Owner</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.owner}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Reg no */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/regnumber.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Reg. Number</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.regNumber}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Spare key */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/key.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Spare Key</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.spareKey}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Engine */}
                    <Col lg={4} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/engine.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Engine Capacity</span>
                          <p className="text-white fSize-4 fw-semibold m-0">{vehicleData.engineCapacity}</p>
                        </div>
                      </div>
                    </Col>

                    {/* Insurance */}
                    <Col lg={12} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/insurenceandvara.png" alt="" width={24} height={24} />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Insurance</span>
                          <div className="d-flex gap-3 align-items-center mt-1">
                            <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                              <i className="fa fa-check me-1" aria-hidden="true"></i>
                              {vehicleData.insurance}
                            </button>
                            {String(vehicleData.insurance || "").toLowerCase() === "yes" && (
                              <>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {vehicleData.insuranceType}
                                </span>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {vehicleData.insuranceValidity}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Warranty */}
                    <Col lg={12} className="pb-2">
                      <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
                        <div className="iconOverview p-1">
                          <img src="/assets/img/insurenceandvara.png" alt="" width={24} height={24} />
                        </div>
                        <div>
                          <span className="text-white fSize-2 fw-medium m-0 text-uppercase">Warranty</span>
                          <div className="d-flex gap-3 align-items-center mt-1">
                            <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                              <i className="fa fa-check me-1" aria-hidden="true"></i>
                              {vehicleData.warranty}
                            </button>
                            {String(vehicleData.warranty || "").toLowerCase() === "yes" && (
                              <>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {vehicleData.warrantyType}
                                </span>
                                <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                                  {vehicleData.warrantyValidity}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Actions bottom */}
              <Row className="mt-4 mb-4">
                <Col lg={7}>
                  <div className="d-flex gap-3 w-100">
                    <Button
                      variant="outline-primary fs_set"
                      className="px-4 py-3 flex-grow-1"
                      style={{
                        borderColor: "#1e3a8a",
                        color: "#1e3a8a",
                        backgroundColor: "white",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                      onClick={handleSaveAsDraft}
                      disabled={authLoading}
                    >
                      {authLoading ? "Saving..." : "Save as draft"}
                    </Button>
                    <Button
                      variant="primary"
                      className="px-4 py-3 d-flex align-items-center justify-content-center gap-2 flex-grow-1  fs_set"
                      style={{
                        backgroundColor: "#1e3a8a",
                        borderColor: "#1e3a8a",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                      onClick={handlePublishClick}
                      disabled={authLoading}
                    >
                      {authLoading ? "Loading..." : "Publish"}
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SAME Login Modal used in Header.jsx */}
      <LoginModal show={showLoginModal} handleClose={closeLogin} />
    </>
  );
}

export default Publish;
