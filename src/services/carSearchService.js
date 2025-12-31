// Car Search Service for API integration
import { API_BASE_URL } from '../config/environment';
import moment from 'moment';
import BrandLogoService from './brandLogoService';
import { normalizeBrand } from '../utils/brandNormalizer';

class CarSearchService {
  /**
   * Search car details by registration number
   * @param {string} regNo - Vehicle registration number
   * @returns {Promise<Object>} Car details response
   */
  static async searchCarByRegistration(regNo) {
    try {
      // Use API_BASE_URL from environment configuration
      const response = await fetch(`${API_BASE_URL}/api/car-search/vin?regNo=${encodeURIComponent(regNo)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (response.status === 404) {
          throw new Error('Registration number not found in database.');
        } else if (response.status === 400) {
          throw new Error('Invalid registration number format.');
        } else {
          throw new Error(`Server error (${response.status}). Please try again.`);
        }
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch car details');
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Car search API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch car details',
        data: null
      };
    }
  }

  /**
   * Format car data for form usage
   * @param {Object} carData - Raw car data from API
   * @returns {Object} Formatted car data
   */
  static formatCarData(carData) {
    if (!carData) return null;

    // Format registration date to "Month Year" format (e.g., "February 2011")
    const formatRegistrationDate = (dateString) => {
      if (!dateString) return '';
      
      // Handle different date formats from API
      let momentDate;
      
      // Try DD/MM/YYYY format first (common in Indian registration)
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Convert DD/MM/YYYY to MM/DD/YYYY for moment parsing
          momentDate = moment(`${parts[1]}/${parts[0]}/${parts[2]}`, 'MM/DD/YYYY');
        } else {
          // If parts don't match expected format, try parsing as-is
          momentDate = moment(dateString);
        }
      } else {
        // Try other common formats
        momentDate = moment(dateString);
      }
      
      // Check if momentDate is defined and valid before calling isValid()
      if (momentDate && momentDate.isValid && momentDate.isValid()) {
        return momentDate.format('MMMM YYYY');
      }
      
      return dateString; // Return original if parsing fails
    };

    // Format registration year to "Month Year" format
    // Priority: Use actual registration date if available, otherwise use year with January
    const formatRegistrationYear = (yearString, registrationDate) => {
      if (!yearString) return '';
      
      // If we have a registration date, use that for the month (e.g., "23/02/2011" -> "February 2011")
      if (registrationDate) {
        const formattedDate = formatRegistrationDate(registrationDate);
        if (formattedDate && formattedDate !== registrationDate) {
          return formattedDate; // Use the formatted registration date
        }
      }
      
      // If it's just a year and no registration date, assume January of that year
      if (/^\d{4}$/.test(yearString)) {
        const yearMoment = moment(`${yearString}-01-01`);
        if (yearMoment && yearMoment.isValid && yearMoment.isValid()) {
          return yearMoment.format('MMMM YYYY');
        }
      }
      
      return yearString;
    };

    // Format manufacturing year - use separate field if available, otherwise use registration date
    const formatManufacturingYear = (mfgYearString, mfgDateString, fallbackRegistrationDate) => {
      // If we have a specific manufacturing year field, use that
      if (mfgYearString) {
        return formatRegistrationYear(mfgYearString, mfgDateString || fallbackRegistrationDate);
      }
      
      // If we have a manufacturing date field, use that
      if (mfgDateString) {
        return formatRegistrationDate(mfgDateString);
      }
      
      // Fallback to registration date (current behavior)
      return formatRegistrationYear(carData.RegistrationYear, fallbackRegistrationDate);
    };

    // Get car make for brand logo
    let carMake = carData.CarMake?.CurrentTextValue || '';
    
    // Normalize brand name (handles JSW MG Motor variations, M&M, etc.)
    const mappedBrand = normalizeBrand(carMake);
    
    // Debug brand mapping
    if (carMake !== mappedBrand) {
      console.log(`🔄 Brand mapping: "${carMake}" → "${mappedBrand}"`);
    }
    
    const brandLogo = BrandLogoService.findBrandLogo(mappedBrand);

    const formattedData = {
      registrationYear: formatRegistrationYear(carData.RegistrationYear, carData.RegistrationDate),
      registrationYearRaw: carData.RegistrationYear || '',
      make: mappedBrand, // Use mapped brand name
      brandLogo: brandLogo, // Brand logo path
      model: carData.CarModel?.CurrentTextValue || '',
      engineSize: carData.EngineSize?.CurrentTextValue || '',
      fuelType: carData.FuelType?.CurrentTextValue || '',
      registrationDate: formatRegistrationDate(carData.RegistrationDate),
      registrationDateRaw: carData.RegistrationDate || '',
      // Manufacturing year - convert MM/YYYY to YYYY-MM format
      mfgYear: (() => {
        // If ManufacturingDate is in MM/YYYY format (e.g., "07/2015"), convert to YYYY-MM
        if (carData.ManufacturingDate && carData.ManufacturingDate.includes('/')) {
          const [month, year] = carData.ManufacturingDate.split('/');
          if (month && year && /^\d{2}$/.test(month) && /^\d{4}$/.test(year)) {
            return `${year}-${month.padStart(2, '0')}`;
          }
        }
        // Fallback to formatted manufacturing year
        return formatManufacturingYear(
          carData.ManufacturingYear,
          carData.ManufacturingDate,
        carData.RegistrationDate
        );
      })(),
      mfgYearRaw: carData.ManufacturingYear || '',
      owner: carData.Owner || '',
      insurance: carData.Insurance || '',
      insuranceUpto: carData.InsuranceUpto || '',
      location: carData.Location || '',
      imageUrl: carData.ImageUrl || '',
      vin: carData.VechileIdentificationNumber || '',
      engineNumber: carData.EngineNumber || '',
      fitness: carData.Fitness || '',
      pucc: carData.PUCC || '',
      numberOfSeats: carData.NumberOfSeats?.CurrentTextValue || '',
      color: carData.VehicleColor || '',
      ownerSrNo: carData.OwnerSrNo || ''
    };

    return formattedData;
  }

  static async checkRegistrationExists(regNo) {
    try {
      const cleanRegNo = regNo.replace(/\s/g, '').toUpperCase();
      const response = await fetch(`${API_BASE_URL}/api/car-search/check-registration?regNo=${encodeURIComponent(cleanRegNo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return { exists: false };

      const data = await response.json();
      return { exists: data.exists || false };
    } catch (error) {
      return { exists: false };
    }
  }
}

export default CarSearchService;