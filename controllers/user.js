const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const register = async (req, res) => {
  const { username, password, name } = req.body;

  const user = await db.user.findOne({ where: { username } });

  if (user) {
    res.status(400).send({ message: "Username already taken" });
  } else {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hashPassword = bcrypt.hashSync(password, salt);

    await db.user.create({ username, password: hashPassword, name });
    res.status(200).send({ message: "User created" });
  }
};

const getPassword = (user) => {
  if (user) {
    return user.password;
  }
  return process.env.FAKE_PASSWORD;
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await db.user.findOne({ where: { username } });
  const isSuccess = bcrypt.compareSync(password, getPassword(user));

  if (!user || !isSuccess) {
    res.status(401).send({ message: "Username or password is wrong" });
  } else {
    const payload = {
      id: user.id,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

    res.status(200).send({
      token,
      message: "User found & Logged in",
    });
  }
};

const getProfileStatus = (relation) => {
  if (relation) {
    return relation.status;
  }
  return "Not Found";
};

const getProfile = async (req, res) => {
  const profileId = Number(req.params.id);
  const myId = Number(req.user.id);

  const targetProfile = await db.user.findOne({
    where: { id: profileId },
  });
  // include: [db.post] จะทำให้ Post ของ User นั้นติดมาด้วย

  if (!targetProfile) {
    res.status(404).send({ message: `Profile id: ${profileId} not found` });
  } else {
    const friendRelationship = await db.friend.findOne({
      where: {
        [Op.or]: [
          { request_from_id: myId, request_to_id: profileId },
          { request_from_id: profileId, request_to_id: myId },
        ],
      },
    });

    const status = getProfileStatus(friendRelationship);

    if (status === "friend") {
      res.status(200).send({ targetProfile, status: "Friend" });
    } else if (
      status === "pending" &&
      friendRelationship.request_from_id === myId
    ) {
      res.status(200).send({ targetProfile, status: "Friend request sent" });
    } else if (
      status === "pending" &&
      friendRelationship.request_from_id === profileId
    ) {
      res
        .status(200)
        .send({ targetProfile, status: "Respond to friend request" });
    } else if (myId === profileId) {
      res.status(200).send({ targetProfile, status: "My Profile" });
    } else {
      res.status(404).send({
        message: `Profile id: ${profileId} not found`,
      });
    }
  }
};

module.exports = { register, login, getProfile };
