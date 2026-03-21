// Role check middleware
const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Access denied. No user' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} not authorized for this action. Required: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Usage: adminOnly = roleCheck('admin', 'owner')
module.exports = { roleCheck };

