const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "mobigic", function (err, decoded) {
      if (decoded) {
        req.user = decoded.userID;
        next();
      } else {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};

module.exports = { authenticate };
