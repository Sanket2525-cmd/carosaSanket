// Form Data Store using Zustand
// Manages car registration form data with persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFormDataStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      formData: {
        // Basic car info
        year: null,
        mfgYear: null,
        brand: null,
        brandLogo: null,
        model: null,
        variant: null,
        registrationNumber: null,
        
        // Car detailsf
        kmDriven: null,
        fuelType: null,
        transmission: null,
        owner: null,
        ownerSrNo: null,
        bodyType: null,
        color: null,
        engineCapacity: null,
        
        // Insurance and warranty
        insurance: null,
        insuranceType: null,
        insuranceDate: null,
        insuranceUpto: null,
        warranty: null,
        warrantyType: null,
        warrantyDate: null,
        
        // Pricing
        listingPrice: null,
        offerPrice: null,
        
        // Additional details
        description: null,
        features: [],
        documents: [],
        
        // Images (compressed)
        images: [],
        
        // VIN API image URL
        vinImageUrl: null,
        
        // Form progress
        currentStep: 1,
        isComplete: false,
      },
      
      // ==================== STATE MANAGEMENT ====================
      
      /**
       * Update form data with new values
       */
      updateFormData: (newData) => {
        const currentData = get().formData;
        set({
          formData: {
            ...currentData,
            ...newData,
            // Update completion status
            isComplete: get().checkFormCompletion({ ...currentData, ...newData })
          }
        });
      },
      
      /**
       * Update specific field
       */
      updateField: (field, value) => {
        const currentData = get().formData;
        set({
          formData: {
            ...currentData,
            [field]: value,
            isComplete: get().checkFormCompletion({ ...currentData, [field]: value })
          }
        });
      },
      
      /**
       * Add or update images with compression
       */
      updateImages: async (newImages) => {
        try {
          console.log('🖼️ updateImages called with:', newImages);
          console.log('🖼️ Number of images:', newImages?.length || 0);
          
          // Handle empty array - user may want to remove all images
          if (!newImages || newImages.length === 0) {
            console.log('ℹ️ Empty images array provided - clearing images');
            const currentData = get().formData;
            set({
              formData: {
                ...currentData,
                images: [], // Set empty array to clear images
                isComplete: get().checkFormCompletion({ ...currentData, images: [] })
              }
            });
            console.log('✅ Empty images array saved to Zustand store');
            return;
          }
          
          const compressedImages = await get().compressImages(newImages);
          console.log('✅ Images compressed successfully:', compressedImages);
          
          const currentData = get().formData;
          set({
            formData: {
              ...currentData,
              images: compressedImages,
              isComplete: get().checkFormCompletion({ ...currentData, images: compressedImages })
            }
          });
          
          console.log('✅ Images saved to Zustand store');
        } catch (error) {
          console.error('❌ Error compressing images:', error);
          // Fallback to original images if compression fails
          const currentData = get().formData;
          set({
            formData: {
              ...currentData,
              images: newImages || [], // Ensure it's at least an empty array
              isComplete: get().checkFormCompletion({ ...currentData, images: newImages || [] })
            }
          });
          console.log('⚠️ Fallback: Saved original images without compression');
        }
      },
      
      /**
       * Update current step
       */
      updateStep: (step) => {
        const currentData = get().formData;
        set({
          formData: {
            ...currentData,
            currentStep: step
          }
        });
      },
      
      /**
       * Mark form as complete
       */
      markComplete: () => {
        const currentData = get().formData;
        set({
          formData: {
            ...currentData,
            isComplete: true
          }
        });
      },
      
      // ==================== UTILITY FUNCTIONS ====================
      
      /**
       * Check if form is complete
       */
      checkFormCompletion: (data) => {
        const requiredFields = [
          'year', 'mfgYear', 'brand', 'model', 'variant', 'registrationNumber',
          'kmDriven', 'fuelType', 'transmission', 'owner', 'bodyType', 'color',
          'listingPrice', 'offerPrice'
        ];
        
        return requiredFields.every(field => {
          const value = data[field];
          return value !== null && value !== undefined && value !== '';
        });
      },
      
      /**
       * Compress images to reduce storage size
       */
      compressImages: async (images) => {
        if (!images || images.length === 0) return [];
        
        console.log('🖼️ Starting image compression for:', images.length, 'images');
        
        const compressedImages = await Promise.all(images.map(async (image, index) => {
          console.log(`🖼️ Processing image ${index}:`, image);
          
          // Preserve section information if present
          const section = image?.section || null;
          
          // Handle new structure: { file: File, section: string }
          if (image?.file && image.file instanceof File) {
            console.log(`🖼️ Image ${index} has file property with section:`, section);
            try {
              const compressedImage = await get().compressFileObject(image.file);
              console.log(`✅ Compressed image ${index}:`, compressedImage);
              // Preserve section information
              return {
                ...compressedImage,
                section: section,
                file: image.file, // Keep original file for upload
              };
            } catch (error) {
              console.warn(`❌ Failed to compress File object ${index}:`, error);
              // Return original structure with section preserved
              return {
                item: {
                  type: "image",
                  src: URL.createObjectURL(image.file),
                  name: image.file.name,
                  size: image.file.size
                },
                section: section,
                file: image.file,
              };
            }
          }
          
          // Handle File objects directly
          if (image instanceof File) {
            console.log(`🖼️ Image ${index} is a File object:`, image.name, image.size, 'bytes');
            try {
              const compressedImage = await get().compressFileObject(image);
              console.log(`✅ Compressed image ${index}:`, compressedImage);
              // Preserve section information if available
              return {
                ...compressedImage,
                section: section || image.section || null,
                file: image, // Keep original file for upload
              };
            } catch (error) {
              console.warn(`❌ Failed to compress File object ${index}:`, error);
              return {
                item: {
                  type: "image",
                  src: URL.createObjectURL(image),
                  name: image.name,
                  size: image.size
                },
                section: section || image.section || null,
                file: image,
              };
            }
          }
          
          // Handle existing image objects with src
          if (image.item && image.item.src) {
            try {
              const compressed = await get().compressImage(image);
              // Preserve section if it exists
              return {
                ...compressed,
                section: section || image.section || null,
              };
            } catch (error) {
              console.warn(`❌ Failed to compress image object ${index}:`, error);
              return {
                ...image,
                section: section || image.section || null,
              };
            }
          }
          
          console.warn(`⚠️ Unknown image format for image ${index}:`, image);
          return {
            ...image,
            section: section || null,
          };
        }));
        
        console.log('✅ Image compression completed:', compressedImages);
        return compressedImages;
      },
      
      /**
       * Compress a File object directly
       */
      compressFileObject: (file) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          // Create object URL for the file
          const objectUrl = URL.createObjectURL(file);
          
          img.onload = () => {
            // Calculate new dimensions (max 800px width/height)
            const maxSize = 800;
            const ratio = Math.min(maxSize / img.width, maxSize / img.height);
            
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
            
            // Clean up object URL
            URL.revokeObjectURL(objectUrl);
            
            // Return structured image object
            resolve({
              item: {
                type: "image",
                src: compressedDataUrl,
                name: file.name,
                size: file.size
              }
            });
          };
          
          img.onerror = () => {
            console.warn('Failed to load file for compression');
            URL.revokeObjectURL(objectUrl);
            resolve({
              item: {
                type: "image",
                src: objectUrl,
                name: file.name,
                size: file.size
              }
            }); // Return original if loading fails
          };
          
          img.src = objectUrl;
        });
      },
      
      /**
       * Compress a single image
       */
      compressImage: (image) => {
        return new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            // Calculate new dimensions (max 800px width/height)
            const maxSize = 800;
            const ratio = Math.min(maxSize / img.width, maxSize / img.height);
            
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
            
            resolve({
              ...image,
              item: {
                ...image.item,
                src: compressedDataUrl
              }
            });
          };
          
          img.onerror = () => {
            console.warn('Failed to load image for compression');
            resolve(image); // Return original if loading fails
          };
          
          img.src = image.item.src;
        });
      },
      
      /**
       * Get form data for API submission
       */
      getFormDataForAPI: () => {
        const data = get().formData;
        console.log('🔍 Raw form data from Zustand:', data);
        
        // Return raw form data for transformFormDataToAPI to process
        return {
          brand: data.brand,
          model: data.model,
          variant: data.variant,
          year: data.year,
          mfgYear: data.mfgYear,
          registrationNumber: data.registrationNumber,
          km: data.kmDriven,
          kmDriven: data.kmDriven,
          fuel: data.fuelType,
          fuelType: data.fuelType,
          transmission: data.transmission,
          owner: data.owner,
          spareKey: data.spareKey,
          exteriorColor: data.exteriorColor,
          engineCapacity: data.engineCapacity,
          warranty: data.warranty,
          warrantyType: data.warrantyType,
          warrantyDate: data.warrantyDate,
          insurance: data.insurance,
          insuranceType: data.insuranceType,
          insuranceDate: data.insuranceDate,
          listingPrice: data.listingPrice,
          offerPrice: data.offerPrice,
          additionalFeatures: data.additionalFeatures,
          images: data.images || [],
          vinImageUrl: data.vinImageUrl
        };
      },
      
      /**
       * Clear all form data
       */
      clearFormData: () => {
        set({
          formData: {
            year: null,
            mfgYear: null,
            brand: null,
            brandLogo: null,
            model: null,
            variant: null,
            registrationNumber: null,
            kmDriven: null,
            fuelType: null,
            transmission: null,
            owner: null,
            ownerSrNo: null,
            bodyType: null,
            color: null,
            engineCapacity: null,
            insurance: null,
            insuranceType: null,
            insuranceDate: null,
            insuranceUpto: null,
            warranty: null,
            warrantyType: null,
            warrantyDate: null,
            listingPrice: null,
            offerPrice: null,
            description: null,
            features: [],
            documents: [],
            images: [],
            vinImageUrl: null,
            currentStep: 1,
            isComplete: false,
          }
        });
      },
      
      /**
       * Get form progress percentage
       */
      getProgressPercentage: () => {
        const data = get().formData;
        const totalFields = 14; // Total required fields
        const filledFields = [
          data.year, data.mfgYear, data.brand, data.model, data.variant,
          data.registrationNumber, data.kmDriven, data.fuelType, data.transmission,
          data.owner, data.bodyType, data.color, data.listingPrice, data.offerPrice
        ].filter(field => field !== null && field !== undefined && field !== '').length;
        
        return Math.round((filledFields / totalFields) * 100);
      },
      
      /**
       * Check if specific step is complete
       */
      isStepComplete: (step) => {
        const data = get().formData;
        
        switch (step) {
          case 1: // Basic info
            return data.year && data.mfgYear && data.brand && data.model;
          case 2: // Car details
            return data.kmDriven && data.fuelType && data.transmission && data.owner;
          case 3: // Additional details
            return data.bodyType && data.color;
          case 4: // Pricing
            return data.listingPrice && data.offerPrice;
          case 5: // Images
            return data.images && data.images.length > 0;
          default:
            return false;
        }
      },
      
      /**
       * Get form data summary for display
       */
      getFormSummary: () => {
        const data = get().formData;
        return {
          car: `${data.brand} ${data.model}`,
          year: data.year,
          km: data.kmDriven,
          fuel: data.fuelType,
          transmission: data.transmission,
          owner: data.owner,
          price: data.listingPrice,
          images: data.images ? data.images.length : 0,
          progress: get().getProgressPercentage()
        };
      }
    }),
    {
      name: 'car-form-storage',
      partialize: (state) => ({ 
        formData: state.formData
      }),
    }
  )
);

export default useFormDataStore;
