import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RoomCard from '../components/RoomCard';
import { mockRooms } from '../data/mockRooms';
import { mockBookings, getPendingBookings, updateBookingStatus } from '../data/mockBookings';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState(mockRooms);
  const [bookings, setBookings] = useState(mockBookings);
  const [notification, setNotification] = useState(null);

  // Get faculty's assigned rooms (in real app, this would be filtered by faculty ID)
  const assignedRooms = rooms.filter(room => 
    room.assignedTo === 'Dr. Smith' || room.assignedTo === 'Prof. Johnson' || room.assignedTo === null
  );

  const pendingBookings = getPendingBookings();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStartClass = (room) => {
    // TODO: Replace with API call - PUT /api/rooms/:id/start-class
    setRooms(prevRooms => 
      prevRooms.map(r => 
        r.id === room.id 
          ? { ...r, status: 'Occupied', assignedTo: user.username, currentClass: 'Current Class' }
          : r
      )
    );
    showNotification('success', `Class started in Room ${room.roomNumber}`);
  };

  const handleEndClass = (room) => {
    // TODO: Replace with API call - PUT /api/rooms/:id/end-class
    setRooms(prevRooms => 
      prevRooms.map(r => 
        r.id === room.id 
          ? { ...r, status: 'Free', assignedTo: null, currentClass: null }
          : r
      )
    );
    showNotification('info', `Class ended in Room ${room.roomNumber}`);
  };

  const handleApproveBooking = (booking) => {
    // TODO: Replace with API call - PUT /api/bookings/:id/approve
    updateBookingStatus(booking.id, 'Approved', user.username);
    setBookings([...bookings]); // Trigger re-render
    showNotification('success', `Booking approved for ${booking.studentName}`);
  };

  const handleRejectBooking = (booking) => {
    // TODO: Replace with API call - PUT /api/bookings/:id/reject
    updateBookingStatus(booking.id, 'Rejected', user.username);
    setBookings([...bookings]); // Trigger re-render
    showNotification('info', `Booking rejected for ${booking.studentName}`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1>Faculty Dashboard</h1>
            <p>Manage your classrooms and booking requests</p>
          </div>

          {notification && (
            <div className={`notification notification-${notification.type}`}>
              {notification.message}
            </div>
          )}

          {/* My Classrooms Section */}
          <section className="dashboard-section">
            <h2>My Classrooms</h2>
            <div className="rooms-grid">
              {assignedRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onStartClass={handleStartClass}
                  onEndClass={handleEndClass}
                  userRole="faculty"
                />
              ))}
            </div>
          </section>

          {/* Booking Requests Section */}
          <section className="dashboard-section">
            <h2>Pending Booking Requests</h2>
            {pendingBookings.length > 0 ? (
              <div className="bookings-list">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <div>
                        <h3>Room {booking.roomNumber}</h3>
                        <p className="booking-building">{booking.building}</p>
                      </div>
                      <span className="booking-status status-pending">Pending</span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-info">
                        <span className="label">Student:</span>
                        <span className="value">{booking.studentName} ({booking.studentId})</span>
                      </div>
                      <div className="booking-info">
                        <span className="label">Purpose:</span>
                        <span className="value">{booking.purpose}</span>
                      </div>
                      <div className="booking-info">
                        <span className="label">Time:</span>
                        <span className="value">
                          {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                        </span>
                      </div>
                      <div className="booking-info">
                        <span className="label">Requested:</span>
                        <span className="value">{formatDateTime(booking.requestedAt)}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => handleApproveBooking(booking)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRejectBooking(booking)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No pending booking requests</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
