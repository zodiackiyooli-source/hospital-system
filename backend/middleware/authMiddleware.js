const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect: Verify JWT, set req.user
const protect = async (req, res, next) => {
  // ─── DEV MODE: BYPASS AUTHENTICATION ─────────────────────────────────────────
  // Maadaama frontend-ka login laga xiray, backend-ka wuxuu isticmaalayaa user macmal ah
  req.user = {
    _id: "60b9b3b3b3b3b3b3b3b3b3b3",
    role: "admin",
    name: "Dev Admin"
  };
  return next();

  // ─── PRODUCTION AUTHENTICATION (Bypassed for now) ──────────────────────────
  /*
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  */
};

module.exports = { protect };
