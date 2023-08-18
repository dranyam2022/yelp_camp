const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const usersRoute = require("./routes/users");

const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const port = 3000;

const campgroundsRoute = require("./routes/campgrounds");
const reviewsRoute = require("./routes/reviews");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
/* app settings */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(flash());

/* ************************* */

const sessionConfig = {
  secret: "thisshoullldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 604800000,
    maxAge: 604800000,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* flash middle-ware */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;

  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", usersRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/reviews", reviewsRoute);

/* *********************************** */

/* app other request */

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
/* ****************** */

/* app error handller */
app.use((err, req, res, next) => {
  const { message = "somthing went wrong", status = 500 } = err;
  res.status(status).render("error", { err });
});
/* *********************** */

app.listen(port, () => {
  console.log(`Serving on port:${port}`);
});
