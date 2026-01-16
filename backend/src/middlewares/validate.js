import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  // 1. Check if schema exists before using it
  if (!schema) {
    console.error("❌ Validation Error: Schema is undefined. Check your imports.");
    return res.status(500).json({ error: "Internal Server Error (Validation)" });
  }

  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    // 2. Check if it is actually a Zod Error
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid Data",
        details: e.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // 3. If it's another error, log it and return 500
    console.error("❌ Unexpected Validation Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};