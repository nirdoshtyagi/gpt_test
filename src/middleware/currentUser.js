const User = require('../models/User');

async function currentUser(req, res, next) {
  if (req.session.userId) {
    req.currentUser = await User.findById(req.session.userId);
    res.locals.currentUser = req.currentUser;
  } else {
    res.locals.currentUser = null;
  }
  next();
}

module.exports = { currentUser };
