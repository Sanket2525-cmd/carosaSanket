"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, isGoogleMapsReady } from "@/utils/loadGoogleMaps";
import { useFormDataStore } from "@/store/formDataStore";

/**
 * Drive Hub Locations - Fixed list of Carosa Drive Hub locations
 */
const DRIVE_HUB_LOCATIONS = [
  {
    id: "delhi-ashok-vihar",
    name: "Delhi - Ashok Vihar",
    address: "Shop No.4, DDA Market, Swami Narayan Marg, Ashok Vihar, Phase 3, Delhi - 110052",
    lat: 28.7011,
    lng: 77.1810,
  },
  // {
  //   id: "noida-sector-63",
  //   name: "Noida - Sector 63",
  //   address: "H-161, Sector 63, BSI Business Park, Noida, Uttar Pradesh 201309",
  //   lat: 28.6253,
  //   lng: 77.3784,
  // },
  // Add more drive hub locations here as needed
];

/**
 * DriveHubLocationMap Component
 * Displays Google Maps with selected Drive Hub location
 * User can select from a dropdown of fixed drive hub locations
 */
function DriveHubLocationMap() {
  const { formData, updateField } = useFormDataStore();
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedHub, setSelectedHub] = useState(
    formData.driveHubLocation || ""
  );
  
  // Initialize location from form data if available
  const getInitialLocation = () => {
    if (formData.driveHubLocation) {
      const hub = DRIVE_HUB_LOCATIONS.find((h) => h.id === formData.driveHubLocation);
      if (hub) {
        return {
          lat: hub.lat,
          lng: hub.lng,
          address: hub.address,
        };
      }
    }
    // Or use saved coordinates if available
    if (formData.driveHubLocationLat && formData.driveHubLocationLng) {
      return {
        lat: parseFloat(formData.driveHubLocationLat),
        lng: parseFloat(formData.driveHubLocationLng),
        address: formData.driveHubLocationAddress || "",
      };
    }
    return { lat: null, lng: null, address: "" };
  };

  const [location, setLocation] = useState(getInitialLocation());

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMountedRef = useRef(true);

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
      });

    return () => {
      isMountedRef.current = false;

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
    };
  }, []);

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

    // Default center (India center)
    const defaultCenter = { lat: 28.6139, lng: 77.2090 };

    // Use selected location if available (validate it's a number)
    const hasValidLocation = 
      location.lat !== null && 
      location.lng !== null && 
      typeof location.lat === "number" && 
      typeof location.lng === "number" &&
      isFinite(location.lat) &&
      isFinite(location.lng);

    const initialCenter = hasValidLocation
      ? { lat: Number(location.lat), lng: Number(location.lng) }
      : defaultCenter;

    try {
      const mapContainer = mapRef.current;
      
      if (!mapContainer) {
        return;
      }

      // Create map
      const map = new window.google.maps.Map(mapContainer, {
        center: initialCenter,
        zoom: hasValidLocation ? 15 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // If location exists, add marker and center map
      if (hasValidLocation) {
        updateLocation(Number(location.lat), Number(location.lng), location.address, map);
      } else if (selectedHub) {
        // If we have a selected hub but no location yet, show it
        const hub = DRIVE_HUB_LOCATIONS.find((h) => h.id === selectedHub);
        if (hub) {
          updateLocation(hub.lat, hub.lng, hub.address, map);
        }
      }
    } catch (err) {
      console.error("Error initializing map:", err);
    }
  };

  // Handle hub selection from dropdown
  const handleHubSelection = (hubId) => {
    const hub = DRIVE_HUB_LOCATIONS.find((h) => h.id === hubId);
    if (!hub) return;

    setSelectedHub(hubId);
    setLocation({
      lat: hub.lat,
      lng: hub.lng,
      address: hub.address,
    });

    // Update map if initialized
    if (mapInstanceRef.current) {
      updateLocation(hub.lat, hub.lng, hub.address, mapInstanceRef.current);
    } else {
      // Wait for map to initialize
      const checkMap = setInterval(() => {
        if (mapInstanceRef.current && isMountedRef.current) {
          clearInterval(checkMap);
          updateLocation(hub.lat, hub.lng, hub.address, mapInstanceRef.current);
        }
      }, 100);

      setTimeout(() => clearInterval(checkMap), 5000);
    }

    // Save to form store
    saveLocationToStore(hub.lat, hub.lng, hub.address, hubId);
  };

  // Update location on map
  const updateLocation = (lat, lng, address, map) => {
    if (!isMountedRef.current || !map) return;

    // Validate coordinates are numbers
    const numLat = typeof lat === "number" ? lat : parseFloat(lat);
    const numLng = typeof lng === "number" ? lng : parseFloat(lng);

    if (isNaN(numLat) || isNaN(numLng) || !isFinite(numLat) || !isFinite(numLng)) {
      console.error("Invalid coordinates in updateLocation:", { lat, lng });
      return;
    }

    try {
      // Update map center and zoom
      map.setCenter({ lat: numLat, lng: numLng });
      map.setZoom(15);
      
      // Add or update marker
      addMarker(numLat, numLng, map);
    } catch (err) {
      console.error("Error updating location:", err);
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
          title: "Drive Hub Location",
        });
      }
    } catch (err) {
      console.error("Error adding marker:", err);
    }
  };

  // Save location to form data store
  const saveLocationToStore = (lat, lng, address, hubId) => {
    try {
      updateField("driveHubLocation", hubId);
      updateField("driveHubLocationLat", lat.toString());
      updateField("driveHubLocationLng", lng.toString());
      updateField("driveHubLocationAddress", address);
    } catch (err) {
      console.error("Error saving location to store:", err);
    }
  };

  return (
    <>
      {/* Drive Hub Location Dropdown */}
      <div className="mb-3">
        <label className="form-label fw-semibold small mb-2" style={{ fontSize: "0.875rem" }}>
          Drive hub location
        </label>
        <select
          className="form-control addressSelect"
          value={selectedHub}
          onChange={(e) => handleHubSelection(e.target.value)}
          style={{ 
            color: selectedHub ? "#000" : "#6c757d",
            fontSize: "0.875rem",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ced4da",
          }}
        >
          <option value="" disabled hidden>
            Select Drive Hub Location
          </option>
          {DRIVE_HUB_LOCATIONS.map((hub) => (
            <option key={hub.id} value={hub.id} style={{ color: "#000" }}>
              {hub.name}
            </option>
          ))}
        </select>
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          Select a drive hub location from the list
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

      {/* Address Display */}
      {location.address && (
        <div
          className="spaceLocation rounded-5 mt-2"
          style={{ backgroundColor: "#f8f9fa", padding: "10px" }}
        >
          <p className="m-0 fSize-3 fw-normal text-dark">{location.address}</p>
        </div>
      )}
    </>
  );
}

export default DriveHubLocationMap;

