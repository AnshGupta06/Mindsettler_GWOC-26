import "dotenv/config"
export const requireAdmin = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAIL || "")

  if (!req.user?.email || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};
