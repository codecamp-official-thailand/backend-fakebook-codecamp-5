module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    profile_pic: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING(100),
    },
  });

  User.associate = (models) => {
    User.hasMany(models.post, { foreignKey: "user_id" });
    User.hasMany(models.comment, { foreignKey: "user_id" });
    User.belongsToMany(models.user, {
      through: models.friend,
      as: "Request_To",
      foreignKey: "request_to_id",
    });
    User.belongsToMany(models.user, {
      through: models.friend,
      as: "Request_From",
      foreignKey: "request_from_id",
    });
  };

  return User;
};
