const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const Subject = require('../models/Subjects');
const User = require('../models/User');

// Cargar variables de entorno
dotenv.config();

const subjectsJsonPath = path.join(__dirname, '..', 'utils', 'subjects.json');

async function seedSubjects() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const data = fs.readFileSync(subjectsJsonPath, 'utf-8');
    const rawSubjects = JSON.parse(data);

    // Limpiar materias existentes
    await Subject.deleteMany({});
    console.log('✅ Materias existentes eliminadas');

    // Procesar cada materia
    const subjects = [];
    for (const rawSubject of rawSubjects) {
      // Buscar el docente por email
      const teacher = await User.findOne({ email: rawSubject.teacherId });
      if (!teacher) {
        console.log(`⚠️ Docente no encontrado: ${rawSubject.teacherId}`);
        continue;
      }

      const subject = new Subject({
        name: rawSubject.name,
        code: rawSubject.code,
        teacherId: teacher._id
      });
      subjects.push(subject);
    }

    // Insertar materias
    await Subject.insertMany(subjects);
    console.log(`✅ ${subjects.length} materias insertadas exitosamente`);
    
  } catch (error) {
    console.error('❌ Error al insertar materias:', error.message);
  } finally {
    process.exit(0);
  }
}

seedSubjects(); 