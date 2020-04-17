const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const db = require("../../models");

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  "jwt",
  new JWTStrategy(options, async (payload, done) => {
    const user = await db.user.findOne({ where: { id: payload.id } });

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);
