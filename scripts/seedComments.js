const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Subject = require('../models/Subjects');

// Cargar variables de entorno
dotenv.config();

const commentsJsonPath = path.join(__dirname, '..', 'utils', 'comments.json');

async function seedComments() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const data = fs.readFileSync(commentsJsonPath, 'utf-8');
    const rawComments = JSON.parse(data);

    // Limpiar comentarios existentes
    await Comment.deleteMany({});
    console.log('✅ Comentarios existentes eliminados');

    // Procesar cada comentario
    const comments = [];
    for (const rawComment of rawComments) {
      // Buscar el usuario por email
      const user = await User.findOne({ email: rawComment.userId });
      if (!user) {
        console.log(`⚠️ Usuario no encontrado: ${rawComment.userId}`);
        continue;
      }

      // Buscar la materia por código
      const subject = await Subject.findOne({ code: rawComment.subjectId });
      if (!subject) {
        console.log(`⚠️ Materia no encontrada: ${rawComment.subjectId}`);
        continue;
      }

      const comment = new Comment({
        userId: user._id,
        subjectId: subject._id,
        text: rawComment.text
      });
      comments.push(comment);
    }

    // Insertar comentarios
    await Comment.insertMany(comments);
    console.log(`✅ ${comments.length} comentarios insertados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error al insertar comentarios:', error.message);
  } finally {
    process.exit(0);
  }
}

seedComments(); 