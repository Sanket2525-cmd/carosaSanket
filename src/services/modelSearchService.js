// Model Search Service for fetching car models, makes, years, and trims
import { API_BASE_URL } from '../config/environment';

class ModelSearchService {
  static BASE_URL = `${API_BASE_URL}/api/car-search`;

  /**
   * Fetch car models for a specific brand
   * @param {string} brand - The car brand (e.g., "Honda")
   * @returns {Promise<Object>} API response with models data
   */
  static async getModels(brand) {
    try {
      // Brand mapping for API compatibility
      const brandMapping = {
        'Maruti Suzuki': '',
        'Maruti Suzuki ': '',
        'Maruti Suzuki-': '',
        'Maruti Suzuki_': '',
        '': ''
      };
      
      // Get the API-compatible brand name
      const apiBrand = brandMapping[brand.toLowerCase()] || brand;
      
      // Try different brand name variations
      const brandVariations = [
        apiBrand, // API-compatible brand name
        brand, // Original brand name
        apiBrand.toLowerCase(), // Lowercase
        apiBrand.toUpperCase(), // Uppercase
        apiBrand.replace(/\s+/g, ''), // Remove spaces
        apiBrand.replace(/\s+/g, '-'), // Replace spaces with hyphens
        apiBrand.replace(/\s+/g, '_'), // Replace spaces with underscores
      ];
      
      // Remove duplicates
      const uniqueVariations = [...new Set(brandVariations)];
      
      console.log('🔍 Brand mapping:', brand, '→', apiBrand);
      console.log('🔍 Trying brand variations:', uniqueVariations);
      
      for (const brandVariation of uniqueVariations) {
        const url = `${this.BASE_URL}/models/${encodeURIComponent(brandVariation)}`;
        console.log('🔍 Fetching models from:', url);
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          
          console.log('📡 Models API response for', brandVariation, ':', { status: response.status, data });
          
          if (response.ok) {
            // Handle the actual API response structure
            if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
              console.log('✅ Found models with brand variation:', brandVariation);
              return { success: true, data: data.data };
            } else if (Array.isArray(data) && data.length > 0) {
              console.log('✅ Found models with brand variation:', brandVariation);
              return { success: true, data: data };
            }
          }
        } catch (variationError) {
          console.log('❌ Failed with brand variation:', brandVariation, variationError);
          continue;
        }
      }
      
      // If all variations failed, return empty result
      console.log('❌ No models found for any brand variation');
      return { success: true, data: [] };
      
    } catch (error) {
      console.error("Error fetching models:", error);
      return { success: false, error: "Network error or server is unreachable" };
    }
  }

  /**
   * Fetch car trims for a specific brand and model
   * @param {string} brand - The car brand (e.g., "honda")
   * @param {string} model - The car model (e.g., "city")
   * @returns {Promise<Object>} API response with trims data
   */
  static async getTrims(brand, model) {
    try {
      // Brand mapping for API compatibility (same as models)
      const brandMapping = {
        'Maruti Suzuki': '',
        'Maruti Suzuki ': '',
        'Maruti Suzuki-': '',
        'Maruti Suzuki_': '',
        '': ''
      };
      
      // Get the API-compatible brand name
      const apiBrand = brandMapping[brand.toLowerCase()] || brand.toLowerCase();
      
      const url = `${this.BASE_URL}/trims/${apiBrand}/${model.toUpperCase()}`;
      console.log('🔍 Fetching trims from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📡 Trims API response:', { status: response.status, data });
      
      if (response.ok) {
        // Handle the actual API response structure
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log('✅ Found trims:', data.data.length);
          return { success: true, data: data.data };
        } else if (Array.isArray(data)) {
          console.log('✅ Found trims (direct array):', data.length);
          return { success: true, data: data };
        } else {
          console.error('❌ Unexpected trims API response structure:', data);
          return { success: false, error: "Unexpected API response structure" };
        }
      } else {
        return { success: false, error: data.message || "Failed to fetch trims" };
      }
    } catch (error) {
      console.error("Error fetching trims:", error);
      return { success: false, error: "Network error or server is unreachable" };
    }
  }

  /**
   * Fetch car makes for a specific year
   * @param {number} year - The year (e.g., 2022)
   * @returns {Promise<Object>} API response with makes data
   */
  static async getMakes(year) {
    try {
      const response = await fetch(`${this.BASE_URL}/makes?year=${year}`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to fetch makes" };
      }
    } catch (error) {
      console.error("Error fetching makes:", error);
      return { success: false, error: "Network error or server is unreachable" };
    }
  }

  /**
   * Fetch available years
   * @returns {Promise<Object>} API response with years data
   */
  static async getYears() {
    try {
      const response = await fetch(`${this.BASE_URL}/years`);
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to fetch years" };
      }
    } catch (error) {
      console.error("Error fetching years:", error);
      return { success: false, error: "Network error or server is unreachable" };
    }
  }

  /**
   * Format models data for UI display
   * @param {Array} modelsData - Raw models data from API (array of model names)
   * @param {string} brand - The selected brand
   * @returns {Array} Formatted models array
   */
  static formatModelsData(modelsData, brand) {
    if (!modelsData || !Array.isArray(modelsData)) {
      return [];
    }

    // Add popular models that might be missing from API
    const additionalModels = [];
    
    // For Maruti Suzuki/, add ERTIGA if not present
    if (brand.toLowerCase() === 'maruti suzuki' || brand.toLowerCase() === '') {
      const hasErtiga = modelsData.some(model => 
        model.toLowerCase().includes('ertiga')
      );
      if (!hasErtiga) {
        additionalModels.push('ERTIGA');
      }
    }

    // Combine API models with additional models
    const allModels = [...modelsData, ...additionalModels];

    return allModels.map(modelName => ({
      id: Math.random().toString(36).substr(2, 9),
      name: modelName,
      brandName: brand,
      image: this.getModelImage(modelName, brand),
    }));
  }

  /**
   * Get model image based on model name and brand
   * @param {string} modelName - The model name
   * @param {string} brand - The brand name
   * @returns {string} Image URL
   */
  static getModelImage(modelName, brand) {
    // Use the single default image for all models as requested
    const DEFAULT_MODEL_IMAGE = 'https://i.ibb.co/4RWtjPjd/car-icon-model-resize.jpg';
    return DEFAULT_MODEL_IMAGE;
  }

  /**
   * Format trims data for UI display
   * @param {Array} trimsData - Raw trims data from API
   * @param {string} brand - The selected brand
   * @param {string} model - The selected model
   * @returns {Array} Formatted variants array (deduplicated by name)
   */
  static formatTrimsData(trimsData, brand, model) {
    if (!trimsData || !Array.isArray(trimsData)) {
      return [];
    }

    console.log('🔧 Formatting trims data:', trimsData.length, 'trims');

    // First, map all trims with transmission info
    const allTrims = trimsData.map(trim => {
      const fullName = trim.model_trim || trim.trim || '';
      const transmission = trim.model_transmission_type || trim.transmission || '';
      
      // Extract base variant name (remove "Automatic" suffix and clean unwanted parts)
      let baseName = fullName
        .replace(/\s+(automatic|manual)$/i, '') // Remove transmission suffix
        .replace(/\s*SELF\s*DISC\s*&\s*ALLOY\s*/gi, '') // Remove "SELF DISC & ALLOY"
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      return {
        id: trim.model_id || Math.random().toString(36).substr(2, 9),
        name: baseName || 'Base Model', // Use base name or default
        fullName: fullName, // Keep original name for reference
        brandName: brand,
        modelName: model,
        image: this.getVariantImage(),
        // Include additional trim data
        year: trim.model_year || trim.year,
        body: trim.model_body || trim.body,
        engineSize: trim.model_engine_cc || trim.engineSize,
        fuelType: trim.model_engine_fuel || trim.fuelType,
        transmission: transmission,
        power: trim.model_engine_power_ps || trim.power,
        torque: trim.model_engine_torque_nm || trim.torque,
        seats: trim.model_seats || trim.seats,
        doors: trim.model_doors || trim.doors,
        // Store all transmission options for this variant
        transmissionOptions: []
      };
    });

    // Group by base name and collect transmission options
    const variantMap = new Map();
    
    allTrims.forEach(trim => {
      const key = trim.name.toLowerCase();
      
      if (!variantMap.has(key)) {
        variantMap.set(key, {
          ...trim,
          transmissionOptions: []
        });
      }
      
      const existingVariant = variantMap.get(key);
      
      // Add transmission option if not already present
      if (trim.transmission && !existingVariant.transmissionOptions.includes(trim.transmission)) {
        existingVariant.transmissionOptions.push(trim.transmission);
      }
      
      // Keep the most detailed trim info (prefer one with more data)
      if (trim.engineSize && !existingVariant.engineSize) {
        existingVariant.engineSize = trim.engineSize;
      }
      if (trim.power && !existingVariant.power) {
        existingVariant.power = trim.power;
      }
    });

    // Convert map back to array
    const variants = Array.from(variantMap.values());
    console.log('✅ Formatted variants:', variants.length, 'unique variants');
    
    return variants;
  }

  /**
   * Get variant image - using the specified ImgBB link
   * @returns {string} Image URL
   */
  static getVariantImage() {
    // Use the specified variant image
    return 'https://i.ibb.co/LhR1XkQG/variant-resize.jpg';
  }

  /**
   * Auto-select variant based on car data from registration search
   * @param {Array} variants - Available variants
   * @param {Object} carData - Car data from registration search
   * @returns {Object|null} Selected variant with transmission info or null
   */
  static autoSelectVariant(variants, carData) {
    if (!variants || !carData || !carData.variant) {
      return null;
    }

    // Clean the API variant name and extract transmission
    const originalVariant = carData.variant;
    const isAutomatic = /automatic/i.test(originalVariant);
    const isManual = /manual/i.test(originalVariant);
    
    // Remove transmission info and unwanted parts for base name matching
    const baseVariantName = originalVariant
      .replace(/\s+(automatic|manual)$/i, '') // Remove transmission suffix
      .replace(/\s*SELF\s*DISC\s*&\s*ALLOY\s*/gi, '') // Remove "SELF DISC & ALLOY"
      .replace(/\s*\([^)]*\)/g, '') // Remove (1198CC) type info
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .toLowerCase();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auto-selecting variant:', { 
        originalVariant: carData.variant, 
        baseVariantName: baseVariantName,
        isAutomatic: isAutomatic,
        isManual: isManual,
        availableVariants: variants.map(v => v.name) 
      });
    }
    
    // Try exact match first
    let selectedVariant = variants.find(variant => 
      variant.name.toLowerCase() === baseVariantName
    );

    // Try partial match if exact match not found
    if (!selectedVariant) {
      selectedVariant = variants.find(variant => 
        variant.name.toLowerCase().includes(baseVariantName) || 
        baseVariantName.includes(variant.name.toLowerCase())
      );
    }

    if (selectedVariant) {
      // Add transmission detection info to the selected variant
      const enhancedVariant = {
        ...selectedVariant,
        detectedTransmission: isAutomatic ? 'Automatic' : (isManual ? 'Manual' : null),
        originalVariantName: originalVariant
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Selected variant with transmission:', enhancedVariant);
      }

      return enhancedVariant;
    }

    return null;
  }

  /**
   * Get transmission options for a selected variant
   * @param {Array} variants - Available variants
   * @param {string} selectedVariantName - The selected variant name
   * @returns {Array} Available transmission options
   */
  static getTransmissionOptions(variants, selectedVariantName) {
    if (!variants || !selectedVariantName) {
      return ['Manual', 'Automatic']; // Default options
    }

    const selectedVariant = variants.find(variant => 
      variant.name.toLowerCase() === selectedVariantName.toLowerCase()
    );

    if (selectedVariant && selectedVariant.transmissionOptions && selectedVariant.transmissionOptions.length > 0) {
      return selectedVariant.transmissionOptions;
    }

    return ['Manual', 'Automatic']; // Default options
  }

  /**
   * Auto-select model based on car data from registration search
   * @param {Array} models - Available models
   * @param {Object} carData - Car data from registration search
   * @returns {Object|null} Selected model or null
   */
  static autoSelectModel(models, carData) {
    if (!models || !carData || !carData.model) {
      return null;
    }

    // Clean the API model name (remove extra info like engine size)
    const apiModel = carData.model.toLowerCase()
      .replace(/\s*\([^)]*\)/g, '') // Remove (1198CC) type info
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auto-selecting model:', { 
        originalModel: carData.model, 
        cleanedModel: apiModel, 
        availableModels: models.map(m => m.name) 
      });
    }
    
    // Try exact match first
    let selectedModel = models.find(model => 
      model.name.toLowerCase() === apiModel
    );

    // Try partial match if exact match not found
    if (!selectedModel) {
      selectedModel = models.find(model => 
        model.name.toLowerCase().includes(apiModel) || 
        apiModel.includes(model.name.toLowerCase())
      );
    }

    if (process.env.NODE_ENV === 'development' && selectedModel) {
      console.log('Selected model:', selectedModel);
    }

    return selectedModel || null;
  }
}

export default ModelSearchService;
