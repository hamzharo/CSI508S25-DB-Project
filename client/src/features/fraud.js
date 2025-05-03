// src/features/fraud.js
import api from '@/utils/api'; // Assuming your configured Axios instance is here

/**
 * Creates a new fraud report.
 * @param {object} reportData - The report data.
 * @param {string} reportData.description - The description of the suspected fraud.
 * @param {number|null} [reportData.reported_account_id] - Optional ID of the account involved.
 * @param {number|null} [reportData.related_transaction_id] - Optional ID of the transaction involved.
 * @returns {Promise<object>} - The response data from the API (usually the created report).
 */
export const createFraudReport = async (reportData) => {
    try {
        console.log("API Call: Creating fraud report with data:", reportData);
        // Backend route is POST /api/fraud/reports
        const response = await api.post('/fraud/reports', reportData);
        console.log("API Response: Fraud report created.", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error: Failed to create fraud report:", error.response?.data || error.message);
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to submit fraud report');
    }
};

/**
 * Fetches the user's submitted fraud reports.
 * @returns {Promise<Array<object>>} - An array of the user's reports.
 */
export const getMyFraudReports = async () => {
    try {
        console.log("API Call: Fetching user's fraud reports...");
        // Backend route is GET /api/fraud/reports/my-reports
        const response = await api.get('/fraud/reports/my-reports');
        console.log("API Response: Fraud reports fetched.", response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch fraud reports:", error.response?.data || error.message);
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to load existing fraud reports');
    }
};