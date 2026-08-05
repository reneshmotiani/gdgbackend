const express = require("express");
const notesRoutes = require("./src/routes");

const app = express();

// Middleware to parse JSON. If JSON is unparseable, catch it cleanly to prevent crashing.
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ error: "BadRequest", message: "Malformed JSON" });
  }
  next();
});

app.use("/api", notesRoutes);

// Catch-all for non-existent routes
app.use((req, res) => {
  res
    .status(404)
    .json({ error: "NotFound", message: "Endpoint does not exist" });
});

// Centralized error handler to catch any unhandled exceptions
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
