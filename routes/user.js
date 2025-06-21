const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/user")


router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout",userController.logout);


// GET /users/check-auth
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});


module.exports = router;