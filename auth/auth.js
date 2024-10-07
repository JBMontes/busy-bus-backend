
require("dotenv").config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied. No token provided" });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied. No token provided" });
    }

    // Verify the token
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });

        req.user = user;  
        next();  
    });
};

module.exports = { authenticateToken };
