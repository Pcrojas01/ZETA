const express = require('express');
const router = express.Router();
const {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
} = require('../controllers/gradeController');
const { verifyToken, checkRole } = require('../middlewares/auth_middleware');

// Obtener todas las notas (público)
router.get('/', getAllGrades);

// Obtener una nota por ID (público)
router.get('/:id', getGradeById);

// Registrar nueva nota (solo ADMIN o DOCENTE)
router.post('/', verifyToken, checkRole('ADMIN', 'DOCENTE'), createGrade);

// Actualizar nota (solo ADMIN o DOCENTE)
router.put('/:id', verifyToken, checkRole('ADMIN', 'DOCENTE'), updateGrade);

// Eliminar nota (solo ADMIN o DOCENTE)
router.delete('/:id', verifyToken, checkRole('ADMIN', 'DOCENTE'), deleteGrade);

// Obtener notas por estudiante (público)
router.get('/student/:studentId', getGradesByStudent);

module.exports = router;
