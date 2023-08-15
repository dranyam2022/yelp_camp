const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}`);
    res.redirect("/campgrounds");
  }
);

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body.user;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.flash("success", `Welcome to Yelp Camp ${username}`);
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/logout", (req, res, next) => {
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
});

module.exports = router;
