// backend/controllers/user.controller.js

const User = require("../models/User");

// GET semua user
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
     res.json({
      code: 200,
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
        code: 404,
        status: "error",
        message: "User not found"
     });

    res.json({
      code: 200,
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
      return res.status(404).json({
       code: 404,
       error: "User tidak ditemukan" });

    await user.update(req.body);

    res.json({
      code: 200,
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
       return res.status(404).json({
      code: 404,
       error: "User tidak ditemukan" 
       });

    res.json({
      code: 200,
      status: "success",
      message: `User id ${id} berhasil dihapus`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
