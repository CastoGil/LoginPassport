import express from "express";
const router = express.Router();
//////////////////////RUTA CHAT///////////////////////////

router.get("/chat", async (req, res) => {
  res.render("chats", {});
});

export default router;
