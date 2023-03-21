import express from "express";
import admin from "../middlewares/index.js";
import {
  processRegisterForm,
  closeSession,
  showLoginForm,
  showRegisterForm,
  processLoginForm,
} from "../Dao/controllerDb/userManager.js";
import passport from "passport";
const router = express.Router();



/////////////////////rutas login y registro//////////////////////////////
router.get("/login", showLoginForm);
router.post("/login", admin, processLoginForm);
router.get("/logout", closeSession);
router.get("/register", showRegisterForm);
router.post("/register", processRegisterForm);


///ruta github//
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Redireccionar al usuario a la página de inicio o a cualquier otra página deseada
    res.redirect("/api/products");
  }
);
export default router;
