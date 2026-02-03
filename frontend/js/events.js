/**
 * Events Management JavaScript
 * Handles all CRUD operations for Events using AJAX
 */

function loadEvents() {
  showTableLoading('eventsTableBody', 6);

  $.ajax({
    url: `${API_BASE_URL}/events`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        renderEventsTable(response.data);
      } else {
        showTableEmpty('eventsTableBody', 6, 'No events found');
        showAlert('Failed to load events', 'warning');
      }
    },
    error: function(xhr, status, error) {
      showTableEmpty('eventsTableBody', 6, 'Error loading events');
      showAlert('Error loading events: ' + (xhr.responseJSON?.error || error), 'danger');
    }
  });
}

function renderEventsTable(events) {
  const tbody = $('#eventsTableBody');
  tbody.empty();

  if (events.length === 0) {
    showTableEmpty('eventsTableBody', 6, 'No events found. Create your first event!');
    return;
  }

  events.forEach(function(event) {
    const row = `
      <tr>
        <td><strong>${escapeHtml(event.title)}</strong></td>
        <td><span class="badge bg-info">${escapeHtml(event.category)}</span></td>
        <td>${formatDate(event.date)}</td>
        <td>
          <strong>${escapeHtml(event.organizer.name)}</strong><br>
          <small class="text-muted">${escapeHtml(event.organizer.department || 'N/A')}</small>
        </td>
        <td>${escapeHtml(event.description || 'N/A').substring(0, 50)}${event.description && event.description.length > 50 ? '...' : ''}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal" data-action="edit" data-id="${event._id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-type="event" data-id="${event._id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
    tbody.append(row);
  });

  attachEventHandlers();
}

function loadEventForEdit(eventId) {
  $.ajax({
    url: `${API_BASE_URL}/events/${eventId}`,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data) {
        const event = response.data;
        $('#eventId').val(event._id);
        $('#eventTitle').val(event.title);
        $('#eventCategory').val(event.category);
        $('#eventDate').val(formatDateForInput(event.date));
        $('#eventDescription').val(event.description || '');
        $('#organizerName').val(event.organizer.name);
        $('#organizerDepartment').val(event.organizer.department || '');
        $('#organizerContact').val(event.organizer.contact || '');
      }
    },
    error: function(xhr, status, error) {
      showAlert('Error loading event: ' + (xhr.responseJSON?.error || error), 'danger');
      $('#eventModal').modal('hide');
    }
  });
}

$('#saveEventBtn').on('click', function() {
  const eventId = $('#eventId').val();
  const eventData = {
    title: $('#eventTitle').val(),
    category: $('#eventCategory').val(),
    date: $('#eventDate').val(),
    description: $('#eventDescription').val(),
    organizer: {
      name: $('#organizerName').val(),
      department: $('#organizerDepartment').val(),
      contact: $('#organizerContact').val()
    }
  };

  if (!eventData.title || !eventData.category || !eventData.date || !eventData.organizer.name) {
    showAlert('Please fill in all required fields', 'warning');
    return;
  }

  const url = eventId
    ? `${API_BASE_URL}/events/${eventId}`
    : `${API_BASE_URL}/events`;
  const method = eventId ? 'PUT' : 'POST';

  const btn = $(this);
  btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Saving...');

  $.ajax({
    url: url,
    method: method,
    contentType: 'application/json',
    data: JSON.stringify(eventData),
    dataType: 'json',
    success: function(response) {
      if (response.success) {
        showAlert(response.message || (eventId ? 'Event updated successfully' : 'Event created successfully'), 'success');
        $('#eventModal').modal('hide');
        loadEvents();
      } else {
        showAlert(response.error || 'Failed to save event', 'danger');
      }
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to save event';
      showAlert('Error: ' + errorMsg, 'danger');
    },
    complete: function() {
      btn.prop('disabled', false).html('Save Event');
    }
  });
});

function deleteEvent(eventId) {
  $.ajax({
    url: `${API_BASE_URL}/events/${eventId}`,
    method: 'DELETE',
    success: function() {
      showAlert('Event deleted successfully', 'success');
      loadEvents();
    },
    error: function(xhr, status, error) {
      const errorMsg = xhr.responseJSON?.error || error || 'Failed to delete event';
      showAlert('Error: ' + errorMsg, 'danger');
    }
  });
}

function attachEventHandlers() {
  $('button[data-type="event"][data-bs-toggle="modal"]').on('click', function() {
    deleteCallback = deleteEvent;
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
