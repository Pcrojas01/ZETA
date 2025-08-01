const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/auth_middleware');

// Crear un usuario (solo ADMIN)
router.post('/', verifyToken, checkRole('ADMIN'), createUser);

// Ver todos los usuarios (público)
router.get('/', getAllUsers);

module.exports = router;
