export const requireAdmin = (req, res, next) => {
  const adminEmails = [
    "shsheth2006@gmail.com",
    "suraj06shah@gmail.com"
  ];

  if (!req.user?.email || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};
