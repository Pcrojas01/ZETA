// public/js/dashboard_admin.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Usar la función autenticada para hacer la petición
        const res = await fetch('/api/reports/admin_dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
        });

    const data = await res.json();

    document.getElementById('total-users').textContent = data.totalUsers || 0;
    document.getElementById('total-teachers').textContent = data.totalTeachers || 0;
    document.getElementById('total-students').textContent = data.totalStudents || 0;
    document.getElementById('total-subjects').textContent = data.totalSubjects || 0;
    document.getElementById('total-comments').textContent = data.totalComments || 0;
  } catch (err) {
    window.authUtils.handleAuthError(err);
  }
});

// Función para cerrar sesión (ya está en main.js, pero la mantenemos por compatibilidad)
function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = '/login';

}
console.log('📦 Token:', localStorage.getItem('token'));
console.log('📦 Datos:', data);


// 👇 Esto es clave para que el onclick del HTML funcione
window.cerrarSesion = cerrarSesion;
