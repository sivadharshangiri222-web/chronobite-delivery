export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin authorization required.',
      code: 'FORBIDDEN'
    });
  }
  next();
};

export const customerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({
      message: 'Access denied. Customer authorization required.',
      code: 'FORBIDDEN'
    });
  }
  next();
};
