export const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // In production, we want to warn if the API URL is not set
    if (process.env.NODE_ENV === 'production' && !apiUrl) {
        console.warn(
            'Warning: NEXT_PUBLIC_API_URL is not defined. Defaulting to localhost. This may cause issues in production.'
        );
    }

    return apiUrl || 'http://localhost:8000';
};

export const API_URL = getApiUrl();
