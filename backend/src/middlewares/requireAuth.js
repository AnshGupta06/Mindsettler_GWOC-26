import admin from "../config/firebaseAdmin.js";

export default async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token" });

    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("DECODED:", decoded.uid, decoded.email); 

    req.firebaseUser = decoded; // { uid, email, name }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
