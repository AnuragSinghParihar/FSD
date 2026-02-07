/**
 * Admin Authorization Middleware
 * Must be used AFTER authenticate middleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = adminOnly;
