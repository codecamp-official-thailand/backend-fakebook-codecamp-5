const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/user");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", auth, getProfile);

module.exports = router;
