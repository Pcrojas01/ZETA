const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// Obtener boletín por estudiante
const getStudentReport = async (req, res) => {
  const { studentId } = req.params;
  const db = getDB();

  try {
    const grades = await db.collection('grades').find({ studentId }).toArray();

    if (grades.length === 0) {
      return res.status(404).json({ message: 'No se encontraron calificaciones' });
    }

    // Agrupar notas por materia
    const report = {};
    grades.forEach((grade) => {
      if (!report[grade.subjectId]) {
        report[grade.subjectId] = {
          subjectId: grade.subjectId,
          subjectName: grade.subjectName,
          period: grade.period,
          grades: [],
        };
      }
      report[grade.subjectId].grades.push({
        corte: grade.corte,
        value: grade.value,
        comment: grade.comment || '',
      });
    });



    // Calcular promedio por materia
    const finalReport = Object.values(report).map((subject) => {
      const total = subject.grades.reduce((acc, g) => acc + parseFloat(g.value), 0);
      const avg = total / subject.grades.length;
      return {
        ...subject,
        average: avg.toFixed(2),
      };
    });

    res.status(200).json(finalReport);
  } catch (error) {
    console.error('❌ Error al generar boletín:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

    // Obtener resumen del dashboard de admin
    const getAdminDashboard = async (req, res) => {
  const db = getDB();

  try {
    const totalUsers = await db.collection('users').countDocuments();
    const totalTeachers = await db.collection('users').countDocuments({ role: 'teacher' });
    const totalStudents = await db.collection('users').countDocuments({ role: 'student' });
    const totalSubjects = await db.collection('subjects').countDocuments();
    const totalComments = await db.collection('comments').countDocuments();

    return res.status(200).json({
      totalUsers,
      totalTeachers,
      totalStudents,
      totalSubjects,
      totalComments
    });
  } catch (error) {
    console.error('❌ Error al generar resumen admin:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

  
module.exports = {
  getStudentReport,
  getAdminDashboard
};
