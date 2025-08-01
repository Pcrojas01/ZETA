// public/js/periods.js

document.addEventListener('DOMContentLoaded', () => {
  cargarPeriodos();

  const form = document.getElementById('periodForm');
  const cancelEditBtn = document.getElementById('cancelEdit');

  form.addEventListener('submit', onSubmitForm);
  cancelEditBtn.addEventListener('click', resetForm);
});

async function cargarPeriodos() {
  const tbody = document.getElementById('periodsTableBody');
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api/periods');
    const periodos = await res.json();
    if (!Array.isArray(periodos)) throw new Error('Respuesta inesperada');
    if (periodos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No hay periodos registrados</td></tr>';
      return;
    }
    periodos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.startDate ? (new Date(p.startDate)).toLocaleDateString() : '-'}</td>
        <td>${p.endDate ? (new Date(p.endDate)).toLocaleDateString() : '-'}</td>
        <td>
          <button onclick="editarPeriodo('${p._id}')">Editar</button>
          <button onclick="eliminarPeriodo('${p._id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4">Error al cargar periodos</td></tr>';
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.periodId.value;
  const name = form.name.value.trim();
  const startDate = form.startDate.value;
  const endDate = form.endDate.value;
  const msgDiv = document.getElementById('formMessage');
  msgDiv.textContent = '';

  if (!name || !startDate || !endDate) {
    msgDiv.textContent = 'Todos los campos son obligatorios';
    return;
  }

  try {
    let res, data;
    if (id) {
      // Editar
      res = await fetch(`/api/periods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, startDate, endDate })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      msgDiv.textContent = 'Periodo actualizado correctamente';
    } else {
      // Crear
      res = await fetch('/api/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, startDate, endDate })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear');
      msgDiv.textContent = 'Periodo creado correctamente';
    }
    resetForm();
    cargarPeriodos();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function editarPeriodo(id) {
  fetch(`/api/periods/${id}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById('periodId').value = p._id;
      document.getElementById('name').value = p.name;
      document.getElementById('startDate').value = p.startDate ? p.startDate.substring(0, 10) : '';
      document.getElementById('endDate').value = p.endDate ? p.endDate.substring(0, 10) : '';
      document.getElementById('cancelEdit').style.display = '';
    });
}

async function eliminarPeriodo(id) {
  if (!confirm('¿Seguro que deseas eliminar este periodo?')) return;
  const msgDiv = document.getElementById('tableMessage');
  msgDiv.textContent = '';
  try {
    const res = await fetch(`/api/periods/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar');
    msgDiv.textContent = 'Periodo eliminado correctamente';
    cargarPeriodos();
    resetForm();
  } catch (err) {
    msgDiv.textContent = err.message;
  }
}

function resetForm() {
  document.getElementById('periodForm').reset();
  document.getElementById('periodId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('formMessage').textContent = '';
} 