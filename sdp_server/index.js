const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
// add middleware for sending json
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
