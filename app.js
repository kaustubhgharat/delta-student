require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cors = require('cors');

const User = require('./models/user.js');
const listingsRouter = require('./routes/listing.js');
const userRouter = require('./routes/user.js');
const reviewsRouter = require('./routes/review.js');

const app = express();

const port = process.env.PORT || 3000;
const DB_URL = process.env.ATLASBD_URL;
const SESSION_SECRET = process.env.SECRET || 'keyboard cat'; // fallback just in case


app.set("trust proxy", 1);
// ✅ CORS config
app.use(cors({
  origin: "https://delta-student-frontend.onrender.com",
  credentials: true
}));

// ✅ MongoDB session store
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: SESSION_SECRET
  },
  ttl: 24 * 60 * 60 // 1 day
});
store.on("error", (err) => {
  console.log("Mongo Store Error:", err);
});

// ✅ Session middleware (with persistent store)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    secure: true,          // ✅ Render uses HTTPS
    sameSite: "none"       // ✅ Required for cross-site credentials
  }
}));

// ✅ JSON & form middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Optional user data available in templates (if needed)
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server running ✅");
});
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ error: message });
});

// ✅ DB connection and server startup
main().then(() => {
  console.log("Connected to DB");
}).catch(console.error);

async function main() {
  await mongoose.connect(DB_URL);
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
