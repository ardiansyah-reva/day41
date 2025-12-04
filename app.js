require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");              // ← TAMBAH INI
const rateLimit = require("express-rate-limit"); // ← TAMBAH INI
const routes = require("./routes");

const app = express();

app.use(helmet()); 

// Rate limiting - cegah spam
const limiter = rateLimit({             
  windowMs: 15 * 60 * 1000,             
  max: 100,                              
  message: "Terlalu banyak request"     
});                                       
app.use('/api/', limiter);              

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API berjalan 🚀",
  });
});

module.exports = app;