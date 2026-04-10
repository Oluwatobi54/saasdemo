/**
 * SaaS API Service for AfriDam Backend
 * Handles image scanning and recommendation fetching.
 * Uses window.AFRIDAM_CONFIG for credentials.
 */

const SaasApiService = {
  /**
   * Performs the skin scan using the SaaS gateway.
   * @param {File|Blob} imageFile - Thecaptured skin image.
   * @param {Object} metadata - Additional info like age, concerns, environment.
   * @returns {Promise<Object>} - The analysis result and recommendations.
   */
  async scanSkin(imageFile, metadata = {}) {
    const config = window.AFRIDAM_CONFIG;
    if (!config || !config.API_KEY) {
      console.warn('SaaS Configuration is missing. Please ensure config.js is loaded.');
      throw new Error('API Configuration Error');
    }

    const formData = new FormData();
    formData.append('file', imageFile);


    try {
      const response = await fetch(`${config.BACKEND_URL}v1/saas/scan`, {
        method: 'POST',
        headers: {
          'X-API-KEY': config.API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed. Please try again.');
      }

      return await response.json();
    } catch (error) {
      console.error('SaaS API Error:', error);
      throw error;
    }
  },

  /**
   * Fetches scan history for the partner.
   */
  async getHistory() {
    const config = window.AFRIDAM_CONFIG;
    try {
      const response = await fetch(`${config.BACKEND_URL}v1/saas/scans`, {
        headers: {
          'X-API-KEY': config.API_KEY
        }
      });

      if (!response.ok) throw new Error('Failed to fetch history');
      return await response.json();
    } catch (error) {
      console.error('SaaS History Error:', error);
      throw error;
    }
  }
};

// Export to window for global access in pure HTML/JS setup
window.SaasApiService = SaasApiService;
