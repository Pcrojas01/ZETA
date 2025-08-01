// public/js/comments.js

document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();
  cargarMaterias();
  cargarComentarios();

  const form = document.getElementById('commentForm');
  const cancelEditBtn = document.getElementById('cancelEdit');

  form.addEventListener('submit', onSubmitForm);
  cancelEditBtn.addEventListener('click', resetForm);
});

async function cargarUsuarios() {
  const select = document.getElementById('userId');
  try {
    const res = await fetch('/api/users');
    const usuarios = await res.json();
    select.innerHTML = '<option value="">Seleccione un usuario</option>';
    usuarios.forEach(u => {
      const option = document.createElement('option');
      option.value = u._id;
      option.textContent = u.name + ' (' + u.email + ' - ' + u.role + ')';
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar usuarios</option>';
  }
}

async function cargarMaterias() {
  const select = document.getElementById('subjectId');
  try {
    const res = await fetch('/api/subjects');
    const materias = await res.json();
    select.innerHTML = '<option value="">Seleccione una materia</option>';
    materias.forEach(mat => {
      const option = document.createElement('option');
      option.value = mat._id;
      option.textContent = mat.name + ' (' + mat.code + ')';
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar materias</option>';
  }
}

async function cargarComentarios() {
  const tbody = document.getElementById('commentsTableBody');
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api/comments');
    const comentarios = await res.json();
    if (!Array.isArray(comentarios)) throw new Error('Respuesta inesperada');
    if (comentarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No hay comentarios registrados</td></tr>';
      return;
    }
    comentarios.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.userId ? (c.userId.name + ' (' + c.userId.email + ')') : '-'}</td>
        <td>${c.subjectId ? (c.subjectId.name + ' (' + c.subjectId.code + ')') : '-'}</td>
        <td>${c.text}</td>
        <td>${c.createdAt ? (new Date(c.createdAt)).toLocaleString() : '-'}</td>
        <td>
          <button onclick="editarComentario('${c._id}')">Editar</button>
          <button onclick="eliminarComentario('${c._id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5">Error al cargar comentarios</td></tr>';
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.commentId.value;
  const userId = form.userId.value;
  const subjectId = form.subjectId.value;
  const text = form.text.value.trim();
  const msgDiv = document.getElementById('formMessage');
  msgDiv.textContent = '';

  if (!userId || !subjectId || !text) {
    msgDiv.textContent = 'Todos los campos son obligatorios';
    return;
  }

  try {
    let res, data;
    if (id) {
      // Editar
      res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subjectId, text })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      msgDiv.textContent = 'Comentario actualizado correctamente';
    } else {
      // Crear
      res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subjectId, text })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear');
      msgDiv.textContent = 'Comentario creado correctamente';
    }
    resetForm();
    cargarComentarios();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function editarComentario(id) {
  fetch(`/api/comments/${id}`)
    .then(res => res.json())
    .then(c => {
      document.getElementById('commentId').value = c._id;
      document.getElementById('userId').value = c.userId?._id || '';
      document.getElementById('subjectId').value = c.subjectId?._id || '';
      document.getElementById('text').value = c.text;
      document.getElementById('cancelEdit').style.display = '';
    });
}

async function eliminarComentario(id) {
  if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
  const msgDiv = document.getElementById('tableMessage');
  msgDiv.textContent = '';
  try {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar');
    msgDiv.textContent = 'Comentario eliminado correctamente';
    cargarComentarios();
    resetForm();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function resetForm() {
  document.getElementById('commentForm').reset();
  document.getElementById('commentId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('formMessage').textContent = '';
} 