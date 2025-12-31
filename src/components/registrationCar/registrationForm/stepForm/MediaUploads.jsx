import { faArrowRight, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import CarPhotosForm from "./uploader/CarPhotosForm";
import { useFormDataStore } from "../../../../store/formDataStore";

function MediaUploads({backTo6, goStep8}) {
  // Use Zustand store for form data
  const { formData: details, updateImages, updateFormData } = useFormDataStore();
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Memoize existing images to prevent infinite re-renders
  // Only recreate if details.existingImages actually changes
  const existingImages = useMemo(() => {
    return details?.existingImages || {
      exterior: [],
      interior: [],
      highlights: [],
      tyres: []
    };
  }, [details?.existingImages]);

  // Generate car summary text
  const getCarSummary = () => {
      const rawYear = details.year || details.mfgYear || "2025";
  let formattedYear;

  if (/^\d{4}-\d{2}$/.test(rawYear)) {
    const [y, m] = rawYear.split("-");
    const date = new Date(y, m - 1);
    formattedYear = date
      .toLocaleString("en-US", { month: "long", year: "numeric" })
      .replace(" ", " "); // → "May, 2014"
  } else {
    formattedYear = rawYear.toString();
  }
    // const year = details.year || details.mfgYear || "2025";
    const brand = details.brand || "";
    const model = details.model || "";
    const variant = details.variant || "";
    const fuel = details.fuel || "Petrol";
    const transmission = details.transmission || "Manual";
    const color = details.color || "White";
    const owner = details.owner === 1 ? "1st" : details.owner === 2 ? "2nd" : details.owner === 3 ? "3rd" : `${details.owner}th`;
    const kms = details.km || "45,000";
    
    // Only include variant if it's different from model (to avoid duplication)
    const variantPart = (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) 
      ? ` ${variant}` 
      : "";
    
    return `${formattedYear} ${brand} ${model}${variantPart} ${fuel} ${transmission}, ${color}, ${owner}, ${kms} Kms`;
  };

  // Calculate progress percentage for transparency gradient
  const progressPercentage = (7 / 9) * 100; // Step 7 of 9 = 77.78%

  // Clear validation errors when user makes changes
  const clearValidationError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Check if we're in edit mode (has existing images)
  const isEditMode = useMemo(() => {
    const hasExistingImages = existingImages && (
      (existingImages.exterior && existingImages.exterior.length > 0) ||
      (existingImages.interior && existingImages.interior.length > 0) ||
      (existingImages.highlights && existingImages.highlights.length > 0) ||
      (existingImages.tyres && existingImages.tyres.length > 0)
    );
    return hasExistingImages;
  }, [existingImages]);

  // Validation function - images are optional, especially in edit mode
  const validateForm = () => {
    const errors = {};

    // Images are optional - user can proceed without uploading new images
    // This is especially important in edit mode where they might just want to remove images
    // No validation error for empty images

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📤 handleSubmit called, uploadedImages:', uploadedImages.length);
    
    if (validateForm()) {
      // Store image objects with section information preserved
      const imageObjects = uploadedImages.map(imageObj => {
        if (imageObj.file) {
          // Preserve section information from CarPhotosForm
          return {
            file: imageObj.file,
            section: imageObj.section || null, // Preserve section info
          };
        } else if (imageObj instanceof File) {
          // If it's already a File instance, wrap it with section info if available
          return {
            file: imageObj,
            section: imageObj.section || null,
          };
        } else {
          console.warn('Invalid image object:', imageObj);
          return null;
        }
      }).filter(obj => obj !== null && obj.file !== null); // Remove null entries
      
      console.log('📤 Storing image objects with section info for upload:', {
        originalCount: uploadedImages.length,
        processedCount: imageObjects.length,
        imageObjects: imageObjects,
        isEditMode: isEditMode,
        hasExistingImages: isEditMode
      });
      
      // Allow proceeding with empty images - user may not want to upload new images
      // or may want to remove all existing images in edit mode
      if (imageObjects.length === 0) {
        console.log('ℹ️ No new images to upload - proceeding without images');
        // Set empty array to clear any previous images
        try {
          await updateImages([]);
          console.log('✅ Empty images array saved to Zustand store');
          goStep8();
          return;
        } catch (error) {
          console.error('❌ Error saving empty images array:', error);
          // Still proceed - don't block user
          goStep8();
          return;
        }
      }
      
      try {
        // Update the details with image objects (preserving section info) using Zustand store
        await updateImages(imageObjects);
        console.log('✅ Images successfully saved to Zustand store with section information');
        goStep8();
      } catch (error) {
        console.error('❌ Error saving images to Zustand store:', error);
        setValidationErrors({ images: 'Failed to save images. Please try again.' });
      }
    } else {
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[data-field="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  // Handle images from CarPhotosForm (now includes removed image IDs)
  const handleImagesChange = useCallback((images, removedImageIds = []) => {
    console.log('📸 handleImagesChange called with:', images.length, 'images');
    setUploadedImages(images);
    // Store removed image IDs in form data for later use in update
    if (removedImageIds && removedImageIds.length > 0) {
      updateFormData({ removedImageIds });
    }
    clearValidationError("images");
  }, [updateFormData]);

  return (
    <div 
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage}%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`
      }}
    >
      {/* Background Image */}
      <div className="registration-bg-image"></div>
      
      <Container fluid className="registration-container">
        <Row className="registration-content">
          <Col md={12}>
            <div className="mb-3 d-flex justify-content-end chippyTopText">
              <p className="py-3 px-5">
                {getCarSummary()}
              </p>
            </div>
          </Col>
          
          {/* Left Section - Information */}
          <Col xl={6} className="registration-info-section">
            <h1 className="registration-main-title brand-main-title">
              Upload clear and high-quality photos of your car from all angles — front, rear, sides, interior, dashboard, and odometer.
            </h1>
            
            <p className="registration-description text-wrap">
              Good images make your listing stand out and attract more genuine buyers.
            </p>
            
            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 7 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '78%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}
          
          </Col>

          {/* Right Section - Form Card */}
          <Col xl={6} className="registration-form-section ">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Photos</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form photo-form">
                <div data-field="images" className="photo-scroller">
                    {validationErrors.images && (
                    <div className="text-danger  text-center">
                      {validationErrors.images}
                    </div>
                  )}
                  <CarPhotosForm 
                    onImagesChange={handleImagesChange} 
                    existingImages={existingImages}
                  />
                
                </div>
              </form>

              {/* Back and Next Buttons - Right Section */}
            </div>
          </Col>
          
          <Col xs={12} className="">
            <div className="warraping d-flex align-items-center justify-content-between">
              <div className="registration-left-actions">
                <button type="button" className="nav-btn nav-btn-reset">
                  Reset
                </button>
              </div>
          
              <div className="registration-right-actions">
                <button 
                  type="button" 
                  className="nav-btn nav-btn-back"
                  onClick={backTo6}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="nav-btn nav-btn-next"
                  onClick={handleSubmit}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MediaUploads;
