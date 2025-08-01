const Grade = require('../models/Grade');

// Obtener todas las notas
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('studentId', 'name email')
      .populate('subjectId', 'name code');
    res.status(200).json(grades);
  } catch (error) {
    console.error('❌ Error al obtener notas:', error.message);
    res.status(500).json({ message: 'Error al obtener notas' });
  }
};

// Obtener una nota por ID
const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('subjectId', 'name code');
    if (!grade) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.status(200).json(grade);
  } catch (error) {
    console.error('❌ Error al obtener nota:', error.message);
    res.status(500).json({ message: 'Error al obtener nota' });
  }
};

// Registrar una nota
const createGrade = async (req, res) => {
  const { studentId, subjectId, period, score, comment } = req.body;
  try {
    const newGrade = new Grade({ studentId, subjectId, period, score, comment });
    await newGrade.save();
    res.status(201).json({ message: 'Nota registrada', grade: newGrade });
  } catch (error) {
    console.error('❌ Error al registrar nota:', error.message);
    res.status(500).json({ message: 'Error interno al registrar nota' });
  }
};

// Actualizar una nota
const updateGrade = async (req, res) => {
  const { studentId, subjectId, period, score, comment } = req.body;
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { studentId, subjectId, period, score, comment },
      { new: true, runValidators: true }
    );
    if (!grade) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.status(200).json({ message: 'Nota actualizada', grade });
  } catch (error) {
    console.error('❌ Error al actualizar nota:', error.message);
    res.status(500).json({ message: 'Error al actualizar nota' });
  }
};

// Eliminar una nota
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.status(200).json({ message: 'Nota eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar nota:', error.message);
    res.status(500).json({ message: 'Error al eliminar nota' });
  }
};

// Obtener notas por estudiante
const getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('subjectId', 'name code');
    res.status(200).json(grades);
  } catch (error) {
    console.error('❌ Error al obtener notas del estudiante:', error.message);
    res.status(500).json({ message: 'Error al obtener notas del estudiante' });
  }
};

module.exports = {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
};
