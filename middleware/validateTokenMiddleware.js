const jwt = require("jsonwebtoken");

function validateTokenMiddleware(req, res, next) {
  const rawAccessToken = req.headers.authorization;

  if (!rawAccessToken) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  const token = rawAccessToken.split(" ")[1]; // Bearer <token>

  if (!token || token === "null") {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    req.user = decoded; // store user info in req
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
}

module.exports = validateTokenMiddleware;
