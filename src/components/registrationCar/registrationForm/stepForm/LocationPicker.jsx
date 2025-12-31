"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useFormDataStore } from "../../../../store/formDataStore";
import { loadGoogleMaps, isGoogleMapsReady } from "@/utils/loadGoogleMaps";

function LocationPicker({ backTo9, goToNext }) {
  const { formData: details, updateField } = useFormDataStore();
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState({
    lat: details.carLocationLat || null,
    lng: details.carLocationLng || null,
    address: details.carLocationAddress || "",
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load Google Maps API using shared utility
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if Google Maps is already loaded
    if (isGoogleMapsReady()) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Load Google Maps (will only load once even if called multiple times)
    loadGoogleMaps()
      .then(() => {
        setMapLoaded(true);
        initializeMap();
      })
      .catch((err) => {
        console.error("Failed to load Google Maps:", err);
        setError("Failed to load Google Maps. Please refresh the page.");
      });
  }, []);

  // Initialize map when Google Maps is loaded
  const initializeMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current) return;

    // Default center (Noida, India)
    const defaultCenter = { lat: 28.5355, lng: 77.3910 };
    
    // Use existing location or default
    const initialCenter = location.lat && location.lng 
      ? { lat: parseFloat(location.lat), lng: parseFloat(location.lng) }
      : defaultCenter;

    // Create map
    const map = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: location.lat && location.lng ? 15 : 10,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    // Add marker if location exists
    if (location.lat && location.lng) {
      addMarker(parseFloat(location.lat), parseFloat(location.lng), map);
    }

    // Initialize Places Autocomplete
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "in" }, // Restrict to India
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || "";

          updateLocation(lat, lng, address, map);
        }
      });
    }

    // Allow dragging marker to update location
    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      updateLocation(lat, lng, "", map);
    });
  };

  // Add or update marker
  const addMarker = (lat, lng, map) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Update location when marker is dragged
      markerRef.current.addListener("dragend", (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        reverseGeocode(newLat, newLng);
      });
    }
  };

  // Update location and address
  const updateLocation = async (lat, lng, address, map) => {
    setLocation({ lat, lng, address: address || "" });
    
    // Update marker
    if (map) {
      addMarker(lat, lng, map);
      map.setCenter({ lat, lng });
      map.setZoom(15);
    }

    // If address is not provided, reverse geocode
    if (!address) {
      await reverseGeocode(lat, lng);
    } else {
      // Update form store
      updateField("carLocationLat", lat.toString());
      updateField("carLocationLng", lng.toString());
      updateField("carLocationAddress", address);
    }
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    
    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error("Geocoding failed"));
          }
        });
      });

      const address = response;
      setLocation({ lat, lng, address });
      updateField("carLocationLat", lat.toString());
      updateField("carLocationLng", lng.toString());
      updateField("carLocationAddress", address);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      // Still save coordinates even if address lookup fails
      updateField("carLocationLat", lat.toString());
      updateField("carLocationLng", lng.toString());
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current) {
          await updateLocation(lat, lng, "", mapInstanceRef.current);
        } else {
          // If map not ready, just set location
          setLocation({ lat, lng, address: "" });
          await reverseGeocode(lat, lng);
        }

        setIsLoadingLocation(false);
      },
      (err) => {
        setIsLoadingLocation(false);
        setError("Unable to get your location. Please allow location access or search for a location.");
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location.lat || !location.lng) {
      setError("Please select a location for your car");
      return;
    }

    if (!location.address) {
      setError("Please wait while we get the address for this location");
      return;
    }

    // Location is already saved to store via updateField
    goToNext();
  };

  // Progress calculation
  const progressPercentage = (10 / 10) * 100;

  return (
    <div
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage}%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`,
      }}
    >
      <div className="registration-bg-image"></div>

      <Container fluid className="registration-container">
        <form onSubmit={handleSubmit}>
          <Row className="registration-content">
            <Col md={12}>
              <div className="mb-3 d-flex justify-content-end chippyTopText">
                <p className="py-3 px-5">
                  {details.brand || "Car"} {details.model || ""} - Set Pickup Location
                </p>
              </div>
            </Col>

            {/* Left Section */}
            <Col md={6} className="registration-info-section">
              <h1 className="registration-main-title brand-main-title">
                Where can buyers pick up your car?
              </h1>
              <p className="registration-description text-wrap">
                Set the location where buyers can come to view and pick up your car after purchase. 
                We'll automatically detect your current location, or you can search for a different address.
              </p>

              <div className="registration-progress">
                <div className="progress-text">Step 10 of 10</div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: "100%" }}></div>
                </div>
              </div>

              {/* Current Location Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="btn btn-primary w-100 py-3"
                  style={{
                    backgroundColor: "#1e3a8a",
                    borderColor: "#1e3a8a",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                  {isLoadingLocation ? "Getting Location..." : "Use My Current Location"}
                </button>
              </div>

              {error && (
                <div className="alert alert-warning mt-3" role="alert">
                  {error}
                </div>
              )}

              {/* Address Display */}
              {location.address && (
                <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <p className="mb-1 fw-semibold">Selected Location:</p>
                  <p className="mb-0 text-muted">{location.address}</p>
                </div>
              )}
            </Col>

            {/* Right Section */}
            <Col md={6} className="mobilePaddingSet">
              <div className="registration-form-card">
                <div className="form-card-header text-center">
                  <h4 className="form-card-title text-white fSize-6 fw-semibold">
                    Car Pickup Location
                  </h4>
                </div>

                <div className="registration-form">
                  {/* Search Input */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Search Location</label>
                    <div className="position-relative">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="position-absolute"
                        style={{
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="form-control py-3 px-3 ps-5 rounded-1"
                        placeholder="Search for an address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                    <small className="text-muted">Type an address to search</small>
                  </div>

                  {/* Map Container */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Map</label>
                    <div
                      ref={mapRef}
                      style={{
                        width: "100%",
                        height: "400px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      {!mapLoaded && (
                        <div
                          className="d-flex align-items-center justify-content-center h-100"
                          style={{ backgroundColor: "#f8f9fa" }}
                        >
                          <div className="text-center">
                            <div className="spinner-border text-primary mb-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted">Loading map...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <small className="text-muted">
                      Click on the map or drag the marker to set the exact location
                    </small>
                  </div>

                  {/* Address Display in Form */}
                  {location.address && (
                    <div className="mb-3 p-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <p className="mb-1 fw-semibold small">Address:</p>
                      <p className="mb-0 small text-muted">{location.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <div className="warraping d-flex align-items-center justify-content-between">
              <button
                type="button"
                className="nav-btn nav-btn-back"
                onClick={backTo9}
              >
                Back
              </button>

              <div className="registration-right-actions">
                <button
                  type="submit"
                  className="nav-btn nav-btn-next"
                  disabled={!location.lat || !location.lng || !location.address}
                >
                  Continue
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </button>
              </div>
            </div>
          </Row>
        </form>
      </Container>
    </div>
  );
}

export default LocationPicker;


