const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Cargar variables de entorno
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const usersJsonPath = path.join(__dirname, 'utils', 'users.json');

async function seedUsers() {
  try {
    // Leer archivo JSON
    const data = fs.readFileSync(usersJsonPath, 'utf-8');
    const rawUsers = JSON.parse(data);

    // Encriptar contraseñas
    const users = await Promise.all(
      rawUsers.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Conectar a MongoDB
    await client.connect();
    const db = client.db(); // DB ya viene definida por la URI
    const collection = db.collection('users');

    // Eliminar duplicados si deseas limpiar antes (opcional)
    await collection.deleteMany({});

    // Insertar usuarios con contraseña encriptada
    const result = await collection.insertMany(users);
    console.log(`✅ Usuarios insertados: ${result.insertedCount}`);
  } catch (error) {
    console.error('❌ Error al insertar usuarios:', error.message);
  } finally {
    await client.close();
  }
}

seedUsers();
