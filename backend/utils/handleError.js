const handleError = (res, statusCode, message) => {
  res.status(statusCode);
  throw new Error(message);
};

export default handleError;
