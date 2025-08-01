const express = require('express');
const router = express.Router();
const {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
} = require('../controllers/periodController');
const { verifyToken, checkRole } = require('../middlewares/auth_middleware');

// Obtener todos los periodos (público)
router.get('/', getAllPeriods);

// Obtener un periodo por ID (público)
router.get('/:id', getPeriodById);

// Crear periodo (solo ADMIN)
router.post('/', verifyToken, checkRole('ADMIN'), createPeriod);

// Actualizar periodo (solo ADMIN)
router.put('/:id', verifyToken, checkRole('ADMIN'), updatePeriod);

// Eliminar periodo (solo ADMIN)
router.delete('/:id', verifyToken, checkRole('ADMIN'), deletePeriod);

module.exports = router;
