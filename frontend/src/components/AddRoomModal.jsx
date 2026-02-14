import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddRoomModal.css';

const AddRoomModal = ({ isOpen, onClose, onAddRoom }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    status: 'Free',
    assignedTo: '',
    currentClass: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.roomNumber.trim()) {
      setError('Room number is required');
      return;
    }

    if (!formData.building.trim()) {
      setError('Building name is required');
      return;
    }

    if (!formData.floor) {
      setError('Floor is required');
      return;
    }

    if (!formData.capacity || formData.capacity <= 0) {
      setError('Valid capacity is required');
      return;
    }

    // If status is Occupied, require assignedTo and currentClass
    if (formData.status === 'Occupied') {
      if (!formData.assignedTo.trim()) {
        setError('Assigned To is required for occupied rooms');
        return;
      }
      if (!formData.currentClass.trim()) {
        setError('Current Class is required for occupied rooms');
        return;
      }
    }

    // Create room object
    const newRoom = {
      id: Date.now(), // Generate unique ID
      roomNumber: formData.roomNumber,
      building: formData.building,
      floor: parseInt(formData.floor),
      capacity: parseInt(formData.capacity),
      status: formData.status,
      assignedTo: formData.status === 'Occupied' ? formData.assignedTo : null,
      currentClass: formData.status === 'Occupied' ? formData.currentClass : null,
      createdAt: new Date().toISOString()
    };

    // TODO: Replace with actual API call - POST /api/rooms
    onAddRoom(newRoom);

    // Reset form
    setFormData({
      roomNumber: '',
      building: '',
      floor: '',
      capacity: '',
      status: 'Free',
      assignedTo: '',
      currentClass: ''
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Classroom</h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roomNumber">Room Number *</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., 101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="building">Building *</label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="e.g., Main Block"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="floor">Floor *</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="e.g., 1"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity *</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 60"
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Free">Free</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>

          {formData.status === 'Occupied' && (
            <>
              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To *</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="e.g., Prof. Smith"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentClass">Current Class *</label>
                <input
                  type="text"
                  id="currentClass"
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures"
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
