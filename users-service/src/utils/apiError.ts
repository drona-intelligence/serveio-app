export interface ApiError {
    success: false;
    error: string;
    code?: number | undefined;
}

export function apiError(error: string, code?: number): ApiError {
    return {
        success: false,
        error,
        code,
    };
}