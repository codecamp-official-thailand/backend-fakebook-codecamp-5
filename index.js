require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const friendRoute = require('./routes/friend')
const db = require("./models");

const app = express();
require("./config/passport/passport");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/friends", friendRoute);

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
