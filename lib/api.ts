// Replace with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch data with Authorization header if a token is present.
 */
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>), // <--- Add this type assertion
    };

    if (token) { 
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error((await response.json()).error || 'API request failed');
    }

    return response;
}