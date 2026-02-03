/**
 * CampusHub Main Application JavaScript
 * Handles navigation, alerts, and general UI interactions
 */

const API_BASE_URL = 'http://localhost:3000/api';

let currentSection = 'events';
let deleteCallback = null;
let deleteId = null;
let deleteType = null;

$(document).ready(function() {
  initializeNavigation();
  initializeModals();
  loadInitialSection();
});

function initializeNavigation() {
  $('.nav-link[data-section]').on('click', function(e) {
    e.preventDefault();
    const section = $(this).data('section');
    switchSection(section);
  });
}

function switchSection(section) {
  $('.nav-link').removeClass('active');
  $(`.nav-link[data-section="${section}"]`).addClass('active');

  $('.content-section').hide();
  $(`#${section}-section`).show();

  currentSection = section;

  switch (section) {
    case 'events':
      loadEvents();
      break;
    case 'students':
      loadStudents();
      break;
    case 'resources':
      loadResources();
      break;
  }
}

function loadInitialSection() {
  switchSection('events');
}

function initializeModals() {
  $('.modal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset();
    $(this).find('input[type="hidden"]').val('');
  });

  $('#eventModal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    const action = button.data('action');
    const modal = $(this);

    if (action === 'create') {
      modal.find('.modal-title').text('Add New Event');
      modal.find('#eventForm')[0].reset();
    } else if (action === 'edit') {
      modal.find('.modal-title').text('Edit Event');
      const eventId = button.data('id');
      loadEventForEdit(eventId);
    }
  });

  $('#studentModal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    const action = button.data('action');
    const modal = $(this);

    if (action === 'create') {
      modal.find('.modal-title').text('Add New Student');
      modal.find('#studentForm')[0].reset();
      loadEventsForStudentSelect();
    } else if (action === 'edit') {
      modal.find('.modal-title').text('Edit Student');
      const studentId = button.data('id');
      loadStudentForEdit(studentId);
    }
  });

  $('#resourceModal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    const action = button.data('action');
    const modal = $(this);

    if (action === 'create') {
      modal.find('.modal-title').text('Add New Resource');
      modal.find('#resourceForm')[0].reset();
    } else if (action === 'edit') {
      modal.find('.modal-title').text('Edit Resource');
      const resourceId = button.data('id');
      loadResourceForEdit(resourceId);
    }
  });

  $('#deleteModal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    deleteId = button.data('id');
    deleteType = button.data('type');
  });

  $('#confirmDeleteBtn').on('click', function() {
    if (deleteCallback && deleteId) {
      deleteCallback(deleteId);
    }
    $('#deleteModal').modal('hide');
  });
}

function showAlert(message, type = 'info') {
  const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <i class="bi bi-${getAlertIcon(type)}"></i> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  $('#alertContainer').append(alertHtml);

  setTimeout(function() {
    $('#alertContainer .alert').first().alert('close');
  }, 5000);
}

function getAlertIcon(type) {
  const icons = {
    'success': 'check-circle',
    'danger': 'exclamation-triangle',
    'warning': 'exclamation-circle',
    'info': 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function showTableLoading(tableBodyId, colCount) {
  $(`#${tableBodyId}`).html(`
    <tr>
      <td colspan="${colCount}" class="text-center">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div> Loading...
      </td>
    </tr>
  `);
}

function showTableEmpty(tableBodyId, colCount, message = 'No data available') {
  $(`#${tableBodyId}`).html(`
    <tr>
      <td colspan="${colCount}" class="text-center text-muted">
        <i class="bi bi-inbox"></i> ${message}
      </td>
    </tr>
  `);
}
