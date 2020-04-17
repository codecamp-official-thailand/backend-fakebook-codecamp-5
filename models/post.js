module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    text: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
  });

  Post.associate = (models) => {
    Post.hasMany(models.comment, { foreignKey: "post_id" });
    Post.belongsTo(models.user, { foreignKey: "user_id" });
  };

  return Post;
};
