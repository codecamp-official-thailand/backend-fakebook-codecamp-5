const db = require("../models");
const { Op } = require("sequelize");

const sendRequestFriend = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const myId = Number(req.user.id);
    const friendRelationship = await db.friend.findOne({
      where: {
        [Op.or]: [
          { request_from_id: myId, request_to_id: targetId },
          { request_from_id: targetId, request_to_id: myId },
        ],
      },
    });

    if (!friendRelationship && targetId !== myId) {
      const friendRlt = await db.friend.create({
        request_from_id: myId,
        request_to_id: targetId,
        status: "pending",
      });
      res.status(201).send(friendRlt);
    } else {
      res.status(400).send({ message: `Something went wrong.` });
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex);
  }
};

const denyFriendRequest = async (req, res) => {
  const targetId = Number(req.params.id);
  const myId = Number(req.user.id);

  const friendRelationship = await db.friend.findOne({
    where: {
      [Op.and]: [
        { status: "pending" },
        {
          [Op.or]: [
            { request_from_id: myId, request_to_id: targetId },
            { request_from_id: targetId, request_to_id: myId },
          ],
        },
      ],
    },
  });

  if (friendRelationship) {
    await friendRelationship.destroy();
    res.status(200).send({ message: "success" });
  } else {
    res.status(400).send({ message: "Something went wrong" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const targetId = Number(req.params.id);
  const myId = Number(req.user.id);

  const friendRelationship = await db.friend.findOne({
    where: {
      [Op.and]: [
        { status: "pending" },
        {
          [Op.or]: [
            { request_from_id: myId, request_to_id: targetId },
            { request_from_id: targetId, request_to_id: myId },
          ],
        },
      ],
    },
  });

  if (friendRelationship) {
    await friendRelationship.update({ status: "friend" });
    res.status(200).send({ message: "success" });
  } else {
    res.status(400).send({ message: "Something went wrong" });
  }
};

const deleteFriend = async (req, res) => {
  const targetId = Number(req.params.id);
  const myId = Number(req.user.id);

  const friendRelationship = await db.friend.findOne({
    where: {
      [Op.and]: [
        { status: "friend" },
        {
          [Op.or]: [
            { request_from_id: myId, request_to_id: targetId },
            { request_from_id: targetId, request_to_id: myId },
          ],
        },
      ],
    },
  });

  if (friendRelationship) {
    await friendRelationship.destroy();
    res.status(200).send({ message: "success" });
  } else {
    res.status(400).send({ message: "Something went wrong" });
  }
};

module.exports = {
  sendRequestFriend,
  deleteFriend,
  denyFriendRequest,
  acceptFriendRequest,
};
