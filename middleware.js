module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Please login first!");
    res.redirect("/login");
  }
};
