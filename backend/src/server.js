import app from "./app.js";
import healthRoutes from "./src/routes/healthRoutes.js";

const PORT = process.env.PORT || 5000;
app.use("/api/health", healthRoutes);
app.listen(PORT, () => {
  console.log(`Backend running on port http://localhost:${PORT}/`);
});
