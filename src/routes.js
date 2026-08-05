const express = require("express");
const router = express.Router();
const ctrl = require("./controllers");

router.get("/notes", ctrl.getNotes);
router.get("/notes/:id", ctrl.getNoteById);
router.post("/notes", ctrl.createNote);
router.put("/notes/:id", ctrl.updateNote);
router.patch("/notes/:id", ctrl.patchNote);
router.delete("/notes/:id", ctrl.deleteNote);

module.exports = router;
