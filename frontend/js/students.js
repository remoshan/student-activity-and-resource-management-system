/**
 * Students Management JavaScript
 * Handles all CRUD operations for Students using AJAX
 */

function loadStudents() {
  showTableLoading('studentsTableBody', 4);

  $.ajax({
    url: `${API_BASE_URL}/students`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        renderStudentsTable(response.data);
      } else {
        showTableEmpty('studentsTableBody', 4, 'No students found');
        showAlert('Failed to load students', 'warning');
      }
    },
    error: function(xhr, status, error) {
      showTableEmpty('studentsTableBody', 4, 'Error loading students');
      showAlert('Error loading students: ' + (xhr.responseJSON?.error || error), 'danger');
    }
  });
}

function renderStudentsTable(students) {
  const tbody = $('#studentsTableBody');
  tbody.empty();

  if (students.length === 0) {
    showTableEmpty('studentsTableBody', 4, 'No students found. Add your first student!');
    return;
  }

  students.forEach(function(student) {
    const eventsCount = student.registeredEvents ? student.registeredEvents.length : 0;
    const eventsList = student.registeredEvents && student.registeredEvents.length > 0
      ? student.registeredEvents.map(e => escapeHtml(e.title)).join(', ')
      : 'None';

    const row = `
      <tr>
        <td><strong>${escapeHtml(student.name)}</strong></td>
        <td>${escapeHtml(student.email)}</td>
        <td>
          <span class="badge bg-primary">${eventsCount} event(s)</span><br>
          <small class="text-muted">${eventsList}</small>
        </td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#studentModal" data-action="edit" data-id="${student._id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-type="student" data-id="${student._id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
    tbody.append(row);
  });

  attachStudentHandlers();
}

function loadEventsForStudentSelect() {
  $.ajax({
    url: `${API_BASE_URL}/events`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        const select = $('#studentEvents');
        select.empty();

        if (response.data.length === 0) {
          select.append('<option value="">No events available</option>');
        } else {
          response.data.forEach(function(event) {
            select.append(`<option value="${event._id}">${escapeHtml(event.title)} - ${formatDate(event.date)}</option>`);
          });
        }
      }
    },
    error: function(xhr, status, error) {
      console.error('Error loading events for select:', error);
    }
  });
}

function loadStudentForEdit(studentId) {
  loadEventsForStudentSelect();

  $.ajax({
    url: `${API_BASE_URL}/students/${studentId}`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        const student = response.data;
        $('#studentId').val(student._id);
        $('#studentName').val(student.name);
        $('#studentEmail').val(student.email);

        const select = $('#studentEvents');
        if (student.registeredEvents && student.registeredEvents.length > 0) {
          student.registeredEvents.forEach(function(event) {
            select.find(`option[value="${event._id}"]`).prop('selected', true);
          });
        }
      }
    },
    error: function(xhr, status, error) {
      showAlert('Error loading student: ' + (xhr.responseJSON?.error || error), 'danger');
      $('#studentModal').modal('hide');
    }
  });
}

$('#saveStudentBtn').on('click', function() {
  const studentId = $('#studentId').val();
  const selectedEvents = $('#studentEvents').val() || [];

  const studentData = {
    name: $('#studentName').val(),
    email: $('#studentEmail').val(),
    registeredEvents: Array.isArray(selectedEvents) ? selectedEvents : [selectedEvents]
  };

  if (!studentData.name || !studentData.email) {
    showAlert('Please fill in all required fields', 'warning');
    return;
  }

  const url = studentId
    ? `${API_BASE_URL}/students/${studentId}`
    : `${API_BASE_URL}/students`;
  const method = studentId ? 'PUT' : 'POST';

  const btn = $(this);
  btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Saving...');

  $.ajax({
    url: url,
    method: method,
    contentType: 'application/json',
    data: JSON.stringify(studentData),
    dataType: 'json',
    success: function(response) {
      if (response.success) {
        showAlert(response.message || (studentId ? 'Student updated successfully' : 'Student created successfully'), 'success');
        $('#studentModal').modal('hide');
        loadStudents();
      } else {
        showAlert(response.error || 'Failed to save student', 'danger');
      }
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to save student';
      showAlert('Error: ' + errorMsg, 'danger');
    },
    complete: function() {
      btn.prop('disabled', false).html('Save Student');
    }
  });
});

function deleteStudent(studentId) {
  $.ajax({
    url: `${API_BASE_URL}/students/${studentId}`,
    method: 'DELETE',
    success: function() {
      showAlert('Student deleted successfully', 'success');
      loadStudents();
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to delete student';
      showAlert('Error: ' + errorMsg, 'danger');
    }
  });
}

function attachStudentHandlers() {
  $('button[data-type="student"][data-bs-toggle="modal"]').on('click', function() {
    deleteCallback = deleteStudent;
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
