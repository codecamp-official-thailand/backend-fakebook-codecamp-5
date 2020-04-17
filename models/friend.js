module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define("friend", {
    status: {
      type: DataTypes.ENUM("friend", "pending", "banned"),
    },
  });

  return Friend;
};