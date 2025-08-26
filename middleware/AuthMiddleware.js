const jwt = require("jsonwebtoken");

function validateTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing. Please log in again.",
    });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token || token === "null") {
    return res.status(401).json({
      message: "Token missing. Please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);

    // Attach decoded token to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Token invalid or expired. Please log in again.",
    });
  }
}

module.exports = { validateTokenMiddleware };
