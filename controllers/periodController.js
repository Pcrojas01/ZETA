const Period = require('../models/Period');

// Obtener todos los periodos
const getAllPeriods = async (req, res) => {
  try {
    const periods = await Period.find();
    res.status(200).json(periods);
  } catch (error) {
    console.error('❌ Error al obtener periodos:', error.message);
    res.status(500).json({ message: 'Error al obtener periodos' });
  }
};

// Obtener un periodo por ID
const getPeriodById = async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    if (!period) {
      return res.status(404).json({ message: 'Periodo no encontrado' });
    }
    res.status(200).json(period);
  } catch (error) {
    console.error('❌ Error al obtener periodo:', error.message);
    res.status(500).json({ message: 'Error al obtener periodo' });
  }
};

// Crear un nuevo periodo
const createPeriod = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    const newPeriod = new Period({ name, startDate, endDate });
    await newPeriod.save();
    res.status(201).json({ message: 'Periodo creado exitosamente', period: newPeriod });
  } catch (error) {
    console.error('❌ Error al crear periodo:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un periodo
const updatePeriod = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    const period = await Period.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate },
      { new: true, runValidators: true }
    );
    if (!period) {
      return res.status(404).json({ message: 'Periodo no encontrado' });
    }
    res.status(200).json({ message: 'Periodo actualizado', period });
  } catch (error) {
    console.error('❌ Error al actualizar periodo:', error.message);
    res.status(500).json({ message: 'Error al actualizar periodo' });
  }
};

// Eliminar un periodo
const deletePeriod = async (req, res) => {
  try {
    const period = await Period.findByIdAndDelete(req.params.id);
    if (!period) {
      return res.status(404).json({ message: 'Periodo no encontrado' });
    }
    res.status(200).json({ message: 'Periodo eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar periodo:', error.message);
    res.status(500).json({ message: 'Error al eliminar periodo' });
  }
};

module.exports = {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
};
