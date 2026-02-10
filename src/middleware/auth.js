function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      return res.status(403).render('error', { message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
