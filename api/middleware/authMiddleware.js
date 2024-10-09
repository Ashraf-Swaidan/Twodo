import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Allow preflight requests without a token
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Respond with 200 OK for preflight requests
  }

  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the header
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized!' });
    req.userId = decoded.id;
    req.username = decoded.username;
    req.email = decoded.email; // Save user id to request for later use
    req.avatar = decoded.avatar;
    next();
  });
};
