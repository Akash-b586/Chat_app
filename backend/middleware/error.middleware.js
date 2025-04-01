const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // checks if the error message is a string, if it is, it splits the string by the comma and trims the white space and filters out any empty strings
  const errors = err.message
    ? err.message
        .split(",")
        .map((error) => error.trim())
        .filter((msg) => msg !== "")
    : "Something went wrong";

  res.status(statusCode).json({
    message: errors,
    success: false,
  });
};

export default errorMiddleware;
