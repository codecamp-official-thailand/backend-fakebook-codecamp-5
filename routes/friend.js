const express = require("express");
const passport = require("passport");
const {
  denyFriendRequest,
  deleteFriend,
  acceptFriendRequest,
  sendRequestFriend,
} = require("../controllers/friend");
const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });

router.post("/requests/:id", auth, sendRequestFriend);

router.delete("/requests/:id", auth, denyFriendRequest);

router.put("/requests/:id", auth, acceptFriendRequest);

router.delete("/:id", auth, deleteFriend);

module.exports = router;
