const admin = async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = { email, role: "admin" };
    return res.redirect("/api/products");
  }
  next();
};
export default admin;
