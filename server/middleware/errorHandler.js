const errorHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Mongoose validation error (e.g. required fields, minlength)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  // JWT errors (invalid token, expired token)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
