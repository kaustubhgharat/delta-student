const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/user")


router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout",userController.logout);


// GET /users/check-auth
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user }); // You may return only { username: req.user.username } if you prefer
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;