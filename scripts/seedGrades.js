const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const Grade = require('../models/Grade');
const User = require('../models/User');
const Subject = require('../models/Subjects');

// Cargar variables de entorno
dotenv.config();

const gradesJsonPath = path.join(__dirname, '..', 'utils', 'grades.json');

async function seedGrades() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const data = fs.readFileSync(gradesJsonPath, 'utf-8');
    const rawGrades = JSON.parse(data);

    // Limpiar notas existentes
    await Grade.deleteMany({});
    console.log('✅ Notas existentes eliminadas');

    // Procesar cada nota
    const grades = [];
    for (const rawGrade of rawGrades) {
      // Buscar el estudiante por email
      const student = await User.findOne({ email: rawGrade.studentId });
      if (!student) {
        console.log(`⚠️ Estudiante no encontrado: ${rawGrade.studentId}`);
        continue;
      }

      // Buscar la materia por código
      const subject = await Subject.findOne({ code: rawGrade.subjectId });
      if (!subject) {
        console.log(`⚠️ Materia no encontrada: ${rawGrade.subjectId}`);
        continue;
      }

      const grade = new Grade({
        studentId: student._id,
        subjectId: subject._id,
        period: rawGrade.period,
        score: rawGrade.score,
        comment: rawGrade.comment
      });
      grades.push(grade);
    }

    // Insertar notas
    await Grade.insertMany(grades);
    console.log(`✅ ${grades.length} notas insertadas exitosamente`);
    
  } catch (error) {
    console.error('❌ Error al insertar notas:', error.message);
  } finally {
    process.exit(0);
  }
}

seedGrades(); 