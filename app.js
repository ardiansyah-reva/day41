require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/auth", authRoutes);
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API berjalan 🚀",
  });
});

module.exports = app;
