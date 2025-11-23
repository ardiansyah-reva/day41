exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Tidak diizinkan. Token diperlukan.",
    });
  }

  req.user = { id: 1, full_name: "Pengguna Autentikasi Dummy" };

  next();
};
