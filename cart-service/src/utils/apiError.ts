export const apiError = (message: string, statusCode: number) => {
  return {
    success: false,
    message,
    statusCode,
    data: null
  };
};
