/**
 * User-Friendly Error Handler
 * Converts technical API/database errors into friendly messages
 */

// Map of technical error patterns to user-friendly messages
const errorMessages: Record<string, string> = {
    // Authentication errors
    'Invalid login credentials': 'Incorrect email or password. Please try again.',
    'invalid_grant': 'Incorrect email or password. Please try again.',
    'Invalid email or password': 'Incorrect email or password. Please try again.',
    'Email not confirmed': 'Please verify your email before logging in.',
    'User not found': 'No account found with these credentials.',

    // Network/Connection errors
    'Failed to fetch': 'Unable to connect. Please check your internet connection.',
    'NetworkError': 'Network error. Please check your connection and try again.',
    'TypeError: Failed to fetch': 'Connection failed. Please try again.',
    'net::ERR_': 'Connection error. Please try again.',

    // Database/API errors
    'Database error': 'Something went wrong. Please try again later.',
    'relation .* does not exist': 'Service temporarily unavailable. Please try again.',
    'Could not find the function': 'Service is being updated. Please refresh the page.',
    'PGRST': 'Service error. Please try again later.',
    'schema cache': 'Please refresh the page and try again.',

    // Permission errors
    'permission denied': 'You don\'t have permission to perform this action.',
    'row-level security': 'Access denied. Please contact support if this persists.',
    'violates row-level security': 'You don\'t have access to this resource.',

    // Validation errors
    'duplicate key': 'This record already exists.',
    'unique constraint': 'This record already exists.',
    'not-null constraint': 'Please fill in all required fields.',

    // Server errors
    '500': 'Server error. Please try again later.',
    '502': 'Server is temporarily unavailable. Please try again.',
    '503': 'Service unavailable. Please try again later.',
    '504': 'Request timed out. Please try again.',

    // Generic
    'Something went wrong': 'An unexpected error occurred. Please try again.',
};

/**
 * Convert a technical error to a user-friendly message
 */
export function getFriendlyErrorMessage(error: unknown): string {
    // Handle null/undefined
    if (!error) {
        return 'An unexpected error occurred. Please try again.';
    }

    // Get the error message string
    let errorString = '';

    if (typeof error === 'string') {
        errorString = error;
    } else if (error instanceof Error) {
        errorString = error.message;
    } else if (typeof error === 'object') {
        const err = error as any;
        errorString = err.message || err.error_description || err.error || err.msg || JSON.stringify(error);
    }

    // Check for matching patterns
    for (const [pattern, friendlyMessage] of Object.entries(errorMessages)) {
        try {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(errorString)) {
                return friendlyMessage;
            }
        } catch {
            // If regex fails, try simple includes
            if (errorString.toLowerCase().includes(pattern.toLowerCase())) {
                return friendlyMessage;
            }
        }
    }

    // If no pattern matched, return a generic message
    // Log the actual error for debugging (only in development)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.warn('[ErrorHandler] Unmapped error:', errorString);
    }

    return 'Something went wrong. Please try again.';
}

/**
 * Log error for debugging while showing friendly message to user
 */
export function handleError(error: unknown, context?: string): string {
    // Log full error for debugging
    console.error(`[${context || 'Error'}]`, error);

    // Return user-friendly message
    return getFriendlyErrorMessage(error);
}

export default {
    getFriendlyErrorMessage,
    handleError,
};
