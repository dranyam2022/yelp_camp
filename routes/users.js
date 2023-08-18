const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const {
  renderLogin,
  renderRegister,
  requestLogin,
  registerUser,
  requestLogout,
} = require("../controllers/users");

router
  .route("/login")
  .get(renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    requestLogin
  );

router.route("/register").get(renderRegister).post(wrapAsync(registerUser));

router.get("/logout", requestLogout);

module.exports = router;
