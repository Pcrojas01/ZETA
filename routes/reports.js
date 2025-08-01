const express = require('express');
const router = express.Router();
const { getStudentReport, getAdminDashboard } = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middlewares/auth_middleware');

// Nueva ruta para el resumen del admin
router.get('/admin_dashboard', verifyToken, checkRole('admin'), getAdminDashboard);

// Ya existente: obtener boletín por estudiante
router.get('/:studentId', verifyToken, checkRole('student'), getStudentReport);

module.exports = router;
