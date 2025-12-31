// Brand Logo Service for mapping car makes to logo images
class BrandLogoService {
  // Brand logo mapping - maps car make names to logo image paths
  static brandLogoMap = {
    // Exact matches
    'Honda': 'https://ibb.co/kswGySck/honda.jpg',
    'Audi': '/images/audicar.jpg',
    'BMW': '/images/bmwcar.jpg',
    'Ford': '/images/fordcar.jpg',
    'Mercedes Benz': '/images/marcar.jpg',
    'Mercedes': '/images/marcar.jpg',
    'Peugeot': '/images/peugeotcar.jpg',
    'Volkswagen': '/images/volkswagencar.jpg',
    'Volkswagen': '/images/Volkswagentwo.jpg',
    '': '/images/.png',
    'Mahindra': '/images/mahindra.png',
    'Kia': '/images/kia.png',
    
    // Case-insensitive matches (will be handled by findBrandLogo method)
    'honda': 'https://ibb.co/kswGySck/honda.jpg',
    'audi': '/images/audicar.jpg',
    'bmw': '/images/bmwcar.jpg',
    'ford': '/images/fordcar.jpg',
    'mercedes benz': '/images/marcar.jpg',
    'mercedes': '/images/marcar.jpg',
    'peugeot': '/images/peugeotcar.jpg',
    'volkswagen': '/images/volkswagencar.jpg',
    '': '/images/.png',
    'mahindra': '/images/mahindra.png',
    'kia': '/images/kia.png',
  };

  /**
   * Find brand logo for a given car make
   * @param {string} carMake - The car make from API (e.g., "Honda", "BMW")
   * @returns {string} - Path to the brand logo image
   */
  static findBrandLogo(carMake) {
    if (!carMake) return null;

    // Clean the car make string
    const cleanMake = carMake.trim();
    
    // Try exact match first
    if (this.brandLogoMap[cleanMake]) {
      return this.brandLogoMap[cleanMake];
    }

    // Try case-insensitive match
    const lowerMake = cleanMake.toLowerCase();
    if (this.brandLogoMap[lowerMake]) {
      return this.brandLogoMap[lowerMake];
    }

    // Try partial matches for common variations
    const partialMatches = {
      'honda': 'https://ibb.co/kswGySck/honda.jpg',
      'audi': '/images/audicar.jpg',
      'bmw': '/images/bmwcar.jpg',
      'ford': '/images/fordcar.jpg',
      'mercedes': '/images/marcar.jpg',
      'benz': '/images/marcar.jpg',
      'peugeot': '/images/peugeotcar.jpg',
      'volkswagen': '/images/volkswagencar.jpg',
      'vw': '/images/volkswagencar.jpg',
      '': '/images/.png',
      'mahindra': '/images/mahindra.png',
      'kia': '/images/kia.png',
    };

    for (const [key, logoPath] of Object.entries(partialMatches)) {
      if (lowerMake.includes(key)) {
        return logoPath;
      }
    }

    // Default fallback - return a generic car logo or null
    return '/images/brandcar.png'; // Generic brand logo
  }

  /**
   * Get all available brand logos
   * @returns {Array} - Array of brand logo objects
   */
  static getAllBrandLogos() {
    return Object.entries(this.brandLogoMap).map(([brand, logo]) => ({
      brandName: brand,
      image: logo
    }));
  }

  /**
   * Add a new brand logo mapping
   * @param {string} brandName - The brand name
   * @param {string} logoPath - Path to the logo image
   */
  static addBrandLogo(brandName, logoPath) {
    this.brandLogoMap[brandName] = logoPath;
    this.brandLogoMap[brandName.toLowerCase()] = logoPath;
  }
}

export default BrandLogoService;
