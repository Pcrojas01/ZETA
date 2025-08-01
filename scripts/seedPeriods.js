const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const Period = require('../models/Period');

// Cargar variables de entorno
dotenv.config();

const periodsJsonPath = path.join(__dirname, '..', 'utils', 'periods.json');

async function seedPeriods() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const data = fs.readFileSync(periodsJsonPath, 'utf-8');
    const rawPeriods = JSON.parse(data);

    // Limpiar periodos existentes
    await Period.deleteMany({});
    console.log('✅ Periodos existentes eliminados');

    // Procesar cada periodo
    const periods = rawPeriods.map(rawPeriod => new Period({
      name: rawPeriod.name,
      startDate: new Date(rawPeriod.startDate),
      endDate: new Date(rawPeriod.endDate)
    }));

    // Insertar periodos
    await Period.insertMany(periods);
    console.log(`✅ ${periods.length} periodos insertados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error al insertar periodos:', error.message);
  } finally {
    process.exit(0);
  }
}

seedPeriods(); 