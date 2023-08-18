const User = require("../models/user");

module.exports.requestLogin = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  req.flash("success", `Welcome back ${req.user.username}`);
  res.redirect(redirectUrl);
  if (res.locals.returnTo) {
    delete res.locals.returnTo;
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body.user;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", `Welcome to Yelp Camp ${username}`);
        res.redirect("/campgrounds");
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

module.exports.requestLogout = (req, res, next) => {
  if (req.user && req.user.length != 0) {
    req.logout(function (err) {
      if (err) {
        req.flash("error", err.message);
        next(err);
      } else {
        req.flash("success", "You are now logged out!");
        res.redirect("/campgrounds");
      }
    });
  } else {
    req.flash("error", "Please login!");
    res.redirect("/login");
  }
};
