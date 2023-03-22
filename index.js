const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) =>
  res.json({
    name: "sanchit",
    email: "pasrichaasanchit@outlook.com",
  })
);

app.listen(port, () => console.log("express server running on port 3000"));
