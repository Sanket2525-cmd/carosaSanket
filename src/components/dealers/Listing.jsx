"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import CarService from "@/services/carService";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/config/environment";
import { safeParseCustomFields } from "@/utils/jsonUtils";
import DeactivateListingModal from "@/components/modals/DeactivateListingModal";
import UpdatePriceModal from "@/components/modals/UpdatePriceModal";
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/services/useDebounce";
import Pagination from "@/components/common/Pagination"; // ✅ new global pagination
import Link from "next/link";

const Listing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuthStore();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);

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

  // ✅ Backend pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paginationMeta, setPaginationMeta] = useState(null);

  // Fetch cars when page or search changes
  useEffect(() => {
    fetchMyCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || user?.role !== "Dealer") {
        setCars([]);
        setPaginationMeta(null);
        setLoading(false);
        return;
      }

      // Pass pagination and search params to backend
      const result = await CarService.getMyCars({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined, // Only send if not empty
      });

      if (result.success) {
        const carsData = result.data || [];
        
        // Fetch best offers count for each car
        const carsWithBestOffersCount = await Promise.all(
          carsData.map(async (car) => {
            try {
              const offersResult = await CarService.getOffersForCar(car.id);
              if (offersResult.success && Array.isArray(offersResult.data)) {
                // Count total DealNegotiation entries across all deals (best offers)
                let bestOffersCount = 0;
                offersResult.data.forEach((deal) => {
                  if (deal.DealNegotiation && Array.isArray(deal.DealNegotiation)) {
                    bestOffersCount += deal.DealNegotiation.length;
                  }
                });
                return {
                  ...car,
                  bestOffersCount: bestOffersCount,
                };
              }
              return {
                ...car,
                bestOffersCount: 0,
              };
            } catch (error) {
              console.error(`Error fetching best offers for car ${car.id}:`, error);
              return {
                ...car,
                bestOffersCount: 0,
              };
            }
          })
        );
        
        setCars(carsWithBestOffersCount);
        setPaginationMeta(result.meta || null);
        console.log("Fetched cars for dealer:", carsWithBestOffersCount);
        console.log("Pagination meta:", result.meta);
      } else {
        setError(result.message || "Failed to fetch cars");
        setCars([]);
        setPaginationMeta(null);
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Network error. Please try again.");
      setCars([]);
      setPaginationMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Not set";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "LISTED":
        return "listing-badge-active";
      case "PENDING":
        return "listing-badge-pending";
      case "SOLD":
        return "listing-badge-sold";
      default:
        return "listing-badge-inactive";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "LISTED":
        return "Active";
      case "PENDING":
        return "Pending";
      case "SOLD":
        return "Sold";
      default:
        return "Inactive";
    }
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
        await fetchMyCars();
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
        await fetchMyCars();
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
        await fetchMyCars();
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

  // Reset to page 1 when search term changes (before debounce)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Use cars directly from backend (already paginated and filtered)
  const currentCars = cars;

  if (loading) {
    return (
      <div className="dashboard-content">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Listings</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchMyCars}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Header Section */}
      <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
            Listings {paginationMeta ? `(${paginationMeta.total.items})` : cars.length > 0 ? `(${cars.length})` : ''}
          </h2>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Page will reset via useEffect when debouncedSearch changes
              }}
              placeholder="Search by Name, Model, Reg. No, Brand..."
            />
            <Button className="dealers-btn-secondary px-4 py-2 rounded-xl">
              Filters
            </Button>
            <Link className="dealers-btn-primary rounded-2 px-4 py-2 rounded-xl bg-success" href="/RegistrationYourCar">
            Create Listing
            </Link>

            <Button className="dealers-btn-primary px-4 py-2 rounded-xl bg-warning">
              Raise Inspection
            </Button>
          </div>
        </div>
      </div>

      {/* No Cars Message */}
      {cars.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-car text-muted" style={{ fontSize: "4rem" }}></i>
          </div>
          <h4 className="text-muted mb-3">No Cars Listed</h4>
          <p className="text-muted mb-4">
            You haven't listed any cars for sale yet.
          </p>
          <Button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/registration")}
          >
            List Your First Car
          </Button>
        </div>
      )}

      {/* Car Listings */}
      {currentCars.map((car, index) => {
        const extractedCustomFields = safeParseCustomFields(car);
        // Prioritize mfgYear (manufacturing year) over year (registration year)
        const yearRaw = extractedCustomFields.mfgYear || extractedCustomFields.manufacturingYear || extractedCustomFields.manufactureYear || car.mfgYear || car.manufacturingYear;
        const year = yearRaw ? (() => {
          // Extract year from various formats (e.g., "March, 2014" or "2014-03" or just "2014")
          if (!isNaN(yearRaw)) return parseInt(yearRaw, 10);
          const match = yearRaw.toString().match(/\b(19|20)\d{2}\b/);
          return match ? parseInt(match[0], 10) : (extractedCustomFields.year || car.year || "N/A");
        })() : (extractedCustomFields.year || car.year || "N/A");
        const kmDriven = extractedCustomFields.kmDriven || extractedCustomFields.km || "N/A";
        const listingPrice =
          extractedCustomFields.listingPrice ?? car.listingPrice ?? 0;
        const offerPrice =
          extractedCustomFields.offerPrice ?? car.offerPrice ?? 0;

        return (
          <Row key={car.id || index} className="mb-4">
            <Col lg={12}>
              <div className="dealers-card p-3">
                <Row>
                  <Col lg={3}>
                    <img
                      src={
                        car.CarImages && car.CarImages.length > 0
                          ? `${API_BASE_URL}${car.CarImages[0].url}`
                          : "/images/carCard.png"
                      }
                      alt={car.name || "Car"}
                      className="rounded listing-car-image"
                      style={{ width: "100%", height: "240px", objectFit: "cover" }}
                    />
                  </Col>

                  <Col lg={9}>
                    <div className="ps-3">
                      <div className="d-flex flex-wrap justify-content-between">
                        <div>
                          <h2 className="listing-car-title">{car.name || "Car Listing"}</h2>
                          <p className="listing-car-did">CLID: {car.id}</p>
                        </div>
                        <div className="text-lg-end">
                          <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
                            <span className={`listing-badge ${extractedCustomFields.isActive === false ? 'listing-badge-inactive' : getStatusBadgeClass(car.status)}`}>
                              {extractedCustomFields.isActive === false ? 'Inactive' : getStatusText(car.status)}
                            </span>
                            <span className="listing-badge listing-badge-certified">
                              ✓ Certified Cars
                            </span>
                            <span className="listing-badge listing-badge-offers">{car.bestOffersCount || 0} Best Offer{car.bestOffersCount !== 1 ? 's' : ''}</span>
                            <span className="listing-badge listing-badge-offers">{car.testDrivesCount ?? (Array.isArray(car.TestDrive) ? car.TestDrive.length : 0)} Test Drive</span>
                          </div>
                          <p className="mb-0 mt-md-2 mt-3">
                          Reg. No:{" "}
                          <span className="fw-bold">
                            {extractedCustomFields.registrationNumber ||
                              extractedCustomFields.regNumber ||
                              "N/A"}
                          </span>
                        </p>
                        </div>
                      </div>

                      <div className="listing-timestamps d-flex flex-wrap gap-md-5 gap-2 mt-2">
                        <p className="mb-md-3 mb-0"><strong>Active Since:</strong> {formatDate(car.createdAt)}</p>
                        <p className="mb-md-3 mb-0"><strong>Last Modified:</strong> {formatDate(car.updatedAt)}</p>
                      </div>

                      <div className="d-flex gap-4 mt-3">
                        <p className="listing-price mb-0">
                          <strong>Selling Price:</strong>{" "}
                          <span className="fw-bold">{formatPrice(listingPrice)}</span>
                        </p>
                        <p className="listing-price mb-0">
                          <strong>Closing Deal Price:</strong>{" "}
                          <span className="fw-bold">{formatPrice(offerPrice)}</span>
                        </p>
                      </div>

                      <div className="d-flex flex-wrap gap-md-3 gap-2 mt-4">
                        <Link href={getCarDetailUrl(car)} className="listing-btn listing-btn-green" >
                        View Listing
                        </Link>
                
                        <Button 
                          className="listing-btn listing-btn-blue"
                          onClick={() => {
                            window.location.href = `/RegistrationYourCar?editId=${car.id}`;
                          }}
                        >
                          Edit Listing
                        </Button>
                        {extractedCustomFields.isActive === false ? (
                          <Button
                            className="listing-btn listing-btn-green"
                            onClick={() => handleActivateClick(car.id)}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Button
                            className="listing-btn listing-btn-red"
                            onClick={() => handleDeactivateClick(car.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                        <Button className="listing-btn listing-btn-green">Raise Inspection</Button>
                        <Button
                          className="listing-btn listing-btn-purple"
                          onClick={() => handleOpenUpdatePrice(car)}
                        >
                          Update Price
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Modals */}
            <DeactivateListingModal
              show={showDeactivateModal}
              onHide={handleCloseDeactivateModal}
              onConfirm={handleConfirmDeactivate}
            />
            <UpdatePriceModal
              show={showUpdatePriceModal}
              onHide={handleCloseUpdatePrice}
              onConfirm={handleConfirmUpdatePrice}
              initialListingPrice={`₹${listingPrice.toLocaleString("en-IN")}`}
              initialOfferPrice={`₹${offerPrice.toLocaleString("en-IN")}`}
            />
          </Row>
        );
      })}

      {/* ✅ Backend Pagination */}
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
};

export default Listing;
