require("dotenv").config(); // load env vars

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const getCookies = require("./routes/cookies.js");
const session = require("express-session");
const flash = require("connect-flash");

// =======================
// DATABASE CONNECTION
// =======================
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// =======================
// APP CONFIG
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =======================
// SESSION + FLASH
// =======================
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// =======================
// ROOT ROUTE (IMPORTANT)
// =======================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// =======================
// ROUTES
// =======================
app.use("/cookies", getCookies);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// =======================
// ERROR HANDLING (KEEP LAST)
// =======================
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
