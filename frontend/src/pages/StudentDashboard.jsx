import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';
import { mockRooms, getBuildings } from '../data/mockRooms';
import { mockBookings, addBooking } from '../data/mockBookings';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeView, setActiveView] = useState('find-rooms'); // 'find-rooms' or 'my-bookings'
  const [myBookings, setMyBookings] = useState(mockBookings.filter(b => b.studentName === user.username));

  const buildings = ['all', ...getBuildings()];

  // Filter rooms based on selected criteria
  const filteredRooms = rooms.filter(room => {
    const matchBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;
    const matchCapacity = room.capacity >= minCapacity;
    return matchBuilding && matchCapacity;
  });

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingData) => {
    // TODO: Replace with API call - POST /api/bookings
    const newBooking = addBooking({
      ...bookingData,
      studentName: user.username,
      studentId: 'CS2024XXX' // This would come from user profile
    });

    setMyBookings([...myBookings, newBooking]);
    setShowBookingForm(false);
    setSelectedRoom(null);
    
    setNotification({
      type: 'success',
      message: `Booking request submitted for Room ${bookingData.roomNumber}. Pending faculty approval.`
    });

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
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

  const stats = {
    total: rooms.length,
    free: rooms.filter(r => r.status === 'Free').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1>Student Dashboard</h1>
            <p>Find and book available classrooms</p>
          </div>

          {notification && (
            <div className={`notification notification-${notification.type}`}>
              {notification.message}
            </div>
          )}

          {activeView === 'find-rooms' ? (
            <>
              {/* Statistics Cards */}
              <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><FontAwesomeIcon icon={faSchool} size="2x" /></div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Rooms</p>
              </div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-icon"><FontAwesomeIcon icon={faCheckCircle} size="2x" /></div>
              <div className="stat-info">
                <h3>{stats.free}</h3>
                <p>Free Rooms</p>
              </div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-icon"><FontAwesomeIcon icon={faTimesCircle} size="2x" /></div>
              <div className="stat-info">
                <h3>{stats.occupied}</h3>
                <p>Occupied Rooms</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <h2>Find Classrooms</h2>
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="building">Building:</label>
                <select
                  id="building"
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                >
                  {buildings.map(building => (
                    <option key={building} value={building}>
                      {building === 'all' ? 'All Buildings' : building}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="capacity">Min Capacity:</label>
                <select
                  id="capacity"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                >
                  <option value="0">Any</option>
                  <option value="30">30+</option>
                  <option value="50">50+</option>
                  <option value="70">70+</option>
                  <option value="100">100+</option>
                </select>
              </div>

              <div className="filter-results">
                <span>{filteredRooms.length} rooms found</span>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="rooms-section">
            <div className="rooms-grid">
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBookClick={handleBookClick}
                    userRole="student"
                  />
                ))
              ) : (
                <div className="no-rooms">
                  <p>No rooms found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
            </>
          ) : (
            <>
              {/* My Bookings View */}
              <section className="dashboard-section">
                <h2>My Bookings</h2>
                {myBookings.length > 0 ? (
                  <div className="bookings-list">
                    {myBookings.map(booking => (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                          <div>
                            <h3>Room {booking.roomNumber}</h3>
                            <p className="booking-building">{booking.building}</p>
                          </div>
                          <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="booking-details">
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
                          {booking.status === 'Approved' && booking.approvedBy && (
                            <div className="booking-info">
                              <span className="label">Approved By:</span>
                              <span className="value">{booking.approvedBy}</span>
                            </div>
                          )}
                          {booking.status === 'Rejected' && (
                            <>
                              <div className="booking-info">
                                <span className="label">Rejected By:</span>
                                <span className="value">{booking.rejectedBy}</span>
                              </div>
                              {booking.rejectionReason && (
                                <div className="booking-info">
                                  <span className="label">Reason:</span>
                                  <span className="value" style={{ color: '#e74c3c' }}>{booking.rejectionReason}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <p>You haven't made any booking requests yet.</p>
                    <button 
                      className="login-btn" 
                      onClick={() => setActiveView('find-rooms')}
                      style={{ marginTop: '20px' }}
                    >
                      Find Rooms
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
