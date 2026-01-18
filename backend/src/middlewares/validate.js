import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
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
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid Data",
        details: e.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    console.error("❌ Unexpected Validation Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};