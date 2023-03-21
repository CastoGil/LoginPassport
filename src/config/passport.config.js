import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import { userModel } from "../Dao/models/user.js";
import GithubStrategy from "passport-github2";
import dotenv from "dotenv";
dotenv.config();

///variables de entorno////
const client_ID = process.env.client_ID;
const client_Secret = process.env.client_Secret;
const callback_URL = process.env.callback_URL;

//inicializamos passport////////////
const initializePassport = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await userModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      }
    )
  );
  ////inicializando con github////////
  passport.use(
    new GithubStrategy(
      {
        clientID: client_ID,
        clientSecret: client_Secret,
        callbackURL: callback_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({
            email: profile.emails[0].value,
          });
          if (!user) {
            let newUser = {
              name: profile._json.name,
              email: profile.emails[0].value,
              password: "",
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
  ///////////////////////////////////////////////////////
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};
export default initializePassport;
