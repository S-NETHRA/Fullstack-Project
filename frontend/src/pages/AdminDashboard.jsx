import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { mockRooms, getRoomStats } from '../data/mockRooms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faCheckCircle, faTimesCircle, faChartLine, faUsers, faRuler } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [rooms] = useState(mockRooms);
  const stats = getRoomStats();

  // Calculate utilization by building
  const buildingStats = {};
  rooms.forEach(room => {
    if (!buildingStats[room.building]) {
      buildingStats[room.building] = { total: 0, occupied: 0 };
    }
    buildingStats[room.building].total++;
    if (room.status === 'Occupied') {
      buildingStats[room.building].occupied++;
    }
  });

  // Calculate capacity statistics
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const avgCapacity = Math.round(totalCapacity / rooms.length);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Manage classrooms and view statistics</p>
          </div>

          {/* Main Statistics Cards */}
          <div className="stats-grid stats-grid-large">
            <div className="stat-card stat-primary">
              <div className="stat-icon"><FontAwesomeIcon icon={faSchool} size="2x" /></div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Classrooms</p>
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
            <div className="stat-card stat-warning">
              <div className="stat-icon"><FontAwesomeIcon icon={faChartLine} size="2x" /></div>
              <div className="stat-info">
                <h3>{stats.utilization}%</h3>
                <p>Utilization Rate</p>
              </div>
            </div>
          </div>

          {/* Building-wise Statistics */}
          <section className="dashboard-section">
            <h2>Building-wise Utilization</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Total Rooms</th>
                    <th>Occupied</th>
                    <th>Free</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(buildingStats).map(([building, data]) => {
                    const utilization = ((data.occupied / data.total) * 100).toFixed(1);
                    return (
                      <tr key={building}>
                        <td><strong>{building}</strong></td>
                        <td>{data.total}</td>
                        <td className="text-danger">{data.occupied}</td>
                        <td className="text-success">{data.total - data.occupied}</td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${utilization}%` }}
                            >
                              {utilization}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Capacity Statistics */}
          <section className="dashboard-section">
            <h2>Capacity Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faUsers} size="2x" /></div>
                <div className="stat-info">
                  <h3>{totalCapacity}</h3>
                  <p>Total Capacity</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faRuler} size="2x" /></div>
                <div className="stat-info">
                  <h3>{avgCapacity}</h3>
                  <p>Average Capacity</p>
                </div>
              </div>
            </div>
          </section>

          {/* All Classrooms Table */}
          <section className="dashboard-section">
            <h2>All Classrooms</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room No.</th>
                    <th>Building</th>
                    <th>Floor</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Current Class</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td><strong>{room.roomNumber}</strong></td>
                      <td>{room.building}</td>
                      <td>{room.floor}</td>
                      <td>{room.capacity}</td>
                      <td>
                        <span className={`status-badge status-${room.status.toLowerCase()}`}>
                          {room.status}
                        </span>
                      </td>
                      <td>{room.assignedTo || '-'}</td>
                      <td>{room.currentClass || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
