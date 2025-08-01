const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const { requireAuth } = require('./middlewares/auth_middleware');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Rate limiting (protección básica)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JS, imágenes)
app.use('/public', express.static(path.join(__dirname, 'public')));

// 🌐 RUTAS PARA VISTAS HTML

// Página de inicio → redirige a login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login (público)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Vistas protegidas por rol
app.get('/dashboard_admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard_admin.html'));
});

app.get('/dashboard-docente', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard-docente.html'));
});

app.get('/dashboard-estudiante', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard-estudiante.html'));
});

// Otras vistas del sistema (protegidas)
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/students', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'students.html'));
});

app.get('/teachers', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'teachers.html'));
});

app.get('/grades', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'grades.html'));
});

app.get('/subjects', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'subjects.html'));
});

app.get('/comments', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'comments.html'));
});

app.get('/periods', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'periods.html'));
});

app.get('/manage-users', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manage-users.html'));
});

// API REST
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/periods', require('./routes/periods'));
app.use('/api/reports', require('./routes/reports'));

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ZETA corriendo en http://localhost:${PORT}`);
});
