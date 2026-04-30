export const apiResponse = (data: unknown, message: string = "Success", statusCode: number = 200) => {
  return {
    success: true,
    message,
    statusCode,
    data
  };
};
