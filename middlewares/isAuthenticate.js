const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if(!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}
