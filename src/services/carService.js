// Car Service for API integration
import { API_BASE_URL } from '../config/environment';

class CarService {
  // Helper function to get CSRF token from cookies
  static getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let cookie of cookieArray) {
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  // Helper function to get access token from cookies
  static getAccessToken() {
    const name = 'accessToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let cookie of cookieArray) {
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  /**
   * Create a new car listing
   * @param {Object} carData - Car data from the registration form
   * @returns {Promise<Object>} API response
   */
  static async createCar(carData, status = 'LISTED') {
    try {
      console.log('Creating car with data:', carData);
      console.log('Creating car with status:', status);
      
      // Transform form data to API format for /listings endpoint
      const apiData = this.transformFormDataToListingsAPI(carData);
      console.log('Transformed API data for listings:', apiData);

      // Create FormData for backend upload middleware
      const formData = new FormData();
      
      // Add all flat fields expected by createCarListingUnified
      if (apiData.regYear) formData.append('regYear', apiData.regYear);
      if (apiData.mfgYear) formData.append('mfgYear', apiData.mfgYear);
      if (apiData.brand) formData.append('brand', apiData.brand);
      if (apiData.model) formData.append('model', apiData.model);
      if (apiData.owner) formData.append('owner', apiData.owner);
      if (apiData.variant) formData.append('variant', apiData.variant);
      if (apiData.fuelType) formData.append('fuelType', apiData.fuelType);
      if (apiData.isActive !== undefined) formData.append('isActive', String(apiData.isActive));
      if (apiData.kmDriven) formData.append('kmDriven', apiData.kmDriven);
      if (apiData.noofseat) formData.append('noofseat', apiData.noofseat);
      if (apiData.spareKey) formData.append('spareKey', apiData.spareKey);
      if (apiData.warranty) formData.append('warranty', apiData.warranty);
      if (apiData.insurance) formData.append('insurance', apiData.insurance);
      if (apiData.offerPrice !== undefined && apiData.offerPrice !== null) formData.append('offerPrice', String(apiData.offerPrice));
      if (apiData.vinImageUrl) formData.append('vinImageUrl', apiData.vinImageUrl);
      if (apiData.listingPrice !== undefined && apiData.listingPrice !== null) formData.append('listingPrice', String(apiData.listingPrice));
      if (apiData.transmission) formData.append('transmission', apiData.transmission);
      if (apiData.warrantyDate) formData.append('warrantyDate', apiData.warrantyDate);
      if (apiData.warrantyType) formData.append('warrantyType', apiData.warrantyType);
      if (apiData.exteriorColor) formData.append('exteriorColor', apiData.exteriorColor);
      if (apiData.insuranceDate) formData.append('insuranceDate', apiData.insuranceDate);
      if (apiData.insuranceType) formData.append('insuranceType', apiData.insuranceType);
      if (apiData.engineCapacity) formData.append('engineCapacity', apiData.engineCapacity);
      if (apiData.registrationNumber) formData.append('registrationNumber', apiData.registrationNumber);
      
      // Location data - pickup location (from current location or search)
      if (apiData.carLocationLat) formData.append('carLocationLat', apiData.carLocationLat);
      if (apiData.carLocationLng) formData.append('carLocationLng', apiData.carLocationLng);
      if (apiData.carLocationAddress) formData.append('carLocationAddress', apiData.carLocationAddress);
      
      // Drive hub location (if selected)
      if (apiData.driveHubLocation) formData.append('driveHubLocation', apiData.driveHubLocation);
      if (apiData.driveHubLocationLat) formData.append('driveHubLocationLat', apiData.driveHubLocationLat);
      if (apiData.driveHubLocationLng) formData.append('driveHubLocationLng', apiData.driveHubLocationLng);
      if (apiData.driveHubLocationAddress) formData.append('driveHubLocationAddress', apiData.driveHubLocationAddress);
      
      // Handle status (LISTED or PENDING for drafts)
      if (status) {
        formData.append('status', status);
      }
      
      // Handle additionalFeatures array
      if (apiData.additionalFeatures && Array.isArray(apiData.additionalFeatures) && apiData.additionalFeatures.length > 0) {
        formData.append('additionalFeatures', JSON.stringify(apiData.additionalFeatures));
      }

      // Handle image uploads - categorize into exteriorPhotos, interiorPhotos, highlightPhotos, tyrePhotos
      if (carData.images && Array.isArray(carData.images) && carData.images.length > 0) {
        console.log('📤 Processing images for upload:', carData.images.length, 'images');
        console.log('📤 First image structure:', carData.images[0]);
        
        const mapSectionToField = (section) => {
          if (!section) return 'exteriorPhotos';
          const s = String(section).toLowerCase().trim();
          if (s === 'exterior') return 'exteriorPhotos';
          if (s === 'interior') return 'interiorPhotos';
          if (s === 'highlights' || s === 'attractions') return 'highlightPhotos';
          if (s === 'tyres' || s === 'tyre') return 'tyrePhotos';
          return 'exteriorPhotos';
        };

        const base64ToFile = (base64String, fileName, mimeType) => {
          try {
            if (!base64String || typeof base64String !== 'string') {
              console.error('Invalid base64 string:', typeof base64String);
              return null;
            }

            // Extract base64 data (remove data:image/...;base64, prefix if present)
            const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
            
            if (!base64Data || base64Data.trim().length === 0) {
              console.error('Empty base64 data');
              return null;
            }

            // Decode base64
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let j = 0; j < byteCharacters.length; j++) {
              byteNumbers[j] = byteCharacters.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType || 'image/jpeg' });
            
            if (blob.size === 0) {
              console.error('Blob size is 0 after conversion');
              return null;
            }
            
            const file = new File([blob], fileName || 'image.jpg', { type: mimeType || 'image/jpeg' });
            console.log(`✅ Converted base64 to File: ${file.name}, size: ${file.size} bytes`);
            return file;
          } catch (error) {
            console.error('Error converting base64 to File:', error, 'base64String length:', base64String?.length);
            return null;
          }
        };

        const categorizedImages = {
          exteriorPhotos: [],
          interiorPhotos: [],
          highlightPhotos: [],
          tyrePhotos: []
        };

        for (let i = 0; i < carData.images.length; i++) {
          const img = carData.images[i];
          if (!img) {
            console.warn(`⚠️ Image ${i} is null or undefined`);
            continue;
          }

          // Extract section from multiple possible locations (order matters - check most likely first)
          const section = img.section || 
                         img.item?.section || 
                         img.category || 
                         img.item?.category || 
                         null;
          
          const fieldName = mapSectionToField(section);
          console.log(`📸 Image ${i} - section: "${section}" → field: "${fieldName}"`);

          let file = null;

          // Priority 1: Try File object first (if still available, not persisted)
          if (img?.file instanceof File && img.file.size > 0) {
            file = img.file;
            console.log(`✅ Image ${i}: Using File object directly, size: ${file.size} bytes`);
          } 
          // Priority 2: Check if image itself is a File
          else if (img instanceof File && img.size > 0) {
            file = img;
            console.log(`✅ Image ${i}: Image is File object, size: ${file.size} bytes`);
          }
          // Priority 3: Convert from base64 in item.src (most common after localStorage persistence)
          else if (img?.item?.src) {
            const src = img.item.src;
            if (src && typeof src === 'string' && src.startsWith('data:image/')) {
              const mimeMatch = src.match(/data:([^;]+);/);
              const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              const fileName = img.item?.name || `image_${i}_${fieldName}.jpg`;
              file = base64ToFile(src, fileName, mimeType);
              if (file) {
                console.log(`✅ Image ${i}: Converted from item.src base64`);
              }
            } else if (src && typeof src === 'string' && src.startsWith('blob:')) {
              // Blob URL - cannot convert, skip
              console.warn(`⚠️ Image ${i}: Blob URL cannot be converted (${src.substring(0, 30)}...)`);
            }
          } 
          // Priority 4: Check for base64 in root src property
          else if (img?.src && typeof img.src === 'string' && img.src.startsWith('data:image/')) {
            const mimeMatch = img.src.match(/data:([^;]+);/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            file = base64ToFile(img.src, `image_${i}_${fieldName}.jpg`, mimeType);
            if (file) {
              console.log(`✅ Image ${i}: Converted from root src base64`);
            }
          } 
          // Priority 5: Check if image is a base64 string directly
          else if (typeof img === 'string' && img.startsWith('data:image/')) {
            const mimeMatch = img.match(/data:([^;]+);/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            file = base64ToFile(img, `image_${i}_${fieldName}.jpg`, mimeType);
            if (file) {
              console.log(`✅ Image ${i}: Converted from string base64`);
            }
          } else {
            console.warn(`⚠️ Image ${i}: Unknown format, cannot process:`, {
              hasFile: !!img?.file,
              isFile: img instanceof File,
              hasItemSrc: !!img?.item?.src,
              hasSrc: !!img?.src,
              isString: typeof img === 'string',
              imgType: typeof img,
              imgKeys: Object.keys(img || {})
            });
          }

          if (file && file instanceof File && file.size > 0) {
            categorizedImages[fieldName].push(file);
            console.log(`✅ Image ${i} added to ${fieldName}`);
          } else {
            console.error(`❌ Failed to process image ${i} - no valid file created`);
          }
        }

        const totalFiles = Object.values(categorizedImages).reduce((sum, arr) => sum + arr.length, 0);
        console.log(`📤 Processed ${totalFiles} images for upload:`, {
          exteriorPhotos: categorizedImages.exteriorPhotos.length,
          interiorPhotos: categorizedImages.interiorPhotos.length,
          highlightPhotos: categorizedImages.highlightPhotos.length,
          tyrePhotos: categorizedImages.tyrePhotos.length
        });

        // Append to FormData
        Object.keys(categorizedImages).forEach(fieldName => {
          categorizedImages[fieldName].forEach((file, index) => {
            formData.append(fieldName, file);
            console.log(`📤 Appended ${fieldName}[${index}]: ${file.name} (${file.size} bytes)`);
          });
        });

        // Log FormData contents for debugging
        console.log('📤 FormData entries:', Array.from(formData.entries()).map(([key, value]) => 
          [key, value instanceof File ? `${value.name} (${value.size} bytes)` : String(value).substring(0, 50)]
        ));
      } else {
        console.warn('⚠️ No images found in carData.images:', carData.images);
      }

      console.log('Making API call to:', `${API_BASE_URL}/api/cars/listings`);
      console.log('Request method: POST');
      console.log('Request headers:', {
        'X-CSRF-TOKEN': this.getCsrfToken()
      });

      const response = await fetch(`${API_BASE_URL}/api/cars/listings`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        credentials: 'include',
        body: formData
      });
      
      console.log('API call completed. Response status:', response.status);

      const data = await response.json();
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', data);
      
      if (response.ok && data.success) {
        console.log('Car created successfully:', data.data);
        return {
          success: true,
          data: data.data,
          message: data.message || 'Car created successfully'
        };
      } else {
        // Handle different types of errors from backend
        let errorMessage = data.message || 'Failed to create car';
        
        if (response.status === 401) {
          // Authentication error - user needs to login
          errorMessage = 'Authentication required. Please login to create a car listing.';
          console.error('Authentication error - user not logged in or token expired');
        } else if (response.status === 403) {
          // Permission error
          errorMessage = 'Permission denied. Your account may be disabled or not verified.';
          console.error('Permission denied:', data.message);
        } else if (response.status === 422) {
          // Validation errors from backend
          console.log('Full response data:', data);
          console.log('Response errors:', data.errors);
          
          if (data.errors && typeof data.errors === 'object') {
            const validationErrors = Object.entries(data.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            errorMessage = `Validation errors: ${validationErrors}`;
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = 'Validation error: Please check all required fields';
          }
          console.error('Validation errors:', data.errors || 'No errors object found');
        } else if (response.status >= 500) {
          // Server error - check for specific database constraint errors
          if (data.message && data.message.includes('Unique constraint failed')) {
            if (data.message.includes('registrationNo')) {
              errorMessage = 'This car is already published or listed. Please use a different registration number.';
            } else {
              errorMessage = 'This car listing already exists. Please check your details and try again.';
            }
          } else {
            errorMessage = 'Server error. Please try again later.';
          }
          console.error('Server error:', data.message);
        }
        
        console.error('API Error Response:', {
          status: response?.status || 'unknown',
          statusText: response?.statusText || 'unknown',
          data: data || 'no data',
          url: `${API_BASE_URL}/api/cars/listings`
        });
        
        return {
          success: false,
          message: errorMessage,
          status: response.status,
          errors: data.errors || null
        };
      }
    } catch (error) {
      console.error('Car creation error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Transform form data to API format for /listings endpoint (createCarListingUnified)
   * @param {Object} formData - Form data from registration
   * @returns {Object} API formatted data with flat fields
   */
  static transformFormDataToListingsAPI(formData) {
    // helpers
    const cleanString = (str) =>
      str != null && String(str).trim() !== "" ? String(str).trim() : null;

    const parsePrice = (priceStr) => {
      if (!priceStr && priceStr !== 0) return null;
      const cleanPrice = String(priceStr)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .replace(/Lakh/gi, "")
        .replace(/\s+/g, "")
        .trim();
      const num = parseFloat(cleanPrice);
      return Number.isFinite(num) && num > 0 ? num : null;
    };

    // Helper to convert YYYY-MM format to "Month, YYYY" format
    const formatYearToLabel = (value) => {
      if (!value) return null;
      const str = String(value).trim();
      
      // If already in "Month, YYYY" format, return as is
      if (/^[A-Za-z]+\s*,\s*\d{4}$/.test(str)) {
        return str;
      }
      
      // If in YYYY-MM format, convert to "Month, YYYY"
      const match = str.match(/^(\d{4})-(\d{1,2})$/);
      if (match) {
        const year = parseInt(match[1], 10);
        const monthNum = parseInt(match[2], 10);
        if (Number.isFinite(year) && Number.isFinite(monthNum) && monthNum >= 1 && monthNum <= 12) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthNames[monthNum - 1]}, ${year}`;
        }
      }
      
      return str; // Return as is if can't parse
    };

    // Extract year fields
    const regYearLabel =
      cleanString(formData.regYearFormatted) ||
      (formData.year ? formatYearToLabel(formData.year) : null) ||
      (formData.regYear ? formatYearToLabel(formData.regYear) : null) ||
      cleanString(formData.regYear) ||
      null;

    const mfgYearLabel =
      cleanString(formData.mfgYearFormatted) ||
      (formData.mfgYear ? formatYearToLabel(formData.mfgYear) : null) ||
      cleanString(formData.mfgYear) ||
      null;

    // Color normalization
    const toTitle = (s) =>
      !s ? s : s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

    const exteriorColorInput =
      cleanString(formData.exteriorColor) ||
      cleanString(formData.color) ||
      cleanString(formData.bodyColor) ||
      "White";

    const exteriorColor = toTitle(exteriorColorInput);

    // KM driven - clean and convert to string
    const kmValue = formData.kmDriven || formData.km;
    const cleanedKm = kmValue ? String(kmValue).replace(/,/g, "").replace(/[^\d]/g, "") : "";

    // Owner - normalize to string
    const ownerValue = formData.owner || formData.ownerSrNo || "1";
    const ownerStr = typeof ownerValue === 'number' ? String(ownerValue) : String(ownerValue);

    // Return flat structure matching createCarListingUnified expectations
    return {
      regYear: regYearLabel,
      mfgYear: mfgYearLabel,
      brand: cleanString(formData.brand) || "",
      model: cleanString(formData.model) || "",
      owner: ownerStr,
      variant: cleanString(formData.variant) || "",
      fuelType: cleanString(formData.fuelType) || cleanString(formData.fuel) || "",
      isActive: formData.isActive !== undefined ? !!formData.isActive : true,
      kmDriven: cleanedKm,
      noofseat: cleanString(formData.noofseat) || null,
      spareKey: cleanString(formData.spareKey) || "No",
      warranty: cleanString(formData.warranty) || "No",
      insurance: cleanString(formData.insurance) || "No",
      offerPrice: parsePrice(formData.offerPrice),
      vinImageUrl: cleanString(formData.vinImageUrl) || null,
      listingPrice: parsePrice(formData.listingPrice),
      transmission: cleanString(formData.transmission) || "",
      warrantyDate: cleanString(formData.warrantyDate) || null,
      warrantyType: cleanString(formData.warrantyType) || null,
      exteriorColor: exteriorColor,
      insuranceDate: cleanString(formData.insuranceDate) || null,
      insuranceType: cleanString(formData.insuranceType) || null,
      engineCapacity: cleanString(formData.engineCapacity) || null,
      additionalFeatures: Array.isArray(formData.additionalFeatures) ? formData.additionalFeatures : [],
      registrationNumber: cleanString(formData.registrationNumber) || "",
      
      // Location data - pickup location (from current location or search)
      carLocationLat: formData.carLocationLat ? String(formData.carLocationLat) : null,
      carLocationLng: formData.carLocationLng ? String(formData.carLocationLng) : null,
      carLocationAddress: cleanString(formData.carLocationAddress) || null,
      
      // Drive hub location (if selected)
      driveHubLocation: cleanString(formData.driveHubLocation) || null,
      driveHubLocationLat: formData.driveHubLocationLat ? String(formData.driveHubLocationLat) : null,
      driveHubLocationLng: formData.driveHubLocationLng ? String(formData.driveHubLocationLng) : null,
      driveHubLocationAddress: cleanString(formData.driveHubLocationAddress) || null,
    };
  }

  /**
   * Transform form data to API format according to backend CarRoute API (legacy /api/cars endpoint)
   * @param {Object} formData - Form data from registration
   * @returns {Object} API formatted data
   */
  static transformFormDataToAPI(formData) {
  // helpers
  const cleanString = (str) =>
    str != null && String(str).trim() !== "" ? String(str).trim() : null;

  const parsePrice = (priceStr) => {
    if (!priceStr && priceStr !== 0) return 0;
    const cleanPrice = String(priceStr)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .replace(/Lakh/gi, "")
      .replace(/\s+/g, "")
      .trim();
    const num = parseFloat(cleanPrice);
    return Number.isFinite(num) ? num : 0;
  };

  // Helper to convert YYYY-MM format to "Month, YYYY" format
  const formatYearToLabel = (value) => {
    if (!value) return null;
    const str = String(value).trim();
    
    // If already in "Month, YYYY" format, return as is
    if (/^[A-Za-z]+\s*,\s*\d{4}$/.test(str)) {
      return str;
    }
    
    // If in YYYY-MM format, convert to "Month, YYYY"
    const match = str.match(/^(\d{4})-(\d{1,2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const monthNum = parseInt(match[2], 10);
      if (Number.isFinite(year) && Number.isFinite(monthNum) && monthNum >= 1 && monthNum <= 12) {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[monthNum - 1]}, ${year}`;
      }
    }
    
    return str; // Return as is if can't parse
  };

  // ---------- YEAR FIELDS (always "Month, YYYY" strings if given) ----------
  const regYearLabel =
    cleanString(formData.regYearFormatted) ||
    (formData.year ? formatYearToLabel(formData.year) : null) ||
    (formData.regYear ? formatYearToLabel(formData.regYear) : null) ||
    cleanString(formData.regYear) ||
    null;

  const mfgYearLabel =
    cleanString(formData.mfgYearFormatted) ||
    (formData.mfgYear ? formatYearToLabel(formData.mfgYear) : null) ||
    cleanString(formData.mfgYear) ||
    null;

  const safeRegYear = regYearLabel != null ? String(regYearLabel) : null;
  const safeMfgYear = mfgYearLabel != null ? String(mfgYearLabel) : null;

  // ---------- IMAGE URLS PLACEHOLDERS (ALWAYS 6) ----------
  const IMAGE_SLOTS = 6; // 👈 fixed six placeholders required by your DB
  const imageUrlsPlaceholders = Array.from({ length: IMAGE_SLOTS }, () => ({}));

  // ---------- COLOR (respect UI; fallback to White) ----------
  const toTitle = (s) =>
    !s ? s : s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

  const exteriorColorInput =
    cleanString(formData.exteriorColor) ||
    cleanString(formData.color) ||
    cleanString(formData.bodyColor) ||
    "White";

  const exteriorColor = toTitle(exteriorColorInput);

  // ---------- NAME ----------
  const brand = cleanString(formData.brand) || "Car";
  const model = cleanString(formData.model) || "Model";
  const nameYearForTitle =
    (safeRegYear && (safeRegYear.match(/\b(19|20)\d{2}\b/) || [])[0]) ||
    (safeMfgYear && (safeMfgYear.match(/\b(19|20)\d{2}\b/) || [])[0]) ||
    "";
  let carName = `${brand} ${model}${nameYearForTitle ? ` ${nameYearForTitle}` : ""}`;
  if (!carName.trim()) carName = "Car Listing";

  // ---------- DESCRIPTION ----------
  const kmValue = formData.kmDriven || formData.km;
  const cleanedKm = kmValue ? String(kmValue).replace(/,/g, "").replace(/[^\d]/g, "") : "0";
  const description = `A ${cleanString(formData.fuel) || "Petrol"} powered ${cleanString(formData.transmission) || "Manual"} transmission vehicle with ${cleanedKm || "0"} km driven.`;

  // ---------- customFields ----------
  const customFields = {
    // basic
    brand: cleanString(formData.brand) || "Unknown",
    variant: cleanString(formData.variant) || "Unknown",

    // years as labels
    year: safeRegYear,      // e.g. "April, 2011"
    mfgYear: safeMfgYear,   // e.g. "March, 2011"

    // tech
    fuelType: cleanString(formData.fuelType) || cleanString(formData.fuel) || "Petrol",
    transmission: cleanString(formData.transmission) || "Manual",
    engineCapacity: cleanString(formData.engineCapacity) || "1000cc",

    // ownership
    owner: cleanString(formData.owner) || "1",
    kmDriven: cleanedKm || "0",
    spareKey: cleanString(formData.spareKey) || "No",
    exteriorColor, // 👈 normalized color saved here

    // warranty
    warranty: cleanString(formData.warranty) || "No",
    warrantyType: cleanString(formData.warrantyType) || "Extended",
    warrantyDate: cleanString(formData.warrantyDate) || null,

    // insurance
    insurance: cleanString(formData.insurance) || "No",
    insuranceType: cleanString(formData.insuranceType) || "Comprehensive",
    insuranceDate: cleanString(formData.insuranceDate) || null,

    // pricing
    listingPrice: parsePrice(formData.listingPrice) || 0,
    offerPrice: parsePrice(formData.offerPrice) || 0,

    // features
    additionalFeatures: Array.isArray(formData.additionalFeatures) ? formData.additionalFeatures : [],

    // placeholders only (no real image data)
    imageUrls: imageUrlsPlaceholders,

    // VIN image
    vinImageUrl: cleanString(formData.vinImageUrl) || null,

      // registration
    registrationNumber: cleanString(formData.registrationNumber) || "Not Available",

    // status
    isActive: formData.isActive !== undefined ? !!formData.isActive : true,

    // Location data - pickup location (from current location or search)
    carLocationLat: formData.carLocationLat ? String(formData.carLocationLat) : null,
    carLocationLng: formData.carLocationLng ? String(formData.carLocationLng) : null,
    carLocationAddress: cleanString(formData.carLocationAddress) || null,
    
    // Drive hub location (if selected)
    driveHubLocation: cleanString(formData.driveHubLocation) || null,
    driveHubLocationLat: formData.driveHubLocationLat ? String(formData.driveHubLocationLat) : null,
    driveHubLocationLng: formData.driveHubLocationLng ? String(formData.driveHubLocationLng) : null,
    driveHubLocationAddress: cleanString(formData.driveHubLocationAddress) || null,
  };

  // ---------- final payload ----------
  // Backend expects only these top-level fields: name, description, productType, registrationNo, make, model, status
  // All other fields go in customFields
  const apiPayload = {
    name: carName || "Car Listing", // Required by backend validation
    description: description || "Car listing",
    productType: "Car",
    registrationNo: cleanString(formData.registrationNumber) || null,
    make: cleanString(formData.brand) || null,
    model: cleanString(formData.model) || null,
    // customFields contains all other data
    customFields,
  };

  return apiPayload;
}



  /**
   * Test car data format (for debugging)
   * @param {Object} carData - Car data to test
   * @returns {Object} Formatted data
   */
  static testCarDataFormat(carData) {
    console.log('Testing car data format...');
    const apiData = this.transformFormDataToAPI(carData);
    console.log('Test result:', apiData);
    return apiData;
  }

  /**
   * Get user's cars
   * @returns {Promise<Object>} User's cars
   */
  static async getUserCars() {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/cars/owned`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch cars'
        };
      }
    } catch (error) {
      console.error('Get user cars error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Update car listing
   * @param {string} carId - Car ID
   * @param {Object} carData - Updated car data
   * @returns {Promise<Object>} API response
   */
  static async updateCar(carId, carData) {
    try {
      const accessToken = this.getAccessToken();
      
      // Check if this is a partial update (only customFields)
      const isPartialUpdate = Object.keys(carData).length === 1 && carData.customFields;
      
      // Create FormData for backend upload middleware (updateCarListingUnified expects FormData)
      const formData = new FormData();
      
      if (isPartialUpdate) {
        // For partial updates (e.g., just updating isActive or prices), extract from customFields
        const customFields = carData.customFields;
        
        // Map customFields to flat fields expected by updateCarListingUnified
        if (customFields.isActive !== undefined) {
          formData.append('isActive', String(customFields.isActive));
        }
        if (customFields.listingPrice !== undefined && customFields.listingPrice !== null) {
          formData.append('listingPrice', String(customFields.listingPrice));
        }
        if (customFields.offerPrice !== undefined && customFields.offerPrice !== null) {
          formData.append('offerPrice', String(customFields.offerPrice));
        }
        // Add other customFields that might be updated
        if (customFields.registrationNumber) {
          formData.append('registrationNumber', String(customFields.registrationNumber));
        }
        if (customFields.status) {
          formData.append('status', String(customFields.status));
        }
      } else {
        // For full updates, transform form data to listings API format
        const apiData = this.transformFormDataToListingsAPI(carData);
        
        // Add all flat fields expected by updateCarListingUnified
        if (apiData.regYear) formData.append('regYear', apiData.regYear);
        if (apiData.mfgYear) formData.append('mfgYear', apiData.mfgYear);
        if (apiData.brand) formData.append('brand', apiData.brand);
        if (apiData.model) formData.append('model', apiData.model);
        if (apiData.owner) formData.append('owner', apiData.owner);
        if (apiData.variant) formData.append('variant', apiData.variant);
        if (apiData.fuelType) formData.append('fuelType', apiData.fuelType);
        if (apiData.isActive !== undefined) formData.append('isActive', String(apiData.isActive));
        if (apiData.kmDriven) formData.append('kmDriven', apiData.kmDriven);
        if (apiData.noofseat) formData.append('noofseat', apiData.noofseat);
        if (apiData.spareKey) formData.append('spareKey', apiData.spareKey);
        if (apiData.warranty) formData.append('warranty', apiData.warranty);
        if (apiData.insurance) formData.append('insurance', apiData.insurance);
        if (apiData.offerPrice !== undefined && apiData.offerPrice !== null) {
          formData.append('offerPrice', String(apiData.offerPrice));
        }
        if (apiData.vinImageUrl) formData.append('vinImageUrl', apiData.vinImageUrl);
        if (apiData.listingPrice !== undefined && apiData.listingPrice !== null) {
          formData.append('listingPrice', String(apiData.listingPrice));
        }
        if (apiData.transmission) formData.append('transmission', apiData.transmission);
        if (apiData.warrantyDate) formData.append('warrantyDate', apiData.warrantyDate);
        if (apiData.warrantyType) formData.append('warrantyType', apiData.warrantyType);
        if (apiData.exteriorColor) formData.append('exteriorColor', apiData.exteriorColor);
        if (apiData.insuranceDate) formData.append('insuranceDate', apiData.insuranceDate);
        if (apiData.insuranceType) formData.append('insuranceType', apiData.insuranceType);
        if (apiData.engineCapacity) formData.append('engineCapacity', apiData.engineCapacity);
        if (apiData.registrationNumber) formData.append('registrationNumber', apiData.registrationNumber);
        
        // Handle additional features
        if (apiData.additionalFeatures && Array.isArray(apiData.additionalFeatures)) {
          formData.append('additionalFeatures', JSON.stringify(apiData.additionalFeatures));
        }
        
        // Handle status if provided
        if (carData.status) {
          formData.append('status', String(carData.status));
        }
        
        // Handle removed image IDs (for existing images that user wants to delete)
        // Backend expects array, so append each ID separately or as JSON string
        if (carData.removedImageIds && Array.isArray(carData.removedImageIds) && carData.removedImageIds.length > 0) {
          // Send as JSON string - backend will parse it
          formData.append('removeImageIds', JSON.stringify(carData.removedImageIds));
        }
        
        // Handle images if provided (same logic as createCar)
        if (carData.images && Array.isArray(carData.images) && carData.images.length > 0) {
          console.log('📤 Processing images for update:', carData.images.length, 'images');
          console.log('📤 First image structure:', carData.images[0]);
          
          const mapSectionToField = (section) => {
            if (!section) return 'exteriorPhotos';
            const s = String(section).toLowerCase().trim();
            if (s === 'exterior') return 'exteriorPhotos';
            if (s === 'interior') return 'interiorPhotos';
            if (s === 'highlights' || s === 'attractions') return 'highlightPhotos';
            if (s === 'tyres' || s === 'tyre') return 'tyrePhotos';
            return 'exteriorPhotos';
          };

          const base64ToFile = (base64String, fileName, mimeType) => {
            try {
              if (!base64String || typeof base64String !== 'string') {
                console.error('Invalid base64 string:', typeof base64String);
                return null;
              }

              const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
              
              if (!base64Data || base64Data.trim().length === 0) {
                console.error('Empty base64 data');
                return null;
              }

              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType || 'image/jpeg' });
              
              if (blob.size === 0) {
                console.error('Blob size is 0 after conversion');
                return null;
              }
              
              const file = new File([blob], fileName || 'image.jpg', { type: mimeType || 'image/jpeg' });
              console.log(`✅ Converted base64 to File: ${file.name}, size: ${file.size} bytes`);
              return file;
            } catch (error) {
              console.error('Error converting base64 to File:', error, 'base64String length:', base64String?.length);
              return null;
            }
          };

          const categorizedImages = {
            exteriorPhotos: [],
            interiorPhotos: [],
            highlightPhotos: [],
            tyrePhotos: []
          };

          for (let i = 0; i < carData.images.length; i++) {
            const img = carData.images[i];
            if (!img) {
              console.warn(`⚠️ Image ${i} is null or undefined`);
              continue;
            }

            const section = img.section || 
                           img.item?.section || 
                           img.category || 
                           img.item?.category || 
                           null;
            
            const fieldName = mapSectionToField(section);
            console.log(`📸 Image ${i} - section: "${section}" → field: "${fieldName}"`);

            let file = null;

            if (img?.file instanceof File && img.file.size > 0) {
              file = img.file;
              console.log(`✅ Image ${i}: Using File object directly, size: ${file.size} bytes`);
            } else if (img instanceof File && img.size > 0) {
              file = img;
              console.log(`✅ Image ${i}: Image is File object, size: ${file.size} bytes`);
            } else if (img?.item?.src) {
              const src = img.item.src;
              if (src && typeof src === 'string' && src.startsWith('data:image/')) {
                const mimeMatch = src.match(/data:([^;]+);/);
                const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
                const fileName = img.item?.name || `image_${i}_${fieldName}.jpg`;
                file = base64ToFile(src, fileName, mimeType);
                if (file) {
                  console.log(`✅ Image ${i}: Converted from item.src base64`);
                }
              } else if (src && typeof src === 'string' && src.startsWith('blob:')) {
                console.warn(`⚠️ Image ${i}: Blob URL cannot be converted (${src.substring(0, 30)}...)`);
              }
            } else if (img?.src && typeof img.src === 'string' && img.src.startsWith('data:image/')) {
              const mimeMatch = img.src.match(/data:([^;]+);/);
              const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              file = base64ToFile(img.src, `image_${i}_${fieldName}.jpg`, mimeType);
              if (file) {
                console.log(`✅ Image ${i}: Converted from root src base64`);
              }
            } else if (typeof img === 'string' && img.startsWith('data:image/')) {
              const mimeMatch = img.match(/data:([^;]+);/);
              const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              file = base64ToFile(img, `image_${i}_${fieldName}.jpg`, mimeType);
              if (file) {
                console.log(`✅ Image ${i}: Converted from string base64`);
              }
            } else {
              console.warn(`⚠️ Image ${i}: Unknown format, cannot process:`, {
                hasFile: !!img?.file,
                isFile: img instanceof File,
                hasItemSrc: !!img?.item?.src,
                hasSrc: !!img?.src,
                isString: typeof img === 'string',
                imgType: typeof img,
                imgKeys: Object.keys(img || {})
              });
            }

            if (file && file instanceof File && file.size > 0) {
              categorizedImages[fieldName].push(file);
              console.log(`✅ Image ${i} added to ${fieldName}`);
            } else {
              console.error(`❌ Failed to process image ${i} - no valid file created`);
            }
          }

          const totalFiles = Object.values(categorizedImages).reduce((sum, arr) => sum + arr.length, 0);
          console.log(`📤 Processed ${totalFiles} images for update:`, {
            exteriorPhotos: categorizedImages.exteriorPhotos.length,
            interiorPhotos: categorizedImages.interiorPhotos.length,
            highlightPhotos: categorizedImages.highlightPhotos.length,
            tyrePhotos: categorizedImages.tyrePhotos.length
          });

          Object.keys(categorizedImages).forEach(fieldName => {
            categorizedImages[fieldName].forEach((file, index) => {
              formData.append(fieldName, file);
              console.log(`📤 Appended ${fieldName}[${index}]: ${file.name} (${file.size} bytes)`);
            });
          });
        }
      }
      
      console.log('Making API call to:', `${API_BASE_URL}/api/cars/listings/${carId}`);
      console.log('Request method: PUT');
      
      const response = await fetch(`${API_BASE_URL}/api/cars/listings/${carId}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Car updated successfully'
        };
      } else {
        // Handle different types of errors from backend
        let errorMessage = data.message || 'Failed to update car';
        
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please login to update the car listing.';
        } else if (response.status === 403) {
          errorMessage = 'Permission denied. You do not have access to update this listing.';
        } else if (response.status === 404) {
          errorMessage = 'Car listing not found.';
        } else if (response.status === 422) {
          if (data.errors && typeof data.errors === 'object') {
            const validationErrors = Object.entries(data.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            errorMessage = `Validation errors: ${validationErrors}`;
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        
        return {
          success: false,
          message: errorMessage,
          status: response.status,
          errors: data.errors || null
        };
      }
    } catch (error) {
      console.error('Car update error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Delete car listing
   * @param {string} carId - Car ID
   * @returns {Promise<Object>} API response
   */
  static async deleteCar(carId) {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message || 'Car deleted successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to delete car'
        };
      }
    } catch (error) {
      console.error('Car deletion error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get user's published cars with pagination support
   * @param {Object} params - Query parameters (page, limit, search, status, make)
   * @returns {Promise<Object>} User's cars data with pagination meta
   */
  static async getMyCars(params = {}) {
    try {
      console.log('Fetching user\'s cars with params:', params);
      
      const accessToken = this.getAccessToken();
      console.log('Access token for getMyCars:', accessToken ? 'Present' : 'Missing');
      
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Search and filters
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.make) queryParams.append('make', params.make);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/cars/owned/${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('My cars response:', data);
      console.log('Response structure:', {
        hasData: !!data.data,
        hasMeta: !!data.meta,
        hasCars: !!data.cars,
        isArray: Array.isArray(data),
        keys: Object.keys(data)
      });
      
      // Debug the first car if it exists
      if (data.data && data.data.length > 0) {
        console.log('First car from API:', data.data[0]);
        console.log('First car customFields:', data.data[0].customFields);
        console.log('First car customFields type:', typeof data.data[0].customFields);
      }
      
      if (response.ok) {
        // Backend returns: { success: true, data: [...], meta: { page, limit, total: { items, pages } } }
        // Handle different response formats for backward compatibility
        let carsData = data.data || [];
        let paginationMeta = data.meta || null;
        
        // If response is in old format (just array or { data: [...] }), extract it
        if (!data.meta && (Array.isArray(data) || (data.data && !data.meta))) {
          if (Array.isArray(data)) {
            carsData = data;
          } else if (data.data) {
            carsData = data.data;
          } else if (data.cars) {
            carsData = data.cars;
          }
        }
        
        console.log('Processed cars data:', carsData);
        console.log('Pagination meta:', paginationMeta);
        
        return {
          success: true,
          data: carsData,
          meta: paginationMeta,
          message: 'Cars fetched successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch cars',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Error fetching user cars:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get a single car by ID from the API (public endpoint)
   * @param {string|number} carId - The car ID
   * @returns {Promise<Object>} API response with car data
   */
  static async getCarById(carId) {
    try {
      console.log('Fetching car by ID:', carId);
      
      const response = await fetch(`${API_BASE_URL}/api/cars/public/${carId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched car data:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching car by ID:', error);
      throw error;
    }
  }

  /**
   * Get all offers for dealer's cars
   * @returns {Promise<Object>} API response with offers data
   */
  static async getDealerOffers() {
    try {
      console.log('Fetching dealer offers...');
      
      const response = await fetch(`${API_BASE_URL}/api/offers/my-offers`, {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Dealer offers response:', data);
      
      if (response.ok) {
        return {
          success: true,
          data: data.data || [],
          message: 'Offers fetched successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch offers',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Error fetching dealer offers:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get all offers for a specific car (car owner only)
   * @param {number|string} carId - The car ID
   * @returns {Promise<Object>} API response with offers data
   */
  static async getOffersForCar(carId) {
    try {
      console.log('Fetching offers for car:', carId);
      
      const response = await fetch(`${API_BASE_URL}/api/offers/car/${carId}`, {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Offers for car response:', data);
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data || [],
          message: 'Offers fetched successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch offers',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Error fetching offers for car:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get all cars from the API (public endpoint)
   * @param {Object} params - Query parameters (page, limit, search, status, make)
   * @returns {Promise<Object>} API response with cars data
   */
  static async getAllCars(params = {}) {
    try {
      // Create a cache key based on params (excluding _t and forceRefresh for deduplication)
      const cacheKeyParams = { ...params };
      delete cacheKeyParams._t; // Remove cache busting for deduplication
      delete cacheKeyParams.forceRefresh; // Remove force refresh flag
      const cacheKey = `getAllCars_${JSON.stringify(cacheKeyParams)}`;
      
      // Check if there's already a pending request with the same params (deduplication)
      if (CarService._pendingGetAllCarsRequests && CarService._pendingGetAllCarsRequests.has(cacheKey)) {
        console.log('Deduplicating getAllCars request:', cacheKey);
        return await CarService._pendingGetAllCarsRequests.get(cacheKey);
      }
      
      // Initialize pending requests map if it doesn't exist
      if (!CarService._pendingGetAllCarsRequests) {
        CarService._pendingGetAllCarsRequests = new Map();
      }
      
      console.log('Fetching all cars with params:', params);
      
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Search
      if (params.search) queryParams.append('search', params.search);
      
      // Price filters
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      
      // Brand and model filters
      if (params.make) queryParams.append('make', params.make);
      if (params.model) queryParams.append('model', params.model);
      
      // Year filters
      if (params.year) queryParams.append('year', params.year);
      
      // KM filters
      if (params.km) queryParams.append('km', params.km);
      
      // Fuel type
      if (params.fuel) queryParams.append('fuel', params.fuel);
      
      // Transmission
      if (params.transmission) queryParams.append('transmission', params.transmission);
      
      // Owner
      if (params.owner) queryParams.append('owner', params.owner);
      
      // Body type
      if (params.bodyType) queryParams.append('bodyType', params.bodyType);
      
      // Color
      if (params.color) queryParams.append('color', params.color);
      
      // Features
      if (params.features) queryParams.append('features', params.features);
      
      // Seats
      if (params.seats) queryParams.append('seats', params.seats);
      
      // Category
      if (params.category) queryParams.append('category', params.category);
      
      // Status
      if (params.status) queryParams.append('status', params.status);

      if (params.segment) queryParams.append('segment', params.segment);
      
      // Seller Type
      if (params.sellerType) queryParams.append('sellerType', params.sellerType);
      
      // Only add cache busting if explicitly requested (for filter changes, not initial loads)
      if (params._t && params.forceRefresh) {
        queryParams.append('_t', params._t);
      }
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/cars/public${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching from URL:', url);
      
      // Create the request promise
      const requestPromise = fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched cars data:', data);
        console.log('Number of cars found:', data.data ? data.data.length : 0);
        console.log('Total items in response:', data.meta ? data.meta.total : 'unknown');
        
        return data;
      }).finally(() => {
        // Remove from pending requests after completion
        if (CarService._pendingGetAllCarsRequests) {
          CarService._pendingGetAllCarsRequests.delete(cacheKey);
        }
      });
      
      // Store the pending request for deduplication
      CarService._pendingGetAllCarsRequests.set(cacheKey, requestPromise);
      
      return await requestPromise;
    } catch (error) {
      // Remove from pending requests on error
      const cacheKeyParams = { ...params };
      delete cacheKeyParams._t;
      delete cacheKeyParams.forceRefresh;
      const cacheKey = `getAllCars_${JSON.stringify(cacheKeyParams)}`;
      if (CarService._pendingGetAllCarsRequests) {
        CarService._pendingGetAllCarsRequests.delete(cacheKey);
      }
      console.error('Error fetching all cars:', error);
      throw error;
    }
  }

  /**
   * Get all fuel types with car counts
   * @returns {Promise<Object>} API response with fuel types data
   */
  static async getFuelTypeCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/fuel-types`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fuel type counts:', error);
      throw error;
    }
  }

  /**
   * Get all transmission types with car counts
   * @returns {Promise<Object>} API response with transmission types data
   */
  static async getTransmissionTypeCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/transmission-types`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transmission type counts:', error);
      throw error;
    }
  }

  /**
   * Get all seat counts with car counts
   * @returns {Promise<Object>} API response with seat counts data
   */
  static async getSeatCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/seats`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching seat counts:', error);
      throw error;
    }
  }

  /**
   * Get all colors with car counts
   * @returns {Promise<Object>} API response with colors data
   */
  static async getColorCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/colors`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching color counts:', error);
      throw error;
    }
  }

  /**
   * Get all owners with car counts
   * @returns {Promise<Object>} API response with owners data
   */
  static async getOwnerCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/owners`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching owner counts:', error);
      throw error;
    }
  }

  /**
   * Get all unique brands with car counts
   * @returns {Promise<Object>} API response with brands data
   */
  static async getBrandsWithCounts() {
    try {
      const url = `${API_BASE_URL}/api/cars/public/brands`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching brands with counts:', error);
      throw error;
    }
  }

  /**
   * Get all filter counts in a single aggregated request
   * Uses client-side caching with 4-minute TTL to prevent duplicate requests
   * @returns {Promise<Object>} API response with all filter counts
   */
  static async getAllFilterCounts() {
    const cacheKey = 'car_filter_counts_cache';
    const cacheTimestampKey = 'car_filter_counts_cache_timestamp';
    const cacheTTL = 4 * 60 * 1000; // 4 minutes in milliseconds

    // Check client-side cache first
    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      const cachedTimestamp = sessionStorage.getItem(cacheTimestampKey);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < cacheTTL) {
          // Cache is still valid
          return JSON.parse(cachedData);
        } else {
          // Cache expired, remove it
          sessionStorage.removeItem(cacheKey);
          sessionStorage.removeItem(cacheTimestampKey);
        }
      }
    } catch (error) {
      // If sessionStorage fails (e.g., in private mode), continue with API call
      console.warn('SessionStorage access failed, proceeding with API call:', error);
    }

    // Check if there's already a pending request (deduplication)
    if (CarService._pendingFilterCountsRequest) {
      return CarService._pendingFilterCountsRequest;
    }

    // Make API request
    try {
      const url = `${API_BASE_URL}/api/cars/public/filter-counts`;
      
      const requestPromise = fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Log response for debugging (especially in production)
        console.log('Filter counts API response data:', data);
        if (data && data.data) {
          console.log('Body types in response:', data.data.bodyTypes);
        }
        
        // Cache the response
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          sessionStorage.setItem(cacheTimestampKey, Date.now().toString());
        } catch (error) {
          // If caching fails, continue anyway
          console.warn('Failed to cache filter counts:', error);
        }

        return data;
      }).finally(() => {
        // Clear pending request after completion
        CarService._pendingFilterCountsRequest = null;
      });

      // Store pending request for deduplication
      CarService._pendingFilterCountsRequest = requestPromise;
      
      return await requestPromise;
    } catch (error) {
      // Clear pending request on error
      CarService._pendingFilterCountsRequest = null;
      console.error('Error fetching all filter counts:', error);
      throw error;
    }
  }

  /**
   * Add a car to wishlist
   * @param {string|number} carId - The car ID
   * @returns {Promise<Object>} API response
   */
  static async addToWishlist(carId) {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/wishlist/${carId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Car added to wishlist',
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to add car to wishlist',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Remove a car from wishlist
   * @param {string|number} carId - The car ID
   * @returns {Promise<Object>} API response
   */
  static async removeFromWishlist(carId) {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/wishlist/${carId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Car removed from wishlist',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to remove car from wishlist',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Toggle wishlist status (add if not present, remove if present)
   * @param {string|number} carId - The car ID
   * @returns {Promise<Object>} API response with isInWishlist status
   */
  static async toggleWishlist(carId) {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/wishlist/toggle/${carId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Wishlist updated',
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update wishlist',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Check if a car is in wishlist
   * @param {string|number} carId - The car ID
   * @returns {Promise<Object>} API response with isInWishlist boolean
   */
  static async checkWishlistStatus(carId) {
    try {
      const accessToken = this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}/api/wishlist/check/${carId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          isInWishlist: data.data?.isInWishlist || false
        };
      } else {
        return {
          success: false,
          isInWishlist: false,
          message: data.message || 'Failed to check wishlist status'
        };
      }
    } catch (error) {
      console.error('Check wishlist status error:', error);
      return {
        success: false,
        isInWishlist: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get user's wishlist
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise<Object>} API response with wishlist cars
   */
  static async getWishlist(params = {}) {
    try {
      const accessToken = this.getAccessToken();
      
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/wishlist${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data || [],
          meta: data.meta || null,
          message: data.message || 'Wishlist retrieved successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch wishlist',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Get wishlist error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

// Static property to track pending requests for deduplication
CarService._pendingFilterCountsRequest = null;

export default CarService;