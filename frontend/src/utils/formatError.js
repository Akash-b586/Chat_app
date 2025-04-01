export const formatError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.statusText ||
    "An error occurred. Please try again later.";
  return errorMessage;
};
