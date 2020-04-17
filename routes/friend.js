const express = require("express");
const {
  denyFriendRequest,
  deleteFriend,
  acceptFriendRequest,
  sendRequestFriend,
} = require("../controllers/friend");
const router = express.Router();

router.post("/requests/:id", sendRequestFriend);

router.delete("/requests/:id", denyFriendRequest);

router.put("/requests/:id", acceptFriendRequest);

router.delete("/:id", deleteFriend);

module.exports = router;
