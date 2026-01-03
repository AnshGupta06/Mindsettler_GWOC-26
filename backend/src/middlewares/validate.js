// middleware/validate.js
import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Check if the request body matches the schema
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // Data is good, let it pass
  } catch (e) {
    // Data is bad, return a clear error
    return res.status(400).json({
      error: "Invalid Data",
      details: e.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
};  