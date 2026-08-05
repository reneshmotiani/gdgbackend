const { randomUUID } = require("crypto");
const { notes } = require("./db");
const { noteSchema, notePatchSchema } = require("./schemas");

// Format Zod errors to match the requested shape
const formatZodError = (err) => {
  return {
    error: "ValidationError",
    details: err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })),
  };
};

const getNotes = (req, res) => {
  const { category } = req.query;
  let result = notes;

  if (category) {
    result = notes.filter(
      (n) => n.category.toLowerCase() === category.toLowerCase(),
    );
  }

  res.status(200).json(result);
};

const getNoteById = (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res
      .status(404)
      .json({ error: "NotFound", message: "Note not found" });
  }
  res.status(200).json(note);
};

const createNote = (req, res) => {
  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(formatZodError(parsed.error));
  }

  const newNote = { id: randomUUID(), ...parsed.data };
  notes.push(newNote);
  res.status(201).json(newNote);
};

const updateNote = (req, res) => {
  const parsed = noteSchema.safeParse(req.body); // Full replacement
  if (!parsed.success) {
    return res.status(400).json(formatZodError(parsed.error));
  }

  const index = notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "NotFound", message: "Note not found" });
  }

  notes[index] = { id: req.params.id, ...parsed.data };
  res.status(200).json(notes[index]);
};

const patchNote = (req, res) => {
  const parsed = notePatchSchema.safeParse(req.body); // Partial update
  if (!parsed.success) {
    return res.status(400).json(formatZodError(parsed.error));
  }

  const index = notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "NotFound", message: "Note not found" });
  }

  notes[index] = { ...notes[index], ...parsed.data };
  res.status(200).json(notes[index]);
};

const deleteNote = (req, res) => {
  const index = notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "NotFound", message: "Note not found" });
  }

  notes.splice(index, 1);
  res.status(204).send();
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  patchNote,
  deleteNote,
};
