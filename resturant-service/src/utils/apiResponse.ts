export interface ApiResponse<T> {
    success: true;
    data: T | null;
    message?: string | undefined;
}

export function apiResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}