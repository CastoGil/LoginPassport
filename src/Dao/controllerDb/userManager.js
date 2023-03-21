import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

const showRegisterForm = (req, res) => {
  res.render("register");
};

const processRegisterForm = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("El usuario ya está registrado");
      return res.redirect("/auth/register");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "usuario",
    });
    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/api/products");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showLoginForm = (req, res) => {
  res.render("login");
};

const processLoginForm = passport.authenticate("local", {
  successRedirect: "/api/products",
  failureRedirect: "/auth/login",
  failureFlash: true,
})

const closeSession = async (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.redirect("/auth/login");
    });
  });
};

export {
  processLoginForm,
  showRegisterForm,
  processRegisterForm,
  showLoginForm,
  closeSession,
};
