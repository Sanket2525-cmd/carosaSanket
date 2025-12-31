"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { loadGoogleMaps, isGoogleMapsReady } from "@/utils/loadGoogleMaps";
import { useFormDataStore } from "@/store/formDataStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * InteractiveLocationMap Component
 * Displays Google Maps with user's current location
 * Automatically requests location permission and shows live location
 * Includes search functionality to find pickup locations
 */
function InteractiveLocationMap() {
  const { formData, updateField } = useFormDataStore();
  
  // Helper function to safely parse lat/lng to numbers
  const parseCoordinate = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(parsed) ? null : parsed;
  };

  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState({
    lat: parseCoordinate(formData.carLocationLat),
    lng: parseCoordinate(formData.carLocationLng),
    address: formData.carLocationAddress || "",
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState("");
  const [permissionStatus, setPermissionStatus] = useState("prompt"); // 'prompt', 'granted', 'denied'
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUserSearched, setHasUserSearched] = useState(false); // Track if user has searched a location

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);
  const isMountedRef = useRef(true);
  const checkMapIntervalRef = useRef(null);

  // Save location to form data store - wrapped in useCallback for stability
  // MUST be defined before useEffect that uses it
  const saveLocationToStore = useCallback((lat, lng, address) => {
    try {
      updateField("carLocationLat", lat.toString());
      updateField("carLocationLng", lng.toString());
      updateField("carLocationAddress", address);
    } catch (err) {
      console.error("Error saving location to store:", err);
    }
  }, [updateField]);

  // Load Google Maps API using shared utility
  useEffect(() => {
    if (typeof window === "undefined") return;
    isMountedRef.current = true;

    // Check if already loaded
    if (isGoogleMapsReady()) {
      if (isMountedRef.current) {
        setMapLoaded(true);
        initializeMap();
      }
      return;
    }

    // Load Google Maps (will only load once even if called multiple times)
    loadGoogleMaps()
      .then(() => {
        if (isMountedRef.current) {
          setMapLoaded(true);
          initializeMap();
        }
      })
      .catch((err) => {
        console.error("Failed to load Google Maps:", err);
        if (isMountedRef.current) {
          setError("Failed to load Google Maps. Please refresh the page.");
          setIsLoadingLocation(false);
        }
      });

    return () => {
      isMountedRef.current = false;
      
      // Clear any intervals
      if (checkMapIntervalRef.current) {
        clearInterval(checkMapIntervalRef.current);
        checkMapIntervalRef.current = null;
      }

      // Clean up map instance and marker before React unmounts
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
          markerRef.current = null;
        } catch (err) {
          console.warn("Error cleaning up marker:", err);
        }
      }

      if (mapInstanceRef.current) {
        try {
          // Clear all listeners and set map to null
          if (window.google && window.google.maps && window.google.maps.event) {
            window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
          }
          mapInstanceRef.current = null;
        } catch (err) {
          console.warn("Error cleaning up map:", err);
        }
      }

      // Clean up autocomplete
      if (autocompleteRef.current) {
        try {
          if (window.google && window.google.maps && window.google.maps.event) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
          }
          autocompleteRef.current = null;
        } catch (err) {
          console.warn("Error cleaning up autocomplete:", err);
        }
      }
    };
  }, []);

  // Save location to store whenever location state changes
  // Priority: Searched location > Live location
  // Only save if:
  // 1. User has searched a location (hasUserSearched = true) - always save searched location
  // 2. User hasn't searched (hasUserSearched = false) - save live location only if we have address
  useEffect(() => {
    if (location.lat && location.lng && location.address && isMountedRef.current) {
      // If user searched, always save the searched location (it overrides live location)
      // If user didn't search, save the live location (only if we have an address from reverse geocoding)
      if (hasUserSearched) {
        // User searched - save the searched location
        saveLocationToStore(location.lat, location.lng, location.address);
      } else {
        // User didn't search - save live location (only if address is available)
        // This ensures we don't save incomplete live location data
        if (location.address && location.address.trim().length > 0) {
          saveLocationToStore(location.lat, location.lng, location.address);
        }
      }
    }
  }, [location.lat, location.lng, location.address, hasUserSearched, saveLocationToStore]);

  // Check geolocation permission status and auto-request location
  useEffect(() => {
    if (typeof navigator === "undefined") return;

    // Check permission status if API is available
    if ("permissions" in navigator) {
      let permissionResult = null;
      
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          permissionResult = result;
          if (isMountedRef.current) {
            setPermissionStatus(result.state);
            
            // If permission is granted, get location automatically
            if (result.state === "granted" && mapLoaded) {
              getCurrentLocation();
            }
          }
          result.onchange = () => {
            if (isMountedRef.current) {
              setPermissionStatus(result.state);
              // If permission changes to granted, get location
              if (result.state === "granted" && mapLoaded) {
                getCurrentLocation();
              }
            }
          };
        })
        .catch(() => {
          // Permission API not supported, will try to get location anyway
        });

      return () => {
        // Clean up permission listener
        if (permissionResult && permissionResult.onchange) {
          permissionResult.onchange = null;
        }
      };
    }
  }, [mapLoaded]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      setPermissionStatus("denied");
      return;
    }

    setIsLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update permission status to granted
        if (isMountedRef.current) {
          setPermissionStatus("granted");
        }

        // Update map if already initialized
        if (mapInstanceRef.current) {
          await handleLocationUpdate(lat, lng, "", mapInstanceRef.current);
        } else {
          // If map not ready, wait for it
          if (checkMapIntervalRef.current) {
            clearInterval(checkMapIntervalRef.current);
          }
          
          checkMapIntervalRef.current = setInterval(() => {
            if (mapInstanceRef.current && isMountedRef.current) {
              clearInterval(checkMapIntervalRef.current);
              checkMapIntervalRef.current = null;
              handleLocationUpdate(lat, lng, "", mapInstanceRef.current);
            }
          }, 100);

          // Clear interval after 5 seconds
          setTimeout(() => {
            if (checkMapIntervalRef.current) {
              clearInterval(checkMapIntervalRef.current);
              checkMapIntervalRef.current = null;
            }
          }, 5000);
        }
      },
      (err) => {
        if (!isMountedRef.current) return;

        setIsLoadingLocation(false);
        
        // Only set permission status to denied for actual permission errors
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionStatus("denied");
        }

        let errorMessage = "";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please use the search field above to select a pickup location, or enable location permissions in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please use the search field to select a pickup location.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please use the search field to select a pickup location.";
            break;
          default:
            errorMessage = "Unable to get your location. Please use the search field to select a pickup location.";
            break;
        }

        setError(errorMessage);
        
        // Only log non-timeout errors to console (timeouts are common and not critical)
        // This prevents console error overlay from appearing for normal timeout scenarios
        if (err.code !== err.TIMEOUT) {
          console.warn("Geolocation error:", {
            code: err.code,
            message: err.message || errorMessage,
            codeName: err.code === err.PERMISSION_DENIED ? "PERMISSION_DENIED" :
                     err.code === err.POSITION_UNAVAILABLE ? "POSITION_UNAVAILABLE" :
                     err.code === err.TIMEOUT ? "TIMEOUT" : "UNKNOWN"
          });
        } else {
          // For timeouts, just log a debug message (not an error)
          console.debug("Geolocation request timed out - user can search for location instead");
        }
        
        // Don't set any default location - let user search instead
      },
      {
        enableHighAccuracy: false, // Changed to false - high accuracy can cause timeouts
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 60000, // Allow cached location up to 1 minute old
      }
    );
  };

  // Initialize map when Google Maps is loaded
  const initializeMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current || !isMountedRef.current) return;

    // Prevent multiple map initializations
    if (mapInstanceRef.current) {
      return;
    }

    // Ensure the map container is still in the DOM
    if (!mapRef.current || !document.body.contains(mapRef.current)) {
      return;
    }

    // Use saved location if available, otherwise we'll use live location
    // If no location yet, we'll center on live location once we get it
    const hasValidLocation = 
      location.lat !== null && 
      location.lng !== null && 
      typeof location.lat === "number" && 
      typeof location.lng === "number" &&
      isFinite(location.lat) &&
      isFinite(location.lng);

    const initialCenter = hasValidLocation
      ? { lat: Number(location.lat), lng: Number(location.lng) }
      : { lat: 28.6139, lng: 77.2090 }; // Temporary center (Delhi) - will update to live location

    try {
      // Create map - ensure container is ready
      const mapContainer = mapRef.current;
      
      if (!mapContainer) {
        return;
      }

      // Create map - Google Maps will handle its own DOM
      const map = new window.google.maps.Map(mapContainer, {
        center: initialCenter,
        zoom: location.lat && location.lng ? 15 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Initialize Places Autocomplete for search (after a small delay to ensure DOM is ready)
      setTimeout(() => {
        if (isMountedRef.current && searchInputRef.current) {
          initializeAutocomplete(map);
        }
      }, 100);

      // Always try to get live location first
      // If we have saved location from form, show it temporarily but still get live location
      if (hasValidLocation) {
        addMarker(Number(location.lat), Number(location.lng), map);
      }
      
      // Always request live location (browser will show permission prompt if needed)
      // This will update the map to show user's current location
      getCurrentLocation();
    } catch (err) {
      console.error("Error initializing map:", err);
      if (isMountedRef.current) {
        setError("Failed to initialize map. Please refresh the page.");
      }
    }
  };

  // Initialize Google Places Autocomplete
  const initializeAutocomplete = (map) => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !searchInputRef.current) {
      return;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "in" }, // Restrict to India
          fields: ["geometry", "formatted_address", "address_components"],
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || "";

          // Mark that user has searched - this will override live location
          if (isMountedRef.current) {
            setHasUserSearched(true);
          }

          // Mark this as from search so it overrides live location
          handleLocationUpdate(lat, lng, address, map, true);
          
          // Update search query to show selected address
          if (isMountedRef.current) {
            setSearchQuery(address);
          }
        }
      });
    } catch (err) {
      console.error("Error initializing autocomplete:", err);
    }
  };

  // Update map location
  const updateMapLocation = async (lat, lng) => {
    if (!mapInstanceRef.current || !isMountedRef.current) return;

    // Validate coordinates are numbers
    const numLat = typeof lat === "number" ? lat : parseFloat(lat);
    const numLng = typeof lng === "number" ? lng : parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng) || !isFinite(numLat) || !isFinite(numLng)) {
      console.error("Invalid coordinates:", { lat, lng });
      return;
    }

    try {
      const map = mapInstanceRef.current;
      const newCenter = { lat: numLat, lng: numLng };

      map.setCenter(newCenter);
      map.setZoom(15);
      addMarker(numLat, numLng, map);
    } catch (err) {
      console.error("Error updating map location:", err);
    }
  };

  // Handle location update (from search or geolocation)
  const handleLocationUpdate = async (lat, lng, address, map, isFromSearch = false) => {
    if (!isMountedRef.current) return;

    // Validate coordinates
    const numLat = typeof lat === "number" ? lat : parseFloat(lat);
    const numLng = typeof lng === "number" ? lng : parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng) || !isFinite(numLat) || !isFinite(numLng)) {
      console.error("Invalid coordinates in handleLocationUpdate:", { lat, lng });
      return;
    }

    // Update local state
    setLocation({ lat: numLat, lng: numLng, address: address || "" });
    setIsLoadingLocation(false);
    setError("");

    // Update map
    if (map || mapInstanceRef.current) {
      const mapToUse = map || mapInstanceRef.current;
      await updateMapLocation(numLat, numLng);
    }

    // If address is not provided, reverse geocode
    if (!address) {
      await reverseGeocode(numLat, numLng);
    } else {
      // Save to form store
      saveLocationToStore(numLat, numLng, address);
    }
  };


  // Add or update marker
  const addMarker = (lat, lng, map) => {
    if (!isMountedRef.current || !map) return;

    // Validate coordinates are numbers
    const numLat = typeof lat === "number" ? lat : parseFloat(lat);
    const numLng = typeof lng === "number" ? lng : parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng) || !isFinite(numLat) || !isFinite(numLng)) {
      console.error("Invalid coordinates for marker:", { lat, lng });
      return;
    }

    try {
      const position = { lat: numLat, lng: numLng };
      
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: position,
          map: map,
          draggable: false,
          animation: window.google.maps.Animation.DROP,
          title: "Your Location",
        });
      }
    } catch (err) {
      console.error("Error adding marker:", err);
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
      if (isMountedRef.current) {
        // Update location state - useEffect will handle saving to store
        setLocation((prev) => ({
          ...prev,
          address,
        }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      // Set a default address if geocoding fails
      if (isMountedRef.current) {
        const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setLocation((prev) => ({
          ...prev,
          address: fallbackAddress,
        }));
        // useEffect will handle saving to store
      }
    }
  };

  return (
    <>
      {/* Search Input */}
      <div className="mb-3">
        <label className="form-label fw-semibold small mb-2" style={{ fontSize: "0.875rem" }}>
          Search for pickup location
        </label>
        <div className="position-relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="position-absolute"
            style={{
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
              fontSize: "0.875rem",
              zIndex: 1,
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            className="form-control py-2 pe-2 ps-5 rounded-3"
            placeholder="Search for an address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "1px solid #e5e7eb",
              fontSize: "0.875rem",
            }}
          />
        </div>
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          Type an address to search for pickup location
        </small>
      </div>

      {/* Map Container */}
      <div style={{ position: "relative", width: "100%", height: "250px" }}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        />
        {!mapLoaded && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: "#f8f9fa",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              borderRadius: "12px",
            }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Loading map...</span>
              </div>
              <p className="text-muted small mb-0">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-warning mt-2 py-2 px-3 rounded-3"
          role="alert"
          style={{ fontSize: "0.875rem" }}
        >
          <small>{error}</small>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoadingLocation && (
        <div className="mt-2 text-center">
          <small className="text-muted">
            <span className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </span>
            Getting your location...
          </small>
        </div>
      )}

      {/* Address Display */}
      <div
        className="spaceLocation rounded-5 mt-2"
        style={{ backgroundColor: "#f8f9fa", padding: "10px" }}
      >
        {location.address ? (
          <p className="m-0 fSize-3 fw-normal text-dark">{location.address}</p>
        ) : (
          <p className="m-0 fSize-3 fw-normal text-muted">
            {isLoadingLocation
              ? "Detecting your location..."
              : "Location not available"}
          </p>
        )}
      </div>

    </>
  );
}

export default InteractiveLocationMap;

