// public/js/grades.js

document.addEventListener('DOMContentLoaded', () => {
  cargarEstudiantes();
  cargarMaterias();
  cargarNotas();

  const form = document.getElementById('gradeForm');
  const cancelEditBtn = document.getElementById('cancelEdit');

  form.addEventListener('submit', onSubmitForm);
  cancelEditBtn.addEventListener('click', resetForm);
});

async function cargarEstudiantes() {
  const select = document.getElementById('studentId');
  try {
    const res = await fetch('/api/users?role=ESTUDIANTE');
    const estudiantes = await res.json();
    select.innerHTML = '<option value="">Seleccione un estudiante</option>';
    estudiantes.forEach(est => {
      const option = document.createElement('option');
      option.value = est._id;
      option.textContent = est.name + ' (' + est.email + ')';
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar estudiantes</option>';
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

async function cargarNotas() {
  const tbody = document.getElementById('gradesTableBody');
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api/grades');
    const notas = await res.json();
    if (!Array.isArray(notas)) throw new Error('Respuesta inesperada');
    if (notas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No hay notas registradas</td></tr>';
      return;
    }
    notas.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${n.studentId ? (n.studentId.name + ' (' + n.studentId.email + ')') : '-'}</td>
        <td>${n.subjectId ? (n.subjectId.name + ' (' + n.subjectId.code + ')') : '-'}</td>
        <td>${n.period}</td>
        <td>${n.score}</td>
        <td>${n.comment || ''}</td>
        <td>
          <button onclick="editarNota('${n._id}')">Editar</button>
          <button onclick="eliminarNota('${n._id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6">Error al cargar notas</td></tr>';
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.gradeId.value;
  const studentId = form.studentId.value;
  const subjectId = form.subjectId.value;
  const period = form.period.value.trim();
  const score = form.score.value;
  const comment = form.comment.value.trim();
  const msgDiv = document.getElementById('formMessage');
  msgDiv.textContent = '';

  if (!studentId || !subjectId || !period || score === '') {
    msgDiv.textContent = 'Todos los campos obligatorios deben estar completos';
    return;
  }

  try {
    let res, data;
    if (id) {
      // Editar
      res = await fetch(`/api/grades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, subjectId, period, score, comment })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      msgDiv.textContent = 'Nota actualizada correctamente';
    } else {
      // Crear
      res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, subjectId, period, score, comment })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear');
      msgDiv.textContent = 'Nota registrada correctamente';
    }
    resetForm();
    cargarNotas();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function editarNota(id) {
  fetch(`/api/grades/${id}`)
    .then(res => res.json())
    .then(n => {
      document.getElementById('gradeId').value = n._id;
      document.getElementById('studentId').value = n.studentId?._id || '';
      document.getElementById('subjectId').value = n.subjectId?._id || '';
      document.getElementById('period').value = n.period;
      document.getElementById('score').value = n.score;
      document.getElementById('comment').value = n.comment || '';
      document.getElementById('cancelEdit').style.display = '';
    });
}

async function eliminarNota(id) {
  if (!confirm('¿Seguro que deseas eliminar esta nota?')) return;
  const msgDiv = document.getElementById('tableMessage');
  msgDiv.textContent = '';
  try {
    const res = await fetch(`/api/grades/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar');
    msgDiv.textContent = 'Nota eliminada correctamente';
    cargarNotas();
    resetForm();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function resetForm() {
  document.getElementById('gradeForm').reset();
  document.getElementById('gradeId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('formMessage').textContent = '';
} 