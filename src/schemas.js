const { z } = require("zod");

const noteSchema = z.object({
  title: z.string().min(1, "must be a non-empty string"),
  category: z.string().min(1, "must be a non-empty string"),
  completed: z.boolean().optional().default(false),
});

const notePatchSchema = noteSchema.partial();

module.exports = { noteSchema, notePatchSchema };
