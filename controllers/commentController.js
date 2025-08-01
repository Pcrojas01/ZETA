const Comment = require('../models/Comment');

// Obtener todos los comentarios
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'name email role')
      .populate('subjectId', 'name code');
    res.status(200).json(comments);
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error.message);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

// Obtener un comentario por ID
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('subjectId', 'name code');
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error('❌ Error al obtener comentario:', error.message);
    res.status(500).json({ message: 'Error al obtener comentario' });
  }
};

// Crear comentario
const createComment = async (req, res) => {
  const { userId, subjectId, text } = req.body;
  try {
    const newComment = new Comment({ userId, subjectId, text });
    await newComment.save();
    res.status(201).json({ message: 'Comentario creado', comment: newComment });
  } catch (error) {
    console.error('❌ Error al crear comentario:', error.message);
    res.status(500).json({ message: 'Error al crear comentario' });
  }
};

// Actualizar comentario
const updateComment = async (req, res) => {
  const { userId, subjectId, text } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { userId, subjectId, text },
      { new: true, runValidators: true }
    );
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json({ message: 'Comentario actualizado', comment });
  } catch (error) {
    console.error('❌ Error al actualizar comentario:', error.message);
    res.status(500).json({ message: 'Error al actualizar comentario' });
  }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar comentario:', error.message);
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
