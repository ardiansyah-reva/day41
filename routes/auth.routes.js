// routes/auth.routes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  const { nickname, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password wajib diisi" });

  try {
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(409).json({ error: "Email sudah terdaftar" });

    const hashed = bcrypt.hashSync(password, 10);

    const user = await User.create({
      nickname,
      email,
      password: hashed,
    });

    res.status(201).json({ message: "Register berhasil", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGOUT
router.post("/logout", (req, res) => {
  res.json({ message: "Logout berhasil — hapus token di client" });
});

module.exports = router;
