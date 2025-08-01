const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { verifyToken, checkRole } = require('../middlewares/auth_middleware');

// Obtener todas las materias (público)
router.get('/', getAllSubjects);

// Obtener una materia por ID (público)
router.get('/:id', getSubjectById);

// Crear materia (solo ADMIN)
router.post('/', verifyToken, checkRole('ADMIN'), createSubject);

// Actualizar materia (solo ADMIN)
router.put('/:id', verifyToken, checkRole('ADMIN'), updateSubject);

// Eliminar materia (solo ADMIN)
router.delete('/:id', verifyToken, checkRole('ADMIN'), deleteSubject);

module.exports = router;
