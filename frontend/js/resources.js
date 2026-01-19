/**
 * Resources Management JavaScript
 * Handles all CRUD operations for Resources using AJAX
 */

function loadResources() {
  showTableLoading('resourcesTableBody', 6);

  $.ajax({
    url: `${API_BASE_URL}/resources`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        renderResourcesTable(response.data);
      } else {
        showTableEmpty('resourcesTableBody', 6, 'No resources found');
        showAlert('Failed to load resources', 'warning');
      }
    },
    error: function(xhr, status, error) {
      showTableEmpty('resourcesTableBody', 6, 'Error loading resources');
      showAlert('Error loading resources: ' + (xhr.responseJSON?.error || error), 'danger');
    }
  });
}

function renderResourcesTable(resources) {
  const tbody = $('#resourcesTableBody');
  tbody.empty();

  if (resources.length === 0) {
    showTableEmpty('resourcesTableBody', 6, 'No resources found. Add your first resource!');
    return;
  }

  resources.forEach(function(resource) {
    const availabilityClass = getAvailabilityBadgeClass(resource.availability);

    const row = `
      <tr>
        <td><strong>${escapeHtml(resource.name)}</strong></td>
        <td><span class="badge bg-secondary">${escapeHtml(resource.type)}</span></td>
        <td><span class="badge ${availabilityClass}">${escapeHtml(resource.availability)}</span></td>
        <td>${escapeHtml(resource.location || 'N/A')}</td>
        <td>${escapeHtml(resource.description || 'N/A').substring(0, 50)}${resource.description && resource.description.length > 50 ? '...' : ''}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#resourceModal" data-action="edit" data-id="${resource._id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-type="resource" data-id="${resource._id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
    tbody.append(row);
  });

  attachResourceHandlers();
}

function getAvailabilityBadgeClass(availability) {
  const classes = {
    'Available': 'bg-success',
    'In Use': 'bg-warning',
    'Maintenance': 'bg-danger',
    'Reserved': 'bg-info'
  };
  return classes[availability] || 'bg-secondary';
}

function loadResourceForEdit(resourceId) {
  $.ajax({
    url: `${API_BASE_URL}/resources/${resourceId}`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        const resource = response.data;
        $('#resourceId').val(resource._id);
        $('#resourceName').val(resource.name);
        $('#resourceType').val(resource.type);
        $('#resourceAvailability').val(resource.availability);
        $('#resourceLocation').val(resource.location || '');
        $('#resourceDescription').val(resource.description || '');
      }
    },
    error: function(xhr, status, error) {
      showAlert('Error loading resource: ' + (xhr.responseJSON?.error || error), 'danger');
      $('#resourceModal').modal('hide');
    }
  });
}

$('#saveResourceBtn').on('click', function() {
  const resourceId = $('#resourceId').val();
  const resourceData = {
    name: $('#resourceName').val(),
    type: $('#resourceType').val(),
    availability: $('#resourceAvailability').val(),
    location: $('#resourceLocation').val(),
    description: $('#resourceDescription').val()
  };

  if (!resourceData.name || !resourceData.type || !resourceData.availability) {
    showAlert('Please fill in all required fields', 'warning');
    return;
  }

  const url = resourceId
    ? `${API_BASE_URL}/resources/${resourceId}`
    : `${API_BASE_URL}/resources`;
  const method = resourceId ? 'PUT' : 'POST';

  const btn = $(this);
  btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Saving...');

  $.ajax({
    url: url,
    method: method,
    contentType: 'application/json',
    data: JSON.stringify(resourceData),
    dataType: 'json',
    success: function(response) {
      if (response.success) {
        showAlert(response.message || (resourceId ? 'Resource updated successfully' : 'Resource created successfully'), 'success');
        $('#resourceModal').modal('hide');
        loadResources();
      } else {
        showAlert(response.error || 'Failed to save resource', 'danger');
      }
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to save resource';
      showAlert('Error: ' + errorMsg, 'danger');
    },
    complete: function() {
      btn.prop('disabled', false).html('Save Resource');
    }
  });
});

function deleteResource(resourceId) {
  $.ajax({
    url: `${API_BASE_URL}/resources/${resourceId}`,
    method: 'DELETE',
    success: function() {
      showAlert('Resource deleted successfully', 'success');
      loadResources();
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to delete resource';
      showAlert('Error: ' + errorMsg, 'danger');
    }
  });
}

function attachResourceHandlers() {
  $('button[data-type="resource"][data-bs-toggle="modal"]').on('click', function() {
    deleteCallback = deleteResource;
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
