// public/js/subjects.js

document.addEventListener('DOMContentLoaded', () => {
  cargarDocentes();
  cargarMaterias();

  const form = document.getElementById('subjectForm');
  const cancelEditBtn = document.getElementById('cancelEdit');

  form.addEventListener('submit', onSubmitForm);
  cancelEditBtn.addEventListener('click', resetForm);
});

async function cargarDocentes() {
  const select = document.getElementById('teacherId');
  try {
    const res = await fetch('/api/users?role=DOCENTE');
    const docentes = await res.json();
    select.innerHTML = '<option value="">Seleccione un docente</option>';
    docentes.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc._id;
      option.textContent = doc.name + ' (' + doc.email + ')';
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar docentes</option>';
  }
}

async function cargarMaterias() {
  const tbody = document.getElementById('subjectsTableBody');
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api/subjects');
    const materias = await res.json();
    if (!Array.isArray(materias)) throw new Error('Respuesta inesperada');
    if (materias.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No hay materias registradas</td></tr>';
      return;
    }
    materias.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.name}</td>
        <td>${m.code}</td>
        <td>${m.teacherId ? (m.teacherId.name + ' (' + m.teacherId.email + ')') : '-'}</td>
        <td>
          <button onclick="editarMateria('${m._id}')">Editar</button>
          <button onclick="eliminarMateria('${m._id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4">Error al cargar materias</td></tr>';
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.subjectId.value;
  const name = form.name.value.trim();
  const code = form.code.value.trim();
  const teacherId = form.teacherId.value;
  const msgDiv = document.getElementById('formMessage');
  msgDiv.textContent = '';

  if (!name || !code || !teacherId) {
    msgDiv.textContent = 'Todos los campos son obligatorios';
    return;
  }

  try {
    let res, data;
    if (id) {
      // Editar
      res = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, teacherId })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      msgDiv.textContent = 'Materia actualizada correctamente';
    } else {
      // Crear
      res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, teacherId })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear');
      msgDiv.textContent = 'Materia creada correctamente';
    }
    resetForm();
    cargarMaterias();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function editarMateria(id) {
  fetch(`/api/subjects/${id}`)
    .then(res => res.json())
    .then(m => {
      document.getElementById('subjectId').value = m._id;
      document.getElementById('name').value = m.name;
      document.getElementById('code').value = m.code;
      document.getElementById('teacherId').value = m.teacherId?._id || '';
      document.getElementById('cancelEdit').style.display = '';
    });
}

async function eliminarMateria(id) {
  if (!confirm('¿Seguro que deseas eliminar esta materia?')) return;
  const msgDiv = document.getElementById('tableMessage');
  msgDiv.textContent = '';
  try {
    const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar');
    msgDiv.textContent = 'Materia eliminada correctamente';
    cargarMaterias();
    resetForm();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function resetForm() {
  document.getElementById('subjectForm').reset();
  document.getElementById('subjectId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('formMessage').textContent = '';
} 