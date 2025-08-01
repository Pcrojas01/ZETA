const bcrypt = require('bcrypt');
const User = require('../models/User');

// Crear usuario (solo para ADMIN)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios (o filtrar por rol)
const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
