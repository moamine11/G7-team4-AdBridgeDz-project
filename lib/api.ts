
const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';

/**
 * Helper to fetch data with Authorization header if a token is present.
 */
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>), 
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

export default authenticatedFetch;