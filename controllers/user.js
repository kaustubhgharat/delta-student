const express = require('express');
const User = require("../models/user");
const passport = require('passport');


module.exports.signup=async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Login after signup failed:", err);
        return res.status(500).json({ error: "Login after signup failed" });
      }

      res.status(201).json({ message: "Signup and login successful", user: registeredUser });
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports.login =(req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log("Logged in user:", user); // ✅ ADD THIS
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
}

module.exports.logout= (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.clearCookie("connect.sid"); // optional, if using sessions
    res.status(200).json({ message: "Logout successful" });
  });
}