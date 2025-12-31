/**
 * Utility to load Google Maps API script only once
 * Prevents multiple script loads across components
 */

let googleMapsLoadingPromise = null;
let isGoogleMapsLoaded = false;

/**
 * Load Google Maps API script
 * @returns {Promise<void>} Resolves when Google Maps is ready
 */
export function loadGoogleMaps() {
  // If already loaded, return resolved promise
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    isGoogleMapsLoaded = true;
    return Promise.resolve();
  }

  // If already loading, return the existing promise
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise;
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector(
    'script[src*="maps.googleapis.com/maps/api/js"]'
  );

  if (existingScript) {
    // Script exists but not loaded yet, wait for it
    googleMapsLoadingPromise = new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          isGoogleMapsLoaded = true;
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isGoogleMapsLoaded) {
          reject(new Error("Google Maps failed to load"));
        }
      }, 10000);
    });

    return googleMapsLoadingPromise;
  }

    // Create new loading promise
    googleMapsLoadingPromise = new Promise((resolve, reject) => {
      // Support both environment variable names for compatibility
      const apiKey = 
        process.env.NEXT_PUBLIC_FRONTEND_GOOGLE_MAPS_API_KEY || 
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
        "";

      if (!apiKey) {
        reject(new Error("Google Maps API key is not configured"));
        return;
      }

    // Create unique callback name
    const callbackName = `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set up callback
    window[callbackName] = () => {
      isGoogleMapsLoaded = true;
      // Clean up callback
      if (window[callbackName]) {
        delete window[callbackName];
      }
      resolve();
    };

    // Create and append script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script";

    script.onerror = () => {
      // Clean up on error
      if (window[callbackName]) {
        delete window[callbackName];
      }
      googleMapsLoadingPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return googleMapsLoadingPromise;
}

/**
 * Check if Google Maps is already loaded
 * @returns {boolean}
 */
export function isGoogleMapsReady() {
  return (
    typeof window !== "undefined" &&
    window.google &&
    window.google.maps &&
    isGoogleMapsLoaded
  );
}

