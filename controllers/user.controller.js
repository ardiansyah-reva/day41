// backend/controllers/user.controller.js

const User = require("../models/User");

// GET semua user
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
     res.json({
      status: "success",
      data: users,
    });
   
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: err.message });
  }
};



// GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ 
        status: "error",
        message: "User not found"
     });

    res.json({
      status: "success",
      data: user,
    });

  } catch (err) {
    console.error(error);
    res.status(500).json({ error: err.message });
  }
};


// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ error: "User tidak ditemukan" });

    await user.update(req.body);

    res.json({
      status: "success",
      message: "User berhasil di-update",
      data: user,
    });

  } catch (err) {
    console.error(error)
    res.status(500).json({ error: err.message });
  }
};


// DELETE user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ error: "User tidak ditemukan" });

    res.json({
      status: "success",
      message: `User id ${id} berhasil dihapus`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
