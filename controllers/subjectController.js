const Subject = require('../models/Subjects');

// Obtener todas las materias
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacherId', 'name email');
    res.status(200).json(subjects);
  } catch (error) {
    console.error('❌ Error al obtener materias:', error.message);
    res.status(500).json({ message: 'Error al obtener materias' });
  }
};

// Obtener una materia por ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('teacherId', 'name email');
    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error('❌ Error al obtener materia:', error.message);
    res.status(500).json({ message: 'Error al obtener materia' });
  }
};

// Crear nueva materia
const createSubject = async (req, res) => {
  const { name, code, teacherId } = req.body;
  try {
    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'El código de materia ya existe' });
    }
    const newSubject = new Subject({ name, code, teacherId });
    await newSubject.save();
    res.status(201).json({ message: 'Materia creada exitosamente', subject: newSubject });
  } catch (error) {
    console.error('❌ Error al crear materia:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar materia
const updateSubject = async (req, res) => {
  const { name, code, teacherId } = req.body;
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, teacherId },
      { new: true, runValidators: true }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json({ message: 'Materia actualizada', subject });
  } catch (error) {
    console.error('❌ Error al actualizar materia:', error.message);
    res.status(500).json({ message: 'Error al actualizar materia' });
  }
};

// Eliminar materia
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json({ message: 'Materia eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar materia:', error.message);
    res.status(500).json({ message: 'Error al eliminar materia' });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
