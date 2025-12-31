/**
 * Brand Normalization Utility
 * Maps various brand name formats to standardized display names
 * Handles partial matches and case-insensitive matching
 */

/**
 * Normalize brand name by removing extra spaces, converting to lowercase, and removing special characters
 * @param {string} brandName - The brand name to normalize
 * @returns {string} Normalized brand name
 */
const normalizeBrandName = (brandName) => {
  if (!brandName || typeof brandName !== 'string') return '';
  return brandName
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
};

/**
 * Check if a brand name contains specific keywords (for partial matching)
 * @param {string} brandName - The brand name to check
 * @param {string[]} keywords - Array of keywords to search for
 * @returns {boolean} True if brand name contains any of the keywords
 */
const containsKeywords = (brandName, keywords) => {
  const normalized = normalizeBrandName(brandName);
  return keywords.some(keyword => normalized.includes(keyword.toLowerCase()));
};

/**
 * Brand mapping configuration
 * Maps various brand name formats to standardized display names
 */
const BRAND_MAPPING = {
  // MG Motor mappings - handle JSW MG Motor variations
  'jsw mg motor india pvt ltd': 'MG Motor',
  'jsw mg motor india pvt. ltd': 'MG Motor',
  'jsw mg motor india pvt ltd.': 'MG Motor',
  'jsw mg motor india pvt. ltd.': 'MG Motor',
  'jsw mg motor india': 'MG Motor',
  'jsw mg motor': 'MG Motor',
  'jswmgmotor': 'MG Motor',
  'mg motor': 'MG Motor',
  'mg motors': 'MG Motor',
  'mgmotor': 'MG Motor',
  'mgmotors': 'MG Motor',
  
  // Mahindra mappings (existing)
  'm & m': 'Mahindra',
  'm&m': 'Mahindra',
  'm and m': 'Mahindra',
  'mandm': 'Mahindra',
  
  // Add more brand mappings as needed
};

/**
 * Get standardized brand name from various input formats
 * @param {string} brandName - The brand name to normalize
 * @returns {string} Standardized brand name
 */
export const normalizeBrand = (brandName) => {
  if (!brandName || typeof brandName !== 'string') {
    return brandName || '';
  }

  const trimmed = brandName.trim();
  if (!trimmed) return '';

  // Normalize the input for comparison
  const normalized = normalizeBrandName(trimmed);

  // Check for exact match in mapping
  if (BRAND_MAPPING[normalized]) {
    return BRAND_MAPPING[normalized];
  }

  // Check for partial matches (for cases like "Jsw mg motor india pvt ltd")
  // MG Motor partial matching
  if (containsKeywords(normalized, ['jsw', 'mg', 'motor'])) {
    // Check if it's specifically an MG-related brand
    const mgKeywords = ['jsw', 'mg'];
    const motorKeywords = ['motor', 'motors'];
    
    if (mgKeywords.some(k => normalized.includes(k)) && 
        motorKeywords.some(k => normalized.includes(k))) {
      return 'MG Motor';
    }
  }

  // Return original if no mapping found (capitalize first letter of each word)
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Batch normalize an array of brand names
 * @param {string[]} brandNames - Array of brand names to normalize
 * @returns {string[]} Array of normalized brand names
 */
export const normalizeBrands = (brandNames) => {
  if (!Array.isArray(brandNames)) return [];
  return brandNames.map(brand => normalizeBrand(brand));
};

const brandNormalizer = {
  normalizeBrand,
  normalizeBrands,
  normalizeBrandName
};

export default brandNormalizer;

