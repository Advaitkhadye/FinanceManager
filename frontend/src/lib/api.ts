import { supabase } from './supabase';
import { API_URL } from '../config';

export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
    let session = null;
    try {
        const { data } = await supabase.auth.getSession();
        session = data.session;
    } catch (error) {
        console.warn("Error getting session:", error);
    }

    const token = session?.access_token;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as HeadersInit;

    // Ensure endpoint starts with / if not present (unless it is a full URL, but we assume endpoint paths)
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login?
        // For now just let the caller handle it
    }

    return response;
};
