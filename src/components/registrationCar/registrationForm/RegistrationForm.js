// File: src/component/registrationCar/registrationForm/RegistrationForm.jsx
"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DraftService from "../../../services/draftService";
import { useAuthStore } from "../../../store/authStore";
import { useFormDataStore } from "../../../store/formDataStore";
import CarService from "../../../services/carService";
import { safeParseCustomFields } from "../../../utils/jsonUtils";
import { API_BASE_URL } from "../../../config/environment";

// Steps
import EnterRegistration from "./stepForm/EnterRegistration";
import BrandForm from "./stepForm/BrandForm";
import ModalForm from "./stepForm/ModalForm";
import VeriantForm from "./stepForm/VeriantForm";
import OwnershipForm from "./stepForm/OwnershipForm";
import WarrantyForm from "./stepForm/WarrantyForm";
import MediaUploads from "./stepForm/MediaUploads";
import AdditionalFeatures from "./stepForm/AdditionalFeatures";
import PricingForm from "./stepForm/PricingForm";

// Data
import brands from "../../../data/Brands.json";
// Model.json is no longer used - models come from API makerModal field
// import model from "../../../data/Model.json";
import variant from "../../../data/Variant.json";
import FormHeadingComponents from "./FormHeadingComponents";

// ✅ Array banana hoga
const stepHeadings = [
  "Vehicle Basic Details",
  "Vehicle Basic Details",
  "Vehicle Basic Details",
  "Vehicle Basic Details",
  "Ownership & Specifications",
  "Warranty & Insurance",
  "Media Uploads",
  "Additional Features",
  "Pricing",
];

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  
  // Auth state
  const { user, isAuthenticated } = useAuthStore();
  
  // Form data state from Zustand
  const { 
    formData: details, 
    updateFormData, 
    updateField, 
    updateImages, 
    updateStep,
    clearFormData,
    getFormDataForAPI,
    getProgressPercentage 
  } = useFormDataStore();

  // Step 1 state
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");

  const [searchBrand, setSearchBrand] = useState("");
  const [searchModel, setSearchModel] = useState("");

  // Store car data from API
  const [carData, setCarData] = useState(null);
  
  // Edit mode state - MUST be declared before useEffect that uses it
  const [editCarId, setEditCarId] = useState(null);
  const [isLoadingCar, setIsLoadingCar] = useState(false);
  
  // Debug: Log formData changes when in edit mode
  useEffect(() => {
    if (editCarId && details) {
      console.log('📊 Current formData from Zustand store:', details);
    }
  }, [details, editCarId]);

  const years = useMemo(() => {
    const arr = [];
    const now = new Date().getFullYear();
    for (let y = now; y >= 1990; y--) arr.push(String(y));
    return arr;
  }, []);

  const filteredBrands = useMemo(() => {
    const q = searchBrand.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        (b.brandName || "").toLowerCase().includes(q) ||
        (b.name || "").toLowerCase().includes(q)
    );
  }, [searchBrand]);

  // Model filtering removed - models now come from API makerModal field
  // const filteredModels = useMemo(() => {
  //   const q = searchModel.trim().toLowerCase();
  //   if (!q) return model;
  //   return model.filter(
  //     (m) =>
  //       (m.brandName || m.modelName || "").toLowerCase().includes(q) ||
  //       (m.name || "").toLowerCase().includes(q)
  //   );
  // }, [searchModel]);

  // Handle car data from API
  const handleCarDataFetched = (data) => {
    setCarData(data);
    
    // Auto-fill form details if car data is available
    if (data) {
      // Extract year number from formatted date for dropdown compatibility
      const extractYearFromFormattedDate = (formattedDate) => {
        if (!formattedDate) return '';
        // Extract year from "February 2011" format
        const yearMatch = formattedDate.match(/\d{4}/);
        return yearMatch ? yearMatch[0] : '';
      };

      // Update Zustand store with car data from API
      const apiCarMake = data.make || '';
      const matchingBrand = brands?.find(brand => {
        const brandName = brand.brandName || brand.name || '';
        return brandName.toLowerCase() === apiCarMake.toLowerCase();
      });
      
      // Always prioritize fresh API data over cached data
      // This prevents old cached data (with engine CC) from being used
      const formDataUpdate = {
        year: data.registrationYear || data.registrationYearRaw || details.year,
        brand: matchingBrand ? (matchingBrand.brandName || matchingBrand.name) : (data.make || details.brand),
        brandLogo: data.brandLogo || details.brandLogo,
        model: data.model || null, // Always use fresh API model, never fallback to cached (might have engine CC)
        variant: data.variant || details.variant,
        fuelType: data.fuelType || details.fuelType,
        mfgYear: data.mfgYear || data.registrationYear || data.registrationYearRaw || details.mfgYear,
        engineCapacity: data.engineSize || details.engineCapacity,
        vinImageUrl: data.imageUrl || details.vinImageUrl,
        color: data.color || details.color,
        ownerSrNo: data.ownerSrNo || details.ownerSrNo,
        insuranceUpto: data.insuranceUpto || details.insuranceUpto,
      };
      
      updateFormData(formDataUpdate);
    }
  };

  // Nav helpers
  const goStep2 = () => {
    // This function is now called after successful API validation in EnterRegistration
    // No need for client-side validation here as API handles it
    setError("");
    setStep(2);
  };
  const goStep3 = (e) => { e?.preventDefault?.(); setStep(3); };
  const goStep4 = (e) => { e?.preventDefault?.(); setStep(4); };
  const goStep5 = (e) => { e?.preventDefault?.(); setStep(5); };
  const goStep6 = (e) => { e?.preventDefault?.(); setStep(6); };
  const goStep7 = (e) => { e?.preventDefault?.(); setStep(7); };
  const goStep8 = (e) => { e?.preventDefault?.(); setStep(8); };

  const backTo1 = () => setStep(1);
  const backTo2 = () => setStep(2);
  const backTo3 = () => setStep(3);
  const backTo4 = () => setStep(4);

  // Draft functionality
  const saveDraft = () => {
    const formData = {
      step,
      regNo,
      details,
      carData,
      searchBrand,
      searchModel
    };
    
    DraftService.saveDraft(formData, 'manual');
    alert('Draft saved successfully!');
  };

  const checkAuthAndPublish = () => {
    // This function is no longer used since we navigate to Publish page
    // The Publish page will handle authentication checks
    return true;
  };

  // Auto-save functionality
  useEffect(() => {
    // Auto-save when form data changes (throttled)
    if (step > 1 && (regNo || Object.values(details).some(val => val))) {
      const formData = {
        step,
        regNo,
        details,
        carData,
        searchBrand,
        searchModel
      };
      
      DraftService.autoSave(formData);
    }
  }, [step, regNo, details, carData, searchBrand, searchModel]);

  // Helper function to capitalize first letter (for color matching)
  const capitalizeFirstLetter = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Load car data for editing - MUST be defined before useEffect that uses it
  const loadCarForEdit = useCallback(async (carId) => {
    try {
      setIsLoadingCar(true);
      
      // First verify car exists in database
      const response = await CarService.getCarById(carId);
      
      if (!response.success || !response.data) {
        console.error('Car not found:', carId);
        alert('Car not found. Please try again.');
        window.location.href = '/dealer-dashboard';
        return;
      }
      
      const car = response.data;
      const customFields = safeParseCustomFields(car);
      
      console.log('🔍 Loading car for edit - Car ID:', carId);
      console.log('🔍 Full car object:', car);
      console.log('🔍 Parsed customFields:', customFields);
      console.log('🔍 CarImages:', car.CarImages);
      
      // Clear any existing form data before loading edit data
      clearFormData();
      
      // Extract and organize existing images by category
      const existingImages = {
        exterior: [],
        interior: [],
        highlights: [],
        tyres: []
      };
      
      if (car.CarImages && Array.isArray(car.CarImages)) {
        const baseUrl = API_BASE_URL || 'https://api.carosa.in';
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // Check if backend is on different origin (localhost:3005 vs localhost:3000)
        // Use proxy in development to avoid CORS issues
        const backendIsLocalhost = baseUrl.includes('localhost:3005') || baseUrl.includes('127.0.0.1:3005');
        const useProxy = isDevelopment && backendIsLocalhost;
        
        car.CarImages.forEach((image) => {
          if (!image || !image.url) {
            console.warn('⚠️ Skipping image with missing url:', image);
            return;
          }
          
          const category = (image.category || 'exterior').toLowerCase();
          
          // Extract path from URL (handle both relative and absolute)
          let imagePath = image.url;
          
          // If URL is absolute, extract just the path
          if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            try {
              const urlObj = new URL(imagePath);
              imagePath = urlObj.pathname;
            } catch (e) {
              // If URL parsing fails, try to extract path manually
              const pathMatch = imagePath.match(/\/storage\/.*/);
              if (pathMatch) {
                imagePath = pathMatch[0];
              } else {
                console.warn('⚠️ Could not parse image URL:', imagePath);
                return;
              }
            }
          }
          
          // Ensure path starts with /
          if (!imagePath.startsWith('/')) {
            imagePath = `/${imagePath}`;
          }
          
          // Construct final URL - use proxy in development to avoid CORS
          let imageUrl;
          if (useProxy) {
            // Use Next.js API route proxy to avoid CORS
            imageUrl = `/api/proxy-image?path=${encodeURIComponent(imagePath)}`;
            console.log(`🔍 Using proxy for image ${image.id}: ${imagePath} → ${imageUrl}`);
          } else {
            // Use direct URL (production or same origin)
            imageUrl = `${baseUrl}${imagePath}`;
            console.log(`🔍 Using direct URL for image ${image.id}: ${imageUrl}`);
          }
          
          console.log(`🔍 Processing image ${image.id}: category="${category}", original="${image.url}", path="${imagePath}", final="${imageUrl}"`);
          
          // Map category to section key
          // Backend stores: EXTERIOR, INTERIOR, HIGHLIGHT (singular), TYRE
          // Frontend uses: exterior, interior, highlights (plural), tyres
          let sectionKey = 'exterior';
          const categoryLower = category.toLowerCase();
          
          if (categoryLower === 'interior') {
            sectionKey = 'interior';
          } else if (categoryLower === 'highlight' || categoryLower === 'highlights' || categoryLower === 'attractions' || categoryLower === 'attraction') {
            // Backend uses "HIGHLIGHT" (singular), frontend uses "highlights" (plural) for "Attractions" section
            sectionKey = 'highlights';
          } else if (categoryLower === 'tyres' || categoryLower === 'tyre') {
            sectionKey = 'tyres';
          }
          
          console.log(`🔍 Mapped category "${category}" (${categoryLower}) → sectionKey: "${sectionKey}"`);
          
          existingImages[sectionKey].push({
            id: `existing-${image.id}`, // Unique ID for existing images
            url: imageUrl,
            imageId: image.id, // Store original image ID for removal tracking
            section: sectionKey,
            isExisting: true // Flag to identify existing images
          });
        });
      }
      
      console.log('🔍 Organized existing images:', existingImages);
      
      // Extract month and year from formatted strings like "February, 2011" or "February 2011"
      const extractMonthYear = (dateStr) => {
        if (!dateStr) return { month: null, year: null, monthFormat: null };
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        
        // Try "Month, YYYY" format first (e.g., "February, 2011")
        let match = dateStr.match(/(\w+),\s*(\d{4})/);
        if (!match) {
          // Try "Month YYYY" format (e.g., "February 2011")
          match = dateStr.match(/(\w+)\s+(\d{4})/);
        }
        
        if (match) {
          const monthName = match[1];
          const year = match[2];
          const monthIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
          if (monthIndex >= 0) {
            const monthNum = String(monthIndex + 1).padStart(2, '0');
            return {
              month: monthIndex + 1,
              monthName: monthName,
              year: year,
              monthFormat: `${year}-${monthNum}` // Format: "2011-02" for month input
            };
          }
        }
        return { month: null, monthName: null, year: null, monthFormat: null };
      };

      const regYearData = extractMonthYear(customFields.year || customFields.regYear);
      const mfgYearData = extractMonthYear(customFields.mfgYear);
      const insuranceDateData = extractMonthYear(customFields.insuranceDate);
      const warrantyDateData = extractMonthYear(customFields.warrantyDate);

      // Find matching brand - try multiple matching strategies
      let matchingBrand = brands?.find(brand => {
        const brandName = brand.brandName || brand.name || '';
        const carMake = (car.make || customFields.brand || '').toLowerCase();
        return brandName.toLowerCase() === carMake;
      });
      
      // If no exact match, try partial matching (e.g., "Honda" in "HONDA")
      if (!matchingBrand && (car.make || customFields.brand)) {
        const carMake = (car.make || customFields.brand || '').toLowerCase();
        matchingBrand = brands?.find(brand => {
          const brandName = (brand.brandName || brand.name || '').toLowerCase();
          return brandName === carMake || carMake.includes(brandName) || brandName.includes(carMake);
        });
      }

      // Handle insurance field - convert "Expired" to appropriate value
      let insuranceValue = customFields.insurance;
      if (insuranceValue && typeof insuranceValue === 'string') {
        const insuranceLower = insuranceValue.toLowerCase();
        if (insuranceLower === 'expired' || insuranceLower === 'no') {
          insuranceValue = 'No';
        } else if (insuranceLower === 'yes' || insuranceLower === 'active') {
          insuranceValue = 'Yes';
        }
      }

      // Handle warranty field
      let warrantyValue = customFields.warranty;
      if (warrantyValue && typeof warrantyValue === 'string') {
        const warrantyLower = warrantyValue.toLowerCase();
        if (warrantyLower === 'no') {
          warrantyValue = 'No';
        } else if (warrantyLower === 'yes') {
          warrantyValue = 'Yes';
        }
      }

      // Populate form data with all fields from customFields
      // Note: year and mfgYear must be in "YYYY-MM" format for month input fields
      const formDataToUpdate = {
        registrationNumber: car.registrationNo || customFields.registrationNumber || customFields.regNo,
        // Use monthFormat (YYYY-MM) for month input fields, fallback to year if not available
        year: regYearData.monthFormat || (regYearData.year ? `${regYearData.year}-01` : null),
        regYear: regYearData.year,
        regMonth: regYearData.month,
        regMonthNumber: regYearData.month,
        regMonthName: regYearData.monthName,
        mfgYear: mfgYearData.monthFormat || (mfgYearData.year ? `${mfgYearData.year}-01` : null),
        mfgMonth: mfgYearData.month,
        mfgMonthNumber: mfgYearData.month,
        mfgMonthName: mfgYearData.monthName,
        brand: matchingBrand ? (matchingBrand.brandName || matchingBrand.name) : (car.make || customFields.brand),
        brandLogo: matchingBrand?.logo || null,
        // Use variant for model field (variant contains the full model name like "HONDA JAZZ XMT")
        model: customFields.variant || car.model || customFields.model,
        variant: customFields.variant,
        kmDriven: customFields.kmDriven || customFields.km || '0',
        fuelType: customFields.fuelType || customFields.fuel,
        fuel: customFields.fuelType || customFields.fuel, // Also set fuel field for VariantForm
        transmission: customFields.transmission,
        owner: customFields.owner,
        ownerSrNo: customFields.ownerSrNo,
        // Use exteriorColor first, then color, with proper capitalization to match color options
        color: customFields.exteriorColor ? capitalizeFirstLetter(customFields.exteriorColor) : (customFields.color ? capitalizeFirstLetter(customFields.color) : null),
        exteriorColor: customFields.exteriorColor || customFields.color,
        engineCapacity: customFields.engineCapacity || customFields.engineSize,
        insurance: insuranceValue,
        insuranceType: customFields.insuranceType,
        insuranceDate: customFields.insuranceDate,
        insuranceUpto: insuranceDateData.year ? `${insuranceDateData.monthName}, ${insuranceDateData.year}` : null,
        warranty: warrantyValue,
        warrantyType: customFields.warrantyType,
        warrantyDate: customFields.warrantyDate,
        warrantyUpto: warrantyDateData.year ? `${warrantyDateData.monthName}, ${warrantyDateData.year}` : null,
        spareKey: customFields.spareKey,
        listingPrice: customFields.listingPrice || 0,
        offerPrice: customFields.offerPrice || 0,
        additionalFeatures: Array.isArray(customFields.additionalFeatures) ? customFields.additionalFeatures : (customFields.features || []),
        vinImageUrl: customFields.vinImageUrl,
        // Preserve isActive status (not editable in form, but should be preserved)
        isActive: customFields.isActive !== undefined ? customFields.isActive : true,
        // Store existing images organized by section
        existingImages: existingImages,
      };

      // Update form data first
      updateFormData(formDataToUpdate);
      setRegNo(car.registrationNo || customFields.registrationNumber || '');
      
      // Set carData for ModalForm, VariantForm, and OwnershipForm components to use
      // Use variant as model since that's what contains the full model name like "HONDA JAZZ XMT"
      const carDataForForm = {
        model: customFields.variant || car.model || customFields.model,
        make: car.make || customFields.brand,
        brand: customFields.brand || car.make,
        year: customFields.year,
        mfgYear: customFields.mfgYear,
        fuelType: customFields.fuelType || customFields.fuel, // Add fuelType for VariantForm auto-fill
        variant: customFields.variant,
        owner: customFields.owner, // Add owner for OwnershipForm auto-fill
        ownerSrNo: customFields.ownerSrNo || customFields.owner, // Add ownerSrNo for OwnershipForm auto-fill
        spareKey: customFields.spareKey, // Add spareKey for OwnershipForm auto-fill
        warranty: customFields.warranty, // Add warranty for WarrantyForm auto-fill
        warrantyType: customFields.warrantyType, // Add warrantyType for WarrantyForm auto-fill
        warrantyDate: customFields.warrantyDate, // Add warrantyDate for WarrantyForm auto-fill
        insurance: customFields.insurance, // Add insurance for WarrantyForm auto-fill
        insuranceType: customFields.insuranceType, // Add insuranceType for WarrantyForm auto-fill
        insuranceDate: customFields.insuranceDate, // Add insuranceDate for WarrantyForm auto-fill
        insuranceUpto: customFields.insuranceDate, // Add insuranceUpto for WarrantyForm auto-fill
      };
      setCarData(carDataForForm);
      
      console.log('✅ Car loaded for edit - Form data updated:', formDataToUpdate);
      console.log('✅ Car data set for form components:', carDataForForm);
      console.log('✅ Registration year (year):', customFields.year, '→', regYearData.monthFormat);
      console.log('✅ Manufacturing year (mfgYear):', customFields.mfgYear, '→', mfgYearData.monthFormat);
      console.log('✅ Brand:', customFields.brand, '→', formDataToUpdate.brand);
      console.log('✅ Model/Variant:', customFields.variant, '→', formDataToUpdate.model);
      console.log('✅ Color:', customFields.exteriorColor, '→', formDataToUpdate.color);
      
      // Small delay to ensure Zustand store is updated before navigating
      setTimeout(() => {
        // Set registration number and skip to step 2
        setStep(2);
      }, 100);
    } catch (error) {
      console.error('Error loading car for edit:', error);
    } finally {
      setIsLoadingCar(false);
    }
  }, [clearFormData, updateFormData]);

  // Check for editId in URL and load car data - MUST be after loadCarForEdit definition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    
    if (editId) {
      setEditCarId(parseInt(editId, 10));
      loadCarForEdit(parseInt(editId, 10));
    }
  }, [loadCarForEdit]);

  // Load draft on component mount (only if not in edit mode)
  useEffect(() => {
    if (editCarId) return; // Skip draft loading if editing
    
    const savedDraft = DraftService.getDraft('manual');
    if (savedDraft) {
      const shouldRestore = window.confirm(
        `You have a saved draft from ${new Date(savedDraft.savedAt).toLocaleString()}. Do you want to restore it?`
      );
      
      if (shouldRestore) {
        setStep(savedDraft.step || 1);
        setRegNo(savedDraft.regNo || '');
        // Update Zustand store with draft data
        updateFormData(savedDraft.details || {});
        setCarData(savedDraft.carData || null);
        setSearchBrand(savedDraft.searchBrand || '');
        setSearchModel(savedDraft.searchModel || '');
      }
    }
  }, [updateFormData, editCarId]);

  // Final submit (Step 9) - Navigate to Publish page
  const handleSubmitFinal = async (e, additionalData = {}) => {
    e?.preventDefault?.();
    
    try {
      console.log('🚀 RegistrationForm: Finalizing form submission with Zustand');
      
      // Update form data with all collected information
      const finalFormData = {
        ...details,
        ...additionalData,
        registrationNumber: regNo,
        carData: carData,
        currentStep: 9, // Mark as completed
        isComplete: true,
        editCarId: editCarId // Pass edit ID to publish page
      };
      
      console.log('📝 Final form data:', finalFormData);
      
      // Update Zustand store with final data
      updateFormData(finalFormData);
      console.log('📝 Updated Zustand store with form data');
      
      // Handle images with compression
      if (details.images && Array.isArray(details.images)) {
        console.log('🖼️ Processing images with Zustand compression...');
        console.log('🖼️ Images to process:', details.images);
        await updateImages(details.images);
        console.log('✅ Images processed and saved to Zustand store');
      } else {
        console.log('⚠️ No images found in details.images:', details.images);
      }
      
      console.log('✅ Form data saved to Zustand store');
      console.log('📊 Form completion:', getProgressPercentage() + '%');
      
      // Debug: Check what's actually in Zustand store
      const currentFormData = getFormDataForAPI();
      console.log('🔍 Current Zustand store data:', currentFormData);
      
      // Navigate to publish page (with editId if editing)
      const publishUrl = editCarId ? `/publish?editId=${editCarId}` : '/publish';
      window.location.href = publishUrl;
      
    } catch (error) {
      console.error('❌ Error in handleSubmitFinal:', error);
      // Still navigate to publish page even if there's an error
      const publishUrl = editCarId ? `/publish?editId=${editCarId}` : '/publish';
      window.location.href = publishUrl;
    }
  };

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <EnterRegistration
            regNo={regNo}
            setRegNo={setRegNo}
            error={error}
            setError={setError}
            goStep2={goStep2}
            onCarDataFetched={handleCarDataFetched}
          />
        );
      case 2:
        return (
          <BrandForm
            filteredBrands={filteredBrands}
            allBrands={brands}
            searchBrand={searchBrand}
            setSearchBrand={setSearchBrand}
            backTo1={backTo1}
            goStep3={goStep3}
            carData={carData}
          />
        );
      case 3:
        return (
          <ModalForm
            backTo2={backTo2}
            goStep4={goStep4}
            carData={carData}
          />
        );
      case 4:
        return (
          <VeriantForm
            variant={variant}
            backTo3={backTo3}
            goStep5={goStep5}
            carData={carData}
          />
        );
      case 5:
        return (
          <OwnershipForm
            backTo4={backTo4}
            goStep6={goStep6}
            carData={carData}
          />
        );
      case 6:
        return (
          <WarrantyForm 
            backTo5={goStep5} 
            goStep7={goStep7}
            carData={carData}
          />
        );
      case 7:
        return <MediaUploads backTo6={goStep6} goStep8={goStep8} />;
      case 8:
        return <AdditionalFeatures backTo7={goStep7} goStep9={() => setStep(9)} />;
      case 9:
        return <PricingForm 
          handleSubmitFinal={handleSubmitFinal} 
          backTo8={goStep8} 
          setStep={setStep}
          isAuthenticated={isAuthenticated}
        />;
      default:
        return null;
    }
  }

  return (
    <section className="registrationFormMain" style={{ paddingTop: 130, paddingBottom: 30 }}>
   
          {/* ✅ Har step ki heading */}
          {/* <FormHeadingComponents title={stepHeadings[step - 1]} /> */}
          <Container fluid>
            <Row className="justify-content-center">
              <Col xl={11}>
                <div className="registrationFormBody">
                  {renderStep()}
                </div>
              </Col>
            </Row>
          </Container>
    </section>
  );
}
