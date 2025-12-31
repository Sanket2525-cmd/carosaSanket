/**
 * Utility functions for safe JSON parsing
 * Prevents JSON.parse errors that can crash the application
 */

/**
 * Safely parse a JSON string with fallback
 * @param {string} jsonString - The JSON string to parse
 * @param {any} fallback - The fallback value if parsing fails
 * @returns {any} Parsed JSON object or fallback value
 */
export const safeJsonParse = (jsonString, fallback = {}) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }
  
  const trimmed = jsonString.trim();
  if (!trimmed || !trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    console.warn('Invalid JSON string format:', trimmed);
    return fallback;
  }
  
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    console.warn('JSON parse error:', e);
    return fallback;
  }
};

/**
 * Safely parse customFields from API response
 * Handles nested customFields structure and double-encoded JSON
 * @param {object} apiCar - The car object from API
 * @returns {object} Parsed customFields object
 */
export const safeParseCustomFields = (apiCar) => {
  if (!apiCar || !apiCar.customFields) {
    return {};
  }

  const cf = apiCar.customFields;

  // Case 1: customFields is already a properly formatted object (ideal case)
  if (typeof cf === 'object' && cf !== null && !Array.isArray(cf)) {
    // Check if it has a nested customFields property (double encoding case)
    if (cf.customFields) {
      if (typeof cf.customFields === 'string') {
        // Double encoded: {customFields: "{\"brand\":...}"}
        return safeJsonParse(cf.customFields, {});
      } else if (typeof cf.customFields === 'object') {
        // Triple encoded edge case: {customFields: {customFields: {...}}}
        return cf.customFields;
      }
    }
    // It's already an object, return it directly
    return cf;
  }
  
  // Case 2: customFields is a string (needs parsing)
  if (typeof cf === 'string') {
    try {
      const parsed = safeJsonParse(cf, {});
      // If parsed result has a nested customFields, extract it
      if (parsed && typeof parsed === 'object' && parsed.customFields) {
        if (typeof parsed.customFields === 'string') {
          return safeJsonParse(parsed.customFields, {});
        } else if (typeof parsed.customFields === 'object') {
          return parsed.customFields;
        }
      }
      return parsed;
    } catch (e) {
      console.warn('Error parsing customFields string:', e);
      return {};
    }
  }

  // Fallback: return empty object
  return {};
};

/**
 * Safely parse any JSON string with comprehensive error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {any} fallback - The fallback value if parsing fails
 * @param {string} context - Context for error logging
 * @returns {any} Parsed JSON object or fallback value
 */
export const safeJsonParseWithContext = (jsonString, fallback = {}, context = 'Unknown') => {
  if (!jsonString || typeof jsonString !== 'string') {
    console.warn(`[${context}] Invalid input for JSON parsing:`, typeof jsonString);
    return fallback;
  }
  
  const trimmed = jsonString.trim();
  if (!trimmed) {
    console.warn(`[${context}] Empty JSON string`);
    return fallback;
  }
  
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    console.warn(`[${context}] Invalid JSON string format (not object or array):`, trimmed.substring(0, 50) + '...');
    return fallback;
  }
  
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    console.error(`[${context}] JSON parse error:`, e.message);
    console.error(`[${context}] Problematic JSON string:`, trimmed.substring(0, 100) + '...');
    return fallback;
  }
};

const jsonUtils = {
  safeJsonParse,
  safeParseCustomFields,
  safeJsonParseWithContext
};

export default jsonUtils;





