module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    message: {
      type: DataTypes.STRING,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.post, { foreignKey: "post_id" });
    Comment.belongsTo(models.user, { foreignKey: "user_id" });
  };

  return Comment;
};
