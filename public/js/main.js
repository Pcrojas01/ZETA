// public/js/main.js - Funciones comunes para autenticación y manejo de roles

// Verificar si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

// Obtener el rol del usuario desde el token
function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

// Obtener el nombre del usuario desde el token
function getUserName() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

// Verificar si el usuario tiene un rol específico
function hasRole(role) {
  const userRole = getUserRole();
  return userRole === role;
}

// Verificar si el usuario tiene alguno de los roles especificados
function hasAnyRole(...roles) {
  const userRole = getUserRole();
  return roles.includes(userRole);
}

// Función para hacer peticiones autenticadas a la API
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  const response = await fetch(url, finalOptions);
  
  if (response.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  if (response.status === 403) {
    throw new Error('Acceso denegado');
  }
  
  return response;
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Función para mostrar/ocultar elementos según el rol
function updateUIByRole() {
  const userRole = getUserRole();
  const userName = getUserName();
  
  // Mostrar nombre del usuario si existe
  const userNameElement = document.getElementById('userName');
  if (userNameElement && userName) {
    userNameElement.textContent = userName;
  }
  
  // Ocultar elementos según el rol
  const adminElements = document.querySelectorAll('[data-role="ADMIN"]');
  const docenteElements = document.querySelectorAll('[data-role="DOCENTE"]');
  const estudianteElements = document.querySelectorAll('[data-role="ESTUDIANTE"]');
  
  adminElements.forEach(el => {
    el.style.display = hasRole('ADMIN') ? '' : 'none';
  });
  
  docenteElements.forEach(el => {
    el.style.display = hasAnyRole('ADMIN', 'DOCENTE') ? '' : 'none';
  });
  
  estudianteElements.forEach(el => {
    el.style.display = hasAnyRole('ADMIN', 'DOCENTE', 'ESTUDIANTE') ? '' : 'none';
  });
}

// Función para manejar errores de autenticación
function handleAuthError(error) {
  console.error('Error de autenticación:', error);
  if (error.message === 'Sesión expirada' || error.message === 'Acceso denegado') {
    alert('Error de autenticación: ' + error.message);
    logout();
  } else {
    alert('Error: ' + error.message);
  }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación en páginas protegidas
  if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
  }
  
  // Actualizar UI según el rol
  updateUIByRole();
  
  // Agregar listener para cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// Exportar funciones para uso en otros archivos
window.authUtils = {
  isAuthenticated,
  getUserRole,
  getUserName,
  hasRole,
  hasAnyRole,
  authenticatedFetch,
  logout,
  updateUIByRole,
  handleAuthError
};
