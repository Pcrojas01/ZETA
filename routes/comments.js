const express = require('express');
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/auth_middleware');

// Obtener todos los comentarios (público)
router.get('/', getAllComments);

// Obtener un comentario por ID (público)
router.get('/:id', getCommentById);

// Crear comentario (autenticado)
router.post('/', verifyToken, createComment);

// Actualizar comentario (autenticado)
router.put('/:id', verifyToken, updateComment);

// Eliminar comentario (autenticado)
router.delete('/:id', verifyToken, deleteComment);

module.exports = router;
