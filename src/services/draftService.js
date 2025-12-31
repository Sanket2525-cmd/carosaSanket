// Draft Service for saving and retrieving car listing form data
class DraftService {
  static DRAFT_KEY = 'carosa_car_listing_draft';
  static AUTO_SAVE_KEY = 'carosa_auto_save_draft';

  /**
   * Save draft data to localStorage
   * @param {Object} formData - The form data to save
   * @param {string} type - 'manual' for user-initiated save, 'auto' for auto-save
   */
  static saveDraft(formData, type = 'manual') {
    try {
      const draftData = {
        ...formData,
        savedAt: new Date().toISOString(),
        type: type
      };

      const key = type === 'auto' ? this.AUTO_SAVE_KEY : this.DRAFT_KEY;
      localStorage.setItem(key, JSON.stringify(draftData));
      
      console.log(`Draft saved (${type}):`, draftData);
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  /**
   * Retrieve draft data from localStorage
   * @param {string} type - 'manual' or 'auto'
   * @returns {Object|null} The saved draft data or null if not found
   */
  static getDraft(type = 'manual') {
    try {
      const key = type === 'auto' ? this.AUTO_SAVE_KEY : this.DRAFT_KEY;
      const draftData = localStorage.getItem(key);
      
      if (draftData) {
        const parsed = JSON.parse(draftData);
        console.log(`Draft retrieved (${type}):`, parsed);
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving draft:', error);
      return null;
    }
  }

  /**
   * Clear draft data from localStorage
   * @param {string} type - 'manual', 'auto', or 'all'
   */
  static clearDraft(type = 'all') {
    try {
      if (type === 'all') {
        localStorage.removeItem(this.DRAFT_KEY);
        localStorage.removeItem(this.AUTO_SAVE_KEY);
      } else {
        const key = type === 'auto' ? this.AUTO_SAVE_KEY : this.DRAFT_KEY;
        localStorage.removeItem(key);
      }
      
      console.log(`Draft cleared (${type})`);
      return true;
    } catch (error) {
      console.error('Error clearing draft:', error);
      return false;
    }
  }

  /**
   * Check if draft data exists
   * @param {string} type - 'manual' or 'auto'
   * @returns {boolean}
   */
  static hasDraft(type = 'manual') {
    const key = type === 'auto' ? this.AUTO_SAVE_KEY : this.DRAFT_KEY;
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get draft info (saved date, type, etc.)
   * @param {string} type - 'manual' or 'auto'
   * @returns {Object|null}
   */
  static getDraftInfo(type = 'manual') {
    const draft = this.getDraft(type);
    if (draft) {
      return {
        savedAt: draft.savedAt,
        type: draft.type,
        hasData: Object.keys(draft).length > 2 // More than just savedAt and type
      };
    }
    return null;
  }

  /**
   * Auto-save form data (throttled to avoid excessive saves)
   * @param {Object} formData - The form data to auto-save
   * @param {number} throttleMs - Throttle time in milliseconds (default: 2000)
   */
  static autoSave(formData, throttleMs = 2000) {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft(formData, 'auto');
    }, throttleMs);
  }

  /**
   * Cancel pending auto-save
   */
  static cancelAutoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }
}

export default DraftService;









