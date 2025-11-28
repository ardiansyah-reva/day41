// exports.requireAuth = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({
//       status: "error",
//       message: "Tidak diizinkan. Token diperlukan.",
//     });
//   }

//   req.user = { id: 1, full_name: "Pengguna Autentikasi Dummy" };

//   next();
// };


const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Unauthorized: Token tidak ada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "nickname", "email"],
    });

    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
