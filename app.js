// Required imports and constants
require('dotenv').config()

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const DB_URL=process.env.ATLASBD_URL;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routes
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewsRouter = require("./routes/review.js");

const cors = require('cors');
const allowedOrigins = [
  'http://localhost:5173',
  'https://delta-student-frontend.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// app.options('*', cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl:DB_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",()=>{
  console.log("error in mongo session store ",err);
})
// ✅ Session setup BEFORE passport
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};
app.use(session(sessionOptions));

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Must be BEFORE your routes
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// // ✅ Then mount route
app.use("/", userRouter); 
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ error: message });
});

// ✅ DB connect + server start
main().then(() => {
  console.log("connected to DB");
}).catch(console.error);

async function main() {
  await mongoose.connect(DB_URL);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
